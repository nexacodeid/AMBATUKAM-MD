let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebaklogo) conn.tebaklogo = {}
    let id = m.chat
    if (!(id in conn.tebaklogo)) return m.reply('*❌ Tidak ada sesi Tebak Logo yang sedang berlangsung!*')

    let room = conn.tebaklogo[id]
    let json = room[1]

    let hint = json.jawaban
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')

    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['tebaklogohint', 'tebaklohint']
handler.tags = ['game']
handler.command = /^(tebaklogohint|tebaklohint)$/i

handler.limit = true
handler.group = true

export default handler