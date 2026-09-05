/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const free = 7000
const prem = 1400
const limitfree = 15
const limitprem = 30
const moneyfree = 7000
const moneyprem = 1400

let handler = async (m, { isPrems }) => {
    let time = global.db.data.users[m.sender].lastmonthly + 2592000000
  if (Date.now() - global.db.data.users[m.sender].lastmonthly < 2592000000) throw `❗Kamu Sudah Mengambilnya Dibulan Ini\nTunggu Selama ${msToTime(time - new Date())} Lagi`
        global.db.data.users[m.sender].exp += 200000
        global.db.data.users[m.sender].money += 20000000
        global.db.data.users[m.sender].limit += 1200
        conn.reply(m.chat, `*Selamat Kamu Mendapatkan:*\n\n+200,000 Exp\n+20,000,000 Money\n+1,200 Limit`, m)
        global.db.data.users[m.sender].lastmonthly = Date.now()
    }
handler.help = ['bulanan']
handler.tags = ['rpg']
handler.command = /^(bulanan)$/i
handler.group = true

handler.fail = null
handler.register = true

export default handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    monthly = Math.floor((duration / (1000 * 60 * 60 * 24)) % 720)

  monthly  = (monthly < 10) ? "0" + monthly : monthly
  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return monthly + " Hari " +  hours + " Jam " + minutes + " Menit"
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