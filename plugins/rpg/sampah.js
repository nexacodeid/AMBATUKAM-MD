/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, {
	conn,
	usedPrefix
}) => {
	let kardus = global.db.data.users[m.sender].kardus
	let kaleng = global.db.data.users[m.sender].kaleng
	let botol = global.db.data.users[m.sender].botol
	let pelastik = global.db.data.users[m.sender].pelastik
	let mentionedJid = [m.sender]

	let nuy = `Sampah di Cast
    
    👤 @${m.sender.replace(/@.+/, '')}
    
•📦 *Kardus:* ${kardus.toLocaleString()}
•🗑️ *Kaleng:* ${kaleng.toLocaleString()}
•🍼 *Botol:* ${botol.toLocaleString()}
•🥡 *Pelastik:* ${pelastik.toLocaleString()}
 `.trim()
	conn.reply(m.chat, nuy, m, {contextInfo: { mentionedJid }})

}
handler.help = ['sampah']
handler.tags = ['rpg']
handler.command = /^(sampah)$/i
handler.register = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */