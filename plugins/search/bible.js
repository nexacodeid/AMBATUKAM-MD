let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh: ${usedPrefix + command} kasih`)
    try {
        await m.reply('⏳ Sedang mencari...')
        const url = global.API('theresav', '/search/bible', { q: encodeURIComponent(text) }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        if (data.status && data.result?.length > 0) {
            let msg = `Hasil Pencarian Alkitab untuk "${text}":\n\n`
            data.result.forEach((item, i) => {
                msg += `${i + 1}. *${item.title}*\n`
                msg += `   _${item.text}_\n`
                msg += `   Link: ${item.link}\n\n`
            })
            m.reply(msg)
        } else {
            m.reply(`Tidak ditemukan hasil untuk "${text}".`)
        }
    } catch (e) {
        m.reply(`Terjadi kesalahan: ${e.message}`)
    }
}
handler.help = ['bible <teks>']
handler.tags = ['search']
handler.command = /^bible$/i
handler.description = 'Mencari ayat Alkitab.'
handler.register = true
export default handler
