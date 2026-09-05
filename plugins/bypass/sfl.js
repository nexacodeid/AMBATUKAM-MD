let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukkan URL sfl.gl!\nContoh: ${usedPrefix + command} https://sfl.gl/5jfhStXT`)
    try {
        await m.reply('⏳ Memproses...')
        const apiUrl = global.API('theresav', '/bypass/sfl', { url: text }, 'apikey')
        const res = await fetch(apiUrl)
        const data = await res.json()
        if (data.status) {
            const { original_url, bypassed_url, stats } = data.data
            let message = `[ SFL BYPASS ]\n\n`
            message += `Original URL: ${original_url}\n`
            message += `Bypassed URL: ${bypassed_url}\n`
            message += `Duration: ${stats.duration} detik\n`
            message += `Clicks: ${stats.clicks}`
            m.reply(message)
        } else {
            m.reply(`Gagal memproses URL: ${JSON.stringify(data)}`)
        }
    } catch (e) {
        m.reply(`Terjadi kesalahan: ${e}`)
    }
}
handler.help = ['sfl <url>']
handler.tags = ['bypass']
handler.command = /^sfl$/i
handler.description = 'Bypass sfl.gl URL.'
handler.register = true
export default handler
