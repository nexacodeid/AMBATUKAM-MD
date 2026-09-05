/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = {}

  user.subscriber = Number(user.subscriber) || 0
  user.like = Number(user.like) || 0
  user.liketotal = Number(user.liketotal) || 0
  user.name = user.name || conn.getName(m.sender)
  user.silverplaybutton = Number(user.silverplaybutton) || 0
  user.goldplaybutton = Number(user.goldplaybutton) || 0
  user.diamondplaybutton = Number(user.diamondplaybutton) || 0

  const hasChannel = !!user.nameyt && user.nameyt !== 'Belum Membuat Channel'
  const channelName = hasChannel ? user.nameyt : 'Belum Membuat Channel'

  let subs = user.subscriber.toLocaleString('id-ID')
  let like = user.liketotal.toLocaleString('id-ID')
  let mentionedJid = [m.sender]

  let stt = `*🎧 YOUTUBE STUDIO 🎧*\n\n*• 👤 Pemilik:* @${m.sender.replace(/@.+/, '')}\n*• 🏷️ Nama:* ${user.name}\n*• 🌐 Nama Channel:* ${channelName}\n*• 👥 Subscribers:* ${subs}\n*• 👍🏻 Total like:* ${like}\n\n*• ⬜ Silver play button:* ${user.silverplaybutton === 0 ? 'Tidak Punya' : '✅'}\n*• 🟨 Gold play button:* ${user.goldplaybutton === 0 ? 'Tidak Punya' : '✅'}\n*• 💎 Diamond play button:* ${user.diamondplaybutton === 0 ? 'Tidak Punya' : '✅'}\n▬▭▬▭▬▭▬▭▬▭▬▭▬▭▬▭`

  conn.reply(m.chat, stt, m, {
    contextInfo: { mentionedJid },
  })
}

handler.tags = ['game', 'rpg']
handler.help = ['akunyt']
handler.command = /^(akunyt)$/i
handler.register = true

export default handler
