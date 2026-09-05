/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async(m, {
  text,
  conn,
  usedPrefix,
  command,
  isPrems
  }) => {
  if (!isPrems) return m.reply('Khusus Member Premium!')
  let prem = global.db.data.users[m.sender];
  let time = (Date.now() - (prem.lastbunuhi * 1)) * 1;
     if (time < 86400000) return m.reply(`Maaf Tuan, kamu sudah mengambil jatah harianmu, Tunggu dalam waktu ${clockString(86400000 - time)} lagi`)
     let cap = `*Kamu Check-in Harian Prem*\n* + Rp10,000,000 Money\n* + 30 Limit\n\`Khusus Member Premium!\``
     prem.money += 10000000;
     prem.limit += 30;
     prem.lastbunuhi = Date.now();
     m.reply(cap)

}
handler.tags = ['rpg']
handler.help = ['harianprem (khusus prem)']
handler.command = /^(harianprem|premharian)$/i
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