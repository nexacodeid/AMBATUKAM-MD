let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) return m.reply(`Silakan masukan pertanyaan!\nContoh: ${usedPrefix + command} Apa itu islam?`)
    try {
        const url = global.API('theresav', '/ai/chatilm', { message: encodeURIComponent(text) }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        if (data.status) m.reply(data.result)
        else m.reply(`Terjadi kesalahan: ${data.message || 'Tidak dapat memproses permintaan.'}`)
    } catch (e) {
        m.reply(`Terjadi kesalahan!\n\n${e}`)
    }
}
handler.help = ['chatilm <pertanyaan>']
handler.tags = ['ai']
handler.command = /^chatilm$/i
handler.description = 'Bertanya kepada AI ilmu Islam.'
handler.register = true
handler.limit = true
export default handler
