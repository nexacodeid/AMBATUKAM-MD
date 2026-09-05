/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

/**
@credit Zaell
@Raizell AI MD
@Whatsapp Bot
@Support dengan Donasi ✨
wa.me/6289520616967
**/

let handler = async (m, {
    conn
}) => {

    if (m.isGroup) {
        conn.sendMessage(m.chat, {
            text: '@' + m.chat,
            contextInfo: {
                groupMentions: [{
                    groupSubject: `${global.namebot} Aktif`,
                    groupJid: m.chat
                }]
            }
        }, {
            quoted: m
        })
    } else {
        await conn.reply(m.chat, `${global.namebot} Aktif`, m)
    }

}
handler.customPrefix = /^(bot|mybot)/i;
handler.command = new RegExp();
handler.register = true;
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