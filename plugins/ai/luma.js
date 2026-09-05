/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Feature : Luma AI Video
 *┃ 🔹 Command : .luma
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import axios from 'axios'

const api = {
  xterm: {
    url: 'https://api.termai.cc',
    key: 'raizell'
  }
}

const Luma = (image) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${api.xterm.url}/api/img2video/luma?key=${api.xterm.key}`,
        image,
        {
          headers: {
            'Content-Type': 'application/octet-stream'
          },
          responseType: 'stream'
        }
      )

      response.data.on('data', (chunk) => {
        try {
          const eventString = chunk.toString()

          const eventData = eventString.match(/data: (.+)/)

          if (eventData && eventData[1]) {
            const data = JSON.parse(eventData[1])

            switch (data.status) {
              case 'pending':
              case 'processing':
                console.log('Processing:', data.status)
                break

              case 'failed':
                response.data.destroy()
                reject(data)
                break

              case 'completed':
                response.data.destroy()
                resolve(data)
                break

              default:
                console.log('Unknown status:', data)
            }
          }
        } catch (e) {
          console.error('Chunk Error:', e.message)
          response.data.destroy()
          reject(e)
        }
      })

      response.data.on('error', (err) => {
        console.error('Stream Error:', err.message)
        reject(err)
      })

    } catch (error) {
      console.error('Axios Error:', error.message)
      reject(error)
    }
  })
}

let handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image\/(jpe?g|png)/.test(mime)) {
      return m.reply(`Reply/Kirim gambar dengan caption *.luma*`)
    }

    await m.reply('⏳ Sedang membuat video AI...')

    let media = await q.download()

    let result = await Luma(media)

    if (!result?.video?.url) {
      throw new Error('Video gagal dibuat')
    }

    await conn.sendMessage(
      m.chat,
      {
        video: {
          url: result.video.url
        },
        caption: `✅ *Luma AI Success*`
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)

    m.reply(`❌ Error\n\n${e.message || e}`)
  }
}

handler.help = ['luma']
handler.tags = ['ai']
handler.command = /^(luma)$/i
handler.limit = true
handler.premium = true
handler.register = true
export default handler