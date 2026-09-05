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
    if (Date.now() - global.db.data.users[m.sender].lastnguli > 86400000) {
      global.db.data.users[m.sender].limit += 10
      global.db.data.users[m.sender].money += 50000
      m.reply('*Selamat Kamu Mendapatkan :*\n_Limit +10_\n_Money +50000_')
      global.db.data.users[m.sender].lastnguli = Date.now()
    } else m.reply('Kamu Sudah Mengklaim Upah Nguli Hari Ini')
  }
  handler.help = ['nguli']
  handler.tags = ['rpg']
  handler.command = /^(nguli)$/i
  handler.group = true
  handler.fail = null
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