/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, args, usedPrefix, DevMode, command }) => {
    const helpText = `Contoh: *${usedPrefix}${command} money 100 @tag*\n\n*List Yang Bisa Di Transfer :*\n•💵 Money\n•💳 Tabungan\n•🥤 Potion\n•🗑️ Sampah\n•💎 Diamond\n•📦 Common\n•📦 Uncommon\n•👑 Mythic\n•💎 Legendary\n•🕸️ String\n•🪵 Kayu\n•🪨 Batu\n•⚙️ Iron\n•🪨 Coal\n•🖍️ Peluru`

    if (args.length < 3) return conn.reply(m.chat, helpText, m)

    try {
        let type = (args[0] || '').toLowerCase()
        let count = args[1] && args[1].length > 0 ? Math.min(999999999999999, Math.max(parseInt(args[1]), 1)) : 1
        let who = m.mentionedJid && m.mentionedJid[0]
            ? m.mentionedJid[0]
            : (args[2].replace(/[@ .+-]/g, '').replace(' ', '') + '@s.whatsapp.net')

        if (!m.mentionedJid || !args[2]) return m.reply('Tag Salah Satu, Atau Ketik Nomernya!!')
        if (who === m.sender) return m.reply('🚫 Kamu Tidak Bisa Mentransfer Ke Diri Sendiri!')
        if (who === '6289520616967@s.whatsapp.net') return m.reply('🚫 Jangan Mentransfer Ke Zaell, Transfer Saja Ke Yang Membutuhkan!!')

        let users = global.db.data.users

        // Inisialisasi sender & penerima jika belum ada di DB
        if (!users[m.sender]) users[m.sender] = {}
        if (!users[who]) users[who] = {}

        // Helper kirim error ke dev
        const notifyDev = (e) => {
            if (DevMode) {
                for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                    conn.reply(jid, `Transfer.js error\nNo: *${m.sender.split('@')[0]}*\nCommand: *${m.text}*\n\n*${e}*`, m)
                }
            }
        }

        // Helper transfer generik
        const doTransfer = async (prop, label) => {
            // Inisialisasi properti jika belum ada (termasuk user yang belum daftar)
            if (!users[m.sender][prop]) users[m.sender][prop] = 0
            if (!users[who][prop]) users[who][prop] = 0

            if (users[m.sender][prop] >= count) {
                try {
                    users[m.sender][prop] -= count
                    users[who][prop] += count
                    conn.reply(m.chat, `Berhasil Mentransfer ${count} ${label} Ke @${who.split('@')[0]}!`.trim(), m)
                } catch (e) {
                    users[m.sender][prop] += count
                    m.reply('Gagal Menstransfer')
                    console.log(e)
                    notifyDev(e)
                }
            } else {
                conn.reply(m.chat, `${label} Kamu Tidak Mencukupi Untuk Mentransfer Sebesar ${count}`.trim(), m)
            }
        }

        switch (type) {
            case 'money':      await doTransfer('money', 'Uang'); break
            case 'tabungan':   await doTransfer('bank', 'Uang Dari Bank'); break
            case 'limit':      await doTransfer('limit', 'Limit'); break
            case 'potion':     await doTransfer('potion', 'Potion'); break
            case 'sampah':     await doTransfer('sampah', 'Sampah'); break
            case 'diamond':    await doTransfer('diamond', 'Diamond'); break
            case 'common':     await doTransfer('common', 'Common Crate'); break
            case 'uncommon':   await doTransfer('uncommon', 'Uncommon Crate'); break
            case 'mythic':     await doTransfer('mythic', 'Mythic Crate'); break
            case 'legendary':  await doTransfer('legendary', 'Legendary Crate'); break
            case 'string':     await doTransfer('string', 'String'); break
            case 'batu':       await doTransfer('batu', 'Batu'); break
            case 'coal':       await doTransfer('coal', 'Coal'); break
            case 'peluru':     await doTransfer('peluru', 'Peluru'); break
            case 'kayu':       await doTransfer('kayu', 'Kayu'); break
            case 'iron':       await doTransfer('iron', 'Iron'); break
            default:
                return conn.reply(m.chat, helpText, m)
        }
    } catch (e) {
        conn.reply(m.chat, `Terjadi Error! Hubungi Owner.`, m)
        console.log(e)
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.reply(jid, `Transfer.js error\nNo: *${m.sender.split('@')[0]}*\nCommand: *${m.text}*\n\n*${e}*`, m)
            }
        }
    }
}

handler.help = ['transfer']
handler.tags = ['rpg']
handler.command = /^(transfer|tf)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false
handler.admin = false
handler.botAdmin = false
handler.fail = null
handler.money = 0
handler.register = true

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