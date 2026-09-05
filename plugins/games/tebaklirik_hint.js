let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebaklirik) conn.tebaklirik = {}
    let id = m.chat
    if (!(id in conn.tebaklirik)) return m.reply('*❌ Tidak ada sesi Tebak Lirik yang sedang berlangsung!*')

    let room = conn.tebaklirik[id]
    let json = room[1]

    let hint = json.jawaban
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')

    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['tebaklirikhint', 'tebaklirikhint']
handler.tags = ['game']
handler.command = /^(tebaklirikhint|tebaklirikhint)$/i

handler.limit = true
handler.group = true

export default handler