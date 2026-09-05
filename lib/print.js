/*
 *╭━━━[ 🤖 Raizell AI Bot ]━━━╮
 *┃ 🔹 Creator : Zaell × Raizell AI
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import { WAMessageStubType } from 'baileys';
import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';

function toSafeNumber(value, fallback = 0) {
	if (typeof value === 'bigint') return Number(value);
	if (typeof value?.toNumber === 'function') value = value.toNumber();
	else if (value && typeof value === 'object' && 'low' in value) value = value.low;

	const number = Number(value);
	return Number.isFinite(number) ? number : fallback;
}

function getName(conn, jid) {
	try {
		const name = conn.getName?.(jid);
		return typeof name === 'string' ? name.trim() : '';
	} catch {
		return '';
	}
}

function getPhoneLabel(jid) {
	const digits = String(jid || '')
		.split('@')[0]
		.split(':')[0]
		.replace(/\D/g, '');

	if (!digits) return '-';

	try {
		return PhoneNumber('+' + digits).getNumber('international') || '+' + digits;
	} catch {
		return '+' + digits;
	}
}

function samePhone(left, right) {
	const normalize = (value) => String(value || '').replace(/\D/g, '');
	return normalize(left) && normalize(left) === normalize(right);
}

function withName(number, name) {
	if (!name || samePhone(number, name)) return number;
	return `${number} ~${name}`;
}

function getFileSize(m) {
	const msg = m.msg || {};

	if (typeof msg.vcard === 'string') return Buffer.byteLength(msg.vcard);
	if (msg.fileLength != null) return Math.max(0, toSafeNumber(msg.fileLength));
	if (msg.axolotlSenderKeyDistributionMessage?.length != null) {
		return Math.max(0, toSafeNumber(msg.axolotlSenderKeyDistributionMessage.length));
	}
	if (typeof m.text === 'string') return Buffer.byteLength(m.text);

	return 0;
}

function formatBytes(bytes) {
	const size = Math.max(0, toSafeNumber(bytes));
	if (size < 1000) return `${size} B`;

	const units = ['KB', 'MB', 'GB', 'TB'];
	const unitIndex = Math.min(Math.floor(Math.log(size) / Math.log(1000)) - 1, units.length - 1);
	const value = size / 1000 ** (unitIndex + 1);
	return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function getTimestamp(m) {
	const timestamp = toSafeNumber(m.messageTimestamp, Date.now() / 1000);
	const date = new Date(timestamp > 1e12 ? timestamp : timestamp * 1000);

	return date.toLocaleString('id-ID', {
		timeZone: 'Asia/Jakarta',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});
}

function getMessageType(m) {
	if (m.messageStubType) {
		return WAMessageStubType[m.messageStubType] || `System (${m.messageStubType})`;
	}

	const type = String(m.mtype || 'unknown')
		.replace(/message$/i, '')
		.replace(/^audio$/i, m.msg?.ptt ? 'PTT' : 'Audio');

	return type.replace(/^./, (letter) => letter.toUpperCase()) || 'Unknown';
}

function formatMessageText(m, conn) {
	if (typeof m.text !== 'string' || !m.text) return '';

	let log = m.text.replace(/\u200e+/g, '');
	const mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;
	const mdFormat =
		(depth = 4) =>
		(_, type, text, monospace) => {
			const types = { _: 'italic', '*': 'bold', '~': 'strikethrough' };
			const content = text || monospace || '';
			return !types[type] || depth < 1 ? content : chalk[types[type]](content.replace(mdRegex, mdFormat(depth - 1)));
		};

	log = log.replace(mdRegex, mdFormat(4));
	const mentioned = m?.message?.[m.mtype]?.contextInfo?.mentionedJid || [];

	for (const jid of mentioned) {
		const label = getName(conn, jid) || getPhoneLabel(jid);
		log = log.replaceAll('@' + jid.split('@')[0], chalk.blueBright('@' + label));
	}

	return m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log;
}

export default async function printMessage(m, conn = { user: {} }) {
	// Balasan dan reaction milik bot tidak perlu dicetak sebagai pesan masuk.
	if (!m || m.fromMe || m.key?.fromMe) return;

	const botJid = conn.user?.jid || conn.user?.id || '';
	const botNumber = getPhoneLabel(botJid);
	const botName = conn.user?.name || global.namebot || 'Bot';
	const senderNumber = getPhoneLabel(m.sender);
	const senderName = m.pushName || getName(conn, m.sender);
	const sender = withName(senderNumber, senderName);
	const chatName = m.isGroup ? getName(conn, m.chat) : '';
	const chat = m.isGroup ? `${chatName || 'Grup'} (${m.chat || '-'})` : 'Private chat';
	const user = global.db?.data?.users?.[m.sender];
	const gainedExp = toSafeNumber(m.exp);
	const stats = user
		? `+${gainedExp} EXP • Total ${toSafeNumber(user.exp)} • Limit ${toSafeNumber(user.limit)} • Lv ${toSafeNumber(user.level, 1)}`
		: `+${gainedExp} EXP`;
	const plugin = m.plugin ? ` • ${m.plugin}` : '';

	console.log(
		[
			chalk.cyanBright('╭─ PESAN MASUK'),
			`│ 🤖 ${withName(botNumber, botName)}`,
			`│ 🕒 ${getTimestamp(m)}`,
			`│ 👤 ${sender}`,
			`│ 💬 ${chat}`,
			`│ 🧩 ${getMessageType(m)}${plugin}`,
			`│ 📦 ${formatBytes(getFileSize(m))}`,
			`│ 📈 ${stats}`,
			chalk.cyanBright('╰──────────────'),
		].join('\n')
	);

	const text = formatMessageText(m, conn);
	if (text) console.log(text);

	if (Array.isArray(m.messageStubParameters) && m.messageStubParameters.length) {
		const parameters = m.messageStubParameters
			.map((value) => {
				const jid = conn.decodeJid?.(value) || value;
				return withName(getPhoneLabel(jid), getName(conn, jid));
			})
			.join(', ');
		if (parameters) console.log(chalk.gray(parameters));
	}

	if (/document/i.test(m.mtype || '')) console.log(`🗂️ ${m.msg?.fileName || m.msg?.displayName || 'Document'}`);
	else if (/ContactsArray/i.test(m.mtype || '')) console.log('👨‍👩‍👧‍👦 Daftar kontak');
	else if (/contact/i.test(m.mtype || '')) console.log(`👨 ${m.msg?.displayName || 'Kontak'}`);
	else if (/audio/i.test(m.mtype || '')) {
		const duration = Math.max(0, toSafeNumber(m.msg?.seconds));
		const minutes = Math.floor(duration / 60).toString().padStart(2, '0');
		const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
		console.log(`${m.msg?.ptt ? '🎤 PTT' : '🎵 Audio'} ${minutes}:${seconds}`);
	}

	console.log();
}

const file = global.__filename(import.meta.url);
watchFile(file, () => {
	console.log(chalk.redBright("Update 'lib/print.js'"));
});

/*
 *╭━━━[ 🤖 Raizell AI Bot ]━━━╮
 *┃ 🔹 Creator : Zaell × Raizell AI
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */