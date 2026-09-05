import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // Ambil pesan atau quoted message
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''

        if (!mime.startsWith('image/')) {
            throw `Kirim atau reply gambar dengan caption *${usedPrefix + command}*`
        }

        await m.reply('⏳ Sedang memproses...')

        // Download gambar sebagai buffer
        let img = await q.download?.() || q
        if (!img) throw 'Gagal mengunduh gambar'

        // Upload ke tmpfiles
        let url = await uploadToTmpfiles(img)

        // Panggil API blur wajah
        let api = `https://api-faa.my.id/faa/blurwajah?image=${encodeURIComponent(url)}`
        let res = await fetch(api)

        if (!res.ok) throw `API error: ${res.status}`

        const contentType = res.headers.get('content-type')
        if (!contentType?.includes('image')) {
            throw 'API Blur tidak mengembalikan gambar'
        }

        let buffer = await res.buffer()

        await conn.sendFile(m.chat, buffer, 'blur.jpg', '✅ Wajah berhasil di-blur', m)

    } catch (e) {
        console.error(e)
        throw `Error: ${e.message || e}`
    }
}

handler.help = ['blurwajah']
handler.tags = ['tools']
handler.command = /^(blurwajah|blurface)$/i
handler.limit = true
handler.register = true

export default handler

// ================== UPLOADER TMPFILES.ORG ==================
async function uploadToTmpfiles(buffer) {
    try {
        const { fileTypeFromBuffer } = await import('file-type')
        const type = await fileTypeFromBuffer(buffer)
        const ext = type?.ext || 'jpg'

        const form = new FormData()
        form.append('file', buffer, `image.${ext}`)

        const res = await fetch('https://tmpfiles.org/api/v1/upload', {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
        })

        if (!res.ok) throw new Error(`Upload failed: ${res.status}`)

        const json = await res.json()

        if (json.status !== 'success' || !json.data?.url) {
            throw new Error('Response tmpfiles tidak valid')
        }

        return json.data.url
        
    } catch (e) {
        console.error('Tmpfiles Upload Error:', e)
        throw `Gagal upload ke tmpfiles.org: ${e.message}`
    }
}