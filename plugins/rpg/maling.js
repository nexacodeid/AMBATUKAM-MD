const timeout = 86400000 // 24 jam

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]

  if (!user.lastmaling) user.lastmaling = 0
  if (!user.money) user.money = 0
  if (!user.exp) user.exp = 0
  if (!user.kardus) user.kardus = 0

  let cooldown = timeout
  let time = user.lastmaling + cooldown

  if (Date.now() < time) {
    return m.reply(`📮 Anda sudah maling hari ini\nTunggu selama ⏲️ ${msToTime(time - Date.now())} lagi`)
  }

  let money = Math.floor(Math.random() * 30000)
  let exp = Math.floor(Math.random() * 999)
  let kardus = Math.floor(Math.random() * 1000)

  user.money += money
  user.exp += exp
  user.kardus += kardus
  user.lastmaling = Date.now()

  m.reply(`Selamat kamu mendapatkan:\n💰 +${money} Money\n📦 +${kardus} Kardus\n✨ +${exp} Exp`)

  setTimeout(() => {
    conn.reply(m.chat, `Yuk waktunya Maling lagi 👋`, m)
  }, timeout)
}

handler.help = ['maling']
handler.tags = ['rpg']
handler.command = /^(maling)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botAdmin = false
handler.fail = null
handler.limit = true
handler.exp = 0
handler.money = 0
handler.register = true

export default handler

function msToTime(duration) {
  let days = Math.floor(duration / (1000 * 60 * 60 * 24))
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let seconds = Math.floor((duration / 1000) % 60)

  return `${days} hari ${hours} jam ${minutes} menit ${seconds} detik`
}