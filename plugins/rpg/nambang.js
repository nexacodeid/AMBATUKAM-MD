/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const timeout = 3600000

let handler = async (m, { conn, usedPrefix, text }) => {
let user = global.db.data.users[m.sender]
  //      let timerand = `${Math.floor(Math.random() * 259200000)}`.trim()
	    let _timie = (Date.now() - (user.lastnambang * 1)) * 1
  if (_timie < 3600000) return m.reply(`Kamu Sudah Lelah Untuk *Nambang*\nTunggu Selama ${clockString(3600000 - _timie)} Lagi`)
   // if (global.db.data.users[m.sender].aqua > 9) {
   // let aquah = `${Math.floor(Math.random() * 5)}`.trim()
    let berlians = `${Math.floor(Math.random() * 5)}`.trim()
    let emasbiasas = `${Math.floor(Math.random() * 7)}`.trim()
    let emasbatangs = `${Math.floor(Math.random() * 5)}`.trim()
    let coal = `${Math.floor(Math.random() * 10)}`.trim()
    // global.db.data.users[m.sender].aqua -= aquah * 1
    global.db.data.users[m.sender].berlian += berlians * 1
    global.db.data.users[m.sender].emas += emasbiasas * 1
    global.db.data.users[m.sender].diamond += emasbatangs * 1
    global.db.data.users[m.sender].coal += coal * 1
    global.db.data.users[m.sender].tiketcoin += 1
	global.db.data.users[m.sender].lastnambang = Date.now()
	let mentionedJid = [m.sender]
  conn.reply(m.chat, `Selamat @${m.sender.replace(/@.+/, '')}, kamu mendapatkan : \n💍 *Berlian:* +${berlians}\n🪙 *Emas :* +${emasbiasas}\n💎 *Diamond :* +${emasbatangs}\n🪨 *Coal :* +${coal}\n\n🎟️ *TikenCoin :* +1`, m, {contextInfo: { mentionedJid }})
  setTimeout(() => {
     let mentionedJid = [m.sender]
					conn.reply(m.chat, `Kak @${m.sender.replace(/@.+/, '')}, Sudah waktunya nambang lagi`, m, {contextInfo: { mentionedJid }})
					}, 3600000)
}
handler.help = ['nambang']
handler.tags = ['rpg']
handler.command = /^(nambang)/i
handler.group = true

handler.limit = true
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