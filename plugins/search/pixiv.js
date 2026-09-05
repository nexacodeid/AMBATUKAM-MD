let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh: ${usedPrefix + command} anime`)
    try {
        global.loading(m, conn)
        const url = global.API('theresav', '/search/pixiv', { query: text }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()

        if (!data.status || !Array.isArray(data.result) || !data.result.length) {
            global.loading(m, conn, true)
            return m.reply('No results found.')
        }

        const album = []
        for (let i = 0; i < data.result.length; i++) {
            const v = data.result[i]
            if (!v.thumbnail) continue
            try {
                const imgRes = await fetch(v.thumbnail, {
                    headers: { Referer: 'https://www.pixiv.net/', 'User-Agent': 'Mozilla/5.0' }
                })
                const buf = Buffer.from(await imgRes.arrayBuffer())
                album.push({
                    image: buf,
                    caption: `Pixiv #${i + 1}\nTitle: ${v.title}\nAuthor: ${v.author}`
                })
            } catch { continue }
        }

        if (!album.length) {
            global.loading(m, conn, true)
            return m.reply('No valid images found.')
        }

        await conn.sendAlbumMessage(m.chat, album, { quoted: m, delay: 700 })
        global.loading(m, conn, true)
    } catch (e) {
        global.loading(m, conn, true)
        return m.reply(`Error: ${e.message}`)
    }
}
handler.help = ['pixiv <query>']
handler.tags = ['search']
handler.command = /^pixiv$/i
handler.description = 'Cari ilustrasi dari Pixiv.'
handler.register = true
export default handler
