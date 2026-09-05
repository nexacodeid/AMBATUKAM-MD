import axios from 'axios'
import FormData from 'form-data'

// Fungsi untuk mengunggah gambar menjadi URL (menggunakan tmpfiles.org)
async function uploadImage(buffer) {
  const form = new FormData()
  form.append('file', buffer, { filename: 'image.jpg' }) // tmpfiles menggunakan parameter 'file'
  
  try {
    const { data } = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
      headers: form.getHeaders()
    })
    
    // tmpfiles.org memberikan URL viewer, kita harus mengubahnya ke URL direct download
    // Contoh: https://tmpfiles.org/12345/image.jpg -> https://tmpfiles.org/dl/12345/image.jpg
    let url = data.data.url
    let directUrl = url.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
    
    return directUrl
  } catch (error) {
    throw new Error('Gagal mengunggah gambar ke server tmpFiles.')
  }
}

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''

  // Cek apakah ada media berupa gambar
  if (!mime.includes('image')) {
    await m.react('❓')
    return m.reply(`Kirim atau balas gambar dengan perintah *${usedPrefix + command}*`)
  }

  await m.react('⏳')

  try {
    // 1. Download gambar dari chat WhatsApp
    let media = await q.download()
    
    // 2. Upload gambar ke tmpfiles untuk mendapatkan URL publik
    let imageUrl = await uploadImage(media)

    // 3. Masukkan URL ke API Blur Wajah
    let apiUrl = `https://api-faa.my.id/faa/blurwajah?image=${encodeURIComponent(imageUrl)}`

    // 4. Kirim hasilnya kembali ke chat
    await conn.sendFile(m.chat, apiUrl, 'blurwajah.jpg', '✅ Wajah berhasil disensor/diblur!', m)
    
    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    m.reply(`❌ Terjadi kesalahan: ${e.message}`)
  }
}

handler.help = ['blurwajah']
handler.tags = ['tools', 'image']
handler.command = /^(blurwajah|blurface|sensorwajah)$/i
handler.limit = true
handler.register = true

export default handler