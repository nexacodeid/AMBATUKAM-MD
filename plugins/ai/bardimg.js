import axios from "axios"
import FormData from "form-data"
import fs from "fs"
import path from "path"
import { tmpdir } from "os"

async function uploadToCatbox(buffer, ext = "jpg") {
  const filePath = path.join(tmpdir(), `bardimg-${Date.now()}.${ext}`)

  fs.writeFileSync(filePath, buffer)

  const form = new FormData()
  form.append("reqtype", "fileupload")
  form.append("fileToUpload", fs.createReadStream(filePath))

  const { data } = await axios.post(
    "https://catbox.moe/user/api.php",
    form,
    {
      headers: form.getHeaders()
    }
  )

  fs.unlinkSync(filePath)

  return data
}

const handler = async (m, { conn, text }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || ""

  if (!mime.startsWith("image/")) {
    throw "Reply atau kirim gambar dengan caption *.bardimg pertanyaan*"
  }

  if (!text) {
    throw "Masukkan pertanyaan.\n\nContoh:\n.bardimg gambar apa ini"
  }

  await conn.sendMessage(m.chat, {
    react: {
      text: "⏳",
      key: m.key
    }
  })

  try {
    const media = await q.download()

    const ext = mime.split("/")[1] || "jpg"

    const imageUrl = await uploadToCatbox(media, ext)

    const api = `https://api-faa.my.id/faa/bard-img?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(text)}`

    const { data } = await axios.get(api)

    let result = ""

    if (typeof data === "string") {
      result = data
    } else if (data.result) {
      result = data.result
    } else if (data.message) {
      result = data.message
    } else {
      result = JSON.stringify(data, null, 2)
    }

    await conn.reply(m.chat, result, m)

  } catch (e) {
    console.error(e)

    await conn.reply(
      m.chat,
      `❌ Terjadi error\n\n${e.message || e}`,
      m
    )
  }
}

handler.help = ["bardimg"]
handler.tags = ["ai"]
handler.command = /^(bardimg|imgbard|aigambar)$/i
handler.limit = true
handler.register = true

export default handler