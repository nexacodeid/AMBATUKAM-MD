let handler = async (m, { conn }) => {
    try {
        await m.reply('⏳ Retrieving image...')
        const url = global.API('theresav', '/image/loli', {}, 'apikey')
        const res = await fetch(url)
        if (!res.ok) return m.reply(`Failed to fetch image. Status: ${res.status}`)
        const buffer = Buffer.from(await res.arrayBuffer())
        await conn.sendMessage(m.chat, { image: buffer, caption: '🌸 Loli Image' }, { quoted: m })
    } catch (e) {
        m.reply(`Error: ${e.message}`)
    }
}
handler.help = ['loli']
handler.tags = ['anime']
handler.command = /^loli$/i
handler.description = 'Gambar random loli anime.'
handler.nsfw = true
handler.register = true
handler.limit = true
export default handler
