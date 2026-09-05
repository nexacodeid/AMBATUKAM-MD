/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { args, usedPrefix }) => {
  let type = (args[0] || '').toLowerCase()
  let user = global.db.data.users[m.sender]

  if (!user.emas) user.emas = 0

  const pets = {
    kucing: {
      nama: 'Kucing',
      emoji: '🐈',
      harga: 2,
      key: 'kucing',
      health: 100,
      max: 5,
      kategori: 'Normal'
    },
    anjing: {
      nama: 'Anjing',
      emoji: '🐕',
      harga: 2,
      key: 'anjing',
      health: 100,
      max: 5,
      kategori: 'Normal'
    },
    dog: {
      nama: 'Anjing',
      emoji: '🐕',
      harga: 2,
      key: 'anjing',
      health: 100,
      max: 5,
      kategori: 'Normal'
    },
    kuda: {
      nama: 'Kuda',
      emoji: '🐎',
      harga: 4,
      key: 'kuda',
      health: 150,
      max: 10,
      kategori: 'Normal'
    },
    rubah: {
      nama: 'Rubah',
      emoji: '🦊',
      harga: 6,
      key: 'rubah',
      health: 200,
      max: 10,
      kategori: 'Normal'
    },
    wolf: {
      nama: 'Serigala',
      emoji: '🐺',
      harga: 10,
      key: 'wolf',
      health: 300,
      max: 15,
      kategori: 'Special'
    },
    serigala: {
      nama: 'Serigala',
      emoji: '🐺',
      harga: 10,
      key: 'wolf',
      health: 300,
      max: 15,
      kategori: 'Special'
    },
    naga: {
      nama: 'Naga',
      emoji: '🐉',
      harga: 10,
      key: 'naga',
      health: 500,
      max: 20,
      kategori: 'Special'
    },
    kyubi: {
      nama: 'Kyubi',
      emoji: '🦊',
      harga: 10,
      key: 'kyubi',
      health: 500,
      max: 20,
      kategori: 'Special'
    },
    centaur: {
      nama: 'Centaur',
      emoji: '🦖',
      harga: 10,
      key: 'centaur',
      health: 500,
      max: 20,
      kategori: 'Special'
    },
    griffin: {
      nama: 'Griffin',
      emoji: '🦅',
      harga: 10,
      key: 'griffin',
      health: 400,
      max: 15,
      kategori: 'Special'
    },
    phonix: {
      nama: 'Phonix',
      emoji: '🕊️',
      harga: 10,
      key: 'phonix',
      health: 400,
      max: 15,
      kategori: 'Special'
    },
    phoenix: {
      nama: 'Phonix',
      emoji: '🕊️',
      harga: 10,
      key: 'phonix',
      health: 400,
      max: 15,
      kategori: 'Special'
    },
    robo: {
      nama: 'Robo',
      emoji: '🤖',
      harga: 10,
      key: 'robo',
      health: 350,
      max: 15,
      kategori: 'Special'
    },
    lion: {
      nama: 'Lion',
      emoji: '🦁',
      harga: 10,
      key: 'lion',
      health: 350,
      max: 15,
      kategori: 'Special'
    },
    rhinoceros: {
      nama: 'Rhinoceros',
      emoji: '🦏',
      harga: 10,
      key: 'rhinoceros',
      health: 350,
      max: 15,
      kategori: 'Special'
    },
    badak: {
      nama: 'Rhinoceros',
      emoji: '🦏',
      harga: 10,
      key: 'rhinoceros',
      health: 350,
      max: 15,
      kategori: 'Special'
    }
  }

  const pet = pets[type]

  let normal = Object.values(pets)
    .filter((v, i, arr) => v.kategori === 'Normal' && arr.findIndex(x => x.key === v.key) === i)
    .map(v => `${v.emoji} ${v.nama}: ${v.harga} 🪙`)
    .join('\n')

  let special = Object.values(pets)
    .filter((v, i, arr) => v.kategori === 'Special' && arr.findIndex(x => x.key === v.key) === i)
    .map(v => `${v.emoji} ${v.nama}: ${v.harga} 🪙`)
    .join('\n')

  let caption = `
*🐾 PET STORE 🐾*

*Normal*
${normal}

*Special*
${special}

*Cara Beli:*
Ketik: *${usedPrefix}petshop <nama_pet>*
Contoh: *${usedPrefix}petshop kucing*

*Emas Kamu:* ${user.emas} 🪙
`.trim()

  if (!type) return m.reply(caption)

  if (!pet) {
    return m.reply(`❌ Pet *${type}* tidak tersedia.\n\n${caption}`)
  }

  if ((user[pet.key] || 0) > 0) {
    return m.reply(`❌ Kamu sudah punya pet *${pet.nama}*.`)
  }

  if (user.emas < pet.harga) {
    return m.reply(`🪙 Emas kamu kurang.\nHarga *${pet.nama}*: ${pet.harga} 🪙\nEmas kamu: ${user.emas} 🪙`)
  }

  user.emas -= pet.harga
  user[pet.key] = 1

  let healtKey = `healt${pet.key}`
  let healthKey = `health${pet.key}`

  if (typeof user[healtKey] !== 'number') user[healtKey] = pet.health
  if (typeof user[healthKey] !== 'number') user[healthKey] = pet.health

  m.reply(`
🎉 Selamat!

Kamu berhasil membeli:
${pet.emoji} *${pet.nama}*

📈 Level: 1 / Max ${pet.max}
❤️ Health: ${pet.health} / ${pet.health}
🪙 Sisa emas: ${user.emas}
`.trim())
}

handler.help = ['petshop']
handler.tags = ['rpg']
handler.command = /^(petshop)$/i
handler.register = true

export default handler