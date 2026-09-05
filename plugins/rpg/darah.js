/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import { generateWAMessageFromContent } from 'baileys'
let handler = async(m, { conn, text, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    let health = global.db.data.users[m.sender].health
    let healt = global.db.data.users[m.sender].healt
    let nuy = `Darah kamu ${healt}🩸`
      m.reply( nuy )
    }
handler.tags = ['rpg']
handler.help = ['darah']
handler.command = /^(darah)$/i
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