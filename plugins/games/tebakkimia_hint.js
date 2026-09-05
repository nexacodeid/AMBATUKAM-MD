let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebakkimia) conn.tebakkimia = {}
    let id = m.chat
    if (!(id in conn.tebakkimia)) return m.reply('*❌ Tidak ada sesi Tebak Kimia yang sedang berlangsung!*')

    let room = conn.tebakkimia[id]
    let json = room[1]

    let hint = json.lambang
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')

    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['tebakkimiahint', 'tebakkimhint']
handler.tags = ['game']
handler.command = /^(tebakkimiahint|tebakkimhint)$/i

handler.limit = true
handler.group = true

export default handler