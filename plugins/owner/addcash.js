/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, command, text }) => {

    if (!text) {
        return m.reply(
            `Format salah!\n\n` +
            `Tambah cash: .addcash @user 1000\n` +
            `Kurangi cash: .remcash @user 1000`
        )
    }

    let user = m.mentionedJid?.[0]
    if (!user) return m.reply('Tag orang yang ingin diubah cash-nya!')

    let args = text.trim().split(/\s+/)
    let cashValue = Number(args[1])

    if (!Number.isFinite(cashValue) || cashValue <= 0) {
        return m.reply('Jumlah cash harus berupa angka valid!')
    }

    let users = global.db.data.users

    if (!users[user]) {
        users[user] = { cash: 0 }
    }

    users[user].cash = Number(users[user].cash) || 0

    if (command === 'addcash') {

        users[user].cash += cashValue

        return conn.reply(
            m.chat,
            `Berhasil menambahkan *${cashValue.toLocaleString()}* cash ke @${user.split('@')[0]}`,
            m,
            { mentions: [user] }
        )

    } else if (command === 'remcash') {

        users[user].cash -= cashValue

        if (users[user].cash < 0) users[user].cash = 0

        return conn.reply(
            m.chat,
            `Berhasil mengurangi *${cashValue.toLocaleString()}* cash dari @${user.split('@')[0]}\n` +
            `Sisa: *${users[user].cash.toLocaleString()}*`,
            m,
            { mentions: [user] }
        )
    }
}

handler.help = ['addcash @user <jumlah>', 'remcash @user <jumlah>']
handler.tags = ['owner']
handler.command = /^(add|rem)cash$/i
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