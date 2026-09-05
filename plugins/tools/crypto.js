let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (text && text.toUpperCase().endsWith('USDT')) {
        const symbol = text.toUpperCase()
        const url = `https://api.theresav.biz.id/canvas/crypto?symbol=${symbol}&apikey=${global.APIKeys['https://api.theresav.biz.id']}`
        const res = await fetch(url)
        const buffer = Buffer.from(await res.arrayBuffer())
        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: `📊 Crypto Chart\nSymbol: ${symbol}`
        }, { quoted: m })
        return
    }

    await m.reply('📊 Mengambil daftar crypto...')
    try {
        const url = global.API('theresav', '/tools/crypto/symbols', {}, 'apikey')
        const res = await fetch(url)
        const json = await res.json()
        if (!json?.status) return m.reply('❌ Gagal mengambil data crypto')

        const list = json.result || []
        const rows = list.map(v => ({
            header: v.name,
            title: v.symbol,
            description: `Coin ID: ${v.coin_id}`,
            id: `${usedPrefix + command} ${v.symbol}`
        }))

        await conn.sendMessage(m.chat, {
            image: { url: list[0]?.icon },
            caption: `💰 Daftar Crypto\nTotal: ${list.length}`,
            footer: 'Klik untuk melihat chart',
            buttons: [{
                buttonId: 'crypto_select',
                buttonText: { displayText: '📊 Pilih Crypto' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: 'Crypto List',
                        sections: [{ title: 'Daftar Coin', rows }]
                    })
                }
            }],
            headerType: 1,
            viewOnce: true
        }, { quoted: m })
    } catch (e) {
        m.reply('❌ Gagal mengambil data crypto')
    }
}
handler.help = ['crypto <symbol>']
handler.tags = ['tools']
handler.command = ['crypto']
handler.description = 'Cek chart crypto USDT.'
handler.register = true
export default handler
