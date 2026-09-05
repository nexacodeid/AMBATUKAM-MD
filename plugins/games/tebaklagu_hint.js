let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebaklagu) conn.tebaklagu = {}
    let id = m.chat
    if (!(id in conn.tebaklagu)) return m.reply('*❌ Tidak ada sesi Tebak Lagu yang sedang berlangsung!*')

    let room = conn.tebaklagu[id]
    let json = room[1]

    let hint = json.judul
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')

    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})\nArtis: ${json.artis}`)
}

handler.help = ['tebaklaguhint', 'tebaklhint']
handler.tags = ['game']
handler.command = /^(tebaklaguhint|tebaklhint)$/i

handler.limit = true
handler.group = true

export default handler