import https from 'https'
import axios from 'axios'
import { ButtonV2 } from '../../lib/messagebutton.js'

const SESSION_TIMEOUT = 5 * 60 * 1000
const REVID_HOST = 'www.revid.ai'
const REVID_ENDPOINT = '/api/tiktok-search'

async function reactSafe(m, emoji) {
  try {
    if (typeof m.react === 'function') await m.react(emoji)
  } catch {}
}

function formatNumber(num = 0) {
  num = Number(num) || 0

  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`

  return num.toLocaleString('id-ID')
}

function formatDuration(seconds = 0) {
  seconds = Number(seconds) || 0
  const minute = Math.floor(seconds / 60)
  const second = seconds % 60
  return `${minute}:${String(second).padStart(2, '0')}`
}

function formatDate(timestamp = 0) {
  timestamp = Number(timestamp) || 0
  if (!timestamp) return '-'

  if (timestamp > 9999999999) timestamp = Math.floor(timestamp / 1000)

  return new Date(timestamp * 1000).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  })
}

function cutText(text = '', max = 250) {
  text = String(text || '').replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}...`
}

function safeParseJson(text, fallback = []) {
  try {
    return JSON.parse(text)
  } catch {
    return fallback
  }
}

function isVideoUrl(url = '') {
  if (!url) return false
  if (/\.webp|\.jpg|\.jpeg|\.png|\.gif/i.test(url)) return false
  if (/cover|thumb|thumbnail|avatar|image|photo/i.test(url)) return false

  return /^https?:\/\//i.test(url)
}

function isImageUrl(url = '') {
  return /^https?:\/\//i.test(url) && (
    /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url) ||
    /cover|thumb|thumbnail|image/i.test(url)
  )
}

function normalizeVideo(v = {}) {
  const hashtags = typeof v.hashtags === 'string'
    ? safeParseJson(v.hashtags, [])
    : Array.isArray(v.hashtags)
      ? v.hashtags
      : []

  const videoUrl =
    v.urlUploaded ||
    v.download_url ||
    v.downloadUrl ||
    v.video_url ||
    v.videoUrl ||
    v.url ||
    ''

  const cover =
    v.cover ||
    v.thumbnail ||
    v.thumbnailUrl ||
    v.image ||
    ''

  return {
    id: v.id || v.videoId || v.awemeId || '-',
    title: cutText(v.desc || v.text || v.contentSummary || 'TikTok Video', 100),
    description: v.desc || '',
    full_text: v.text || '',
    content_summary: v.contentSummary || '',
    duration: v.durationInSeconds || v.duration || 0,
    play_count: v.playCount || 0,
    like_count: v.diggCount || v.likeCount || 0,
    comment_count: v.commentCount || 0,
    share_count: v.shareCount || 0,
    author: v.userNickname || v.author || '-',
    username: v.username || '-',
    hashtags,
    video_url: isVideoUrl(videoUrl) ? videoUrl : '',
    cover: isImageUrl(cover) ? cover : '',
    created_at: v.createTime || 0,
    raw: v
  }
}

function searchRevidTikTok(keywords, options = {}) {
  const now = Date.now()
  const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000
  const limit = Math.max(1, Math.min(Number(options.limit) || 10, 20))

  const payload = JSON.stringify({
    keywords,
    filtersFast: [
      'nbChar > 10',
      `createTime >= ${Math.floor(oneYearAgo / 1000)} AND createTime <= ${Math.floor(now / 1000)}`
    ],
    extraParams: {
      sort: options.sort || ''
    }
  })

  const reqOptions = {
    hostname: REVID_HOST,
    port: 443,
    path: REVID_ENDPOINT,
    method: 'POST',
    family: 4,
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json',
      'Referer': 'https://www.revid.ai/'
    }
  }

  return new Promise((resolve, reject) => {
    const req = https.request(reqOptions, res => {
      let data = ''

      res.on('data', chunk => {
        data += chunk.toString()
      })

      res.on('end', () => {
        try {
          const json = JSON.parse(data)

          if (json.error || json.message?.toLowerCase?.().includes('error')) {
            return reject(new Error(json.error || json.message))
          }

          const videos = Array.isArray(json.videos) ? json.videos : []

          const results = videos
            .slice(0, limit)
            .map(normalizeVideo)
            .filter(v => v.video_url || v.cover)

          if (!results.length) {
            return reject(new Error('Video tidak ditemukan.'))
          }

          resolve({
            query: keywords,
            total: results.length,
            videos: results
          })
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}. Raw: ${data.slice(0, 300)}`))
        }
      })
    })

    req.on('timeout', () => {
      req.destroy(new Error('Request timeout.'))
    })

    req.on('error', reject)
    req.write(payload)
    req.end()
  })
}

async function fetchMediaBuffer(url, type = 'video') {
  const { data, status, headers } = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 120000,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': '*/*',
      'Referer': 'https://www.tiktok.com/'
    },
    validateStatus: () => true
  })

  const buffer = Buffer.from(data || [])
  const contentType = String(headers?.['content-type'] || '')

  if (status >= 400) throw new Error(`HTTP ${status}`)
  if (!buffer.length) throw new Error('Buffer media kosong.')

  if (/text|json|html/i.test(contentType)) {
    throw new Error(`URL bukan media. Content-Type: ${contentType}`)
  }

  if (type === 'video' && buffer.length < 50000) {
    throw new Error(`Video terlalu kecil/rusak: ${buffer.length} byte`)
  }

  if (type === 'image' && buffer.length < 500) {
    throw new Error(`Gambar terlalu kecil/rusak: ${buffer.length} byte`)
  }

  return buffer
}

function buildCaption(video, index, total, query) {
  const tags = Array.isArray(video.hashtags) && video.hashtags.length
    ? video.hashtags.slice(0, 8).map(v => `#${String(v).replace(/^#/, '')}`).join(' ')
    : '-'

  return `乂 *TikTok VT Search*

*Query:* ${query}
*Result:* ${index + 1}/${total}

*Title:*
${video.title || '-'}

*Author:* ${video.author || '-'} (@${video.username || '-'})
*Duration:* ${formatDuration(video.duration)}
*Upload:* ${formatDate(video.created_at)}

*Stats:*
👁️ Play: ${formatNumber(video.play_count)}
❤️ Like: ${formatNumber(video.like_count)}
💬 Comment: ${formatNumber(video.comment_count)}
🔁 Share: ${formatNumber(video.share_count)}

*Hashtags:*
${tags}

*ID:* ${video.id || '-'}`.trim()
}

function buildActionText(session) {
  const current = session.index + 1
  const total = session.videos.length

  return (
    `乂 *TikTok VT Search*\n\n` +
    `*Query:* ${session.query}\n` +
    `*Result:* ${current}/${total}\n\n` +
    `Tekan tombol di bawah untuk lanjut ke video berikutnya.`
  )
}


async function sendResult(conn, m, session) {
  const video = session.videos[session.index]
  const caption = buildCaption(video, session.index, session.videos.length, session.query)

  let sentMedia = false

  if (video.video_url) {
    try {
      const buffer = await fetchMediaBuffer(video.video_url, 'video')

      await conn.sendMessage(
        m.chat,
        {
          video: buffer,
          mimetype: 'video/mp4',
          fileName: `vtsearch-${video.id || Date.now()}.mp4`,
          caption
        },
        {
          quoted: m
        }
      )

      sentMedia = true
    } catch (e) {
      console.error('VTSEARCH VIDEO ERROR:', e.message || e)
    }
  }

  if (!sentMedia && video.cover) {
    try {
      const buffer = await fetchMediaBuffer(video.cover, 'image')

      await conn.sendMessage(
        m.chat,
        {
          image: buffer,
          caption
        },
        {
          quoted: m
        }
      )

      sentMedia = true
    } catch (e) {
      console.error('VTSEARCH COVER ERROR:', e.message || e)
    }
  }

  if (!sentMedia) {
    await conn.sendMessage(
      m.chat,
      {
        text: caption
      },
      {
        quoted: m
      }
    )
  }
}

function getSessionKey(m) {
  return `${m.chat}:${m.sender}`
}

function getButtonId(m) {
  let id =
    m.message?.buttonsResponseMessage?.selectedButtonId ||
    m.message?.templateButtonReplyMessage?.selectedId ||
    m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m.text ||
    ''

  const params =
    m.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson

  if (params) {
    try {
      const json = JSON.parse(params)
      id = json.id || json.button_id || json.selectedId || json.selected_id || id
    } catch {
      id = params
    }
  }

  return String(id || '').trim()
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const args = String(text || '').trim()

  if (!args) {
    return m.reply(
      `Masukkan kata kunci pencarian.\n\n` +
      `Contoh:\n` +
      `${usedPrefix + command} kicau mania\n\n` +
      `Opsional limit:\n` +
      `${usedPrefix + command} kicau mania --limit 5`
    )
  }

  const limitMatch = args.match(/--limit\s+(\d+)/i)
  const limit = limitMatch ? Number(limitMatch[1]) : 10
  const query = args.replace(/--limit\s+\d+/i, '').trim()

  if (!query) {
    return m.reply('Query tidak valid.')
  }

  try {
    await reactSafe(m, '⏳')

    const result = await searchRevidTikTok(query, { limit })

    conn.vtSearchSession = conn.vtSearchSession || {}

    const key = getSessionKey(m)

    conn.vtSearchSession[key] = {
      query: result.query,
      videos: result.videos,
      index: 0,
      timestamp: Date.now()
    }

    await sendResult(conn, m, conn.vtSearchSession[key])

    await reactSafe(m, '✅')
  } catch (e) {
    console.error('VTSEARCH ERROR:', e)
    await reactSafe(m, '❌')
    return m.reply(`❌ Gagal mencari TikTok VT.\n\n${e.message || e}`)
  }
}

handler.before = async function before(m, { conn }) {
  const buttonId = getButtonId(m)

  if (!/^vtsearch_(next|stop)$/i.test(buttonId)) return

  conn.vtSearchSession = conn.vtSearchSession || {}

  const key = getSessionKey(m)
  const session = conn.vtSearchSession[key]

  if (!session) {
    return m.reply('⚠️ Sesi VT Search tidak ditemukan. Cari ulang dengan `.vtsearch <query>`.')
  }

  if (Date.now() - session.timestamp > SESSION_TIMEOUT) {
    delete conn.vtSearchSession[key]
    return m.reply('⏰ Sesi VT Search sudah kadaluarsa. Cari ulang dengan `.vtsearch <query>`.')
  }

  if (buttonId === 'vtsearch_stop') {
    delete conn.vtSearchSession[key]
    return m.reply('✅ Sesi VT Search dihentikan.')
  }

  session.index += 1
  session.timestamp = Date.now()

  if (session.index >= session.videos.length) {
    delete conn.vtSearchSession[key]
    return m.reply('✅ Semua hasil sudah dikirim.')
  }

  try {
    await reactSafe(m, '⏳')
    await sendResult(conn, m, session)
    await reactSafe(m, '✅')
  } catch (e) {
    console.error('VTSEARCH NEXT ERROR:', e)
    await reactSafe(m, '❌')
    return m.reply(`❌ Gagal mengirim result berikutnya.\n\n${e.message || e}`)
  }
}

handler.help = ['vtsearch <query>', 'ttvt <query>', 'revidtt <query>']
handler.tags = ['search']
handler.command = /^(vtsearch|ttvt|ttsearch|tiktokvt)$/i
handler.limit = true
handler.register = true

export default handler