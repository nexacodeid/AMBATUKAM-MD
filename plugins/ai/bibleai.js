let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Usage: ${usedPrefix}${command} <question>`)
    try {
        global.loading(m, conn)
        const url = global.API('theresav', '/ai/bible', { text }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        global.loading(m, conn, true)
        if (data.status) {
            let reply = `*Question:* ${data.question}\n\n*Answer:* ${data.result.answer}\n\n*Sources:*\n`
            data.result.sources.forEach(s => { reply += `- ${s.text}\n` })
            m.reply(reply)
        } else {
            m.reply(`API Error: ${data.message}`)
        }
    } catch (e) {
        global.loading(m, conn, true)
        m.reply(`Error: ${e}`)
    }
}
handler.help = ['bibleai <question>']
handler.tags = ['ai']
handler.command = /^bibleai$/i
handler.description = 'Tanya jawab Bible AI.'
handler.register = true
handler.limit = true
export default handler
