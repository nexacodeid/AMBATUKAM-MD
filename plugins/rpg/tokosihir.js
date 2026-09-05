/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const Btopi = 3200000
const Bsarung = 2100000
const Bsepatu = 1900000
let handler  = async (m, { conn, command, args, usedPrefix, DevMode }) => {
    let type = (args[0] || '').toLowerCase()
    let _type = (args[1] || '').toLowerCase()
    let jualbeli = (args[0] || '').toLowerCase()
    let ipah = global.db.data.users[m.sender]
    let uang = ipah.money
    let formattedAngka = uang.toLocaleString();
    const Kaine = `
*Example :* ${usedPrefix}${command} buy topisihir
*Uangmu :* _Rp.${formattedAngka}_

▬▭▬▭▬▭▬▭▬▭▬▭▬
*Equipment | Harga*
👒 Topi Sihir:       ${Btopi}
🧤 Sarung Tangan:       ${Bsarung}
👞 Sepatu Sihir:       ${Bsepatu}

_*Coming soon...*_
`.trim()

    try {
        if (/tokosihir/i.test(command)) {
            const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : 1
            switch (jualbeli) {
            case 'buy':
                switch (_type) {
                    case 'topisihir':
                            if (global.db.data.users[m.sender].magichats == 1) return conn.reply(m.chat, 'Kamu Sudah Memiliki *👒 Topi Sihir*', m)
                            if (global.db.data.users[m.sender].magichatsuse == 1) return conn.reply(m.chat, 'Kamu Sudah Menggunakan *👒 Topi Sihir*', m)
                            if (global.db.data.users[m.sender].money >= Btopi) {
                                global.db.data.users[m.sender].magichats += 1
                                global.db.data.users[m.sender].money -= Btopi * 1
                                conn.reply(m.chat, `Succes membeli *Topi Sihir* dengan harga ${Btopi} money\n\n*Cara Menggunakan:* .equip`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli *Topi Sihir* dengan harga ${Btopi} money`.trim(), m)
                        break
                        case 'sarungtangan':
                            if (global.db.data.users[m.sender].gloves == 1) return conn.reply(m.chat, 'Kamu Sudah Memiliki *🧤 Sarung Tangan*', m)
                            if (global.db.data.users[m.sender].glovesuse == 1) return conn.reply(m.chat, 'Kamu Sudah Menggunakan *🧤 Sarung Tangan*', m)
                            if (global.db.data.users[m.sender].money >= Bsarung) {
                                global.db.data.users[m.sender].gloves += 1
                                global.db.data.users[m.sender].money -= Bsarung * 1
                                conn.reply(m.chat, `Succes membeli *Sarung Tangan* dengan harga ${Bsarung} money\n\n*Cara Menggunakan:* .equip`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli *Sarung Tangan* dengan harga ${Bsarung} money`.trim(), m)
                        break
                        case 'sepatusihir':
                            if (global.db.data.users[m.sender].sepatu == 1) return conn.reply(m.chat, 'Kamu Sudah Memiliki *👞 Sepatu Sihir*', m)
                            if (global.db.data.users[m.sender].sepatuuse == 1) return conn.reply(m.chat, 'Kamu Sudah Menggunakan *👞 Sepatu Sihir*', m)
                            if (global.db.data.users[m.sender].money >= Bsepatu) {
                                global.db.data.users[m.sender].sepatu += 1
                                global.db.data.users[m.sender].money -= Bsepatu * 1
                                conn.reply(m.chat, `Succes membeli *Sepatu Sihir* dengan harga ${Bsepatu} money\n\n*Cara Menggunakan:* .equip`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli *Sepatu Sihir* dengan harga ${Bsepatu} money`.trim(), m)
                        break
               default:
                        return conn.reply(m.chat, Kaine, m)
                }
             break
             case 'jual': 
                switch (_type) {
                    case 'topisihir':
                     m.reply(`Item ini tidak dapat di jual`)
                     break
                     case 'sarungtangan':
                     m.reply(`Item ini tidak dapat di jual`)
                     break
                     case 'sepatusihir':
                     m.reply(`Item ini tidak dapat di jual`)
                     break
                  default:
                      return conn.reply(m.chat, Kaine, m)
                }
            break
        default:
                return conn.reply(m.chat, Kaine, m)
            }
        }
    } catch (e) {
        conn.reply(m.chat, Kaine, m)
        console.log(e)
    }
}

handler.help = ['tokosihir']
handler.tags = ['rpg']
handler.command = /^(tokosihir)$/i
handler.limit = true
handler.group = true
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