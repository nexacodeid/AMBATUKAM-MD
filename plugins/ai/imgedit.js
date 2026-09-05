import axios from 'axios'
import FormData from 'form-data'

function getMime(q) {
  return q?.mimetype || q?.msg?.mimetype || ''
}

function getApiBase() {
  return (global.APIs?.theresav || 'https://api.theresav.biz.id').replace(/\/+$/, '')
}

function getApiKey() {
  const base = getApiBase()
  return global.APIKeys?.[base] || global.APIKeys?.theresav || 'raizell'
}

function getExt(mime = '') {
  if (/png/i.test(mime)) return 'png'
  if (/webp/i.test(mime)) return 'webp'
  return 'jpg'
}

function isUrl(str = '') {
  return /^https?:\/\//i.test(str)
}

function isDataImage(str = '') {
  return /^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(str)
}

function isBase64Image(str = '') {
  if (typeof str !== 'string') return false
  if (str.length < 1000) return false
  if (/^https?:\/\//i.test(str)) return false
  if (!/^[A-Za-z0-9+/=\r\n]+$/.test(str)) return false
  return true
}

function findImageFromJson(input) {
  if (!input) return null

  if (Buffer.isBuffer(input)) {
    return {
      type: 'buffer',
      value: input
    }
  }

  if (typeof input === 'string') {
    if (isUrl(input)) {
      return {
        type: 'url',
        value: input
      }
    }

    if (isDataImage(input)) {
      const base64 = input.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/i, '')
      return {
        type: 'buffer',
        value: Buffer.from(base64, 'base64')
      }
    }

    if (isBase64Image(input)) {
      return {
        type: 'buffer',
        value: Buffer.from(input.replace(/\s+/g, ''), 'base64')
      }
    }

    return null
  }

  if (Array.isArray(input)) {
    for (const item of input) {
      const found = findImageFromJson(item)
      if (found) return found
    }

    return null
  }

  if (typeof input === 'object') {
    const priorityKeys = [
      'url',
      'image',
      'image_url',
      'imageUrl',
      'output',
      'output_url',
      'outputUrl',
      'result',
      'data',
      'file',
      'file_url',
      'download',
      'download_url',
      'base64',
      'b64',
      'buffer'
    ]

    for (const key of priorityKeys) {
      if (key in input) {
        const found = findImageFromJson(input[key])
        if (found) return found
      }
    }

    for (const value of Object.values(input)) {
      const found = findImageFromJson(value)
      if (found) return found
    }
  }

  return null
}

async function getFormLength(form) {
  return await new Promise(resolve => {
    form.getLength((err, length) => {
      if (err) return resolve(null)
      resolve(length)
    })
  })
}

async function postDeepAiEdit(buffer, mime, prompt) {
  const base = getApiBase()
  const apikey = getApiKey()
  const ext = getExt(mime)

  const form = new FormData()

  form.append('prompt', prompt)
  form.append('apikey', apikey)
  form.append('image', buffer, {
    filename: `deepai-edit.${ext}`,
    contentType: mime || 'image/jpeg',
    knownLength: buffer.length
  })

  const headers = {
    ...form.getHeaders(),
    accept: '*/*',
    'user-agent': 'Mozilla/5.0'
  }

  const length = await getFormLength(form)
  if (length) headers['content-length'] = length

  const res = await axios.post(
    `${base}/ai/deepai/edit`,
    form,
    {
      headers,
      timeout: 1000 * 60 * 8,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      responseType: 'arraybuffer',
      validateStatus: () => true
    }
  )

  const contentType = String(res.headers?.['content-type'] || '')
  const responseBuffer = Buffer.from(res.data || [])

  if (!responseBuffer.length) {
    throw new Error('Response API kosong.')
  }

  if (/image\//i.test(contentType)) {
    return {
      media: {
        type: 'buffer',
        value: responseBuffer
      },
      json: null
    }
  }

  const raw = responseBuffer.toString('utf8')
  let json

  try {
    json = JSON.parse(raw)
  } catch {
    throw new Error(`Response bukan JSON/gambar: ${raw.slice(0, 500)}`)
  }

  if (res.status >= 400 || json.status === false) {
    throw new Error(json.error || json.message || `HTTP ${res.status}`)
  }

  const media = findImageFromJson(json)

  return {
    media,
    json
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m
  const mime = getMime(q)

  if (!/image\/(jpe?g|png|webp)/i.test(mime)) {
    return m.reply(
      `Reply/kirim gambar dengan caption:\n` +
      `${usedPrefix + command} prompt\n\n` +
      `Contoh:\n` +
      `${usedPrefix + command} buat agar karakternya berpose dua jari`
    )
  }

  const prompt = String(text || '').trim()

  if (!prompt) {
    return m.reply(
      `Masukkan prompt edit gambar.\n\n` +
      `Contoh:\n` +
      `${usedPrefix + command} buat agar karakternya berpose dua jari`
    )
  }

  try {
    await m.react?.('⏳').catch(() => {})

    const buffer = await q.download?.()

    if (!buffer || !buffer.length) {
      throw new Error('Gagal mengambil gambar.')
    }

    const { media, json } = await postDeepAiEdit(buffer, mime, prompt)

    if (!media) {
      const debug = JSON.stringify(json, null, 2).slice(0, 3500)

      await m.react?.('❌').catch(() => {})

      return m.reply(
        `❌ URL/gambar hasil tidak ditemukan dari response API.\n\n` +
        `*Response API:*\n` +
        '```json\n' +
        debug +
        '\n```'
      )
    }

    const imageContent =
      media.type === 'url'
        ? { url: media.value }
        : media.value

    await conn.sendMessage(
      m.chat,
      {
        image: imageContent,
        caption:
          `✅ *DeepAI Image Edit*\n\n` +
          `Prompt:\n${prompt}`
      },
      {
        quoted: m
      }
    )

    await m.react?.('✅').catch(() => {})
  } catch (e) {
    console.error('DEEPAI EDIT ERROR:', e)
    await m.react?.('❌').catch(() => {})
    return m.reply(`❌ Gagal edit gambar.\n\n${e.message || e}`)
  }
}

handler.help = ['deepaiedit <prompt>']
handler.tags = ['ai']
handler.command = /^(deepaiedit|deepedit|aiedit|editai)$/i
handler.limit = true
handler.register = true

export default handler