import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    await m.react('❓')
    return m.reply(`Masukkan judul lagu yang ingin dicari!\nContoh: *${usedPrefix + command} last child diary depresi*`)
  }

  await m.react('⏳')

  try {
    // 1. Hit API SoundCloud Play
    let apiUrl = `https://api-faa.my.id/faa/soundcloud-play?query=${encodeURIComponent(text)}`
    let { data } = await axios.get(apiUrl)

    // 2. Cek apakah hasil valid
    if (!data.status || !data.result) {
      throw new Error('Lagu tidak ditemukan atau API sedang bermasalah.')
    }

    let res = data.result

    // 3. Konversi milidetik ke menit:detik untuk durasi lagu
    let totalSeconds = Math.floor(res.duration / 1000)
    let minutes = Math.floor(totalSeconds / 60)
    let seconds = (totalSeconds % 60).toString().padStart(2, '0')
    let durationFormatted = `${minutes}:${seconds}`

    // 4. Susun pesan caption
    let info = `☁️ *S O U N D C L O U D   P L A Y*\n\n`
    info += `🎵 *Judul:* ${res.title}\n`
    info += `👤 *User:* ${res.user}\n`
    info += `⏱️ *Durasi:* ${durationFormatted}\n`
    info += `🔗 *Source:* ${res.source_url}\n\n`
    info += `⏳ _Sedang mengirim audio, mohon tunggu sebentar..._`

    // 5. Kirim Thumbnail & Info Detail terlebih dahulu
    await conn.sendFile(m.chat, res.thumbnail, 'thumb.jpg', info, m)

    // 6. Kirim file Audio (MP3)
    await conn.sendMessage(m.chat, { 
      audio: { url: res.download_url }, 
      mimetype: 'audio/mpeg',
      fileName: `${res.title}.mp3`
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    await m.react('❌')
    m.reply(`❌ Terjadi kesalahan: ${e.message}`)
  }
}

handler.help = ['scplay']
handler.tags = ['downloader']
handler.command = /^(scplay|soundcloudplay|play)$/i
handler.limit = true
handler.register = true

export default handler