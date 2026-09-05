import { tmpdir } from 'os'
import { join } from 'path'
import { writeFileSync, existsSync, unlinkSync } from 'fs'
import { spawn } from 'child_process'
import sharp from 'sharp'

function tmpFile(name, ext = '') {
  return join(tmpdir(), `${name}-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', args)
    let err = ''

    ff.stderr.on('data', data => {
      err += data.toString()
    })

    ff.on('error', reject)
    ff.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(err || `FFmpeg exited with code ${code}`))
    })
  })
}

async function webpToPng(buffer) {
  try {
    return await sharp(buffer, { animated: false }).png().toBuffer()
  } catch {
    const input = tmpFile('toimg-input', '.webp')
    const output = tmpFile('toimg-output', '.png')

    try {
      writeFileSync(input, buffer)
      await runFfmpeg(['-y', '-i', input, '-frames:v', '1', output])

      if (!existsSync(output)) throw new Error('Output gambar tidak dibuat.')
      return await sharp(output).png().toBuffer()
    } finally {
      for (const file of [input, output]) {
        try {
          if (file && existsSync(file)) unlinkSync(file)
        } catch {}
      }
    }
  }
}

let handler = async (m, { conn, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || q.mimetype || ''

  if (!/image|webp/.test(mime)) {
    return m.reply(
      `Kirim atau reply sticker/gambar dengan caption:\n` +
      `${usedPrefix + command}`
    )
  }

  try {
    await m.react?.('⏳').catch(() => {})

    const media = await q.download()
    if (!media) throw new Error('Media gagal diunduh.')

    let image

    if (/webp/.test(mime)) {
      image = await webpToPng(media)
    } else {
      image = await sharp(media).png().toBuffer()
    }

    await conn.sendMessage(
      m.chat,
      {
        image,
        caption: '✅ Berhasil diubah menjadi gambar.'
      },
      { quoted: m }
    )

    await m.react?.('✅').catch(() => {})
  } catch (e) {
    console.error('TOIMG ERROR:', e)
    await m.react?.('❌').catch(() => {})
    return m.reply(`Gagal mengubah ke gambar.\n\n${e.message || e}`)
  }
}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = /^(toimg|toimage)$/i
handler.register = true

export default handler