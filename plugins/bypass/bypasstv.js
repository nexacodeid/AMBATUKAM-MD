let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukan URL Linkvertise.\nContoh: ${usedPrefix}${command} https://linkvertise.com/xxxx`)
    try {
        global.loading(m, conn)
        const apiUrl = global.API('theresav', '/tools/bypass/linkvertise', { url: text }, 'apikey')
        const res = await fetch(apiUrl)
        const data = await res.json()
        global.loading(m, conn, true)
        if (data.status) m.reply(data.result)
        else m.reply(`Terjadi kesalahan: ${JSON.stringify(data)}`)
    } catch (e) {
        global.loading(m, conn, true)
        m.reply(`Terjadi kesalahan: ${e}`)
    }
}
handler.help = ['bypasstv <url>']
handler.tags = ['bypass']
handler.command = /^bypasstv$/i
handler.description = 'Bypass Linkvertise URL.'
handler.register = true
export default handler
