let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh: ${usedPrefix}${command} hello`)
    try {
        await m.reply('⏳ Thinking...')
        const url = global.API('theresav', '/ai/chrunos', { text }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        if (data.status) m.reply(data.output)
        else m.reply(`Error: ${JSON.stringify(data)}`)
    } catch (e) {
        m.reply(`Error: ${e.message}`)
    }
}
handler.help = ['chrunos <text>']
handler.tags = ['ai']
handler.command = /^chrunos$/i
handler.description = 'AI Chat model Chrunos.'
handler.register = true
handler.limit = true
export default handler
