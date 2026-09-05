let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Usage: ${usedPrefix + command} <query>`)
    try {
        await m.reply('⏳ Mencari...')
        const query = args.join(' ')
        const url = global.API('theresav', '/search/youtube', { q: query }, 'apikey')
        const res = await fetch(url)
        const json = await res.json()
        if (!json.status || !json.result?.length) return m.reply('No results found.')

        const videos = json.result
        const rows = videos.slice(0, 10).flatMap(v => [
            {
                header: v.channel,
                title: `📹 ${v.title.length > 40 ? v.title.slice(0, 37) + '...' : v.title}`,
                description: `⏱️ ${v.duration}`,
                id: `${usedPrefix}ytmp4 ${v.link}`
            },
            {
                header: v.channel,
                title: `🎧 ${v.title.length > 40 ? v.title.slice(0, 37) + '...' : v.title}`,
                description: `⏱️ ${v.duration}`,
                id: `${usedPrefix}ytmp3 ${v.link}`
            }
        ])

        await conn.sendMessage(m.chat, {
            text: `🎬 *YouTube Search Results*\nQuery: *${query}*\nTotal: ${videos.length} video`,
            footer: 'Pilih untuk download Video/Audio',
            buttons: [{
                buttonId: 'yts_select',
                buttonText: { displayText: '📥 Pilih Video/Audio' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: 'YouTube Video List',
                        sections: [{ title: 'Search Results', rows }]
                    })
                }
            }],
            headerType: 1,
            viewOnce: true
        }, { quoted: m })
    } catch (e) {
        m.reply(`Error: ${e.message}`)
    }
}
handler.command = /^yts(earch)?$/i
handler.tags = ['search']
handler.help = ['yts <query>']
handler.description = 'Cari video YouTube dan download.'
handler.register = true
export default handler
