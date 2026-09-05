/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let jumlah = 2

let handler = async (m, { conn, text, args, command }) => {
  
  let user = global.db.data.users[m.sender]
  let count = (args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(parseInt(user.money)) : 1) * 1
  let tiket = user.tiketcoin
  let stee = ` *Jasa Change TiketC*

*Contoh:* .${command} <jumlah>

*🎟️ 1 TiketC*
> 💳 2 limit

*Your TiketC:* _🎟️${tiket} TiketC_
`
 if (!args[0]) return m.reply(stee)
 if (global.db.data.users[m.sender].tiketcoin >= count * 1) {
     if (tiket == 0) return m.reply(`[ ! ] Kamu tidak memiliki TikenCoin!`)
     user.limit += 2 * count
     user.tiketcoin -= count * 1
   conn.reply(m.chat, `[ ✓ ] *Berhasil Menukar* _🎟️${count}_ TiketCoin, Ke _💳${jumlah * count}_ Limit`, m)
   } else return m.reply(`Tiket yang anda miliki *🎟️${tiket}* TiketC`)
}
handler.tags = ['rpg']
handler.help = ['ctiket <jumlah>']
handler.command = /^(ctiket|tukartiket)/i
handler.register = true

export default handler;

function number(x = 0) {
    x = parseInt(x)
    return !isNaN(x) && typeof x == 'number'
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