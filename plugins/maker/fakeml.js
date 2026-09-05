import { createRequire } from 'node:module'
import fs from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const require = createRequire(import.meta.url)
const fakeMl = require('fake-ml')
const generateCard = typeof fakeMl === 'function' ? fakeMl : fakeMl.generateCard

if (typeof generateCard !== 'function') {
  throw new TypeError('Package fake-ml tidak menyediakan fungsi generateCard.')
}

const ranks = {
  epic: 'Epic',
  glory: 'Glory',
  gm: 'Grandmaster',
  honor: 'Honor',
  imo: 'Immortal',
  legend: 'Legend',
  mawi: 'Mawi'
}

const borders = Array.from({ length: 17 }, (_, index) => index)

function teksPanduan(usedPrefix, command) {
  return `
🎮 *FAKE ML CARD*

*Cara pakai:*
Reply gambar yang ingin dijadikan avatar, lalu ketik:

${usedPrefix + command} nama|rank|border

*Contoh:*
${usedPrefix + command} ${global.getOwnerName?.() || global.ownerName || 'Owner'}|imo|2
${usedPrefix + command} ${global.getBotName?.() || global.namebot || 'Bot'}|glory|11

*Daftar Rank:*
${Object.entries(ranks).map(([key, name]) => `• ${name} = ${key}`).join('\n')}

*Daftar Border:*
${borders.map(v => `• Border ${v}`).join('\n')}

*Catatan:*
Avatar wajib dari gambar yang di-reply.
Border 0 menggunakan outline default.
`.trim()
}

function sanitizeUsername(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N} _-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 15) || 'Player'
}

function bufferToDataUrl(buffer, mime) {
  const normalizedMime = String(mime || '').toLowerCase()
  const safeMime = /^image\/(?:jpe?g|png|webp|gif)$/.test(normalizedMime)
    ? normalizedMime.replace('image/jpg', 'image/jpeg')
    : 'image/jpeg'

  return `data:${safeMime};base64,${buffer.toString('base64')}`
}

function resolveGeneratedCard(result, outputDir) {
  if (Buffer.isBuffer(result)) return result

  if (result?.status && result.status !== 'success') {
    throw new Error(result.message || 'Generator Fake ML gagal.')
  }

  const outputValue = typeof result === 'string' ? result : result?.result
  if (typeof outputValue !== 'string' || !outputValue.trim()) {
    throw new Error('Generator Fake ML tidak mengembalikan path gambar.')
  }

  const outputPath = path.resolve(outputValue)
  const allowedPrefix = `${path.resolve(outputDir)}${path.sep}`

  if (!outputPath.startsWith(allowedPrefix)) {
    throw new Error('Generator mengembalikan lokasi file yang tidak aman.')
  }

  const stat = fs.statSync(outputPath, { throwIfNoEntry: false })
  if (!stat?.isFile()) {
    throw new Error('File hasil Fake ML tidak ditemukan.')
  }

  return fs.readFileSync(outputPath)
}

async function sendGeneratedCard(conn, m, result, caption, outputDir) {
  const buffer = resolveGeneratedCard(result, outputDir)

  if (!Buffer.isBuffer(buffer) || buffer.length < 8) {
    throw new Error('File hasil Fake ML kosong atau rusak.')
  }

  const pngSignature = buffer.subarray(0, 8).toString('hex')
  if (pngSignature !== '89504e470d0a1a0a') {
    throw new Error('Hasil generator bukan gambar PNG yang valid.')
  }

  return conn.sendMessage(m.chat, {
    image: buffer,
    caption
  }, { quoted: m })
}

let handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  let outputDir = null

  try {
    const q = m.quoted || m
    const mime = q.mimetype || q.msg?.mimetype || ''
    const inputParts = String(text || '').split('|').map(value => value.trim())

    if (inputParts.length !== 3) {
      await m.react('❌')
      return m.reply(teksPanduan(usedPrefix, command))
    }

    if (!/^image\//i.test(mime)) {
      await m.react('❌')
      return m.reply(
        `Reply gambar yang ingin dijadikan avatar.\n\n${teksPanduan(usedPrefix, command)}`
      )
    }

    const [usernameInput, rankInput, borderInput] = inputParts
    const username = sanitizeUsername(usernameInput)
    const rank = (rankInput || 'imo').toLowerCase()
    const border = Number(borderInput)

    if (!ranks[rank]) {
      await m.react('❌')
      return m.reply(
        `Rank *${rank}* tidak valid.\n\n${teksPanduan(usedPrefix, command)}`
      )
    }

    if (borderInput === '' || !Number.isInteger(border) || !borders.includes(border)) {
      await m.react('❌')
      return m.reply(
        `Border *${borderInput || '-'}* tidak valid.\n\n${teksPanduan(usedPrefix, command)}`
      )
    }

    await m.react('⏳')

    const downloaded = await q.download()

    if (!downloaded?.length) {
      await m.react('❌')
      return m.reply('Gagal mengunduh gambar yang di-reply.')
    }

    const buffer = Buffer.isBuffer(downloaded) ? downloaded : Buffer.from(downloaded)
    if (buffer.length > 10 * 1024 * 1024) {
      await m.react('❌')
      return m.reply('Ukuran avatar terlalu besar. Maksimum 10 MB.')
    }

    const avatar = bufferToDataUrl(buffer, mime)
    outputDir = await fs.promises.mkdtemp(path.join(tmpdir(), 'shinomiya-fakeml-'))

    const result = await generateCard({
      avatar,
      username,
      rank,
      border,
      outputDir
    })

    const caption =
      `🎮 *FAKE ML CARD*\n\n` +
      `👤 Username : ${username}\n` +
      `🏆 Rank : ${ranks[rank]}\n` +
      `🖼️ Border : ${border === 0 ? 'Default' : border}`

    await sendGeneratedCard(conn, m, result, caption, outputDir)

    await m.react('✅')
  } catch (e) {
    console.error('[FAKEML ERROR]', e)
    await m.react('❌').catch(() => {})
    return m.reply(`Gagal membuat Fake ML Card.\n\nError: ${e.message || String(e)}`)
  } finally {
    if (outputDir) {
      await fs.promises.rm(outputDir, { recursive: true, force: true }).catch(error => {
        console.warn('[FAKEML CLEANUP]', error.message)
      })
    }
  }
}

handler.help = ['fakeml <nama>|<rank>|<border>']
handler.tags = ['maker']
handler.command = /^(fakeml|mlcard|fakecard)$/i
handler.register = true

export default handler