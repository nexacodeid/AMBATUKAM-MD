import { AIRich } from '../../lib/messagebutton.js'

let handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  if (!text) {
    return m.reply(`Use example: ${usedPrefix}${command} Theresa apocalypse`)
  }

  try {
    await m.react?.('⏳').catch(() => {})

    const url = global.API('theresav', '/search/pinterest', {
      query: text
    }, 'apikey')

    const res = await fetch(url)
    const data = await res.json()

    if (!data.status || !Array.isArray(data.result)) {
      await m.react?.('❌').catch(() => {})
      return m.reply('Failed to fetch results from the API.')
    }

    const results = data.result
      .filter(v => v.directLink)
      .slice(0, 10)

    if (!results.length) {
      await m.react?.('❌').catch(() => {})
      return m.reply('No valid images found.')
    }

    const posts = results.map((v, i) => ({
      title: `Pinterest #${i + 1}`,
      subtitle: text,
      username: 'Pinterest',
      profile_picture_url: 'https://i.pinimg.com/736x/21/f1/74/21f1748447e68916633a80b9c28ea6ad.jpg',
      thumbnail_url: v.directLink,
      post_caption: `Result #${i + 1}`,
      post_url: v.link || v.directLink,
      source_app: 'PINTEREST',
      footer_label: 'Open Image',
      is_carousel: true,
      orientation: 'PORTRAIT',
      post_type: 'PHOTO'
    }))

    try {
      await new AIRich(conn)
        .setTitle('Pinterest Search')
        .addText(
          `*Pinterest Result*\n\n` +
          `Query: ${text}\n` +
          `Total: ${results.length} gambar\n\n` +
          `Geser card untuk melihat hasil lainnya.`
        )
        .addPost(posts)
        .addSuggest([
          `${usedPrefix + command} anime icon`,
          `${usedPrefix + command} wallpaper hd`,
          `${usedPrefix + command} logo store`
        ])
        .send(m.chat, {
          quoted: m
        })

      await m.react?.('✅').catch(() => {})
      return
    } catch (e) {
      console.error('AIRICH POST PINTEREST ERROR:', e)
    }

    const album = results.map((v, i) => ({
      image: {
        url: v.directLink
      },
      caption: `Pinterest #${i + 1}\nLink: ${v.link || '-'}`
    }))

    await conn.sendAlbumMessage(m.chat, album, {
      quoted: m,
      delay: 700
    })

    await m.react?.('✅').catch(() => {})
  } catch (error) {
    console.error(error)
    await m.react?.('❌').catch(() => {})
    return m.reply(`An error occurred: ${error.message}`)
  }
}

handler.help = ['pinterest <query>', 'pins <query>']
handler.tags = ['search']
handler.command = /^(pinterest|pins)$/i
handler.description = 'Search Pinterest using AIRich carousel.'
handler.register = true

export default handler