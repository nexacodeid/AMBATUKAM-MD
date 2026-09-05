/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn }) => {
	let list = Object.entries(global.db.data.users);
	for (let [, data] of list) {
		data.leather = 0;
	}
	conn.reply(m.chat, `*Berhasil direset*`, m);
};

handler.help = ['resetitem'];
handler.tags = ['owner'];
handler.command = /^(resitem)$/i;
handler.owner = true;
handler.register = true;

export default handler;
