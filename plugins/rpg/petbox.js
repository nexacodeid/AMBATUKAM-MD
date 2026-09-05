/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Feature : RPG Petbox
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]

  if (!user.petbox) user.petbox = 0
  if (!user.kucing) user.kucing = 0
  if (!user.anjing) user.anjing = 0
  if (!user.kuda) user.kuda = 0
  if (!user.rubah) user.rubah = 0
  if (!user.wolf) user.wolf = 0
  if (!user.phonix) user.phonix = 0
  if (!user.naga) user.naga = 0
  if (!user.exp) user.exp = 0

  if (user.petbox < 1) {
    return m.reply(`📦 Petbox kamu kosong!\n\nDapatkan petbox dari fitur RPG seperti adventure, mission, atau shop.`)
  }

  user.petbox -= 1

  let pets = [
    {
      name: 'Kucing',
      key: 'kucing',
      emoji: '🐈',
      chance: 35,
      exp: 100
    },
    {
      name: 'Anjing',
      key: 'anjing',
      emoji: '🐕',
      chance: 25,
      exp: 150
    },
    {
      name: 'Kuda',
      key: 'kuda',
      emoji: '🐎',
      chance: 18,
      exp: 250
    },
    {
      name: 'Rubah',
      key: 'rubah',
      emoji: '🦊',
      chance: 12,
      exp: 400
    },
    {
      name: 'Wolf',
      key: 'wolf',
      emoji: '🐺',
      chance: 7,
      exp: 650
    },
    {
      name: 'Phonix',
      key: 'phonix',
      emoji: '🦅',
      chance: 2,
      exp: 1000
    },
    {
      name: 'Naga',
      key: 'naga',
      emoji: '🐉',
      chance: 1,
      exp: 1500
    }
  ]

  let random = Math.random() * 100
  let total = 0
  let reward = pets[0]

  for (let pet of pets) {
    total += pet.chance
    if (random <= total) {
      reward = pet
      break
    }
  }

  user[reward.key] += 1
  user.exp += reward.exp

  let text = `
╭━━━[ 🎁 PETBOX ]━━━╮
┃ Kamu membuka 1 Petbox!
┃
┃ ${reward.emoji} Pet didapat:
┃ ${reward.name}
┃
┃ ✨ Bonus Exp:
┃ +${reward.exp}
┃
┃ 📦 Sisa Petbox:
┃ ${user.petbox}
╰━━━━━━━━━━━━━━━╯
`.trim()

  m.reply(text)
}

handler.help = ['petbox']
handler.tags = ['rpg']
handler.command = /^(petbox|openpetbox|bukapetbox)$/i

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