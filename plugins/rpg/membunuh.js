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
	let dapat = Math.floor(Math.random() * 100000);
	let healtu = Math.floor(Math.random() * 100);
	let who;
	if (m.isGroup) who = m.mentionedJid[0];
	else who = m.chat;
	if (!who) return m.reply('Tag salah satu lah');
	if (typeof global.db.data.users[who] == 'undefined') return m.reply('Pengguna tidak ada didalam database');
	if (who == '6289520616967@s.whatsapp.net') return m.reply('Hei Kamu Ngapain, Zaell Sudah Cheat Kebal, Ga Mempan Di Bunuh.');

	let users = global.db.data.users;
	let __timers = Date.now() - (users[m.sender].lastsda || 0);
	let _timers = 3600000 - __timers;
	let timers = clockString(_timers);

	if (__timers > 3600000) {
		if (10 > users[who].health) return m.reply('ᴛᴀʀɢᴇᴛ ꜱᴜᴅᴀʜ ᴛɪᴅᴀᴋ ᴍᴇᴍɪʟɪᴋɪ ʜᴇᴀʟᴛʜ💉');
		if (100 > users[who].money) return m.reply('💠ᴛᴀʀɢᴇᴛ ᴛɪᴅᴀᴋ ᴍᴇᴍɪʟɪᴋɪ ᴀᴘᴀᴘᴜɴ :(💠');
		users[who].health -= healtu;
		users[who].money -= dapat;
		users[m.sender].money += dapat;
		users[m.sender].lastsda = Date.now();
		conn.reply(m.chat, `ᴛᴀʀɢᴇᴛ ʙᴇʀʜᴀꜱɪʟ ᴅɪ ʙᴜɴᴜʜ ᴅᴀɴ ᴋᴀᴍᴜ ᴍᴇɴɢᴀᴍʙɪʟ ᴍᴏɴᴇʏ ᴛᴀʀɢᴇᴛ ꜱᴇʙᴇꜱᴀʀ\n💰${dapat} ᴍᴏɴᴇʏ\nᴅᴀʀᴀʜ ᴛᴀʀɢᴇᴛ ʙᴇʀᴋᴜʀᴀɴɢ -${healtu} ʜᴇᴀʟᴛʜ❤`, m);
	} else {
		conn.reply(m.chat, `Anda Sudah Membunuh Dan Berhasil Sembunyi, tunggu ${timers} untuk membunuh lagi`, m);
	}
};

handler.help = ['membunuh *@tag*'];
handler.tags = ['rpg'];
handler.command = /^membunuh$/;
handler.register = true;
handler.group = true;
export default handler;

function clockString(ms) {
	let h = Math.floor(ms / 3600000);
	let m = Math.floor(ms / 60000) % 60;
	let s = Math.floor(ms / 1000) % 60;
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}
