import fetch from 'node-fetch'
import FormData from 'form-data'
import { AIRich, ButtonV2 } from '../../lib/messagebutton.js'

function splitFirstCodeBlock(text = '') {
  const value = String(text || '')
  const match = value.match(/```([\w.+-]*)\n([\s\S]*?)```/)
  if (!match) return { before: value.trim(), lang: '', code: '' }
  return {
    before: value.replace(match[0], '').trim(),
    lang: match[1] || 'text',
    code: match[2].trim()
  }
}

async function sendRichGPT(conn, m, result, usedPrefix) {
  const response = String(result || '').trim()
  const parsed = splitFirstCodeBlock(response)

  try {
    const rich = new AIRich(conn).setTitle('GPT-4o Response')
    if (parsed.code) {
      if (parsed.before) rich.addText(parsed.before)
      rich.addCode(parsed.lang, parsed.code)
    } else {
      rich.addText(response)
    }
    rich.addSuggest(['Ringkas jawaban ini', 'Beri contoh', 'Ubah jadi langkah-langkah'])
    return await rich.send(m.chat, { quoted: m })
  } catch (e) {
    console.log('SEND GPT AIRICH ERROR:', e)
    try {
      return await new ButtonV2(conn)
        .setBody(`乂 *GPT-4o Response*\n\n${response}`)
        .setFooter(global.namebot || 'AI Assistant')
        .addButton('🔁 Tanya Lagi', `${usedPrefix}gpt `)
        .addButton('🧠 DeepSeek', `${usedPrefix}deepseek `)
        .send(m.chat, { quoted: m })
    } catch (err) {
      console.log('SEND GPT BUTTON ERROR:', err)
      return m.reply(`乂 *GPT-4o Response*\n\n${response}`)
    }
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    const q = text || m.quoted?.text
    const mime = (m.quoted || m).mimetype || ''
    const isImage = /image\/(png|jpe?g|webp)/i.test(mime)

    if (!q && !isImage) {
      return m.reply(
        `Contoh penggunaan:\n` +
        `${usedPrefix + command} Halo\n\n` +
        `Atau kirim/reply gambar dengan caption:\n` +
        `${usedPrefix + command} gambar ini apa?`
      )
    }

    await conn.sendPresenceUpdate('composing', m.chat)

    const form = new FormData()
    form.append('text', q || '')
    form.append('apikey', global.APIKeys?.[global.APIs?.theresav] || '')

    if (isImage) {
      const media = await (m.quoted || m).download()
      form.append('image', media, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
      })
    }

    const res = await fetch(global.API('theresav', '/ai/gpt'), {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    })

    const json = await res.json()

    if (!json.status) {
      return m.reply('❌ Gagal mendapatkan respon dari API')
    }

    return await sendRichGPT(conn, m, json.result, usedPrefix)
  } catch (e) {
    console.error(e)
    m.reply(`❌ Terjadi error\n\n${e.message}`)
  }
}

handler.help = ['gpt <text>', 'gpt <image>']
handler.tags = ['ai']
handler.command = /^(gpt|gpt4|gpt4o)$/i
handler.register = true
handler.limit = true

export default handler