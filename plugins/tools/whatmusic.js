/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Feature : What Music
 *┃ 🔹 Command : .whatmusic
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const api = {
  xterm: {
    url: 'https://api.termai.cc',
    key: 'raizell'
  }
}

async function whatmusic(buffer) {
  let response = await fetch(
    `${api.xterm.url}/api/audioProcessing/whatmusic?key=${api.xterm.key}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: buffer
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}`)
  }

  let json = await response.json()
  return json
}

function pick(obj, paths) {
  for (let path of paths) {
    let value = path.split('.').reduce((acc, key) => acc?.[key], obj)
    if (value !== undefined && value !== null && value !== '') return value
  }
  return '-'
}

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mimetype || ''

    if (!/audio|video/.test(mime)) {
      return m.reply(`Reply audio/video dengan command:

*${usedPrefix + command}*`)
    }

    await m.react('⏳')

    let media = await q.download()

    if (!media) {
      throw new Error('Gagal download media.')
    }

    let result = await whatmusic(media)

    let title = pick(result, [
      'title',
      'data.title',
      'result.title',
      'metadata.music.0.title'
    ])

    let artist = pick(result, [
      'artist',
      'data.artist',
      'result.artist',
      'metadata.music.0.artists.0.name'
    ])

    let album = pick(result, [
      'album',
      'data.album',
      'result.album',
      'metadata.music.0.album.name'
    ])

    let releaseDate = pick(result, [
      'release_date',
      'data.release_date',
      'result.release_date',
      'metadata.music.0.release_date'
    ])

    let label = pick(result, [
      'label',
      'data.label',
      'result.label',
      'metadata.music.0.label'
    ])

    let text =
`*🎵 WHAT MUSIC RESULT*

*• Title:* ${title}
*• Artist:* ${artist}
*• Album:* ${album}
*• Release:* ${releaseDate}
*• Label:* ${label}`

    await m.reply(text)

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply(`❌ Error

${e.message || e}`)
  }
}

handler.help = ['whatmusic']
handler.tags = ['tools']
handler.command = /^(whatmusic|whatmusik|findmusic|carilagu)$/i
handler.limit = true
handler.register = true

export default handler