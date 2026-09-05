/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]
  if (user.limit == undefined) user.limit = 10 // default limit kalau belum ada

  let teks = `
💳 *Limit Kamu Saat Ini:*
- 📌 Sisa limit: *${user.limit}*

Gunakan *${usedPrefix}limit* untuk klaim limit harian kalau ada.
`.trim()

  m.reply(teks)
}

handler.help = ['limit']
handler.tags = ['info']
handler.command = /^limit$/i
handler.limit = false // command ini tidak pakai limit

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