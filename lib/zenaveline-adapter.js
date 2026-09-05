/*
 *╭━━━[ 🤖 Raizell AI Bot ]━━━╮
 *┃ 🔹 Creator : Zaell × Raizell AI
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import { promises as fs } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { extname, join } from 'node:path'
import { tmpdir } from 'node:os'

import sharp from 'sharp'
import scraper from '@zenaveline/scraper'

export { scraper }

export const AIO_TOOLS = Object.freeze([
  'apple-music-downloader',
  'douyin-downloader',
  'facebook-video-downloader',
  'instagram-reels-downloader',
  'instagram-story-downloader',
  'instagram-video-downloader',
  'likee-downloader',
  'linkedin-video-downloader',
  'pinterest-video-downloader',
  'soundcloud-downloader',
  'spotify-downloader',
  'tiktok-photo-downloader',
  'tiktok-story-downloader',
  'tiktok-video-downloader',
  'twitter-gif-downloader',
  'twitter-video-downloader',
  'youtube-monetization-checker',
  'youtube-money-calculator',
  'youtube-tags-extractor',
  'youtube-thumbnail-downloader',
  'youtube-transcript',
  'youtube-video-downloader'
])

export function formatNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number.toLocaleString('id-ID') : String(value ?? '-')
}

export function truncate(value, max = 3500) {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  if (!text) return '-'
  return text.length > max ? `${text.slice(0, max)}\n…(dipotong)` : text
}

export function extractUrl(text = '') {
  return String(text).match(/https?:\/\/[^\s<>]+/i)?.[0]?.replace(/[),.]+$/, '') || null
}

export function spotifyId(input = '', type) {
  const value = String(input).trim()
  const match = value.match(new RegExp(`(?:open\\.spotify\\.com\\/${type}\\/|spotify:${type}:)([A-Za-z0-9]+)`, 'i'))
  return match?.[1] || (/^[A-Za-z0-9]+$/.test(value) ? value : null)
}

export function collectUrlEntries(value) {
  const result = []
  const seenObjects = new WeakSet()
  const seenUrls = new Set()

  const visit = (item, path = 'result') => {
    if (typeof item === 'string') {
      const matches = item.match(/https?:\/\/[^\s"'<>]+/gi) || []
      for (const raw of matches) {
        const url = raw.replace(/[),.]+$/, '')
        if (!seenUrls.has(url)) {
          seenUrls.add(url)
          result.push({ path, url })
        }
      }
      return
    }

    if (!item || typeof item !== 'object') return
    if (seenObjects.has(item)) return
    seenObjects.add(item)

    if (Array.isArray(item)) {
      item.forEach((entry, index) => visit(entry, `${path}[${index}]`))
      return
    }

    for (const [key, entry] of Object.entries(item)) {
      visit(entry, `${path}.${key}`)
    }
  }

  visit(value)

  const score = ({ path }) => {
    if (/(download|no_watermark|video_url|url_dl|\.dl\b|\.links?\b)/i.test(path)) return 0
    if (/(media|videos?|images?|slides?|audio|music)/i.test(path)) return 1
    if (/(thumbnail|thumb|cover|avatar)/i.test(path)) return 3
    return 2
  }

  return result.sort((a, b) => score(a) - score(b))
}

function fileNameFromUrl(url, fallback = 'hasil.bin') {
  try {
    const name = decodeURIComponent(new URL(url).pathname.split('/').pop() || '')
      .replace(/[^a-zA-Z0-9._ -]/g, '_')
      .slice(0, 100)
    return name && extname(name) ? name : fallback
  } catch {
    return fallback
  }
}

export async function sendMediaEntries(conn, m, data, options = {}) {
  const {
    caption = '',
    max = 10,
    fallbackName = 'hasil.bin',
    filter = () => true
  } = options

  const entries = collectUrlEntries(data).filter(filter).slice(0, max)
  if (!entries.length) throw new Error(`Tidak menemukan URL media pada respons:\n${truncate(data, 1200)}`)

  let sent = 0
  const failed = []

  for (const entry of entries) {
    try {
      const result = await conn.sendFile(
        m.chat,
        entry.url,
        fileNameFromUrl(entry.url, fallbackName),
        sent === 0 ? caption : '',
        m
      )
      if (result) sent += 1
      else failed.push(entry.url)
    } catch {
      failed.push(entry.url)
    }
  }

  if (!sent) {
    await m.reply(`Media tidak dapat dikirim langsung. Link hasil:\n${failed.map((url, index) => `${index + 1}. ${url}`).join('\n')}`)
  }

  return { sent, failed, total: entries.length }
}

export async function withQuotedImage(m, callback) {
  const quoted = m.quoted || m
  const mime = (quoted.msg || quoted).mimetype || quoted.mediaType || ''

  if (!/^image\//i.test(mime)) {
    throw new Error('Kirim atau balas sebuah gambar terlebih dahulu.')
  }

  const buffer = await quoted.download()
  if (!Buffer.isBuffer(buffer) || !buffer.length) {
    throw new Error('Gambar tidak berhasil diunduh dari pesan.')
  }

  const suffix = mime.includes('png') ? '.png' : mime.includes('webp') ? '.webp' : '.jpg'
  const filePath = join(tmpdir(), `zenaveline-${randomUUID()}${suffix}`)
  await fs.writeFile(filePath, buffer)

  try {
    return await callback({ buffer, filePath, mime, quoted })
  } finally {
    await fs.unlink(filePath).catch(() => {})
  }
}

export async function simulationWatermark(input) {
  const image = sharp(input)
  const metadata = await image.metadata()
  const width = metadata.width || 1080
  const height = metadata.height || 1920
  const fontSize = Math.max(48, Math.round(width * 0.12))
  const bandHeight = Math.max(110, Math.round(fontSize * 1.7))

  const overlay = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-25 ${width / 2} ${height / 2})">
        <rect x="-${width * 0.2}" y="${height / 2 - bandHeight / 2}" width="${width * 1.4}" height="${bandHeight}" fill="rgba(190,0,0,0.72)"/>
        <text x="${width / 2}" y="${height / 2 + fontSize * 0.34}" text-anchor="middle" font-family="sans-serif" font-size="${fontSize}" font-weight="800" fill="#fff" letter-spacing="8">SIMULASI</text>
      </g>
    </svg>
  `)

  return image.composite([{ input: overlay }]).png().toBuffer()
}

export function errorMessage(error) {
  const response = error?.response?.data
  if (typeof response === 'string') return response
  if (response) return truncate(response, 900)
  return error?.message || String(error)
}

/*
 *╭━━━[ 🤖 Raizell AI Bot ]━━━╮
 *┃ 🔹 Creator : Zaell × Raizell AI
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */