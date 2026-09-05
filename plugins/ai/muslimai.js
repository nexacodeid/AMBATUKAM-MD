let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Gunakan format: ${usedPrefix}${command} <pertanyaan>`)
    try {
        global.loading(m, conn)
        const url = global.API('theresav', '/ai/muslimai', { query: encodeURIComponent(text) }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        global.loading(m, conn, true)
        if (data.status) m.reply(data.result)
        else m.reply('Terjadi kesalahan saat memproses permintaan.')
    } catch (e) {
        global.loading(m, conn, true)
        m.reply('Maaf, terjadi kesalahan: ' + e.message)
    }
}
handler.help = ['muslimai <pertanyaan>']
handler.tags = ['ai']
handler.command = /^muslimai$/i
handler.description = 'Bertanya tentang ajaran Islam.'
handler.register = true
handler.limit = true
export default handler
