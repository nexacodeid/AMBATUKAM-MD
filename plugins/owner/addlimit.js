/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, text }) => {

    if (!text) {
        return m.reply(
            `Format salah!\n\n` +
            `Contoh: .addlimit @user 100`
        )
    }

    let who = m.mentionedJid?.[0]
    if (!who) return m.reply('Tag orang yang ingin diberi limit!')

    let args = text.trim().split(/\s+/)
    let poin = Number(args[1])

    if (!Number.isFinite(poin) || poin <= 0) {
        return m.reply('Jumlah limit harus berupa angka valid!')
    }

    if (poin > 11000) {
        return m.reply('Ngotak dikit lah kalau ngasih, kebanyakan itu!\nLu mau systemku error??')
    }

    let users = global.db.data.users

    if (!users[who]) {
        users[who] = { limit: 0 }
    }

    users[who].limit = Number(users[who].limit) || 0
    users[who].limit += poin

    return conn.reply(
        m.chat,
        `Selamat @${who.split('@')[0]}!\nKamu mendapatkan +${poin.toLocaleString()} limit.\nTotal limit sekarang: *${users[who].limit.toLocaleString()}*`,
        m,
        { mentions: [who] }
    )
}

handler.help = ['addlimit @user <jumlah>']
handler.tags = ['owner']
handler.command = /^(addlimit)$/i
handler.rowner = false
handler.premium = false
handler.owner = true

export default handler

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */