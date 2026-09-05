/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn }) => {
let user = global.db.data.users[m.sender]
  let _timie = (Date.now() - (user.lastharian * 1)) * 1
  if (_timie < 86400000 ) return m.reply(`Kamu Udah Ambil Jatah Limit Hari Ini.\n\nTunggu Selama${clockString(86400000 - _timie)} Lagi`)
    global.db.data.users[m.sender].limit += 100
    conn.reply(m.chat, '*Kamu Mengambil Cek-in Harianmu*\n\nLimit +100\nSetiap user 100 limit perhari!', m)
    global.db.data.users[m.sender].lastharian = Date.now()
    
setTimeout(() => {
			conn.reply(m.chat, `Yuu Saatnya *Check-in* Harianmu`, m)
		}, 86400000)
}
handler.help = ['harian']
handler.tags = ['rpg']
handler.command = /^(daily|harian)$/i
handler.group = false
handler.register = true

export default handler 

function clockString(ms) {
  let h = isNaN(ms) ? '60' : Math.floor(ms / 3600000) % 60
  let m = isNaN(ms) ? '60' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60
  return [h, m, s,].map(v => v.toString().padStart(2, 0) ).join(':')
}

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */