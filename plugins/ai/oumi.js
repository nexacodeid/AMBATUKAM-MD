import https from 'https'

function bersihkanSSML(teks) {
  if (!teks) return teks

  return String(teks)
    .replace(/<speak>|<\/speak>/gi, '')
    .replace(/<break\s+time=['"][^'"]+['"]\s*\/?>/gi, '')
    .replace(/<emphasis\s+level=['"][^'"]+['"]\s*>/gi, '')
    .replace(/<\/emphasis>/gi, '')
    .replace(/<prosody\s+rate=['"][^'"]+['"]\s*>/gi, '')
    .replace(/<\/prosody>/gi, '')
    .replace(/<say-as[^>]*>|<\/say-as>/gi, '')
    .replace(/<phoneme[^>]*>|<\/phoneme>/gi, '')
    .replace(/<sub[^>]*>|<\/sub>/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getBotPrompt() {
  const botName = global.getBotName?.() || global.namebot || 'WhatsApp Bot'
  const ownerName = global.getOwnerName?.() || global.ownerName || global.author || 'Owner'

  return `
Kamu adalah ${botName}, asisten AI di WhatsApp.

Identitas:
- Nama kamu ${botName}.
- Kamu dibuat oleh ${ownerName}.
- Jangan mengaku sebagai ChatGPT, OpenAI, Gemini, Google AI, atau model lain.
- Jika ditanya siapa kamu, jawab sebagai ${botName}.

Gaya bicara:
- Gunakan bahasa Indonesia.
- Jawab dengan kalem, sopan, ringan, dan natural.
- Jangan terlalu panjang jika tidak diminta.
- Jangan terlalu formal.
- Boleh memakai emoji secukupnya.
- Jangan memakai tag SSML/XML seperti <speak>, <break>, <prosody>, dan sejenisnya.

Aturan:
- Jika user bertanya hal teknis, jawab jelas dan langsung.
- Jika user bercanda, boleh balas santai.
- Jika tidak tahu, katakan tidak tahu.
- Jangan bantu hal berbahaya, ilegal, merugikan orang lain, atau konten dewasa.
`.trim()
}

function buildPrompt(systemPrompt, userQuestion) {
  return `${systemPrompt}

Current user question:
${userQuestion}

Now answer in the exact style defined above.`
}

function postAskGita(prompt) {
  const payload = JSON.stringify({
    prompt
  })

  const options = {
    hostname: 'www.askgita.co',
    port: 443,
    path: '/api/llm/ask',
    method: 'POST',
    family: 4,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json'
    }
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = ''

      res.on('data', chunk => {
        data += chunk
      })

      res.on('end', () => {
        if (!data) {
          return reject(new Error('Response API kosong.'))
        }

        let json

        try {
          json = JSON.parse(data)
        } catch {
          return reject(new Error(`Response bukan JSON: ${data.slice(0, 300)}`))
        }

        if (res.statusCode >= 400 || json.success === false) {
          return reject(new Error(json.error || json.message || `HTTP ${res.statusCode}`))
        }

        resolve(json)
      })
    })

    req.on('error', err => {
      reject(err)
    })

    req.setTimeout(120000, () => {
      req.destroy(new Error('Request timeout.'))
    })

    req.write(payload)
    req.end()
  })
}

async function askBot(question) {
  const fullPrompt = buildPrompt(getBotPrompt(), question)
  const json = await postAskGita(fullPrompt)

  const answer =
    json.text ||
    json.response ||
    json.answer ||
    json.result ||
    json.data?.text ||
    json.data?.response ||
    json.data?.answer ||
    json.data?.result

  if (!answer) {
    throw new Error(`Jawaban AI kosong. Response: ${JSON.stringify(json).slice(0, 700)}`)
  }

  return bersihkanSSML(answer)
}

let handler = async (m, { text, usedPrefix, command }) => {
  const question = String(text || m.quoted?.text || '').trim()

  if (!question) {
    return m.reply(
      `Mau tanya apa ke ${global.getBotName?.() || global.namebot || 'bot ini'}?\n\n` +
      `Contoh:\n` +
      `${usedPrefix + command} halo, kamu siapa?`
    )
  }

  try {
    await m.react?.('⏳').catch(() => {})

    const answer = await askBot(question)

    await m.reply(answer)

    await m.react?.('✅').catch(() => {})
  } catch (e) {
    console.error('[BOT AI ERROR]:', e)
    await m.react?.('❌').catch(() => {})
    return m.reply(`${global.getBotName?.() || global.namebot || 'Bot'} sedang gagal menjawab.\n\n${e.message || e}`)
  }
}

handler.help = ['ai <teks>']
handler.tags = ['ai']
handler.command = /^(ai|askai)$/i
handler.limit = true
handler.register = true

export default handler