let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        const text1 = args[0] || global.getOwnerName?.() || global.ownerName || 'Owner'
        const text2 = args[1] || 'Bot'
        const url = global.API('theresav', '/maker/pornhub', { text1, text2 }, 'apikey')
        const res = await fetch(url)
        if (!res.ok) return m.reply(`HTTP error! status: ${res.status}`)
        const buffer = Buffer.from(await res.arrayBuffer())
        await conn.sendMessage(m.chat, { image: buffer, caption: '🎬 Maker' }, { quoted: m })
    } catch (e) {
        m.reply(`Error: ${e.message}`)
    }
}
handler.help = ['phub <teks1> <teks2>']
handler.tags = ['maker']
handler.command = /^phub$/i
handler.description = 'Buat gambar style Pornhub dengan teks custom.'
handler.register = true
export default handler
