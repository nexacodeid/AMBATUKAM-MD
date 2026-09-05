/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const rewards = {
  limit: 10,
}
const cooldown = 86400000 // 24 jam

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]

  if (!user.lastclaim) user.lastclaim = 0

  if (user.role === 'Free user' && user.limit >= 20) {
    return conn.reply(m.chat, 'Free user only have 20 Limit max', m)
  }

  let now = Date.now()
  let remaining = user.lastclaim + cooldown - now
  if (remaining > 0) {
    let hours = Math.floor(remaining / 3600000)
    let minutes = Math.floor((remaining % 3600000) / 60000)
    let seconds = Math.floor((remaining % 60000) / 1000)
    return m.reply(`❌ Kamu sudah claim harian!\nTunggu *${hours} jam ${minutes} menit ${seconds} detik* lagi`)
  }

  let text = ''
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue
    user[reward] += rewards[reward]
    text += `*+${rewards[reward]}* ${reward}\n`
  }

  conn.reply(m.chat, `🎉 Klaim berhasil!\n${text.trim()}`, m)
  user.lastclaim = now
}

handler.help = ['claimlimit']
handler.command = /^(claimlimit)$/i
handler.cooldown = cooldown
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