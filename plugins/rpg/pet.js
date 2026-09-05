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
  const user = global.db.data.users[m.sender]
  const pets = {
    naga: { nama: '🐉 Naga', level: 'naga', exp: 'nagaexp', max: 100, perLevel: 10000 },
    kyubi: { nama: '🦊 Kyubi', level: 'kyubi', exp: 'kyubiexp', max: 100, perLevel: 10000 },
    centaur: { nama: '🦖 Centaur', level: 'centaur', exp: 'centaurexp', max: 100, perLevel: 10000 },
    phonix: { nama: '🕊️ Phonix', level: 'phonix', exp: 'phonixexp', max: 100, perLevel: 10000 },
    griffin: { nama: '🦅 Griffin', level: 'griffin', exp: 'griffinexp', max: 100, perLevel: 10000 },
    kuda: { nama: '🐎 Kuda', level: 'kuda', exp: 'horseexp', max: 100, perLevel: 100 },
    anjing: { nama: '🐶 Anjing', level: 'dog', exp: 'dogexp', max: 100, perLevel: 100 },
    rubah: { nama: '🦊 Rubah', level: 'rubah', exp: 'foxexp', max: 100, perLevel: 100 },
    kucing: { nama: '🐱 Kucing', level: 'kucing', exp: 'kucingexp', max: 100, perLevel: 1000 },
    lion: { nama: '🦁 Lion', level: 'lion', exp: 'lionexp', max: 100, perLevel: 100 },
    wolf: { nama: '🐺 Wolf', level: 'wolf', exp: 'wolfexp', max: 100, perLevel: 10000 }
  }

  let str = `🐾 *Status Pet Kamu* 🐾\n\n`
  let adaPet = false

  for (let key in pets) {
    let pet = pets[key]
    let lvl = user[pet.level] || 0
    let exp = user[pet.exp] || 0
    if (lvl === 0) continue
    adaPet = true
    let naik = lvl >= pet.max ? '✅ MAX' : `${exp}/${lvl * pet.perLevel}`
    str += `• ${pet.nama}\n  Level: ${lvl} / ${pet.max}\n  EXP: ${naik}\n\n`
  }

  if (!adaPet) str += `Kamu belum memiliki pet apa pun.\nGunakan *.petbox* untuk membuka Pet Box.`

  await conn.reply(m.chat, str.trim(), m)
}

handler.help = ['pet']
handler.tags = ['rpg']
handler.command = /^pet$/i
handler.register = true
handler.group = true

export default handler

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */