/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

function normalizeJid(input = '') {
    let number = String(input).replace(/[^0-9]/g, '')
    if (!number) return null
    if (number.startsWith('0')) number = '62' + number.slice(1)
    return number + '@s.whatsapp.net'
}

function getTarget(m, args = []) {
    if (m.mentionedJid?.[0]) return m.mentionedJid[0]
    if (m.quoted?.sender) return m.quoted.sender

    let possibleNumber = args.find(v => /^(?:@?\d{5,}|\+?\d{5,})$/.test(v.replace(/[^0-9+@]/g, '')))
    if (possibleNumber) return normalizeJid(possibleNumber)

    return null
}

function getExpValue(args = []) {
    for (let arg of args) {
        let cleaned = String(arg).replace(/[^0-9]/g, '')
        if (!cleaned) continue

        // Jangan anggap nomor WA panjang sebagai jumlah exp kalau ada angka lain setelahnya.
        if (cleaned.length >= 10 && args.some(v => {
            let n = String(v).replace(/[^0-9]/g, '')
            return n && n !== cleaned && n.length < 10
        })) continue

        let value = Number(cleaned)
        if (Number.isFinite(value) && value > 0) return value
    }
    return null
}

let handler = async (m, { conn, command, text }) => {
    let args = text.trim().split(/\s+/).filter(Boolean)

    let user = getTarget(m, args)
    let expValue = getExpValue(args)

    if (!user || !expValue) {
        return m.reply(
            `Format salah!\n\n` +
            `*Tambah exp:*\n` +
            `.addexp @user 1000\n` +
            `.addexp 628xxxx 1000\n` +
            `Reply pesan user lalu ketik .addexp 1000\n\n` +
            `*Kurangi exp:*\n` +
            `.remexp @user 1000\n` +
            `.remexp 628xxxx 1000\n` +
            `Reply pesan user lalu ketik .remexp 1000`
        )
    }

    let users = global.db.data.users

    if (!users[user]) users[user] = {}
    users[user].exp = Number(users[user].exp) || 0

    if (command === 'addexp') {
        users[user].exp += expValue

        return conn.reply(
            m.chat,
            `Berhasil menambahkan *${expValue.toLocaleString()}* exp ke @${user.split('@')[0]}\n` +
            `Total exp sekarang: *${users[user].exp.toLocaleString()}*`,
            m,
            { mentions: [user] }
        )
    }

    if (command === 'remexp') {
        users[user].exp -= expValue
        if (users[user].exp < 0) users[user].exp = 0

        return conn.reply(
            m.chat,
            `Berhasil mengurangi *${expValue.toLocaleString()}* exp dari @${user.split('@')[0]}\n` +
            `Sisa exp: *${users[user].exp.toLocaleString()}*`,
            m,
            { mentions: [user] }
        )
    }
}

handler.help = ['addexp @user <jumlah>', 'remexp @user <jumlah>', 'addexp <jumlah> (reply user)', 'remexp <jumlah> (reply user)']
handler.tags = ['owner']
handler.command = /^(add|rem)exp$/i
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