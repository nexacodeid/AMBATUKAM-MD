/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, command, args, usedPrefix }) => {
    let type = (args[0] || '').toLowerCase()
    let user = global.db.data.users[m.sender]
    let tosi = user.magichats || 0
    let satang = user.gloves || 0
    let sesihi = user.sepatu || 0
    let topijerami = user.topijerami || 0
    
    let zell = `*Equipment Yang Tersedia🧰*
👒 *Topi Sihir:*    ${tosi}
👒 *Topi Jerami:*   ${topijerami}
🧤 *Sarung Tangan*  ${satang}
👞 *Sepatu Sihir*   ${sesihi}

*Example:* _${usedPrefix}${command} topisihir_
*Example:* _${usedPrefix}${command} topijerami_

_Equipment yang tersedia saat ini ada 4 jenis, akan ada lebih banyak equipment di masa depan!_`
  
    switch (type) {
        case 'topisihir':
            if (user.magichatsuse > 0) return m.reply(`Kamu Sudah Menggunakan Item ini!`)
            if (user.magichats < 1) return m.reply(`Kamu Tidak Memiliki *👒 Topi Sihir*\nSilahkan beli dulu`)
            user.magichats -= 1
            user.magichatsuse += 1
            user.sworddamage += 1300 * 1
            user.healt += 300 * 1
            user.health += 300 * 1
            user.stamina += 100 * 1
            user.fullstamina += 100 * 1
            m.reply(`Sukses Menggunakan *👒 Topi Sihir*\n💉Darah kamu bertambah *+300*\n🛡️Stamina  kamu bertambah *+100*\n💥 Damage: *+1300*`)
            break
            
        case 'topijerami':
            if (user.topjeramiuse > 0) return m.reply(`Kamu Sudah Menggunakan Item ini!`)
            if (user.topijerami < 1) return m.reply(`Kamu Tidak Memiliki *👒 Topi Jerami*\nSilahkan beli dulu di shop`)
            user.topijerami -= 1
            user.topjeramiuse += 1
            user.sworddamage += 800 * 1
            user.healt += 200 * 1
            user.health += 200 * 1
            user.stamina += 80 * 1
            user.fullstamina += 80 * 1
            m.reply(`Sukses Menggunakan *👒 Topi Jerami*\n💉Darah kamu bertambah *+200*\n🛡️Stamina  kamu bertambah *+80*\n💥 Damage: *+800*`)
            break
            
        case 'sarungtangan':
            if (user.glovesuse > 0) return m.reply(`Kamu Sudah Menggunakan Item ini!`)
            if (user.gloves < 1) return m.reply(`Kamu Tidak Memiliki *🧤 Sarung Tangan*\nSilahkan beli dulu`)
            user.gloves -= 1
            user.glovesuse += 1
            user.sworddamage += 500 * 1
            user.healt += 75 * 1
            user.health += 75 * 1
            user.stamina += 45 * 1
            user.fullstamina += 45 * 1
            m.reply(`Sukses Menggunakan *🧤 Sarung Tangan*\n💉Darah kamu bertambah *+75*\n🛡️Stamina  kamu bertambah *+45*\n💥 Damage: *+500*`)
            break
            
        case 'sepatusihir':
            if (user.sepatuuse > 0) return m.reply(`Kamu Sudah Menggunakan Item ini!`)
            if (user.sepatu < 1) return m.reply(`Kamu Tidak Memiliki *👞 Sepatu Sihir*\nSilahkan beli dulu`)
            user.sepatuuse += 1
            user.sepatu -= 1
            user.sworddamage += 650 * 1
            user.healt += 100 * 1
            user.health += 100
            user.stamina += 70 * 1
            user.fullstamina += 70 * 1
            m.reply(`Sukses Menggunakan *👞 Sepatu Sihir*\n💉Darah kamu bertambah *+100*\n🛡️Stamina  kamu bertambah *+70*\n💥 Damage: *+650*`)
            break
            
        default:
            return m.reply(zell)
    }
}

handler.tags = ['rpg']
handler.help = ['equip']
handler.command = /^(equip|gunakan)/i
handler.register = true
handler.group = true

export default handler;

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */