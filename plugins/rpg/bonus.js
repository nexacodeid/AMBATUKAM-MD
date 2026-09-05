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
  if (Date.now() - global.db.data.users[m.sender].lastclaim > 86400000) {
  let mentionedJid = [m.sender]
    let ster = `Selamat Kak @${m.sender.replace(/@.+/, '')}, Kamu Mendapatkan: Rp.200.000`
    global.db.data.users[m.sender].money += 200000
    global.db.data.users[m.sender].lastclaim = Date.now()
    conn.reply(m.chat, ster, m, {contextInfo: { mentionedJid }})
  } else conn.reply(m.chat, `Blum waktunya`, m)
}
handler.help = ['hadiah']
handler.tags = ['rpg']
handler.command = /^(bonus|hadiah)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
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