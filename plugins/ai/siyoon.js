let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukan Teks!\nContoh: ${usedPrefix + command} Hi`)
    try {
        global.loading(m, conn)
        const url = global.API('theresav', '/ai/siyoon', { text }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        global.loading(m, conn, true)
        if (data.status) m.reply(data.result)
        else m.reply('Terjadi kesalahan saat memproses permintaan.')
    } catch (e) {
        global.loading(m, conn, true)
        m.reply('Maaf, terjadi kesalahan pada server.')
    }
}
handler.help = ['siyoon <text>']
handler.tags = ['ai']
handler.command = /^siyoon$/i
handler.description = 'AI Chat dengan model Siyoon.'
handler.register = true
handler.limit = true
export default handler
