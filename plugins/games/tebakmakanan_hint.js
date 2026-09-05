let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebakmakanan) conn.tebakmakanan = {}
    let id = m.chat
    if (!(id in conn.tebakmakanan)) return m.reply('*❌ Tidak ada sesi Tebak Makanan yang sedang berlangsung!*')

    let room = conn.tebakmakanan[id]
    let json = room[1]

    let hint = json.jawaban
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')

    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['tebakmakananhint', 'tebakmakhint']
handler.tags = ['game']
handler.command = /^(tebakmakananhint|tebakmakhint)$/i

handler.limit = true
handler.group = true

export default handler