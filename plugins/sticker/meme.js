import { Sticker } from 'wa-sticker-formatter'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'

async function uguu(filePath) {
  const form = new FormData()
  form.append('files[]', fs.createReadStream(filePath))

  const { data } = await axios.post('https://uguu.se/upload', form, {
    headers: {
      ...form.getHeaders()
    }
  })

  if (!data.files || !data.files[0] || !data.files[0].url) {
    throw new Error('Gagal upload ke Uguu')
  }

  return data.files[0].url
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [atas, bawah] = (text || '').split('|')

  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!mime) {
    return m.reply(`Balas media dengan perintah:\n\n${usedPrefix + command} <teks atas>|<teks bawah>`)
  }

  if (!/image|video|webp/.test(mime)) {
    return m.reply('Media tidak didukung. Kirim/reply gambar, video, atau stiker.')
  }

  await m.react('🕒')

  let mediaBuffer = await q.download()
  if (!mediaBuffer) return m.reply('Gagal download media.')

  let ext = mime.split('/')[1] || 'png'
  if (ext === 'jpeg') ext = 'jpg'

  let tempFile = path.join(process.cwd(), `temp_${Date.now()}.${ext}`)

  try {
    fs.writeFileSync(tempFile, mediaBuffer)

    let url = await uguu(tempFile)
    let stickerSource

    if (mime.startsWith('image/')) {
      stickerSource = `https://api.memegen.link/images/custom/${encodeURIComponent(atas || ' ')}/${encodeURIComponent(bawah || ' ')}.png?background=${encodeURIComponent(url)}`
    } else {
      stickerSource = url
    }

    let sticker = await createSticker(stickerSource)
    await conn.sendFile(m.chat, sticker, 'sticker.webp', '', m)

    await m.react('✅')
  } catch (err) {
    await m.react('❌')
    m.reply(`Error: ${err.message}`)
  } finally {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile)
  }
}

handler.help = ['smeme <teks atas>|<teks bawah>']
handler.tags = ['sticker']
handler.command = /^(smeme)$/i
handler.limit = true
handler.register = true

export default handler

async function createSticker(source, quality = 100) {
  let stickerMetadata = {
    type: 'full',
    pack: global.stickpack || global.getBotName?.() || global.namebot || 'WhatsApp Bot',
    author: global.stickauth || global.getOwnerName?.() || global.ownerName || global.author || 'Owner',
    quality
  }

  return new Sticker(source, stickerMetadata).toBuffer()
}