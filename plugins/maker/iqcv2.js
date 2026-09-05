let handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {

  if (!text) {
    return m.reply(`
❌ Format salah

Contoh:
${usedPrefix + command} oi
`.trim())
  }

  const imageUrl = global.API('theresav', '/canvas/iqc/v2', { text }, 'apikey')

  await conn.sendMessage(
    m.chat,
    {
      image: {
        url: imageUrl
      },
      caption: `
✨ IQC CANVAS V2

📝 Text:
${text}
`.trim()
    },
    {
      quoted: m
    }
  )
}

handler.help = ['iqcv2']
handler.tags = ['maker']
handler.command = /^(iqcv2)$/i
handler.register = true

export default handler