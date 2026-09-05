/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, text }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = {}

  user.name = user.name || conn.getName(m.sender)
  user.subscriber = Number(user.subscriber) || 0
  user.like = Number(user.like) || 0
  user.liketotal = Number(user.liketotal) || 0
  user.money = Number(user.money) || 0
  user.bank = Number(user.bank) || 0
  user.lastlive = Number(user.lastlive) || 0
  user.silverplaybutton = Number(user.silverplaybutton) || 0
  user.goldplaybutton = Number(user.goldplaybutton) || 0
  user.diamondplaybutton = Number(user.diamondplaybutton) || 0

  const hasChannel = !!user.nameyt && user.nameyt !== 'Belum Membuat Channel'
  if (!hasChannel) {
    return conn.reply(m.chat, `Kamu tidak memiliki akun YouTube, silahkan buat terlebih dahulu,\n\nKetik: .createyt <nama channel>`, m)
  }

  let timie = Date.now() - user.lastlive
  if (timie < 600000) {
    return m.reply(`Hari ini kamu sudah live YouTube, silahkan beristirahat\n\nSelama ${clockString(600000 - timie)}`)
  }

  let judul = (text || '').trim()
  if (!judul) return conn.reply(m.chat, `Nama judul live-nya apa?\nContoh: .live game epep`, m)
  if (judul.length > 25) return conn.reply(m.chat, `Panjang judul maksimal 25 karakter`, m)

  let money = 0, subs = 0, like = 0, donate = 0
  if (user.subscriber > 10000000) {
    money = Math.floor(Math.random() * 5000000)
    subs = Math.floor(Math.random() * 10000)
    like = Math.floor(Math.random() * 600000)
    donate = Math.floor(Math.random() * 1500000)
    if (user.diamondplaybutton < 1) {
      user.diamondplaybutton = 1
      conn.reply(m.chat, `*Selamat ${user.name}*\nkamu mendapatkan Diamond Play Button atas kenaikan ${user.subscriber.toLocaleString('id-ID')} subscriber! 🎉💎`, m)
    }
  } else if (user.subscriber > 1000000) {
    money = Math.floor(Math.random() * 500000)
    subs = Math.floor(Math.random() * 6000)
    like = Math.floor(Math.random() * 300000)
    donate = Math.floor(Math.random() * 5500000)
    if (user.goldplaybutton < 1) {
      user.goldplaybutton = 1
      conn.reply(m.chat, `*Selamat ${user.name}*\nkamu mendapatkan Gold Play Button atas kenaikan ${user.subscriber.toLocaleString('id-ID')} subscriber! 🎉🥇`, m)
    }
  } else if (user.subscriber > 500000) {
    money = Math.floor(Math.random() * 230000)
    subs = Math.floor(Math.random() * 2000)
    like = Math.floor(Math.random() * 5000)
    donate = Math.floor(Math.random() * 250000)
  } else if (user.subscriber > 100000) {
    money = Math.floor(Math.random() * 150000)
    subs = Math.floor(Math.random() * 1000)
    like = Math.floor(Math.random() * 30000)
    donate = Math.floor(Math.random() * 150000)
    if (user.silverplaybutton < 1) {
      user.silverplaybutton = 1
      conn.reply(m.chat, `*Selamat ${user.name}*\nkamu mendapatkan Silver Play Button atas kenaikan ${user.subscriber.toLocaleString('id-ID')} subscriber! 🎉🥈`, m)
    }
  } else if (user.subscriber > 50000) {
    money = Math.floor(Math.random() * 80000)
    subs = Math.floor(Math.random() * 500)
    like = Math.floor(Math.random() * 3000)
    donate = Math.floor(Math.random() * 90000)
  } else if (user.subscriber > 10000) {
    money = Math.floor(Math.random() * 60000)
    subs = Math.floor(Math.random() * 200)
    like = Math.floor(Math.random() * 2000)
    donate = Math.floor(Math.random() * 70000)
  } else if (user.subscriber > 1000) {
    money = Math.floor(Math.random() * 30000)
    subs = Math.floor(Math.random() * 130)
    like = Math.floor(Math.random() * 1000)
    donate = Math.floor(Math.random() * 45000)
  } else if (user.subscriber > 100) {
    money = Math.floor(Math.random() * 15000)
    subs = Math.floor(Math.random() * 90)
    like = Math.floor(Math.random() * 500)
    donate = Math.floor(Math.random() * 25000)
  } else {
    money = Math.floor(Math.random() * 5000)
    subs = Math.floor(Math.random() * 50)
    like = Math.floor(Math.random() * 100)
    donate = Math.floor(Math.random() * 15000)
  }

  user.money += money
  user.subscriber += subs
  user.like += like
  user.liketotal += like
  user.bank += donate
  user.lastlive = Date.now()

  let mentionedJid = [m.sender]
  let str = `[ 🔴 *LIVE YOUTUBE* ]\n\n*Hasil Dari Streaming*\n👤 *Streamer:* @${m.sender.replace(/@.+/, '')}\n🌐 *Channel:* ${user.nameyt}\n📹 *Judul Live:* ${judul}\n💸 *Money:* +${money.toLocaleString('id-ID')}\n💳 *Donasi:* +${donate.toLocaleString('id-ID')}\n👥 *New Subscriber:* +${subs.toLocaleString('id-ID')}\n👍🏻 *New Like:* +${like.toLocaleString('id-ID')}\n\n📊 *Total Like:* ${user.liketotal.toLocaleString('id-ID')}\n📈 *Total Subscriber:* ${user.subscriber.toLocaleString('id-ID')}\n▬▭▬▭▬▭▬▭▬▭▬▭\n\nCek akun YouTubemu\nketik .akunyt`

  conn.reply(m.chat, str, m, { contextInfo: { mentionedJid } })

  setTimeout(() => {
    conn.reply(m.chat, `Heii @${m.sender.replace(/@.+/, '')}👋🏻, Subscribersmu menunggumu, ayo live kembali.`, m, {
      contextInfo: { mentionedJid: [m.sender] }
    })
  }, 600000)
}

handler.tags = ['rpg', 'game']
handler.help = ['live <judul>', 'streaming <judul>']
handler.command = /^(live|streaming)$/i
handler.register = true
handler.group = true

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '00' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '00' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '00' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(' : ')
}
