let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Contoh: ${usedPrefix}${command} https://google.com`)
    try {
        const url = global.API('theresav', '/tools/ssweb', { url: args[0] }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        if (data.status && data.result?.imageUrl) {
            await conn.sendMessage(m.chat, {
                image: { url: data.result.imageUrl },
                caption: `URL: ${data.result.url}`
            }, { quoted: m })
        } else {
           
            m.reply('Gagal mengambil tangkapan layar.')
        }
    } catch (e) {
       
        m.reply(`Error: ${e}`)
    }
}
handler.help = ['ssweb <url>']
handler.tags = ['tools']
handler.command = /^ssweb$/i
handler.description = 'Screenshot halaman web.'
handler.register = true
export default handler
