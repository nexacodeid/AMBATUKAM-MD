/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const xpperlimit = 1
let handler = async (m, { conn, command, args }) => {
	let user = global.db.data.users[m.sender]
  let count = (args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(parseInt(user.bank)) : 1) * 1
  if (user.atm == 0) return m.reply('Kamu Belum Punya ATM, Silahkan Bikin Dulu\nCaranya Ketik: .craft atm')
  if (global.db.data.users[m.sender].bank >= count * 1) {
    global.db.data.users[m.sender].bank -= count * 1
    global.db.data.users[m.sender].money += count * 1
 let bank = user.bank
 let mentionedJid = [m.sender]
    conn.reply(m.chat, `*✅@${m.sender.replace(/@.+/, '')} Menarik Uang Dari Bank*\n💸 Sebesar : _Rp.${count.toLocaleString()}_\n🏧 Tabunganmu di bank : _Rp.${bank.toLocaleString()}_`, m, {contextInfo: { mentionedJid }})
  } else conn.reply(m.chat, `Kamu tidak menyimpan uang di bank`, m)
}
handler.help = ['tarik']
handler.tags = ['rpg']
handler.command = /^tarik([0-9]+)|tarik|tarikall$/i
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