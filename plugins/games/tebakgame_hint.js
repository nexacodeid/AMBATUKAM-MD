let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebakgame) conn.tebakgame = {}
    let id = m.chat
    if (!(id in conn.tebakgame)) return m.reply('*❌ Tidak ada sesi Tebak Game yang sedang berlangsung!*')

    let room = conn.tebakgame[id]
    let json = room[1]

    let hint = json.jawaban
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')

    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['tebakgamehint', 'tebakghint']
handler.tags = ['game']
handler.command = /^(tebakgamehint|tebakghint)$/i

handler.limit = true
handler.group = true

export default handler