let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.asahotak) conn.asahotak = {}
    let id = m.chat
    if (!(id in conn.asahotak)) return m.reply('*❌ Tidak ada sesi Asah Otak yang sedang berlangsung!*')
    
    let room = conn.asahotak[id]
    let json = room[1]
    
    let hint = json.jawaban
    let masked = hint.replace(/[aiueoAIUEO]/g, '_')
    
    m.reply(`*💡 HINT:*\n${masked}\n\n(Huruf pertama: ${hint.charAt(0).toUpperCase()})`)
}

handler.help = ['asahotakhint']
handler.tags = ['game']
handler.command = /^asahotakhint$/i

handler.limit = true
handler.group = true

export default handler