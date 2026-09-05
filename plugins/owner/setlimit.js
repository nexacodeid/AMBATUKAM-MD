/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

function pickTarget(m, args) {
    let mentioned = m.mentionedJid && m.mentionedJid[0]
    if (mentioned) return mentioned

    let quotedSender = m.quoted && m.quoted.sender
    if (quotedSender) return quotedSender

    let numberArg = args.find(v => /^\+?\d{5,}$/.test(String(v).replace(/[^0-9+]/g, '')))
    if (numberArg) {
        let number = numberArg.replace(/[^0-9]/g, '')
        return number + '@s.whatsapp.net'
    }

    return null
}

function ensureUser(jid) {
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.users[jid]) {
        global.db.data.users[jid] = {
            name: '',
            exp: 0,
            limit: 20,
            level: 1,
            premiumTime: 0,
            registered: false,
            banned: false,
            autolevelup: false
        }
    }
    return global.db.data.users[jid]
}

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    args = args || []

    if (!text) {
        return m.reply(
            `Format salah!\n\n` +
            `Contoh user tertentu:\n` +
            `${usedPrefix + command} @user 100\n` +
            `${usedPrefix + command} 100 628xxxx\n` +
            `Reply user: ${usedPrefix + command} 100\n\n` +
            `Contoh semua user:\n` +
            `${usedPrefix + command} all 100\n` +
            `${usedPrefix + command} semua 100\n` +
            `${usedPrefix + command} global 100\n\n` +
            `Catatan: command ini mengubah total limit menjadi jumlah yang ditentukan, bukan menambah.`
        )
    }

    let amountText = args.find(v => /^-?\d+$/.test(String(v)))
    let amount = Number(amountText)

    if (!Number.isFinite(amount) || amount < 0) {
        return m.reply('Jumlah limit harus berupa angka valid dan tidak boleh minus!')
    }

    if (amount > 1000000) {
        return m.reply('Limit maksimal 1.000.000 biar database nggak jadi gudang beras digital.')
    }

    let modeAll = args.some(v => /^(all|semua|global|users|user)$/i.test(String(v)))

    if (!global.db.data.users) global.db.data.users = {}

    if (modeAll) {
        let users = Object.keys(global.db.data.users)
        if (!users.length) return m.reply('Database user masih kosong.')

        let changed = 0
        for (let jid of users) {
            if (!jid || !jid.includes('@')) continue
            let user = ensureUser(jid)
            user.limit = amount
            changed++
        }

        return m.reply(
            `✅ *Set Limit Global Berhasil*\n\n` +
            `Total user diubah: *${changed.toLocaleString('id-ID')}*\n` +
            `Limit sekarang: *${amount.toLocaleString('id-ID')}*`
        )
    }

    let who = pickTarget(m, args)
    if (!who) return m.reply('Tag, reply, atau masukkan nomor user yang ingin di-set limitnya!\n\nUntuk semua user pakai: ' + usedPrefix + command + ' all 100')

    let user = ensureUser(who)
    let before = Number(user.limit) || 0
    user.limit = amount

    return conn.reply(
        m.chat,
        `✅ *Set Limit Berhasil*\n\n` +
        `User: @${who.split('@')[0]}\n` +
        `Sebelum: *${before.toLocaleString('id-ID')}*\n` +
        `Sekarang: *${amount.toLocaleString('id-ID')}*`,
        m,
        { mentions: [who] }
    )
}

handler.help = ['selimit @user <jumlah>', 'setlimit @user <jumlah>', 'selimit all <jumlah>', 'setlimit all <jumlah>']
handler.tags = ['owner']
handler.command = /^(selimit|setlimit)$/i
handler.owner = true

export default handler