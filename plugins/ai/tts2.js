import fetch from 'node-fetch'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

const api = {
  xterm: {
    url: "https://api.termai.cc",
    key: "raizell"
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh penggunaan:\n${usedPrefix + command} hallo|bella|0|0.9`

  let [txt, voice, pitch, speed] = text.split('|')
  if (!txt) throw `Format salah. Contoh:\n${usedPrefix + command} hallo|bella|0|0.9`

  voice = (voice || 'bella').trim()
  pitch = (pitch || '0').trim()
  speed = (speed || '0.9').trim()

  await m.reply('*Mohon tunggu*, sedang menghasilkan audio...')

  try {
    let url = `${api.xterm.url}/api/text2speech/elevenlabs?text=${encodeURIComponent(txt.trim())}&voice=${voice}&pitch=${pitch}&speed=${speed}&key=${api.xterm.key}`
    
    let res = await fetch(url)
    if (!res.ok) throw `Server Error: ${res.status}`
    
    let contentType = res.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      let json = await res.json()
      throw json.msg || json.message || JSON.stringify(json)
    }

    let buffer = await res.buffer()
    
    let tmpFileMp3 = path.join(process.cwd(), `tmp_${Date.now()}.mp3`)
    let tmpFileOpus = path.join(process.cwd(), `tmp_${Date.now()}.opus`)
    
    await fs.promises.writeFile(tmpFileMp3, buffer)

    exec(`ffmpeg -i "${tmpFileMp3}" -c:a libopus -b:a 64k -vbr on "${tmpFileOpus}"`, async (err) => {
      if (err) {
        if (fs.existsSync(tmpFileMp3)) fs.unlinkSync(tmpFileMp3)
        if (fs.existsSync(tmpFileOpus)) fs.unlinkSync(tmpFileOpus)
        throw `FFmpeg Error: ${err.message}`
      }

      let audioBuffer = await fs.promises.readFile(tmpFileOpus)

      await conn.sendMessage(m.chat, { 
        audio: audioBuffer, 
        mimetype: 'audio/ogg; codecs=opus', 
        ptt: true 
      }, { quoted: m })

      if (fs.existsSync(tmpFileMp3)) fs.unlinkSync(tmpFileMp3)
      if (fs.existsSync(tmpFileOpus)) fs.unlinkSync(tmpFileOpus)
    })

  } catch (e) {
    console.error(e)
    throw `Error: ${e.message || e}`
  }
}

handler.help = ['elevenlabs <text|voice|pitch|speed>']
handler.tags = ['ai', 'tools']
handler.command = /^(elevenlabs|tts2)$/i
handler.limit = true
handler.register = true

export default handler