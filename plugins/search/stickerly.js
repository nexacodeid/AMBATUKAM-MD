let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`🔍 Gunakan: *${usedPrefix + command} <nama stiker>*\nContoh: *${usedPrefix + command} spongebob*`)

    // Download langsung dari URL stickerly
    if (text.startsWith('https://sticker.ly/')) {
        await m.reply('⏳ Mengunduh sticker pack...')
        try {
            const url = global.API('theresav', '/download/stickerly', { url: text }, 'apikey')
            const res = await fetch(url)
            const data = await res.json()
            if (!data?.status) throw new Error(data?.message || 'API error')

            const pack = data.result
            if (!pack?.stickers?.length) throw new Error('Sticker pack kosong')

            const MAX_STICKERS = 30
            const results = await Promise.allSettled(
                pack.stickers.slice(0, MAX_STICKERS).map(async (s) => {
                    const r = await fetch(s.imageUrl)
                    if (!r.ok) throw new Error(`HTTP ${r.status}`)
                    const buffer = Buffer.from(await r.arrayBuffer())
                    if (!buffer.length) throw new Error('Empty buffer')
                    return { data: buffer, emojis: ['🎨'], accessibilityLabel: s.fileName || 'sticker' }
                })
            )

            const stickerBuffers = results.filter(r => r.status === 'fulfilled').map(r => r.value)
            if (!stickerBuffers.length) throw new Error('Semua stiker gagal diunduh')

            const coverRes = await fetch(pack.thumbnailUrl || pack.stickers[0].imageUrl)
            const coverBuffer = Buffer.from(await coverRes.arrayBuffer())

            await conn.sendMessage(m.chat, {
                stickerPack: {
                    name: pack.name || 'Sticker Pack',
                    publisher: pack.author?.name || 'Unknown',
                    description: `${pack.stickerCount || 0} stickers`,
                    cover: coverBuffer,
                    stickers: stickerBuffers
                }
            }, { quoted: m })
        } catch (e) {
            m.reply(`❌ Gagal mengunduh sticker pack: ${e.message}`)
        }
        return
    }

    await m.reply(`🔍 Mencari stiker *${text}*...`)
    try {
        const url = global.API('theresav', '/search/stickerly', { q: text }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        if (!data?.status || !Array.isArray(data.result) || !data.result.length) {
            return m.reply('❌ Stiker tidak ditemukan')
        }

        const list = data.result
        const all = list.map(v => ({
            header: v.name || 'No Name',
            title: `👤 ${v.author || 'Unknown'}`,
            description: `🖼️ ${v.stickerCount || 0} stiker | 📤 ${v.exportCount || 0}x export`,
            id: `${usedPrefix + command} ${v.url}`
        }))

        const sections = []
        for (let i = 0; i < all.length; i += 10) {
            sections.push({ title: `Pack ${i + 1}–${Math.min(i + 10, all.length)}`, rows: all.slice(i, i + 10) })
        }

        await conn.sendMessage(m.chat, {
            image: { url: list[0]?.thumbnailUrl || 'https://telegra.ph/file/404.jpg' },
            caption: `🎨 Hasil: *${text}*\nTotal: ${list.length} pack`,
            footer: 'Pilih pack untuk download',
            buttons: [{
                buttonId: 'stickerly_select',
                buttonText: { displayText: '🎨 Pilih Stiker Pack' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({ title: 'Sticker Packs', sections })
                }
            }],
            headerType: 1,
            viewOnce: true
        }, { quoted: m })
    } catch (e) {
        m.reply(`❌ Gagal mencari stiker: ${e.message}`)
    }
}
handler.help = ['stickerly <query>']
handler.tags = ['search']
handler.command = ['stickerly']
handler.description = 'Cari dan download stiker dari Stickerly.'
handler.register = true
export default handler
