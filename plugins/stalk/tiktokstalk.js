let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukkan username TikTok.\nContoh: ${usedPrefix}${command} username`)
    try {
        await m.reply('⏳ Fetching TikTok profile...')
        const url = global.API('theresav', '/stalk/tiktok', { username: text.trim() }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        if (!data?.status) return m.reply(`Failed to fetch TikTok profile. ${data?.message || ''}`)

        const profile = data?.result?.profile || {}
        const stats = data?.result?.stats || {}

        let caption = `*TikTok Profile Info*\n\n`
        caption += `Username: @${profile.username || '-'}\n`
        caption += `Nickname: ${profile.nickname || '-'}\n`
        caption += `User ID: ${profile.userId || '-'}\n`
        caption += `Bio: ${profile.bio || '-'}\n`
        caption += `Verified: ${profile.verified ? 'Yes' : 'No'}\n`
        caption += `Private: ${profile.privateAccount ? 'Yes' : 'No'}\n\n`
        caption += `*Stats:*\n`
        caption += `Followers: ${stats.followers || 0}\n`
        caption += `Following: ${stats.following || 0}\n`
        caption += `Likes: ${stats.likes || 0}\n`
        caption += `Videos: ${stats.videos || 0}\n\n`
        caption += `Profile URL: ${profile.url || '-'}`

        const imageUrl = profile?.avatar?.large || profile?.avatar?.medium || profile?.avatar?.thumb

        if (imageUrl) {
            await conn.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption
            }, { quoted: m }).catch(() => m.reply(caption))
        } else {
            await m.reply(caption)
        }
    } catch (e) {
        return m.reply(`Error: ${e.message}`)
    }
}
handler.help = ['tiktokstalk <username>']
handler.tags = ['stalk']
handler.command = /^tiktokstalk$/i
handler.description = 'Stalk profil TikTok.'
handler.register = true
export default handler
