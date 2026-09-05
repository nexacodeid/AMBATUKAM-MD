import { AIRich } from '../../lib/messagebutton.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Contoh: ${usedPrefix + command} naruto`)

  try {
    await m.react?.('⏳').catch(() => {})

    const url = global.API('theresav', '/search/pinterest', {
      query: text
    }, 'apikey')

    const res = await fetch(url)
    const data = await res.json()

    if (!data.status || !Array.isArray(data.result)) {
      await m.react?.('❌').catch(() => {})
      return m.reply('Gagal mengambil data dari API.')
    }

    const results = data.result
      .filter(v => v.directLink)
      .slice(0, 10)

    if (!results.length) {
      await m.react?.('❌').catch(() => {})
      return m.reply('Tidak ada gambar yang valid.')
    }

    const rich = new AIRich(conn)
      .setTitle('Pinterest Search')
      .addText(`*Pinterest Result*\n\nQuery: ${text}\nTotal: ${results.length} gambar`)
      .addSuggest([
        `${usedPrefix + command} anime`,
        `${usedPrefix + command} wallpaper`,
        `${usedPrefix + command} logo`
      ])

    for (const img of results) {
      rich.addImage({
        image: img.directLink,
        caption: img.link || 'Pinterest Image'
      })
    }

    await rich.send(m.chat, { quoted: m })

    await m.react?.('✅').catch(() => {})
  } catch (e) {
    console.error(e)
    await m.react?.('❌').catch(() => {})
    m.reply(`Error: ${e.message}`)
  }
}

handler.help = ['pinterest <query>', 'pins <query>']
handler.tags = ['search']
handler.command = /^(pinterest|pins)$/i
handler.register = true

export default handler