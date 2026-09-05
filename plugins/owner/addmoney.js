/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, command, text, args }) => {
    if (!text) return m.reply('Format salah!\n\nTambah money: addmoney <tag orang> <jumlah money>\nKurangi money: remmoney <tag orang> <jumlah money>')
    
    let user = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
    if (!user) return m.reply('Tag atau balas pesan orang yang akan diubah moneynya!')
    
    let moneyValue = parseInt(args[args.length - 1])
    if (isNaN(moneyValue)) return m.reply('Jumlah money harus angka!')

    let users = global.db.data.users
    if (!users[user]) users[user] = { money: 0 }

    if (command === 'addmoney') {
        users[user].money += moneyValue
        conn.reply(m.chat, `Berhasil menambahkan ${moneyValue} money untuk @${user.split('@')[0]}!`, m, { mentions: [user] })
    } else if (command === 'remmoney') {
        if (moneyValue > users[user].money) {
            users[user].money = 0
            conn.reply(m.chat, `Berhasil mengurangi money untuk @${user.split('@')[0]}. Money kini menjadi 0!`, m, { mentions: [user] })
        } else {
            users[user].money -= moneyValue
            conn.reply(m.chat, `Berhasil mengurangi ${moneyValue} money untuk @${user.split('@')[0]}!`, m, { mentions: [user] })
        }
    }
}

handler.help = ['addmoney', 'remmoney']
handler.tags = ['owner']
handler.command = /^(add|rem)money$/i
handler.rowner = true
handler.owner = true

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