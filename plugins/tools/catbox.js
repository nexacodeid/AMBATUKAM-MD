/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) m.reply(`Balas media dengan perintah *${usedPrefix + command}*`)

  try {
    const media = await q.download()
    const ext = mime.split('/')[1] || 'bin'
    const filePath = path.join(tmpdir(), `upload-${Date.now()}.${ext}`)
    fs.writeFileSync(filePath, media)

    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', fs.createReadStream(filePath))

    const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders(),
    })

    fs.unlinkSync(filePath)
    m.reply(`✅ *Upload berhasil!*\n${data}`)
  } catch (err) {
    console.error('❌ Error upload:', err)
    m.reply('❌ Gagal upload ke catbox.moe')
  }
}

handler.help = ['catbox']
handler.tags = ['tools']
handler.command = /^catbox$/i
handler.limit = true
handler.register = true

export default handler

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */