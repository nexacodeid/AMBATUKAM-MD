export async function before(m, { isAdmin, isOwner, isBotAdmin }) {
	const user = global.db.data.users[m.sender];
	const chat = global.db.data.chats[m.chat];

	if (!m.isBaileys || m.mtype === 'protocolMessage' || m.mtype === 'pollUpdateMessage' || m.mtype === 'reactionMessage') return;
	if (!m.msg || !m.message || m.key.remoteJid !== m.chat || user?.banned || chat?.isBanned) return;

	this.spam = this.spam || {};
	this.spam[m.sender] = this.spam[m.sender] || { count: 0, lastspam: 0 };
	const now = m.messageTimestamp?.low || m.messageTimestamp;
	const timeDifference = now - this.spam[m.sender].lastspam;

	if (timeDifference < 10) {
		this.spam[m.sender].count++;
		if (this.spam[m.sender].count >= 5 && !isOwner && !isAdmin && !isBotAdmin) {
			user.banned = true;
			this.spam[m.sender].lastspam = now;

			// Simpan referensi ke this (conn) agar bisa digunakan di dalam setTimeout
			const conn = this;
			const senderRef = m.sender;
			const chatRef = m.chat;
			const keyRef = m.key;

			setTimeout(() => {
				const u = global.db.data.users[senderRef];
				if (u) u.banned = false;
				if (conn.spam?.[senderRef]) conn.spam[senderRef].count = 0;
				conn.sendMessage(chatRef, { react: { text: '✅', key: keyRef } }).catch(() => {});
			}, 10000);

			return m.reply('⚠️ Kamu telah terbanned, tunggu setelah 10 detik..');
		}
	} else {
		this.spam[m.sender].count = 0;
	}

	this.spam[m.sender].lastspam = now;
}
