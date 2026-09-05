let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukan URL ouo.io yang ingin di bypass!\nContoh: ${usedPrefix}${command} https://ouo.io/xxxxxxxx`)
    try {
        global.loading(m, conn)
        const url = global.API('theresav', '/tools/ouo/bypass', { url: text }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        global.loading(m, conn, true)
        if (data.status && data.result) {
            await m.reply(`*Berhasil Bypass Ouo.io*\n\n*Input:* ${data.input}\n*Result:* ${data.result}`)
        } else {
            m.reply(`Terjadi kesalahan: ${data.message || 'Gagal bypass URL.'}`)
        }
    } catch (e) {
        global.loading(m, conn, true)
        m.reply(`Terjadi kesalahan: ${e.message}`)
    }
}
handler.help = ['bypassouo <url>']
handler.tags = ['bypass']
handler.command = /^bypassouo$/i
handler.description = 'Bypass URL ouo.io'
handler.register = true
export default handler
