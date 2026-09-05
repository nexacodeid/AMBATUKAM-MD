import { Button } from '../../lib/messagebutton.js'


let handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {

  let nickname = args[0]
  let versi = Number(args[1]) || 1

  if (!nickname) {
    return m.reply(`
❌ Format salah

Contoh:
${usedPrefix + command} ${global.getOwnerName?.() || global.ownerName || 'nickname'} 1
`.trim())
  }

  if (versi < 1) versi = 1
  if (versi > 10) versi = 10

  const imageUrl = global.API('theresav', '/canvas/lobyff', { nickname, versi }, 'apikey')

  const btn = new Button(conn)

    .setBody(`
🎮 FREE FIRE LOBBY

👤 Nickname : ${nickname}
🖼️ Versi : ${versi}

Gunakan tombol di bawah
untuk mengganti versi lobby.
`.trim())

    .setFooter(`Version ${versi}`)
    .setImage(imageUrl)

  // LIST VERSION
  btn
    .addSelection('☷ Pilih Versi')
    .makeSections('LIST VERSION')

  for (let i = 1; i <= 10; i++) {

    btn.makeRow(
      '',
      `Versi ${i}`,
      `Lobby Free Fire versi ${i}`,
      `${usedPrefix + command} ${nickname} ${i}`
    )
  }

  // QUICK BUTTON
  if (versi > 1) {
    btn.addReply(
      '⬅️ Prev',
      `${usedPrefix + command} ${nickname} ${versi - 1}`
    )
  }

  if (versi < 10) {
    btn.addReply(
      '➡️ Next',
      `${usedPrefix + command} ${nickname} ${versi + 1}`
    )
  }

  btn.addReply(
    '🎲 Random',
    `${usedPrefix + command} ${nickname} ${Math.floor(Math.random() * 10) + 1}`
  )

  return await btn.send(m.chat, {
    quoted: m
  })
}

handler.help = ['lobyff']
handler.tags = ['maker']
handler.command = /^(lobyff|fflobby)$/i
handler.register = true

export default handler