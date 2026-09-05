let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebakbendera) conn.tebakbendera = {}
    let id = m.chat
    if (!(id in conn.tebakbendera)) return m.reply('*❌ Tidak ada sesi Tebak Bendera yang sedang berlangsung!*')
    
    let room = conn.tebakbendera[id]
    let json = room[1]
    
    let hint = json.name
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')
    
    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['tebakbenderahint', 'tbkbenderahint']
handler.tags = ['game']
handler.command = /^(tbkbenderahint|tebakbenderahint)$/i

handler.limit = true
handler.group = true

export default handler