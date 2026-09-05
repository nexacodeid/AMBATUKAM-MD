import {
  AIO_TOOLS,
  collectUrlEntries,
  errorMessage,
  extractUrl,
  formatNumber,
  scraper,
  sendMediaEntries,
  truncate
} from '../../lib/zenaveline-adapter.js'

const YOUTUBE_FORMATS = new Set(['144', '240', '360', '480', '720', '1080', 'mp3'])

function requireUrl(text, pattern, example) {
  const url = extractUrl(text)
  if (!url || (pattern && !pattern.test(url))) {
    throw new Error(`Masukkan URL yang valid.\nContoh: ${example}`)
  }
  return url
}

function autoAioTool(url) {
  if (/music\.apple\.com/i.test(url)) return 'apple-music-downloader'
  if (/douyin\.com/i.test(url)) return 'douyin-downloader'
  if (/facebook\.com|fb\.watch/i.test(url)) return 'facebook-video-downloader'
  if (/instagram\.com/i.test(url)) return 'instagram-video-downloader'
  if (/likee\.(video|com)/i.test(url)) return 'likee-downloader'
  if (/linkedin\.com/i.test(url)) return 'linkedin-video-downloader'
  if (/pinterest\.|pin\.it/i.test(url)) return 'pinterest-video-downloader'
  if (/soundcloud\.com/i.test(url)) return 'soundcloud-downloader'
  if (/open\.spotify\.com/i.test(url)) return 'spotify-downloader'
  if (/tiktok\.com/i.test(url)) return 'tiktok-video-downloader'
  if (/(twitter|x)\.com/i.test(url)) return 'twitter-video-downloader'
  if (/youtu\.be|youtube\.com/i.test(url)) return 'youtube-video-downloader'
  return null
}

async function sendGenericResult(conn, m, data, caption) {
  const entries = collectUrlEntries(data)
  if (!entries.length) return m.reply(`${caption}\n\n${truncate(data)}`)
  return sendMediaEntries(conn, m, data, { caption, max: 12 })
}

async function instagram(conn, m, text, usedPrefix, command) {
  const url = requireUrl(text, /instagram\.com/i, `${usedPrefix}${command} https://www.instagram.com/reel/...`)
  const result = await scraper.igdl(url)
  if (!result?.success && !collectUrlEntries(result).length) throw new Error(result?.message || 'Instagram tidak mengembalikan media.')
  await sendGenericResult(conn, m, result, '✅ Instagram berhasil diproses.')
}

async function threads(conn, m, text, usedPrefix, command) {
  const url = requireUrl(text, /threads\.(net|com)/i, `${usedPrefix}${command} https://www.threads.net/@user/post/...`)
  const result = await scraper.threadsdownload(url)
  if (!result?.media?.length) throw new Error('Media Threads tidak ditemukan.')

  const caption = [
    '*Threads Downloader*',
    result.author?.username ? `👤 ${result.author.username}` : null,
    result.author?.caption || null
  ].filter(Boolean).join('\n')

  await sendMediaEntries(conn, m, result.media.map(item => item.download), { caption, max: 12 })
}

async function twitter(conn, m, text, usedPrefix, command) {
  const url = requireUrl(text, /(twitter|x)\.com/i, `${usedPrefix}${command} https://x.com/user/status/...`)
  const result = await scraper.twetterdownload(url)
  if (result?.status === false) throw new Error(result.message || 'Twitter/X gagal diproses.')
  await sendGenericResult(conn, m, result, '✅ Twitter/X berhasil diproses.')
}

async function pinterest(conn, m, text, usedPrefix, command) {
  const url = requireUrl(text, /pinterest\.|pin\.it/i, `${usedPrefix}${command} https://pin.it/...`)
  const result = await scraper.pinterestdownload(url)
  const videos = result?.content?.videos || []
  const images = [...(result?.content?.images || [])].sort(
    (a, b) => (Number(b.width) * Number(b.height)) - (Number(a.width) * Number(a.height))
  )
  const media = videos.length ? videos : images.slice(0, 1)
  if (!media.length) throw new Error('Media Pinterest tidak ditemukan.')

  const caption = [
    '*Pinterest Downloader*',
    `👤 ${result.user?.fullName || '-'} (@${result.user?.username || '-'})`,
    `📝 ${result.post?.title || '-'}`,
    result.post?.description || null
  ].filter(Boolean).join('\n')

  await sendMediaEntries(conn, m, media, { caption, max: 3 })
}

async function douyin(conn, m, text, usedPrefix, command) {
  const url = requireUrl(text, /douyin\.com/i, `${usedPrefix}${command} https://v.douyin.com/...`)
  const result = await scraper.douyindl(url)
  if (result?.status !== 'success' || !result.metadata?.video_url) throw new Error(result?.message || 'Douyin gagal diproses.')
  const meta = result.metadata
  const caption = `*Douyin Downloader*\n👤 ${meta.author || '-'}\n⏱️ ${meta.duration || '-'}\n📝 ${meta.description || '-'}`
  await conn.sendFile(m.chat, meta.video_url, 'douyin.mp4', caption, m)
}

async function tiktok(conn, m, text, usedPrefix, command) {
  const url = requireUrl(text, /tiktok\.com/i, `${usedPrefix}${command} https://vt.tiktok.com/...`)
  const result = await scraper.tiktokdownload(url)
  if (!result?.download) throw new Error('TikTok tidak mengembalikan media.')

  const caption = [
    '*TikTok Downloader*',
    `👤 ${result.author?.nickname || '-'} (@${result.author?.username || '-'})`,
    `▶️ ${formatNumber(result.views)}  ❤️ ${formatNumber(result.like)}  💬 ${formatNumber(result.comment)}`,
    result.title || null
  ].filter(Boolean).join('\n')

  const downloads = Array.isArray(result.download) ? result.download : [result.download]
  await sendMediaEntries(conn, m, downloads, { caption, max: 12, fallbackName: result.isVideo ? 'tiktok.mp4' : 'tiktok.jpg' })
}

async function mediafire(conn, m, text, usedPrefix, command) {
  const url = requireUrl(text, /mediafire\.com/i, `${usedPrefix}${command} https://www.mediafire.com/file/...`)
  const result = await scraper.mediafiredl(url)
  if (!result?.status) throw new Error(result?.msg || 'MediaFire gagal diproses.')

  if (result.type === 'folder') {
    const files = result.files || []
    const list = files.slice(0, 30).map((file, index) => `${index + 1}. ${file.filename || file.quickkey || 'file'}\n${file.links || '-'}`)
    return m.reply(`*MediaFire Folder*\n📁 ${result.foldername || result.name || '-'}\n📦 ${files.length} file\n\n${list.join('\n\n')}${files.length > 30 ? '\n\n…daftar dipotong' : ''}`)
  }

  const download = result.url || result.links
  if (!download) throw new Error('Link unduhan MediaFire tidak ditemukan.')
  const caption = `*MediaFire Downloader*\n📄 ${result.filename || '-'}\n📦 ${result.size_format || result.size || '-'}\n🌐 ${result.location || '-'}`
  await conn.sendFile(m.chat, download, result.filename || 'mediafire.bin', caption, m)
}

async function appleMusic(conn, m, text, usedPrefix, command) {
  const url = requireUrl(text, /music\.apple\.com/i, `${usedPrefix}${command} https://music.apple.com/...`)
  const result = await scraper.applemusicdl(url)
  if (!result?.url_dl) throw new Error('Audio Apple Music tidak ditemukan.')
  const caption = `*Apple Music Downloader*\n🎵 ${result.title || '-'}\n👤 ${result.artist || '-'}\n💿 ${result.album || '-'}\n⏱️ ${result.duration || '-'}`
  if (result.thumb) await conn.sendFile(m.chat, result.thumb, 'applemusic.jpg', caption, m)
  await conn.sendFile(m.chat, result.url_dl, `${result.title || 'applemusic'}.mp3`, '', m)
}

async function spotifyDownload(conn, m, text, usedPrefix, command) {
  let url = extractUrl(text)

  if (!url && command === 'spotify' && text.trim()) {
    const spotify = new scraper.spotify()
    const search = await spotify.search(text.trim())
    url = search?.tracks?.[0]?.url || null
  }

  if (!url || !/open\.spotify\.com\/track/i.test(url)) {
    throw new Error(`Masukkan URL track Spotify atau judul untuk spotify.\nContoh: ${usedPrefix}${command} https://open.spotify.com/track/...`)
  }

  const result = await scraper.spotifydl(url)
  if (!result?.status || !result.dl) throw new Error('Track Spotify gagal diunduh.')
  const caption = `*Spotify Downloader*\n🎵 ${result.title || '-'}\n👤 ${result.author || '-'}`
  if (result.cover) await conn.sendFile(m.chat, result.cover, 'spotify.jpg', caption, m)
  await conn.sendFile(m.chat, result.dl, `${result.title || 'spotify'}.mp3`, '', m)
}

async function saveTube(conn, m, text, usedPrefix, command) {
  const url = requireUrl(text, /youtu\.be|youtube\.com/i, `${usedPrefix}${command} https://youtu.be/...`)
  const tokens = text.trim().split(/\s+/)
  const requested = tokens.find(token => YOUTUBE_FORMATS.has(token.toLowerCase()))?.toLowerCase()
  const audioCommand = /^(ytmp3|yta)$/i.test(command)
  const format = audioCommand ? 'mp3' : requested || '720'
  const saveTubeClient = new scraper.savetube()
  const result = await saveTubeClient.download(url, format)
  if (!result?.status || !result.dl) throw new Error(result?.msg || result?.error || 'YouTube gagal diunduh.')

  const caption = `*SaveTube Downloader*\n🎬 ${result.title || '-'}\n⏱️ ${result.duration || '-'}\n📦 ${format === 'mp3' ? 'MP3 128 kbps' : `${format}p`}`
  if (result.thumb) await conn.sendFile(m.chat, result.thumb, 'youtube.jpg', caption, m)
  await conn.sendFile(m.chat, result.dl, `${result.title || 'youtube'}.${format === 'mp3' ? 'mp3' : 'mp4'}`, '', m)
}

async function allInOne(conn, m, text, usedPrefix, command) {
  const input = text.trim()
  if (!input || /^list$/i.test(input)) {
    return m.reply(`*All-in-One Downloader — daftar tool*\n\n${AIO_TOOLS.map((tool, index) => `${index + 1}. ${tool}`).join('\n')}\n\nPemakaian:\n${usedPrefix}${command} <tool> <url>\nAtau: ${usedPrefix}${command} <url> (deteksi otomatis)`)
  }

  const url = requireUrl(input, null, `${usedPrefix}${command} tiktok-video-downloader https://vt.tiktok.com/...`)
  const explicitTool = input.split(/\s+/).find(token => AIO_TOOLS.includes(token))
  const tool = explicitTool || autoAioTool(url)
  if (!tool) throw new Error(`Platform tidak dikenali. Lihat daftar dengan ${usedPrefix}${command} list`)

  const result = await scraper.allinonedownloader(url, tool)
  if (result?.success === false || result?.status === false) throw new Error(result.error || result.message || 'All-in-One downloader gagal.')
  await sendGenericResult(conn, m, result, `✅ Selesai dengan tool *${tool}*.`)
}

let handler = async (m, context) => {
  const { conn, text = '', usedPrefix = '.', command = '' } = context
  const cmd = command.toLowerCase()

  await m.react?.('⏳').catch(() => {})

  try {
    if (/^(ig|igdl|instagram|instagdramdl)$/.test(cmd)) await instagram(conn, m, text, usedPrefix, command)
    else if (/^(threads|threadsdl)$/.test(cmd)) await threads(conn, m, text, usedPrefix, command)
    else if (/^(twitter|twitterdl|x)$/.test(cmd)) await twitter(conn, m, text, usedPrefix, command)
    else if (/^(pindl|pinterestdl)$/.test(cmd)) await pinterest(conn, m, text, usedPrefix, command)
    else if (/^(douyin|douyindl)$/.test(cmd)) await douyin(conn, m, text, usedPrefix, command)
    else if (/^(tiktok|tt)$/.test(cmd)) await tiktok(conn, m, text, usedPrefix, command)
    else if (/^(mediafire|mf)$/.test(cmd)) await mediafire(conn, m, text, usedPrefix, command)
    else if (/^(applemusic|am)$/.test(cmd)) await appleMusic(conn, m, text, usedPrefix, command)
    else if (/^(spotify)$/.test(cmd)) await spotifyDownload(conn, m, text, usedPrefix, command)
    else if (/^(ytmp3|yta|ytmp4|ytv|savetube)$/.test(cmd)) await saveTube(conn, m, text, usedPrefix, command)
    else if (cmd === 'aio') await allInOne(conn, m, text, usedPrefix, command)
    await m.react?.('✅').catch(() => {})
  } catch (error) {
    console.error('[ZENAVELINE DOWNLOADER]', error)
    await m.react?.('❌').catch(() => {})
    await m.reply(`❌ ${errorMessage(error)}`)
  }
}

handler.help = [
  'igdl <url>', 'threadsdl <url>', 'twitter <url>', 'pindl <url>',
  'douyindl <url>', 'tiktok <url>', 'mediafire <url>', 'applemusic <url>', 'spotify <judul>', 'ytmp3 <url>', 'ytmp4 <url> [quality]',
  'aio list', 'aio <tool> <url>'
]
handler.tags = ['downloader']
handler.command = /^(ig|igdl|instagram|instagdramdl|threads|threadsdl|twitter|twitterdl|x|pindl|pinterestdl|douyin|douyindl|tiktok|tt|mediafire|mf|applemusic|am|spotify||ytmp3|yta|ytmp4|ytv|savetube|aio)$/i
handler.limit = true
handler.register = true

export default handler