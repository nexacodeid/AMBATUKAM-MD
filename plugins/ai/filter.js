import fetch from 'node-fetch'
import FormData from 'form-data'

const api = {
  xterm: {
    url: "https://api.termai.cc",
    key: "raizell"
  }
}

const models = [
  'anime2d', 'maid', '3dcartoon', 'disney', 'colorfull',
  'steam', 'anime2real', 'enlarger'
]

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (command === 'filters') {
    let list = models.map((v, i) => `*${i + 1}.* ${v}`).join('\n')
    return m.reply(`*List Filter Tersedia:*\n\n${list}\n\nContoh: *${usedPrefix}filter anime2d* [reply/kirim gambar]`)
  }

  if (!mime.startsWith('image/')) throw `Kirim/reply gambar dengan caption *${usedPrefix + command} <model>*\n\nKetik *${usedPrefix}filters* untuk lihat list model`

  let model = (args[0] || '').toLowerCase()
  if (!model) throw `Mau pake filter apa?\nContoh: *${usedPrefix + command} anime2d*\n\nKetik *${usedPrefix}filters* untuk lihat list`
  if (!models.includes(model)) throw `Model *${model}* tidak tersedia!\n\nKetik *${usedPrefix}filters* untuk lihat list model`

  await m.reply('*Mohon tunggu*, sedang memproses gambar...')

  try {
    let img = await q.download?.() || await conn.downloadMediaMessage(q)
    if (!img) throw 'Gagal mengunduh gambar dari WhatsApp.'

    if (typeof img.then === 'function' || img[Symbol.asyncIterator]) {
      let buffers = []
      for await (const chunk of img) buffers.push(chunk)
      img = Buffer.concat(buffers)
    }

    let url = await uploadImage(img)
    if (!url || !url.startsWith('http')) throw `Gagal mengupload gambar ke hosting. Response: ${url}`

    let result = await filterXterm(url, model, m)

    if (!result || result.status !== 3) throw result?.message || 'Gagal memproses gambar. Coba gambar lain!'

    let caption = `*Filter:* ${model}\n*Status:* Selesai`
    await conn.sendFile(m.chat, result.url, 'filter.jpg', caption, m)

  } catch (e) {
    console.error(e)
    throw `Error: ${e.message || e}`
  }
}

handler.help = ['filter <model>', 'filters']
handler.tags = ['ai', 'tools']
handler.command = /^(filters?)$/i
handler.limit = true
handler.register = true

export default handler

async function filterXterm(imageurl, model, m) {
  let tryng = 0
  let res = await fetch(`${api.xterm.url}/api/img2img/filters?action=${model}&url=${encodeURIComponent(imageurl)}&key=${api.xterm.key}`)
  let ai = await res.json()

  if (!ai.status) {
    throw ai.message || ai.msg || `API Error: ${JSON.stringify(ai)}`
  }

  await m.reply(`*ID:* ${ai.id}\n*Status:* Starting...\n\nTunggu 10-30 detik`)

  while (tryng < 50) {
    tryng++
    let s = await fetch(`${api.xterm.url}/api/img2img/filters/batchProgress?id=${ai.id}`)
      .then(res => res.json())

    if (s.status === 1) {
      console.log('Starting...')
    } else if (s.status === 2) {
      console.log('Processing...')
    } else if (s.status === 3) {
      return s
    } else if (s.status === 4) {
      throw 'Maaf terjadi kesalahan. Coba gunakan gambar lain!'
    }
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  throw 'Timeout! Server terlalu lama merespon'
}

async function uploadImage(buffer) {
  const { fileTypeFromBuffer } = await import('file-type')
  const type = await fileTypeFromBuffer(buffer)
  const ext = type?.ext || 'jpg'
  const mimeStr = type?.mime || 'image/jpeg'

  const form = new FormData()
  form.append('file', buffer, {
    filename: `file.${ext}`,
    contentType: mimeStr
  })

  const res = await fetch('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  })
  
  let json = await res.json()
  if (!json || !json.data || !json.data.url) {
    throw `Tmpfiles upload failed`
  }
  return json.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/')
}