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
	let jeruk = global.db.data.users[m.sender].jeruk
	let apel = global.db.data.users[m.sender].apel
	let anggur = global.db.data.users[m.sender].anggur
	let pisang = global.db.data.users[m.sender].pisang
	let mangga = global.db.data.users[m.sender].mangga
	let mentionedJid = [m.sender]

	let nuy = `List Buah"an 
	👤 @${m.sender.replace(/@.+/, '')}
    
•🍌 *Pisang:* ${pisang}
•🥭 *Mangga:* ${mangga}
•🍊 *Jeruk:* ${jeruk}
•🍎 *Apel:* ${apel}
•🍇 *Anggur:* ${anggur}
 `.trim()
    
	conn.reply(m.chat, nuy, m, {contextInfo: { mentionedJid }})

}
handler.help = ['buah']
handler.tags = ['rpg']
handler.command = /^(buah)$/i
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