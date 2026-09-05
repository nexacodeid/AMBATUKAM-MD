import { AIRich, ButtonV2 } from '../../lib/messagebutton.js'

function splitFirstCodeBlock(text = '') {
	const value = String(text || '')
	const match = value.match(/```([\w.+-]*)\n([\s\S]*?)```/)
	if (!match) return { before: value.trim(), lang: '', code: '' }
	return {
		before: value.replace(match[0], '').trim(),
		lang: match[1] || 'text',
		code: match[2].trim()
	}
}

async function sendRichDeepSeek(conn, m, res, usedPrefix) {
	const response = String(res || '').trim()
	const parsed = splitFirstCodeBlock(response)

	try {
		const rich = new AIRich(conn).setTitle('DeepSeek Response')
		if (parsed.code) {
			if (parsed.before) rich.addText(parsed.before)
			rich.addCode(parsed.lang, parsed.code)
		} else {
			rich.addText(response)
		}
		rich.addSuggest(['Lanjutkan', 'Ringkas', 'Beri contoh kode'])
		return await rich.send(m.chat, { quoted: m })
	} catch (e) {
		console.log('SEND DEEPSEEK AIRICH ERROR:', e)
		try {
			return await new ButtonV2(conn)
				.setBody(`乂 *DeepSeek Response*\n\n${response}`)
				.setFooter(global.namebot || 'AI Assistant')
				.addButton('🔁 Tanya Lagi', `${usedPrefix}deepseek `)
				.addButton('🤖 GPT', `${usedPrefix}gpt `)
				.send(m.chat, { quoted: m })
		} catch (err) {
			console.log('SEND DEEPSEEK BUTTON ERROR:', err)
			return m.reply(response)
		}
	}
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
	const input = m.quoted ? m.quoted.text : text
	if (!input) throw `Masukkan pertanyaan atau perintah!\n\nContoh:\n${usedPrefix + command} apa itu AI`

	if (!conn.deepseek) conn.deepseek = {}
	if (!conn.deepseek[m.sender]) conn.deepseek[m.sender] = []
	conn.deepseek[m.sender].push({ role: 'user', content: input })

	try {
		const res = await deepinfra('deepseek-ai/DeepSeek-V3.2', conn.deepseek[m.sender])
		conn.deepseek[m.sender].push({ role: 'assistant', content: res })
		return await sendRichDeepSeek(conn, m, res, usedPrefix)
	} catch (err) {
		m.reply('Terjadi Kesalahan')
		console.error(err)
	}
}

handler.help = ['deepseek']
handler.tags = ['ai']
handler.command = /^deepseek|depseek|deepsek|dipsek$/i
handler.register = true
handler.limit = true

export default handler

export async function deepinfra(model, history) {
	try {
		const res = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
			method: 'POST',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model,
				messages: history
			})
		})
		if (!res.ok) throw new Error(`HTTP Error ${res.status}`)
		const data = await res.json()

		let teks = []
		for (let out of data?.choices || []) {
			if (out.message?.content) teks.push(out.message.content)
		}

		return teks.join('\n')
	} catch (e) {
		throw new Error('Error' + e?.message)
	}
}
