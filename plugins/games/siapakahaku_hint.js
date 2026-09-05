let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.siapakahaku) conn.siapakahaku = {}
    let id = m.chat
    if (!(id in conn.siapakahaku)) return m.reply('*❌ Tidak ada sesi Siapakah Aku yang sedang berlangsung!*')
    
    let room = conn.siapakahaku[id]
    let json = room[1]
    
    let hint = json.jawaban
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')
    
    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['siapakahakuhint', 'siapaakuhint']
handler.tags = ['game']
handler.command = /^(siapakahakuhint|siapaakuhint)$/i

handler.limit = true
handler.group = true

export default handler