import yts from 'yt-search'

import { errorMessage, scraper } from '../../lib/zenaveline-adapter.js'

function safeName(value = 'audio') {
  return String(value).replace(/[\\/:*?"<>|]/g, '_').slice(0, 100) || 'audio'
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const query = String(text || '').trim()
  if (!query) return m.reply(`Contoh:\n${usedPrefix + command} surat cinta untuk starla`)

  await m.react?.('⏳').catch(() => {})

  try {
    const search = await yts(query)
    const video = search?.videos?.[0]
    if (!video?.url) throw new Error('Lagu atau video tidak ditemukan di YouTube.')

    const client = new scraper.savetube()
    const download = await client.download(video.url, 'mp3')
    if (!download?.status || !download?.dl) {
      throw new Error(download?.msg || download?.error || 'Scraper YouTube tidak mengembalikan audio.')
    }

    const title = download.title || video.title
    const caption = [
      '*YouTube Play Music*',
      `🎵 ${title}`,
      `👤 ${video.author?.name || '-'}`,
      `⏱️ ${video.timestamp || download.duration || '-'}`,
      `👁️ ${Number(video.views || 0).toLocaleString('id-ID')}`,
      ''
    ].join('\n')

    if (video.thumbnail || download.thumb) {
      await conn.sendFile(m.chat, download.thumb || video.thumbnail, 'youtube.jpg', caption, m)
    } else {
      await m.reply(caption)
    }

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: download.dl },
        mimetype: 'audio/mpeg',
        fileName: `${safeName(title)}.mp3`
      },
      { quoted: m }
    )

    await m.react?.('✅').catch(() => {})
  } catch (error) {
    console.error('[PLAY SCRAPER]', error)
    await m.react?.('❌').catch(() => {})
    await m.reply(`❌ ${errorMessage(error)}`)
  }
}

handler.help = ['play <judul lagu/video>']
handler.tags = ['downloader']
handler.command = /^play$/i
handler.limit = true
handler.register = true

export default handler