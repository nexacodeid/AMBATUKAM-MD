/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { text }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = {}

  let nama = (text || '').trim()

  if (!nama) {
    return m.reply(`❓ Mau buat akun YouTube dengan nama apa?\n\n*Contoh:* .createyt Zall Ackerman`)
  }

  if (nama.length > 20) {
    return m.reply('❌ Nama terlalu panjang, maksimal 20 karakter.')
  }

  // Jangan anggap placeholder sebagai akun asli
  if (user.nameyt && user.nameyt !== 'Belum Membuat Channel') {
    return m.reply(`❎ Kamu sudah memiliki akun YouTube dengan nama *${user.nameyt}*.`)
  }

  user.nameyt = nama
  user.subscriber = Number(user.subscriber) || 2
  user.like = Number(user.like) || 0
  user.liketotal = Number(user.liketotal) || 0
  user.lastlive = Number(user.lastlive) || 0
  user.silverplaybutton = Number(user.silverplaybutton) || 0
  user.goldplaybutton = Number(user.goldplaybutton) || 0
  user.diamondplaybutton = Number(user.diamondplaybutton) || 0

  m.reply(`✅ *Sukses membuat akun YouTube!*\n\n*Nama YT:* ${user.nameyt}\n*Subscriber:* ${user.subscriber}`)
}

handler.help = ['createyt <nama>']
handler.tags = ['rpg', 'game']
handler.command = /^(createyt|buatyt)$/i
handler.register = true

export default handler
