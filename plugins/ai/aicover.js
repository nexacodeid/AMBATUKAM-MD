/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Feature : Voice Cover AI
 *┃ 🔹 Command : .voicecover
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import axios from 'axios'

const api = {
  xterm: {
    url: 'https://api.termai.cc',
    key: 'raizell'
  }
}

const voiceCover = (audioBuffer, model = 'Miku') => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${api.xterm.url}/api/audioProcessing/voice-covers`,
        audioBuffer,
        {
          params: {
            model,
            key: api.xterm.key
          },
          headers: {
            'Content-Type': 'application/octet-stream'
          },
          responseType: 'stream'
        }
      )

      response.data.on('data', chunk => {
        try {
          const eventString = chunk.toString()
          const eventData = eventString.match(/data: (.+)/)

          if (!eventData) return

          const data = JSON.parse(eventData[1])

          switch (data.status) {
            case 'searching':
            case 'separating':
            case 'starting':
            case 'processing':
            case 'mixing':
              console.log('Voice Cover:', data.status)
              break

            case 'success':
              response.data.destroy()
              resolve(data)
              break

            case 'failed':
              response.data.destroy()
              reject(data)
              break

            default:
              console.log('Unknown status:', data)
          }
        } catch (e) {
          response.data.destroy()
          reject(e)
        }
      })

      response.data.on('error', err => {
        reject(err)
      })
    } catch (e) {
      reject(e)
    }
  })
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    let model = args[0] || 'Miku'

    if (!/audio|video/.test(mime)) {
      return m.reply(`Reply audio/video dengan command:

*${usedPrefix + command} Miku*

Contoh model:
*Miku*
`)
    }

    await m.reply(`⏳ Sedang membuat voice cover dengan model *${model}*...`)

    let media = await q.download()

    if (!media) {
      return m.reply('❌ Gagal download media.')
    }

    let result = await voiceCover(media, model)

    let audioUrl =
      result?.result?.url ||
      result?.result?.audio ||
      result?.url ||
      result?.audio

    if (!audioUrl) {
      throw new Error('URL audio hasil tidak ditemukan.')
    }

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `voice-cover-${model}.mp3`
      },
      { quoted: m }
    )
  } catch (e) {
    console.error(e)

    m.reply(`❌ Error

${e.message || e}`)
  }
}

handler.help = ['voicecover <model>']
handler.tags = ['ai']
handler.command = /^(voicecover|coverai|aicover)$/i
handler.limit = true
handler.premium = true
handler.register = true
export default handler