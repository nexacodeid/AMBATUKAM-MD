let timeout = 600000 // 10 menit

let handler = async (m, { conn, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]

  if (!user.lastadventure) user.lastadventure = 0
  if (!user.health) user.health = 100
  if (!user.money) user.money = 0
  if (!user.exp) user.exp = 0
  if (!user.limit) user.limit = 0
  if (!user.petbox) user.petbox = 0
  if (!user.sampah) user.sampah = 0
  if (!user.potion) user.potion = 0
  if (!user.kayu) user.kayu = 0
  if (!user.batu) user.batu = 0
  if (!user.iron) user.iron = 0
  if (!user.emerald) user.emerald = 0
  if (!user.diamond) user.diamond = 0

  let time = user.lastadventure + timeout

  if (Date.now() < time) {
    return m.reply(`⏳ Kamu sudah adventure.\nTunggu ${msToTime(time - Date.now())} lagi.`)
  }

  if (user.health < 30) {
    return m.reply(`❤️ Health kamu terlalu rendah untuk adventure.\nMinimal health: 30\n\nGunakan ${usedPrefix}heal atau beli potion dulu.`)
  }

  let money = pickRandom(1000, 15000)
  let exp = pickRandom(500, 5000)
  let sampah = pickRandom(1, 20)
  let kayu = pickRandom(1, 15)
  let batu = pickRandom(1, 12)
  let iron = pickRandom(0, 6)
  let emerald = pickRandom(0, 3)
  let diamond = pickRandom(0, 2)
  let potion = Math.random() < 0.25 ? 1 : 0
  let petbox = Math.random() < 0.08 ? 1 : 0
  let limit = Math.random() < 0.15 ? 1 : 0
  let damage = pickRandom(10, 35)

  user.money += money
  user.exp += exp
  user.sampah += sampah
  user.kayu += kayu
  user.batu += batu
  user.iron += iron
  user.emerald += emerald
  user.diamond += diamond
  user.potion += potion
  user.petbox += petbox
  user.limit += limit
  user.health -= damage
  user.lastadventure = Date.now()

  if (user.health < 0) user.health = 0

  let lokasi = [
    'Hutan Gelap',
    'Gua Terlarang',
    'Pegunungan Es',
    'Reruntuhan Kuno',
    'Lembah Monster',
    'Pulau Misterius'
  ]

  let monster = [
    'Goblin',
    'Slime Raksasa',
    'Serigala Liar',
    'Skeleton',
    'Bandit',
    'Orc'
  ]

  let teks = `
╭━━━[ 🗺️ ADVENTURE ]━━━╮
┃ Lokasi : ${lokasi[Math.floor(Math.random() * lokasi.length)]}
┃ Musuh  : ${monster[Math.floor(Math.random() * monster.length)]}
┃
┃ 🎁 Hasil Adventure:
┃ 💰 Money  : +${money}
┃ ✨ Exp    : +${exp}
┃ 🗑️ Sampah : +${sampah}
┃ 🪵 Kayu   : +${kayu}
┃ 🪨 Batu   : +${batu}
┃ ⛓️ Iron   : +${iron}
┃ 🟩 Emerald: +${emerald}
┃ 💎 Diamond: +${diamond}
${potion ? `┃ 🧪 Potion : +${potion}\n` : ''}${petbox ? `┃ 📦 Petbox : +${petbox}\n` : ''}${limit ? `┃ 🎟️ Limit  : +${limit}\n` : ''}┃
┃ ❤️ Damage : -${damage}
┃ ❤️ Health : ${user.health}
╰━━━━━━━━━━━━━━━━━━╯
`.trim()

  m.reply(teks)
}

handler.help = ['adventure']
handler.tags = ['rpg']
handler.command = /^(adventure|adv|petualang|berpetualang)$/i

handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false
handler.fail = null
handler.limit = true
handler.register = true

export default handler

function pickRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function msToTime(duration) {
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let seconds = Math.floor((duration / 1000) % 60)

  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  return `${minutes} menit ${seconds} detik`
}