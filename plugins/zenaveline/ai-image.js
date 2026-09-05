import {
  collectUrlEntries,
  errorMessage,
  scraper,
  sendMediaEntries,
  truncate,
  withQuotedImage
} from '../../lib/zenaveline-adapter.js'

function withTimeout(promise, milliseconds, label) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} melewati batas waktu.`)), milliseconds)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

function findAnswer(value) {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return null

  for (const key of ['answer', 'answer_text', 'response', 'reply', 'message', 'text', 'content', 'result']) {
    const candidate = value[key]
    if (typeof candidate === 'string' && candidate.trim()) return candidate
    if (candidate && typeof candidate === 'object') {
      const nested = findAnswer(candidate)
      if (nested) return nested
    }
  }

  return null
}

async function nova(m, text) {
  if (!text.trim()) throw new Error('Masukkan pertanyaan untuk Nova AI.')
  const result = await scraper.novaai(text.trim())
  const answer = findAnswer(result)
  await m.reply(answer || truncate(result))
}

async function nanoBanana(conn, m, text) {
  if (!text.trim()) throw new Error('Masukkan prompt edit gambar.')

  await withQuotedImage(m, async ({ buffer }) => {
    const result = await withTimeout(scraper.nanobanana(buffer, text.trim()), 240000, 'Proses Nano Banana')
    if (result?.status !== 'success' || !result.image_url) {
      throw new Error(result?.message || `Nano Banana gagal: ${truncate(result, 700)}`)
    }
    await conn.sendFile(m.chat, result.image_url, 'nanobanana.jpg', `✅ Gambar berhasil diedit.\n\nPrompt: ${text.trim()}`, m)
  })
}

async function sharpify(conn, m, model) {
  await withQuotedImage(m, async ({ filePath }) => {
    const result = await withTimeout(scraper.sharpify(filePath, model), 180000, 'Proses Sharpify')
    if (!collectUrlEntries(result).length) {
      throw new Error(`Sharpify tidak mengembalikan gambar: ${truncate(result, 700)}`)
    }
    await sendMediaEntries(conn, m, result, {
      caption: `✅ Sharpify *${model}* selesai.`,
      max: 2,
      fallbackName: `${model}.png`
    })
  })
}

async function pixaRemoveBackground(conn, m) {
  await withQuotedImage(m, async ({ filePath }) => {
    const result = await withTimeout(scraper.pixaremovebg(filePath), 180000, 'Proses remove background')
    if (!Buffer.isBuffer(result) || result.length < 100) throw new Error('Pixa tidak mengembalikan gambar yang valid.')
    await conn.sendMessage(
      m.chat,
      { image: result, caption: '✅ Background berhasil dihapus dengan Pixa.' },
      { quoted: m }
    )
  })
}

let handler = async (m, { conn, text = '', command = '' }) => {
  const cmd = command.toLowerCase()
  await m.react?.('⏳').catch(() => {})

  try {
    if (/^(nova|novaai)$/.test(cmd)) await nova(m, text)
    else if (/^(nanobanana|nana|editimage)$/.test(cmd)) await nanoBanana(conn, m, text)
    else if (/^(hd|hdr|upscale)$/.test(cmd)) await sharpify(conn, m, 'upscale')
    else if (cmd === 'enhance') await sharpify(conn, m, 'enhance')
    else if (cmd === 'sharpremovebg') await sharpify(conn, m, 'removebg')
    else if (/^(nobg|removebg|pixaremovebg|pixa)$/.test(cmd)) await pixaRemoveBackground(conn, m)
    await m.react?.('✅').catch(() => {})
  } catch (error) {
    console.error('[NOVA AI/IMAGE]', error)
    await m.react?.('❌').catch(() => {})
    await m.reply(`❌ ${errorMessage(error)}`)
  }
}

handler.help = [
  'novaai <pertanyaan>', 'nanobanana <prompt> (balas gambar)',
  'hd (balas gambar)', 'enhance (balas gambar)',
  'sharpremovebg (balas gambar)', 'removebg (balas gambar)'
]
handler.tags = ['ai', 'tools']
handler.command = /^(nova|novaai|nanobanana|nana|editimage|hd|hdr|upscale|enhance|sharpremovebg|nobg|removebg|pixaremovebg|pixa)$/i
handler.limit = true
handler.register = true

export default handler
