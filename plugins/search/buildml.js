let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh:\n${usedPrefix + command} marcel`)

    // Jika user klik build dari list
    if (text.includes('|')) {
        const [hero, id] = text.split('|')
        const url = `https://api.theresav.biz.id/canvas/ml/build?hero=${hero}&id=${id}`
        const res = await fetch(url)
        const img = Buffer.from(await res.arrayBuffer())
        await conn.sendMessage(m.chat, {
            image: img,
            caption: `🎮 *Mobile Legends Build*\nHero: *${hero}*`
        }, { quoted: m })
        return
    }

    await m.reply('🔎 Mencari build hero...')
    try {
        const url = global.API('theresav', '/game/ml/build', { hero: text }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        if (!data?.status) return m.reply('❌ Build hero tidak ditemukan')

        const hero = data.hero.name
        const rows = data.builds.map((b, i) => ({
            header: `Build ${i + 1}`,
            title: b.title || 'Build ML',
            description: `Author: ${b.author.username}`,
            id: `${usedPrefix + command} ${hero}|${b.id}`
        }))

        await conn.sendMessage(m.chat, {
            image: { url: data.hero.image_url },
            caption: `🎮 *ML Build Finder*\nHero: *${hero}*\nRole: ${data.hero.roles.join(', ')}\nTotal Build: ${data.total_builds}`,
            footer: 'Pilih build untuk melihat item',
            buttons: [{
                buttonId: 'ml_build',
                buttonText: { displayText: '⚔️ Pilih Build' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: 'Daftar Build',
                        sections: [{ title: 'Build List', rows }]
                    })
                }
            }],
            headerType: 1,
            viewOnce: true
        }, { quoted: m })
    } catch (e) {
        m.reply('❌ Build hero tidak ditemukan')
    }
}
handler.help = ['buildml <hero>']
handler.tags = ['search']
handler.command = ['buildml']
handler.description = 'Cari build Mobile Legends.'
handler.register = true
export default handler
