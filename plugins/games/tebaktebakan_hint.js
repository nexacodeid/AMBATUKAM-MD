let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebaktebakan) conn.tebaktebakan = {}
    let id = m.chat
    if (!(id in conn.tebaktebakan)) return m.reply('*❌ Tidak ada sesi Tebak Tebakan yang sedang berlangsung!*')

    let room = conn.tebaktebakan[id]
    let json = room[1]

    let hint = json.jawaban
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')

    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['tebaktebakanhint', 'tebaktebakhint']
handler.tags = ['game']
handler.command = /^(tebaktebakanhint|tebaktebakhint)$/i

handler.limit = true
handler.group = true

export default handler