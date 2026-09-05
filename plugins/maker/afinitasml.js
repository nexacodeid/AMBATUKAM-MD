/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import { createCanvas, loadImage } from '@napi-rs/canvas'
import axios from 'axios'

const borders = {
  1: 'https://raw.githubusercontent.com/raizell526/dat2/main/uploads/37a1d6-1780367149066.png',
  2: 'https://raw.githubusercontent.com/raizell526/dat1/main/uploads/37179c-1780367174399.png',
  3: 'https://raw.githubusercontent.com/raizell526/dat4/main/uploads/6434ec-1780367224060.png',
  4: 'https://raw.githubusercontent.com/raizell526/dat3/main/uploads/b03f50-1780367227585.png',
  5: 'https://raw.githubusercontent.com/raizell526/dat4/main/uploads/895eca-1780367359007.png',
  6: 'https://raw.githubusercontent.com/raizell526/dat4/main/uploads/97db00-1780367360636.png'
}

const bgUrl = 'https://files.catbox.moe/60th8f.jpg'

/*
 * x    = geser avatar + border ke kanan/kiri
 * y    = geser avatar + border ke atas/bawah
 * size = ukuran avatar
 */
const AVATAR_CONFIG = {
  x: 260,
  y: 535,
  size: 215
}

/*
 * offset makin besar = border makin besar
 * offset makin kecil = border makin rapat/kecil
 */
const BORDER_OFFSET = {
  1: 28,
  2: 28,
  3: 28,
  4: 28,
  5: 28,
  6: 28
}

/*
 * Geser border saja, avatar tidak ikut.
 */
const BORDER_SHIFT = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: 0 },
  3: { x: 0, y: 0 },
  4: { x: 0, y: 0 },
  5: { x: 0, y: 0 },
  6: { x: 0, y: 0 }
}

/*
 * Geser avatar saja, border tidak ikut.
 */
const AVATAR_SHIFT = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: 0 },
  3: { x: 0, y: 0 },
  4: { x: 0, y: 0 },
  5: { x: 0, y: 0 },
  6: { x: 0, y: 0 }
}

function teksPanduan(usedPrefix, command) {
  return `
🖼️ *AFINITAS ML*

*Cara pakai:*
Reply gambar, lalu ketik:

${usedPrefix + command} nomor_border

*Contoh:*
${usedPrefix + command} 1
${usedPrefix + command} 2

*Daftar Border:*
${Object.keys(borders).map(v => `• Border ${v}`).join('\n')}

*Catatan:*
Gambar wajib dari pesan yang di-reply.
`.trim()
}

async function loadImageFromUrl(url) {
  const { data } = await axios.get(url, { responseType: 'arraybuffer' })
  return loadImage(Buffer.from(data))
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!mime.startsWith('image/')) {
      await m.react('❌')
      return m.reply(teksPanduan(usedPrefix, command))
    }

    const borderNum = Number(text) || 1

    if (!borders[borderNum]) {
      await m.react('❌')
      return m.reply(
        `Border *${borderNum}* tidak tersedia.\n\n${teksPanduan(usedPrefix, command)}`
      )
    }

    await m.react('⏳')

    const userImgBuff = await q.download()
    if (!userImgBuff) {
      await m.react('❌')
      return m.reply('Gagal mengunduh gambar.')
    }

    const [userImage, bg, frame] = await Promise.all([
      loadImage(userImgBuff),
      loadImageFromUrl(bgUrl),
      loadImageFromUrl(borders[borderNum])
    ])

    const scale = 2
    const baseWidth = bg.width
    const baseHeight = bg.height

    const canvas = createCanvas(baseWidth * scale, baseHeight * scale)
    const ctx = canvas.getContext('2d')

    ctx.scale(scale, scale)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(bg, 0, 0, baseWidth, baseHeight)

    const avatarShift = AVATAR_SHIFT[borderNum] || { x: 0, y: 0 }
    const borderShift = BORDER_SHIFT[borderNum] || { x: 0, y: 0 }

    const avatarX = AVATAR_CONFIG.x + avatarShift.x
    const avatarY = AVATAR_CONFIG.y + avatarShift.y
    const avatarSize = AVATAR_CONFIG.size

    const offset = BORDER_OFFSET[borderNum] ?? 28

    const borderSize = avatarSize + offset * 2
    const borderX = avatarX - offset + borderShift.x
    const borderY = avatarY - offset + borderShift.y

    const { width, height } = userImage
    const min = Math.min(width, height)
    const cropX = (width - min) / 2
    const cropY = (height - min) / 2

    ctx.drawImage(
      userImage,
      cropX,
      cropY,
      min,
      min,
      avatarX,
      avatarY,
      avatarSize,
      avatarSize
    )

    ctx.drawImage(
      frame,
      borderX,
      borderY,
      borderSize,
      borderSize
    )

    const buffer = canvas.toBuffer('image/png')

    await conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption:
          `✅ Selesai!\n` +
          `🖼️ Border: ${borderNum}\n` +
          `📌 Mode: HD`
      },
      { quoted: m }
    )

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply('Error: ' + e.message)
  }
}

handler.help = ['afinitasml <border>']
handler.tags = ['maker']
handler.command = /^afinitasml$/i
handler.register = true

export default handler
