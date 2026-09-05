let handler = async (m, { conn }) => {
    if (!m.quoted || !m.quoted.isMedia) return m.reply('Reply gambar untuk menggunakan fitur ini')

    try {
        global.loading(m, conn)

        const buffer = await m.quoted.download()
        if (!buffer) return m.reply('Gagal download media.')

        const form = new FormData()
        form.append('files[]', new Blob([buffer]), 'image.jpg')

        const resUpload = await fetch('https://uguu.se/upload.php', { method: 'POST', body: form })
        const json = await resUpload.json()
        const imageUrl = json?.files?.[0]?.url
        if (!imageUrl) return m.reply('Upload gagal.')

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 20000)

        const url = global.API('theresav', '/search/pinlens', { image_url: imageUrl }, 'apikey')
        const res = await fetch(url, { signal: controller.signal })
        clearTimeout(timeout)

        const data = await res.json()
        if (!data.status || !Array.isArray(data.result) || !data.result.length) {
            global.loading(m, conn, true)
            return m.reply('No results found.')
        }

        const album = []
        for (let i = 0; i < data.result.length; i++) {
            const v = data.result[i]
            if (!v.imageUrl) continue
            try {
                const imgRes = await fetch(v.imageUrl)
                const buf = Buffer.from(await imgRes.arrayBuffer())
                album.push({
                    image: buf,
                    caption: `Pinterest Lens #${i + 1}\nTitle: ${v.title || 'N/A'}\nCreator: ${v.creator || 'N/A'}`
                })
            } catch { continue }
        }

        if (!album.length) {
            global.loading(m, conn, true)
            return m.reply('No valid images found.')
        }

        await conn.sendAlbumMessage(m.chat, album, { quoted: m, delay: 500 })
        global.loading(m, conn, true)
    } catch (e) {
        global.loading(m, conn, true)
        if (e.name === 'AbortError') return m.reply('API timeout (lebih dari 20 detik)')
        return m.reply(`Error: ${e.message}`)
    }
}
handler.help = ['pinlens']
handler.tags = ['search']
handler.command = /^pinlens$/i
handler.description = 'Cari gambar Pinterest dari foto.'
handler.register = true
handler.limit = true
export default handler
