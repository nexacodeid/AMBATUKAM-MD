let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukkan URL adlinksumo!\nContoh: ${usedPrefix + command} https://adlinksumo.com/Ddq9Fx`)
    try {
        await m.reply('⏳ Memproses...')
        const apiUrl = global.API('theresav', '/bypass/adlinksumo', { url: text }, 'apikey')
        const res = await fetch(apiUrl)
        const data = await res.json()
        if (data.status) {
            const { original_url, bypassed_url, stats } = data.data
            let message = `[ ADLINKSUMO BYPASS ]\n\n`
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
handler.help = ['adlinksumo <url>']
handler.tags = ['bypass']
handler.command = /^adlinksumo$/i
handler.description = 'Bypass adlinksumo URL.'
handler.register = true
export default handler
