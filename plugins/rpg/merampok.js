/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
  let users = global.db.data.users
  let dapat = Math.floor(Math.random() * 100000)
  let nomors = m.sender
  let who

  if (m.isGroup) who = m.mentionedJid[0]
  else who = m.chat

  if (!who) return m.reply(`Tag orang yang ingin kamu rampok!\n\nContoh:\n${usedPrefix + command} @user`)
  if (!users[who]) return m.reply('Pengguna tidak ada di dalam database!')
  if (who == '447503308581@s.whatsapp.net') return m.reply('🚫 Berani banget kak, mau ngerampok owner? Duitmu bisa jadi 0 loh 😤')

  let cooldown = 3600000
  let waktuSekarang = Date.now()
  let sisaWaktu = cooldown - (waktuSekarang - users[m.sender].lastrob)
  let timers = clockString(sisaWaktu)

  if (waktuSekarang - users[m.sender].lastrob < cooldown) {
    return m.reply(`Kamu sudah merampok dan sedang bersembunyi!\n\nTunggu ${timers} sebelum bisa merampok lagi.`)
  }

  if (users[who].money < 10000) {
    return m.reply('Orang yang kamu rampok terlalu miskin 😢')
  }

  users[who].money -= dapat
  users[m.sender].money += dapat
  users[m.sender].lastrob = waktuSekarang

  conn.reply(m.chat, `💰 Kamu berhasil merampok dan mendapatkan *Rp.${dapat.toLocaleString()}*!`, m)
}

handler.help = ['merampok', 'rob']
handler.tags = ['rpg']
handler.command = /^merampok|rob$/i
handler.limit = true
handler.group = true
handler.register = true

export default handler

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return `${d} *Hari* ${h} *Jam* ${m} *Menit* ${s} *Detik*`
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