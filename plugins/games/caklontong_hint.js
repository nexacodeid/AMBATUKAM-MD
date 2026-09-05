let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.caklontong) conn.caklontong = {}
    let id = m.chat
    if (!(id in conn.caklontong)) return m.reply('*❌ Tidak ada sesi Cak Lontong yang sedang berlangsung!*')

    let room = conn.caklontong[id]
    let json = room[1]

    let hint = json.jawaban
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')

    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['caklontonghint', 'caklontonghint']
handler.tags = ['game']
handler.command = /^(caklontonghint|caklontonghint)$/i

handler.limit = true
handler.group = true

export default handler