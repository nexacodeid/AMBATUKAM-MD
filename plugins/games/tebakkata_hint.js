let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebakkata) conn.tebakkata = {}
    let id = m.chat
    if (!(id in conn.tebakkata)) return m.reply('*❌ Tidak ada sesi Tebak Kata yang sedang berlangsung!*')
    
    let room = conn.tebakkata[id]
    let json = room[1]
    
    let hint = json.jawaban
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')
    
    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['tebakkatahint', 'tbkatahint']
handler.tags = ['game']
handler.command = /^(tbkatahint|tebakkatahint)$/i

handler.limit = true
handler.group = true

export default handler