/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let heal = 10

let handler = async(m, { args, conn, command, usedPrefix }) => {
   let user = global.db.data.users[m.sender]
   let darah = user.healt
   let bardarah = user.health
   let count = (args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(parseInt(user.money)) : 1) * 1
   if (!args[0]) return m.reply(`1 Potion = 10 darah\n*Contoh:* ${usedPrefix + command} 1`)
   
      if (user.potion >= count * 1) {
        if (user.healt < user.health) {
          user.healt += 10 * count
          user.potion -= count
          if (user.healt > user.health ) user.healt = user.health
          let healtnya = user.healt
          conn.reply(m.chat, `Suksess Menggunakan *${count}* 🥤Potion\n*Darahmu:* ${healtnya} / ${bardarah}`, m)
          } else return conn.reply(m.chat, `Darah Kamu Masih Full`, m)
        } else return conn.reply(m.chat, `Potion Kamu Hanya ${user.potion}`, m)
}
handler.tags = ['rpg']
handler.help = ['heal <jumlah>']
handler.command = /^(heal)/i
handler.register = true

export default handler

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