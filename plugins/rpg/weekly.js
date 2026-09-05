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
  exp: 15000,
  money: 50000,
  potion: 10,
}

const cooldown = 604800000

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let now = Date.now()
  let remaining = (user.lastweekly || 0) + cooldown - now
  if (remaining > 0) {
    let sisa = clockString(remaining)
    return m.reply(`⏳ Kamu sudah klaim hadiah weekly.\nTunggu sekitar *${sisa}* lagi untuk bisa klaim lagi.`)
  }
  let text = ''
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) user[reward] = 0
    user[reward] += rewards[reward]
    text += `*+${rewards[reward]}* ${global.rpg.emoticon(reward)}${reward}\n`
  }
  conn.reply(m.chat, '🎉 *WEEKLY REWARD*\n\n' + text.trim(), m)
  user.lastweekly = now
}

handler.help = ['weekly']
handler.tags = ['rpg']
handler.command = /^(weekly)$/i

handler.cooldown = cooldown
handler.register = true

export default handler

function clockString(ms) {
  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [
    d ? `${d} hari` : '',
    h ? `${h} jam` : '',
    m ? `${m} menit` : '',
    s ? `${s} detik` : ''
  ].filter(v => v).join(' ')
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