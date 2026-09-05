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
	let who;
	if (m.isGroup) who = m.mentionedJid[0];
	else who = m.chat;

	if (!who) return m.reply('Tag Orang Yang Ingin Kamu Rampok Atmnya');
	if (typeof global.db.data.users[who] == 'undefined') return m.reply('Pengguna Tidak Ada Didalam Database');
	if (who == '447503308581@s.whatsapp.net') return m.reply('🚫 Gausah Tengil, Lu Cuma Npc!!!');

	let users = global.db.data.users;
	let __timers = Date.now() - (users[m.sender].lastrob || 0);
	let _timers = 3600000 - __timers;
	let timers = clockString(_timers);

	if (__timers > 3600000) {
		if (10000 > users[who].bank) return m.reply('Orang Yang Kamu Tag, Tidak Memiliki Tabungan\nApakah Kamu Tidak Kasihan?');
		users[who].money -= dapat;
		users[who].bank -= dapat;
		users[m.sender].money += dapat;
		users[m.sender].lastrob = Date.now();
		conn.reply(m.chat, `Berhasil Merampok Atmnya Dan Kamu Mendapatkan Rp.${dapat}`, m);
	} else {
		conn.reply(m.chat, `Kamu Sudah Merampok Bank Dan Berhasil Sembunyi, Tunggu ${timers} Untuk Merampok Lagi`, m);
	}
};

handler.help = ['merampokbank'];
handler.tags = ['rpg'];
handler.command = /^merampokbank|rampokbank$/;
handler.premium = true;
handler.group = true;
handler.register = true;

export default handler;

function clockString(ms) {
	let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
	let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
	let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
	let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
	return ['\n' + d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('');
}
