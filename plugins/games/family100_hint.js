let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.family100) conn.family100 = {}
    let id = m.chat
    if (!(id in conn.family100)) return m.reply('*❌ Tidak ada sesi Family 100 yang sedang berlangsung!*')
    
    let room = conn.family100[id]
    let json = room[1]
    
    let hint = json.jawaban[0]
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')
    
    m.reply(`*💡 HINT:*\n${masked}\n\n(Salah satu jawaban dimulai dengan huruf: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['family100hint', 'fam100hint']
handler.tags = ['game']
handler.command = /^(fam100hint|family100hint)$/i

handler.limit = true
handler.group = true

export default handler