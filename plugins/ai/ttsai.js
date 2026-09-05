import axios from 'axios'

const VOICES = {
  arnold: 'VR6AewLTigWG4xSOukaG',
  bella: 'EXAVITQu4vr4xnSDxMaL',
  krishna: 'h5XQxXfDV5lIuiwGGSeD'
}

const VOICE_ALIASES = {
  male: 'arnold',
  cowok: 'arnold',
  pria: 'arnold',
  female: 'bella',
  cewek: 'bella',
  wanita: 'bella',
  girl: 'bella',
  hindu: 'krishna',
  india: 'krishna'
}

function pickVoice(input = '') {
  input = String(input || '').toLowerCase()

  if (VOICES[input]) return input
  if (VOICE_ALIASES[input]) return VOICE_ALIASES[input]

  return null
}

function parseInput(text = '') {
  const args = text.trim().split(/\s+/)
  const first = args[0]?.toLowerCase()

  const voice = pickVoice(first)

  if (voice) {
    return {
      voice,
      text: args.slice(1).join(' ')
    }
  }

  if (first === 'all') {
    return {
      voice: 'all',
      text: args.slice(1).join(' ')
    }
  }

  return {
    voice: 'bella',
    text
  }
}

function parseErrorBuffer(buffer) {
  try {
    const raw = buffer.toString('utf8')
    const json = JSON.parse(raw)
    return json.error || json.message || raw.slice(0, 300)
  } catch {
    return null
  }
}

async function generateTTS(text, voiceName) {
  const voiceId = VOICES[voiceName]

  if (!voiceId) {
    throw new Error(`Voice "${voiceName}" tidak tersedia.`)
  }

  const payload = {
    text,
    voice_id: voiceId,
    model_id: 'eleven_v3',
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0
  }

  const res = await axios.post(
    'https://www.askgita.co/api/tts/elevenlabs',
    payload,
    {
      responseType: 'arraybuffer',
      timeout: 1000 * 60 * 3,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      validateStatus: () => true,
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0'
      }
    }
  )

  const buffer = Buffer.from(res.data || [])
  const contentType = String(res.headers?.['content-type'] || '')

  if (!buffer.length) {
    throw new Error('Response audio kosong.')
  }

  if (res.status >= 400 || /json|text|html/i.test(contentType)) {
    const err = parseErrorBuffer(buffer)
    throw new Error(err || `HTTP ${res.status}`)
  }

  if (buffer.length < 1000) {
    const err = parseErrorBuffer(buffer)
    throw new Error(err || `Audio terlalu kecil/rusak: ${buffer.length} byte`)
  }

  return buffer
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `Masukkan teks.\n\n` +
      `Contoh:\n` +
      `${usedPrefix + command} halo semuanya\n` +
      `${usedPrefix + command} bella halo semuanya\n` +
      `${usedPrefix + command} arnold halo semuanya\n` +
      `${usedPrefix + command} krishna halo semuanya\n` +
      `${usedPrefix + command} all halo semuanya\n\n` +
      `Voice tersedia:\n` +
      `- arnold\n` +
      `- bella\n` +
      `- krishna`
    )
  }

  const { voice, text: inputText } = parseInput(text)

  if (!inputText) {
    return m.reply(
      `Masukkan teks setelah voice.\n\n` +
      `Contoh:\n` +
      `${usedPrefix + command} bella halo semuanya`
    )
  }

  if (inputText.length > 500) {
    return m.reply('Teks terlalu panjang. Maksimal 500 karakter.')
  }

  try {
    await m.react?.('⏳').catch(() => {})

    if (voice === 'all') {
      for (const voiceName of Object.keys(VOICES)) {
        const audio = await generateTTS(inputText, voiceName)

        await conn.sendMessage(
          m.chat,
          {
            audio,
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: `aitts-${voiceName}.mp3`
          },
          {
            quoted: m
          }
        )
      }

      await m.react?.('✅').catch(() => {})
      return
    }

    const audio = await generateTTS(inputText, voice)

    await conn.sendMessage(
      m.chat,
      {
        audio,
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: `aitts-${voice}.mp3`
      },
      {
        quoted: m
      }
    )

    await m.react?.('✅').catch(() => {})
  } catch (e) {
    console.error('AITTS ERROR:', e)
    await m.react?.('❌').catch(() => {})
    return m.reply(`❌ Gagal membuat TTS.\n\n${e.message || e}`)
  }
}

handler.help = [
  'aitts <teks>',
  'aitts bella <teks>',
  'aitts arnold <teks>',
  'aitts krishna <teks>',
  'aitts all <teks>'
]

handler.tags = ['ai']
handler.command = /^(aitts|aivoice|elevenlabs|eltts|tts2)$/i
handler.limit = true
handler.register = true

export default handler