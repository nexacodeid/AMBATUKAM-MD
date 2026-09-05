/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, text, isOwner }) => {
  
 // if (!isOwner) return m.reply(`*Code blum di siapkan oleh Owner*\n Jangan sampai kelewatan untuk claim code di siang hari nanti!!`)
    let user = global.db.data.users[m.sender]
    if (user.tomat == 0) {
    let cap = `*✅ Kamu Mengclaim code event dari owner*\nCara menggunakan Code Ketik .ucode\nSalin Codenya: ⬇️`
    user.lastcode += 1
    user.tomat = 1
    m.reply(cap)
    m.reply(`Xyazellackermanxyz`)
    } else return m.reply(`❗ *Kamu sudah claim code event*`)

}
handler.tags = ['rpg']
handler.help = ['gcode']
handler.command = /^(gcode)/i
handler.register = true

export default handler

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */