let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebakgambar) conn.tebakgambar = {}
    let id = m.chat
    if (!(id in conn.tebakgambar)) return m.reply('*❌ Tidak ada sesi Tebak Gambar yang sedang berlangsung!*')
    
    let room = conn.tebakgambar[id]
    let json = room[1]
    
    let hint = json.jawaban
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')
    
    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['tebakgambarhint', 'tbghint']
handler.tags = ['game']
handler.command = /^(tbghint|tebakgambarhint)$/i

handler.limit = true
handler.group = true

export default handler