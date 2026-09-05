/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Feature : Stable Diffusion
 *┃ 🔹 Command : .sd
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const api = {
  xterm: {
    url: 'https://api.termai.cc',
    key: 'raizell'
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function stablediffusion(body) {
  let tryng = 0
  let result = {
    feature: 'stablediffusion',
    status: 'failed',
    details: null
  }

  try {
    let aiResponse = await fetch(
      `${api.xterm.url}/api/text2img/stablediffusion/createTask?key=${api.xterm.key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )

    if (!aiResponse.ok) {
      throw new Error(`HTTP error! status: ${aiResponse.status}`)
    }

    let contentType = aiResponse.headers.get('content-type')

    if (!contentType || !contentType.includes('application/json')) {
      let text = await aiResponse.text()
      throw new Error(`Expected JSON, but got: ${text}`)
    }

    let ai = await aiResponse.json()

    if (!ai.status) {
      result.details = ai
      return result
    }

    while (tryng < 50) {
      tryng += 1

      let sResponse = await fetch(
        `${api.xterm.url}/api/text2img/stablediffusion/taskStatus?id=${ai.id}`
      )

      if (!sResponse.ok) {
        throw new Error(`HTTP error! status: ${sResponse.status}`)
      }

      let sContentType = sResponse.headers.get('content-type')

      if (!sContentType || !sContentType.includes('application/json')) {
        let text = await sResponse.text()
        throw new Error(`Expected JSON, but got: ${text}`)
      }

      let s = await sResponse.json()

      if (s.taskStatus === 2) {
        result.status = 'success'
        result.details = s
        return result
      }

      if (s.taskStatus === 3) {
        result.details = 'Error occurred'
        return result
      }

      await sleep(2000)
    }

    result.details = 'Timeout: proses terlalu lama'
  } catch (error) {
    result.details = error.message
  }

  return result
}

function pickImageUrl(details) {
  return (
    details?.result?.url ||
    details?.result?.image ||
    details?.result?.images?.[0] ||
    details?.images?.[0] ||
    details?.image ||
    details?.url ||
    null
  )
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return m.reply(`Contoh:

*${usedPrefix + command} beautiful anime girl, cyberpunk city*

Custom aspect ratio:
*${usedPrefix + command} 16:9 | beautiful anime girl, cyberpunk city*`)
    }

    let aspect_ratio = '1:1'
    let prompt = text.trim()

    if (text.includes('|')) {
      let parts = text.split('|')
      aspect_ratio = parts[0].trim() || '1:1'
      prompt = parts.slice(1).join('|').trim()
    }

    if (!prompt) return m.reply('Prompt tidak boleh kosong.')

    await m.reply('⏳ Sedang membuat gambar Stable Diffusion...')

    let body = {
      checkpoint: 'AWPainting_v1.3',
      prompt,
      negativePrompt: '',
      aspect_ratio,
      lora: [
        {
          model: 'Realistic yuzu high heel_unreal feel',
          weight: 0.8
        }
      ],
      sampling: 'DPM++ 2M Karras',
      samplingSteps: 20,
      cfgScale: 7
    }

    let result = await stablediffusion(body)

    if (result.status !== 'success') {
      throw new Error(
        typeof result.details === 'string'
          ? result.details
          : JSON.stringify(result.details, null, 2)
      )
    }

    let imageUrl = pickImageUrl(result.details)

    if (!imageUrl) {
      throw new Error('URL gambar hasil tidak ditemukan.')
    }

    await conn.sendMessage(
      m.chat,
      {
        image: { url: imageUrl },
        caption:
`✅ *Stable Diffusion Success*

*Prompt:* ${prompt}
*Aspect Ratio:* ${aspect_ratio}`
      },
      { quoted: m }
    )
  } catch (e) {
    console.error(e)

    m.reply(`❌ Error

${e.message || e}`)
  }
}

handler.help = ['sd <prompt>']
handler.tags = ['ai']
handler.command = /^(sd|stablediffusion|txt2img)$/i
handler.limit = true
handler.register = true

export default handler