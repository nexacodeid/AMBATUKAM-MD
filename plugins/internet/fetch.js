import path from 'node:path';

const MAX_SIZE = 200 * 1024 * 1024; // 200MB
const TIMEOUT = 15000;

function pickUrl(text = '') {
	const match = text.match(/https?:\/\/[^\s]+/i);
	if (!match) return null;

	try {
		const url = new URL(match[0]);
		if (!['http:', 'https:'].includes(url.protocol)) return null;
		return url.toString();
	} catch {
		return null;
	}
}

function safeFilename(url, fallback = 'file') {
	try {
		const { pathname } = new URL(url);
		let name = path.basename(decodeURIComponent(pathname));
		name = name.replace(/[\\/:*?"<>|]/g, '_').trim();
		return name || fallback;
	} catch {
		return fallback;
	}
}

async function responseToBuffer(res, limit = MAX_SIZE) {
	const contentLength = Number(res.headers.get('content-length') || 0);

	if (contentLength && contentLength > limit) {
		throw new Error('File terlalu besar (maksimal 200MB)');
	}

	const reader = res.body?.getReader();

	if (!reader) {
		const buffer = Buffer.from(await res.arrayBuffer());

		if (buffer.length > limit) {
			throw new Error('File terlalu besar (maksimal 200MB)');
		}

		return buffer;
	}

	const chunks = [];
	let total = 0;

	while (true) {
		const { done, value } = await reader.read();

		if (done) break;

		total += value.length;

		if (total > limit) {
			throw new Error('File terlalu besar (maksimal 200MB)');
		}

		chunks.push(value);
	}

	return Buffer.concat(chunks);
}

let handler = async (m, { conn }) => {
	const rawText = m.quoted?.text || m.text || '';
	const url = pickUrl(rawText);

	if (!url) throw 'Url?';

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), TIMEOUT);

	let res;
	let buffer;

	try {
		res = await fetch(url, {
			redirect: 'follow',
			headers: {
				'user-agent':
					'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
				'accept': '*/*',
			},
			signal: controller.signal,
		});

		if (!res.ok) {
			throw new Error(`HTTP Error ${res.status}`);
		}

		buffer = await responseToBuffer(res, MAX_SIZE);
	} catch (e) {
		const msg =
			e.name === 'AbortError'
				? 'Request timeout'
				: e.message || String(e);

		return m.reply('Gagal fetch URL: ' + msg);
	} finally {
		clearTimeout(timeout);
	}

	const type = (res.headers.get('content-type') || 'application/octet-stream')
		.split(';')[0]
		.trim()
		.toLowerCase();

	const finalUrl = res.url || url;
	const filename = safeFilename(finalUrl, 'file');

	if (type.startsWith('image/')) {
		return conn.sendFile(m.chat, buffer, filename, finalUrl, m);
	}

	if (type === 'application/json' || filename.endsWith('.json')) {
		try {
			const json = JSON.parse(buffer.toString('utf8'));
			const pretty = JSON.stringify(json, null, 2);

			if (pretty.length <= 65536) {
				await m.reply(pretty);
			} else {
				await m.reply(pretty.slice(0, 65536) + '\n\n...terpotong');
			}

			return conn.sendMessage(
				m.chat,
				{
					document: Buffer.from(pretty),
					fileName: filename.endsWith('.json') ? filename : 'file.json',
					mimetype: 'application/json',
				},
				{ quoted: m }
			);
		} catch {
			return m.reply('JSON rusak / tidak valid');
		}
	}

	if (type.startsWith('text/')) {
		const txt = buffer.toString('utf8');
		const outName =
			type === 'text/html'
				? filename.endsWith('.html') || filename.endsWith('.htm')
					? filename
					: 'file.html'
				: filename.includes('.')
					? filename
					: 'file.txt';

		if (txt.length <= 65536) {
			await m.reply(txt);
		} else {
			await m.reply(txt.slice(0, 65536) + '\n\n...terpotong');
		}

		return conn.sendFile(m.chat, Buffer.from(txt), outName, null, m);
	}

	return conn.sendFile(m.chat, buffer, filename, finalUrl, m);
};

handler.help = ['fetch <url>', 'get <url>'];
handler.tags = ['internet'];
handler.command = /^(fetch|get)$/i;
handler.register = true;

export default handler;