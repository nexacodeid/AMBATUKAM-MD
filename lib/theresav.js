/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const DEFAULT_BASE = 'https://api.theresav.biz.id'
const DEFAULT_KEY = 'raizell'

export function getTheresavBase() {
  return global.APIs?.theresav || DEFAULT_BASE
}

export function getTheresavKey() {
  const base = getTheresavBase()
  return global.APIKeys?.[base] || global.APIKeys?.theresav || DEFAULT_KEY
}

export function theresavUrl(path = '/', query = {}) {
  const base = getTheresavBase().replace(/\/+$/, '')
  const cleanPath = String(path || '/').startsWith('/') ? path : `/${path}`
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query || {})) {
    if (value === undefined || value === null || value === '') continue
    params.set(key, String(value))
  }

  params.set('apikey', getTheresavKey())

  return `${base}${cleanPath}?${params.toString()}`
}

export async function theresavJson(path = '/', query = {}, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeout || 60000)

  try {
    const res = await fetch(theresavUrl(path, query), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'user-agent': 'Mozilla/5.0'
      },
      signal: controller.signal
    })

    const text = await res.text()
    let json

    try {
      json = JSON.parse(text)
    } catch {
      throw new Error(`Response bukan JSON: ${text.slice(0, 200)}`)
    }

    if (!res.ok) throw new Error(json?.message || json?.error || `HTTP ${res.status}`)

    return json
  } finally {
    clearTimeout(timeout)
  }
}

export async function theresavBuffer(path = '/', query = {}, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeout || 60000)

  try {
    const res = await fetch(theresavUrl(path, query), {
      method: 'GET',
      headers: {
        'user-agent': 'Mozilla/5.0'
      },
      signal: controller.signal
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text.slice(0, 200) || `HTTP ${res.status}`)
    }

    return Buffer.from(await res.arrayBuffer())
  } finally {
    clearTimeout(timeout)
  }
}

export function pickResult(json = {}) {
  return json.result ?? json.data ?? json.results ?? json
}

export function pickText(json = {}) {
  const result = pickResult(json)

  if (typeof result === 'string') return result
  if (typeof json.message === 'string') return json.message
  if (typeof json.answer === 'string') return json.answer
  if (typeof result?.text === 'string') return result.text
  if (typeof result?.answer === 'string') return result.answer
  if (typeof result?.response === 'string') return result.response
  if (typeof result?.result === 'string') return result.result
  if (Array.isArray(result)) return result.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join('\n\n')

  return JSON.stringify(result, null, 2)
}

export function pickUrl(...values) {
  for (const value of values.flat(Infinity)) {
    if (!value) continue

    if (typeof value === 'string' && /^https?:\/\//i.test(value)) return value

    if (Array.isArray(value)) {
      const url = pickUrl(...value)
      if (url) return url
    }

    if (typeof value === 'object') {
      const url = pickUrl(...Object.values(value))
      if (url) return url
    }
  }

  return ''
}

export function pickUrls(value, limit = 20) {
  const urls = []

  const walk = item => {
    if (!item || urls.length >= limit) return

    if (typeof item === 'string') {
      if (/^https?:\/\//i.test(item)) urls.push(item)
      return
    }

    if (Array.isArray(item)) {
      for (const v of item) walk(v)
      return
    }

    if (typeof item === 'object') {
      for (const v of Object.values(item)) walk(v)
    }
  }

  walk(value)

  return [...new Set(urls)].slice(0, limit)
}

export function isVideoUrl(url = '') {
  return /\.(mp4|mov|mkv|webm)(\?|$)/i.test(url)
}

export function isAudioUrl(url = '') {
  return /\.(mp3|m4a|wav|ogg|opus)(\?|$)/i.test(url)
}

export function isImageUrl(url = '') {
  return /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url)
}

export async function sendAlbumSafe(conn, jid, items = [], quoted) {
  const valid = items.filter(Boolean)

  if (!valid.length) return false

  if (valid.length >= 2 && typeof conn.sendAlbumMessage === 'function') {
    await conn.sendAlbumMessage(jid, valid, {
      quoted,
      delay: 700
    })
    return true
  }

  for (const item of valid) {
    await conn.sendMessage(jid, item, { quoted })
  }

  return true
}

export async function sendList(conn, jid, payload, quoted) {
  if (typeof conn.sendButton === 'function') {
    return await conn.sendButton(jid, payload, { quoted })
  }

  const first = payload.buttons?.[0]
  let rows = []

  try {
    const params = JSON.parse(first?.buttonParamsJson || '{}')
    rows = params.sections?.flatMap(s => s.rows || []) || []
  } catch {}

  const text =
    `${payload.text || payload.caption || ''}\n\n` +
    rows.map((r, i) => `${i + 1}. ${r.title}\n${r.description || ''}\n${r.id}`).join('\n\n')

  return await conn.sendMessage(jid, { text }, { quoted })
}

export function formatNumber(value) {
  return Number(value || 0).toLocaleString('id-ID')
}

export function flattenObject(obj = {}, prefix = '') {
  const out = []

  for (const [key, value] of Object.entries(obj || {})) {
    const name = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out.push(...flattenObject(value, name))
    } else {
      out.push([name, Array.isArray(value) ? value.join(', ') : value])
    }
  }

  return out
}

export function normalizeMedia(data = {}) {
  const result = pickResult(data)
  const urls = pickUrls(result, 30)

  return {
    result,
    urls,
    video: pickUrl(result?.video, result?.video_url, result?.download_url, result?.download, result?.play, result?.nowm, result?.url, urls.find(isVideoUrl)),
    audio: pickUrl(result?.audio, result?.audio_url, result?.music, result?.music_info?.play, urls.find(isAudioUrl)),
    images: pickUrls(result?.images || result?.slides || result?.image || [], 20).filter(isImageUrl)
  }
}

export async function sendDownloaded(conn, m, data, caption = '✅ Done') {
  const media = normalizeMedia(data)

  if (media.images.length > 1 && !media.video) {
    return await sendAlbumSafe(
      conn,
      m.chat,
      media.images.map((url, i) => ({
        image: { url },
        caption: i === 0 ? caption : ''
      })),
      m
    )
  }

  if (media.video) {
    await conn.sendMessage(m.chat, { video: { url: media.video }, caption }, { quoted: m })
    return true
  }

  if (media.audio) {
    await conn.sendMessage(m.chat, { audio: { url: media.audio }, mimetype: 'audio/mpeg' }, { quoted: m })
    return true
  }

  if (media.images[0]) {
    await conn.sendMessage(m.chat, { image: { url: media.images[0] }, caption }, { quoted: m })
    return true
  }

  const anyUrl = media.urls[0]
  if (anyUrl) {
    await conn.sendMessage(
      m.chat,
      {
        document: { url: anyUrl },
        fileName: 'file',
        mimetype: 'application/octet-stream',
        caption
      },
      { quoted: m }
    )
    return true
  }

  return false
}

export async function uploadToCatbox(buffer) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', new Blob([buffer]), 'image.jpg')

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form
  })

  const text = await res.text()
  if (!/^https?:\/\//i.test(text)) throw new Error(text)
  return text
}

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */