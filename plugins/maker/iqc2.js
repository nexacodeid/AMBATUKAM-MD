/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Feature : IQC Image Card
 *┃ 🔹 Command : .iqc
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'
import https from 'https'
import path from 'path'
import fs from 'fs'

const ROOT_DIR = process.cwd()
const ASSETS_DIR = path.join(ROOT_DIR, 'assets', 'iqc')
const FONTS_DIR = path.join(ASSETS_DIR, 'fonts')
const BG_DIR = path.join(ASSETS_DIR, 'backgrounds')
const IMG_DIR = path.join(ASSETS_DIR, 'images')
const TMP_DIR = path.join(ROOT_DIR, 'tmp')

const REMOTE_ASSETS = [
  {
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/SFPRODISPLAYREGULAR.OTF',
    dest: path.join(FONTS_DIR, 'SFPRODISPLAYREGULAR.OTF')
  },
  {
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/SFPRODISPLAYSEMIBOLD.ttf',
    dest: path.join(FONTS_DIR, 'SFPRODISPLAYSEMIBOLD.ttf')
  },
  {
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Image/bg.jpg',
    dest: path.join(BG_DIR, 'bg.jpg')
  },
  {
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Image/artworks-gWLRE6HyPH3DgVMG-ZFFxtg-t500x500.jpg',
    dest: path.join(IMG_DIR, 'photo.jpg')
  }
]

const WA_COLORS = [
  '#E53935', '#D81B60', '#8E24AA', '#5E35B1',
  '#1E88E5', '#039BE5', '#00897B', '#43A047',
  '#F4511E', '#FB8C00'
]

const COLOR_FILE = path.join(ASSETS_DIR, '.color_index')

const config = {
  canvas: { width: 1920, height: 3413 },
  safeZones: {
    namaAtas: {
      a: 980, b: 1080, c: 250, d: 630,
      fontSize: 55, maxChars: 25,
      font: 'SFProSemiBold', align: 'left'
    },
    foto: {
      a: 1125, b: 1713, c: 240, d: 830,
      radius: 28
    },
    waktu: {
      a: 1750, b: 1860, c: 233, d: 424,
      fontSize: 45, maxChars: 10,
      font: 'SFProRegular', textColor: '#555555', align: 'center'
    },
    namaBawah: {
      a: 2701, b: 2880, c: 700, d: 1160,
      centerY: 2787,
      fontSize: 67, maxChars: 25,
      font: 'SFProSemiBold', textColor: '#100e0e', align: 'left'
    }
  }
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return resolve()

    fs.mkdirSync(path.dirname(dest), { recursive: true })
    const file = fs.createWriteStream(dest)

    https.get(url, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        file.close(() => {
          if (fs.existsSync(dest)) fs.unlinkSync(dest)
          download(res.headers.location, dest).then(resolve).catch(reject)
        })
        return
      }

      if (res.statusCode !== 200) {
        file.close(() => {
          if (fs.existsSync(dest)) fs.unlinkSync(dest)
          reject(new Error(`HTTP ${res.statusCode} untuk ${url}`))
        })
        return
      }

      res.pipe(file)
      file.on('finish', () => {
        file.close(() => {
          if (!fs.existsSync(dest) || fs.statSync(dest).size <= 0) {
            return reject(new Error(`Asset gagal disimpan: ${dest}`))
          }
          resolve()
        })
      })
    }).on('error', err => {
      file.close(() => {
        if (fs.existsSync(dest)) fs.unlinkSync(dest)
        reject(err)
      })
    })
  })
}

async function downloadAll() {
  for (const asset of REMOTE_ASSETS) await download(asset.url, asset.dest)
}

function findFontFile(dir, basenames) {
  if (!fs.existsSync(dir)) return null
  const files = fs.readdirSync(dir)

  for (const base of basenames) {
    const match = files.find(f => f.toLowerCase() === base.toLowerCase())
    if (match) return path.join(dir, match)
  }

  return null
}

function registerFont(family, ...basenames) {
  const file = findFontFile(FONTS_DIR, basenames)
  if (!file) throw new Error(`Font tidak ditemukan: ${family}`)

  GlobalFonts.registerFromPath(file, family)
}

let fontsLoaded = false
function loadFonts() {
  if (fontsLoaded) return

  registerFont('SFProSemiBold', 'SFPRODISPLAYSEMIBOLD.TTF', 'SFPRODISPLAYSEMIBOLD.OTF')
  registerFont('SFProRegular', 'SFPRODISPLAYREGULAR.OTF', 'SFPRODISPLAYREGULAR.TTF')

  fontsLoaded = true
}

function getNextColor() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true })

  let idx = 0
  if (fs.existsSync(COLOR_FILE)) {
    idx = parseInt(fs.readFileSync(COLOR_FILE, 'utf8')) || 0
  }

  const color = WA_COLORS[idx % WA_COLORS.length]
  fs.writeFileSync(COLOR_FILE, String((idx + 1) % WA_COLORS.length))

  return color
}

function roundedClipPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawText(ctx, text, zone, textColor) {
  const { a, b, c, d, fontSize, maxChars, font, align, fontWeight, centerY } = zone

  const str = String(text || '').slice(0, maxChars)
  const boxW = d - c
  const boxH = b - a
  const cy = centerY !== undefined ? centerY : a + boxH / 2
  const weight = fontWeight || (font === 'SFProSemiBold' ? 'bold' : 'normal')

  let size = fontSize

  ctx.textBaseline = 'middle'

  while (size > 12) {
    ctx.font = `${weight} ${size}px ${font}`
    if (ctx.measureText(str).width <= boxW) break
    size -= 1
  }

  ctx.font = `${weight} ${size}px ${font}`
  ctx.fillStyle = textColor
  ctx.shadowColor = 'transparent'

  if (align === 'center') {
    ctx.textAlign = 'center'
    ctx.fillText(str, c + boxW / 2, cy)
  } else {
    ctx.textAlign = 'left'
    ctx.fillText(str, c, cy)
  }
}

async function drawFoto(ctx, imagePath, zone) {
  const { a, b, c, d, radius } = zone

  const x = c
  const y = a
  const w = d - c
  const h = b - a
  const r = radius || 28

  const img = await loadImage(imagePath)
  const imgRatio = img.width / img.height
  const boxRatio = w / h

  ctx.save()
  roundedClipPath(ctx, x, y, w, h, r)
  ctx.clip()

  ctx.filter = 'blur(28px)'
  ctx.drawImage(img, x - 40, y - 40, w + 80, h + 80)
  ctx.filter = 'none'

  let fw
  let fh

  if (imgRatio > boxRatio) {
    fw = w
    fh = fw / imgRatio
  } else {
    fh = h
    fw = fh * imgRatio
  }

  ctx.drawImage(img, x + (w - fw) / 2, y + (h - fh) / 2, fw, fh)

  ctx.restore()
}

async function generateIqc({ nama, waktu, photoPath }) {
  await downloadAll()
  loadFonts()

  const namaColor = getNextColor()
  const { width, height } = config.canvas

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const bgPath = path.join(BG_DIR, 'bg.jpg')
  if (fs.existsSync(bgPath) && fs.statSync(bgPath).size > 0) {
    const bgImg = await loadImage(bgPath)
    ctx.drawImage(bgImg, 0, 0, width, height)
  } else {
    ctx.fillStyle = '#f0ece4'
    ctx.fillRect(0, 0, width, height)
  }

  const fallbackPhoto = path.join(IMG_DIR, 'photo.jpg')
  const finalPhoto = fs.existsSync(photoPath || '') ? photoPath : fallbackPhoto

  if (fs.existsSync(finalPhoto) && fs.statSync(finalPhoto).size > 0) {
    await drawFoto(ctx, finalPhoto, config.safeZones.foto)
  }

  drawText(ctx, nama, config.safeZones.namaAtas, namaColor)
  drawText(ctx, waktu, config.safeZones.waktu, config.safeZones.waktu.textColor)
  drawText(ctx, nama, config.safeZones.namaBawah, config.safeZones.namaBawah.textColor)

  return canvas.toBuffer('image/png')
}

function formatClock(date = new Date()) {
  return date.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace('.', ':')
}

function cleanName(name = '') {
  return String(name || 'user')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 25) || 'user'
}

async function getPhotoPath(m, conn, targetJid) {
  fs.mkdirSync(TMP_DIR, { recursive: true })

  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (/image\/(jpe?g|png|webp)/i.test(mime)) {
    const media = await q.download()
    if (media) {
      const imagePath = path.join(TMP_DIR, `iqc-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`)
      fs.writeFileSync(imagePath, media)
      return imagePath
    }
  }

  try {
    const pp = await conn.profilePictureUrl(targetJid, 'image')
    const res = await fetch(pp)
    const buffer = Buffer.from(await res.arrayBuffer())
    const imagePath = path.join(TMP_DIR, `iqc-pp-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`)
    fs.writeFileSync(imagePath, buffer)
    return imagePath
  } catch {
    return path.join(IMG_DIR, 'photo.jpg')
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let tmpPhoto = null

  try {
    await m.react?.('⏳').catch(() => {})

    let [namaInput, waktuInput] = String(text || '').split('|').map(v => v.trim())
    const target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender

    let nama =
      namaInput ||
      m.quoted?.name ||
      m.pushName ||
      target?.split('@')[0] ||
      'user'

    nama = cleanName(nama)
    const waktu = waktuInput || formatClock()

    const photoPath = await getPhotoPath(m, conn, target)
    if (photoPath.includes(`${path.sep}tmp${path.sep}`)) tmpPhoto = photoPath

    const buffer = await generateIqc({ nama, waktu, photoPath })

    await conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption:
          `✅ *IQC berhasil dibuat*\n\n` +
          `👤 Nama: ${nama}\n` +
          `⏰ Waktu: ${waktu}`
      },
      { quoted: m }
    )

    await m.react?.('✅').catch(() => {})
  } catch (e) {
    console.error(e)
    await m.react?.('❌').catch(() => {})
    m.reply(`❌ Error IQC\n\n${e.message || e}`)
  } finally {
    if (tmpPhoto && fs.existsSync(tmpPhoto)) {
      try { fs.unlinkSync(tmpPhoto) } catch {}
    }
  }
}

handler.help = ['iqc2 [nama|waktu]']
handler.tags = ['maker']
handler.command = /^(iqc2)$/i
handler.limit = true
handler.register = true

export default handler