let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh: ${usedPrefix}${command} Hello`)
    try {
        await m.reply('⏳ Sedang memproses...')
        const url = global.API('theresav', '/ai/deepai', { ask: encodeURIComponent(text) }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        if (data.status) m.reply(data.result)
        else m.reply(`API Error: ${data.message || 'Unknown error'}`)
    } catch (e) {
        m.reply(`Error: ${e.message}`)
    }
}
handler.help = ['deepai <query>']
handler.tags = ['ai']
handler.command = /^deepai$/i
handler.description = 'AI DeepAI via Theresa API.'
handler.register = true
handler.limit = true
export default handler
