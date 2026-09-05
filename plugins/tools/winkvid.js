import fetch from 'node-fetch'
import FormData from 'form-data'

const handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = q.mimetype || ''

    if (!/video/.test(mime)) {
      return m.reply(
        `Reply/kirim video dengan caption:\n.winkvideo`
      )
    }

    await conn.sendPresenceUpdate('composing', m.chat)

    let media = await q.download()

    let form = new FormData()
    form.append('video', media, {
      filename: 'video.mp4',
      contentType: mime
    })

    form.append('apikey', 'raizell')

    const res = await fetch(
      'https://api.theresav.biz.id/tools/winkvideo',
      {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
      }
    )

    const json = await res.json()

    if (!json.status) {
      return m.reply('❌ Gagal memproses video')
    }

    let result = json.result?.url

    if (!result) {
      return m.reply('❌ Link hasil tidak ditemukan')
    }

    let teks = `乂 *Wink AI Video Enhancer*\n\n`
    teks += `✅ Video berhasil di enhance\n\n`
    teks += `🔗 Link Download:\n${result}`

    await m.reply(teks)

  } catch (e) {
    console.error(e)
    m.reply(`❌ Error\n\n${e.message}`)
  }
}

handler.help = ['winkvideo']
handler.tags = ['tools']
handler.command = /^(winkvideo|winkai)$/i
handler.register = true

export default handler