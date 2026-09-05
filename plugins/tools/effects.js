import {
  unlinkSync,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync
} from 'fs'

import { join } from 'path'

import { exec } from 'child_process'

let handler = async (
  m,
  {
    conn,
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
      q.mediaType ||
      m.msg?.mimetype ||
      m.mimetype ||
      ''

    const effects = {
      bass: '-af equalizer=f=94:width_type=o:width=2:g=18',
      blown: '-af acrusher=.1:1:64:0:log',
      deep: '-af atempo=4/4,asetrate=44500*2/3',
      earrape: '-af volume=12',
      fast: '-filter:a "atempo=1.63,asetrate=44100"',
      fat: '-filter:a "atempo=1.6,asetrate=22100"',
      nightcore: '-filter:a atempo=1.06,asetrate=44100*1.25',
      reverse: '-filter_complex "areverse"',
      robot: '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"',
      slow: '-filter:a "atempo=0.8,asetrate=44100"',
      smooth: '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"',
      tupai: '-filter:a "atempo=0.5,asetrate=65100"',
      audio8d: '-af apulsator=hz=0.125:amount=1',
      echo: '-af aecho=0.8:0.9:1000:0.3',
      distortion: '-af "acompressor=threshold=0.1:ratio=20:attack=1:release=10,acrusher=level_in=8:level_out=18:bits=8:mode=log:aa=1"',
      pitch: '-af "reverb=80:100:100:100:0:0"',
      reverb: '-af "aecho=0.8:0.9:1000:0.3,aecho=0.8:0.9:500:0.5,aecho=0.8:0.9:250:0.7"',
      flanger: '-af "asetrate=48000*1.5,atempo=1.5,asetrate=48000,equalizer=f=8000:width_type=h:width=50:g=6,apulsator=hz=0.125:amount=1"',
      apulsator: '-af apulsator=hz=0.125',
      tremolo: '-af tremolo=f=6.0:d=0.8',
      chorus: '-af chorus=0.7:0.9:55:0.4:0.25:2'
    }

    const set =
      effects[command.toLowerCase()]

    if (!set) {

      return m.reply(
`Reply audio/vn dengan command:

${usedPrefix + command}`
      )
    }

    if (
      !/audio/.test(mime) &&
      !/ptt/.test(mime)
    ) {

      return m.reply(
        'Reply audio/vn terlebih dahulu.'
      )
    }

    m.react('⏳')

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

    const media = await (
      q.download
        ? q.download()
        : m.download()
    )

    writeFileSync(inputPath, media)

    exec(
      `ffmpeg -y -i "${inputPath}" ${set} "${outputPath}"`,
      async (err) => {

        try {

          try {
            unlinkSync(inputPath)
          } catch {}

          if (err) {

            console.log(err)

            return m.reply(
              '❌ Error saat proses audio.'
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
  'bass',
  'blown',
  'deep',
  'earrape',
  'fast',
  'fat',
  'nightcore',
  'reverse',
  'robot',
  'slow',
  'smooth',
  'tupai',
  'audio8d',
  'echo',
  'distortion',
  'pitch',
  'reverb',
  'flanger',
  'apulsator',
  'tremolo',
  'chorus'
]

handler.tags = ['tools']

handler.command =
/^(bass|blown|deep|earrape|fast|fat|nightcore|reverse|robot|slow|smooth|tupai|audio8d|echo|distortion|pitch|reverb|flanger|apulsator|tremolo|chorus)$/i

handler.limit = true
handler.register = true

export default handler

function getRandom(ext) {

  return `${Math.floor(
    Math.random() * 100000
  )}${ext}`
}