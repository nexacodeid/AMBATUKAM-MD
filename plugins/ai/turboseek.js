let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh: ${usedPrefix}${command} What is the capital of France?`)
    try {
        await m.reply('⏳ Please wait, fetching results...')
        const url = global.API('theresav', '/ai/turboseek', { text }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        if (data.status && data.result?.answer) {
            let answer = `*Answer:* ${data.result.answer}\n\n*Sources:*\n`
            if (Array.isArray(data.result.sources)) {
                data.result.sources.forEach((s, i) => { answer += `${i + 1}. ${s}\n` })
            } else {
                answer += 'No sources found.'
            }
            m.reply(answer)
        } else {
            m.reply('No results found or an error occurred.')
        }
    } catch (e) {
        m.reply(`Error: ${e.message}`)
    }
}
handler.help = ['turboseek <query>']
handler.tags = ['ai']
handler.command = /^turboseek$/i
handler.description = 'Cari jawaban menggunakan TurboSeek AI.'
handler.register = true
handler.limit = true
export default handler
