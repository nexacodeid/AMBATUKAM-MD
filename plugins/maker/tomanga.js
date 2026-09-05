let handler = async (m, {
    conn,
    usedPrefix,
    command
}) => {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''

    if (!/image/.test(mime)) {
        return m.reply(
            `Reply gambar dengan caption\n${usedPrefix + command}`
        )
    }

    try {
        await m.reply('⏳ Processing...')

        const buffer = await q.download()

        if (!buffer) {
            throw new Error('Gagal download gambar')
        }

        const form = new FormData()

        form.append(
            'image',
            new Blob([buffer], {
                type: mime
            }),
            'image.jpg'
        )

        const res = await fetch(
            global.API(
                'theresav',
                '/image/tomanga', {},
                'apikey'
            ), {
                method: 'POST',
                body: form
            }
        )

        if (!res.ok) {
            const text = await res.text().catch(() => '')
            throw new Error(
                `Status ${res.status}${text ? ` - ${text}` : ''}`
            )
        }

        const result = Buffer.from(
            await res.arrayBuffer()
        )

        if (!result || result.length < 1000) {
            throw new Error('Hasil gambar tidak valid')
        }

        await conn.sendMessage(
            m.chat, {
                image: result,
                caption: '📚 Done convert manga'
            }, {
                quoted: m
            }
        )

    } catch (e) {
        console.error(e)
        await m.reply(`❌ Error: ${e.message}`)
    }
}

handler.help = ['tomanga']
handler.tags = ['image']
handler.command = /^(tomanga|manga)$/i
handler.register = true
handler.limit = true

export default handler