import axios from 'axios'
import FormData from 'form-data'

function parseInput(text = '') {
  const parts = text.split('|').map(v => v.trim())
  return {
    prompt: parts[0] || '',
    duration: Math.max(1, Math.min(10, Number(parts[1]) || 5)),
    enhance: (parts[2] || 'HD').toUpperCase()
  }
}

function getMime(q) {
  return q?.mimetype || q?.msg?.mimetype || q?.mediaType || ''
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m
  const mime = getMime(q)

  if (!/image\/(jpe?g|png|webp)/i.test(mime)) {
    return m.reply(
      `Reply atau kirim gambar dengan caption:\n` +
      `${usedPrefix + command} prompt|durasi|enhance\n\n` +
      `Contoh:\n` +
      `${usedPrefix + command} buat orang di gambar berjalan ke depan sambil tersenyum|10|HD`
    )
  }

  const { prompt, duration, enhance } = parseInput(text)

  if (!prompt) {
    return m.reply(
      `Masukkan prompt.\n\n` +
      `Contoh:\n` +
      `${usedPrefix + command} buat orang di gambar berjalan ke depan sambil tersenyum|10|HD`
    )
  }

  try {
    await m.react('⏳')
  } catch {}

  try {
    const buffer = await q.download?.()
    if (!buffer) throw new Error('Gagal mengambil gambar.')

    const ext =
      /png/i.test(mime) ? 'png' :
      /webp/i.test(mime) ? 'webp' :
      'jpg'

    const form = new FormData()
    form.append('image', buffer, {
      filename: `img2vid.${ext}`,
      contentType: mime || 'image/jpeg'
    })
    form.append('prompt', prompt)
    form.append('duration', String(duration))
    form.append('enhance', enhance)

    const url = global.API('theresav', '/ai/img2vid', {}, 'apikey')

    const { data } = await axios.post(url, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 1000 * 60 * 15
    })

    if (!data?.status) {
      throw new Error(data?.error || data?.message || 'Gagal membuat video.')
    }

    const result = data.result || data.data || data
    const videoUrl =
      result?.video ||
      result?.url ||
      result?.videoUrl ||
      result?.result?.video ||
      result?.result?.url ||
      (Array.isArray(result) ? (result[0]?.video || result[0]?.url) : null)

    if (!videoUrl) {
      throw new Error('URL video tidak ditemukan dari response API.')
    }

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        mimetype: 'video/mp4',
        caption:
          `✅ *IMG2VID BERHASIL*\n\n` +
          `📝 Prompt: ${prompt}\n` +
          `⏱️ Durasi: ${duration} detik\n` +
          `✨ Enhance: ${enhance}`
      },
      { quoted: m }
    )

    await m.react('✅')
  } catch (e) {
    await m.react('❌').catch(() => {})
    m.reply(`❌ Error img2vid\n\n${e.message}`)
  }
}

handler.help = ['img2vid <prompt>|<durasi>|<enhance>']
handler.tags = ['ai']
handler.command = /^(img2vid|runway|runwayvid)$/i
handler.register = true
handler.limit = true

export default handler