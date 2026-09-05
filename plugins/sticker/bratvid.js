let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    await m.react('❓')
    return m.reply(`Masukkan teks!\nContoh: *${usedPrefix + command} Hello world!*`)
  }

  await m.react('⏳')

  try {
    let url = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isAnimated=true&delay=500`
    
    await conn.sendSticker(m.chat, url, m)
    
    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    m.reply(`Terjadi kesalahan: ${e.message}`)
  }
}

handler.help = ['bratvid']
handler.tags = ['maker', 'sticker']
handler.command = /^(bratvid)$/i
handler.limit = true
handler.register = true

export default handler