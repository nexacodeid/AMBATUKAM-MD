import {
  unlinkSync,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync
} from 'fs'

import { join } from 'path'

import { exec } from 'child_process'

const handler = async (
  m,
  {
    conn,
    args,
    usedPrefix,
    command
  }
) => {

  try {

    const q = m.quoted
      ? m.quoted
      : m

    const mime =
      q.msg?.mimetype ||
      q.mimetype ||
      ''

    if (!/audio/.test(mime)) {

      return m.reply(
`Balas audio/vn dengan caption:

${usedPrefix + command} 00:00:30 00:00:30

Format:
jam:menit:detik`
      )
    }

    if (!args[0] || !args[1]) {

      return m.reply(
`Example:

${usedPrefix + command} 00:00:30 00:00:30

Argumen:
1. Start time
2. Duration`
      )
    }

    const tmpDir = join(
      process.cwd(),
      'tmp'
    )

    if (!existsSync(tmpDir)) {

      mkdirSync(tmpDir, {
        recursive: true
      })
    }

    const inputPath = join(
      tmpDir,
      getRandom('.mp3')
    )

    const outputPath = join(
      tmpDir,
      getRandom('.mp3')
    )

    const media = await q.download()

    writeFileSync(inputPath, media)

    m.react('⏳')

    exec(
      `ffmpeg -y -ss ${args[0]} -i "${inputPath}" -t ${args[1]} -c copy "${outputPath}"`,
      async (err) => {

        try {

          try {
            unlinkSync(inputPath)
          } catch {}

          if (err) {

            console.log(err)

            return m.reply(
              '❌ Gagal memotong audio.'
            )
          }

          if (!existsSync(outputPath)) {

            return m.reply(
              '❌ File output tidak ditemukan.'
            )
          }

          const buff =
            readFileSync(outputPath)

          await conn.sendMessage(
            m.chat,
            {
              audio: buff,
              mimetype: 'audio/mpeg',
              ptt: false
            },
            {
              quoted: m
            }
          )

          m.react('✅')

          try {
            unlinkSync(outputPath)
          } catch {}

        } catch (e) {

          console.log(e)

          m.reply(
            '❌ Error processing file.'
          )
        }
      }
    )

  } catch (e) {

    console.log(e)

    m.reply(
      '❌ Terjadi kesalahan.'
    )
  }
}

handler.help = [
  'cutaudio',
  'cutmp3',
  'potongaudio',
  'potongmp3'
]

handler.tags = ['tools']

handler.command = /^(potong(audio|mp3)|cut(audio|mp3))$/i
handler.register = true

export default handler

function getRandom(ext) {

  return `${Math.floor(
    Math.random() * 100000
  )}${ext}`
}