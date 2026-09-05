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

function formatMoney(amount) {
    if (amount >= 100000000000) {
        return (amount / 100000000000).toLocaleString('id-ID') + "m";
    } else if (amount >= 10000000000) {
        return (amount / 10000000000).toLocaleString('id-ID') + "m";
    } else if (amount >= 1000000000) {
        return (amount / 1000000000).toLocaleString('id-ID') + "m";
     } else if (amount >= 100000000) {
        return (amount / 100000000).toLocaleString('id-ID') + "jt";
     } else if (amount >= 10000000) {
        return (amount / 10000000).toLocaleString('id-ID') + "jt";
     } else if (amount >= 1000000) {
        return (amount / 1000000).toLocaleString('id-ID') + "jt";
     } else if (amount >= 100000) {
        return (amount / 100000).toLocaleString('id-ID') + "rb";
     } else if (amount >= 10000) {
        return (amount / 10000).toLocaleString('id-ID') + "rb";
     } else if (amount >= 1000) {
        return (amount / 1000).toLocaleString('id-ID') + "rb";
     } else if (amount >= 100) {
        return (amount / 100).toLocaleString('id-ID') + "p";
     } else if (amount >= 10) {
        return (amount / 10).toLocaleString('id-ID') + "p";
     } else if (amount >= 1) {
        return (amount / 1).toLocaleString('id-ID') + "p";
     } else {
        return amount.toString();
    }
} 

let handler = async(m, { conn, text, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    let money = user.money
    let formattedMoney = money.toLocaleString();
   // let firmattedAngka = formattedMoney.toLocaleString();
   let mentionedJid = [m.sender]
    let response = `👤 @${m.sender.replace(/@.+/, '')}\n💸 *Uang :* ${formattedMoney}`
    conn.reply(m.chat, response, m, {contextInfo: { mentionedJid }})
}

handler.tags = ['rpg']
handler.help = ['saku']
handler.command = /^(saku|money)$/i
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