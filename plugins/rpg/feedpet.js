let handler = async (m, { args, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]

  let pet = (args[0] || '').toLowerCase()

  if (!pet) {
    return m.reply(`
Contoh penggunaan:
${usedPrefix + command} kucing
${usedPrefix + command} naga
${usedPrefix + command} wolf
`.trim())
  }

  const pets = {
    kucing: { max: 5, food: 'makananpet', need: 2, emoji: '🐈' },
    anjing: { max: 5, food: 'makananpet', need: 2, emoji: '🐕' },
    kuda: { max: 10, food: 'makananpet', need: 4, emoji: '🐎' },
    rubah: { max: 10, food: 'makananpet', need: 5, emoji: '🦊' },
    wolf: { max: 15, food: 'makananpet', need: 7, emoji: '🐺' },
    robo: { max: 15, food: 'makananpet', need: 8, emoji: '🤖' },
    lion: { max: 15, food: 'makananpet', need: 8, emoji: '🦁' },
    rhinoceros: { max: 15, food: 'makananpet', need: 8, emoji: '🦏' },
    naga: { max: 20, food: 'makanannaga', need: 1, emoji: '🐉' },
    kyubi: { max: 20, food: 'makanankyubi', need: 1, emoji: '🦊' },
    centaur: { max: 20, food: 'makanancentaur', need: 1, emoji: '🦖' },
    griffin: { max: 15, food: 'makanangriffin', need: 1, emoji: '🦅' },
    phonix: { max: 15, food: 'makananphonix', need: 1, emoji: '🕊️' }
  }

  let data = pets[pet]

  if (!data) {
    return m.reply('❌ Pet tidak ditemukan.')
  }

  if (!user[pet] || user[pet] <= 0) {
    return m.reply(`❌ Kamu belum punya pet ${data.emoji}`)
  }

  if (user[pet] >= data.max) {
    return m.reply(`🏆 Level ${pet} sudah MAX`)
  }

  if ((user[data.food] || 0) < data.need) {
    return m.reply(`
❌ Makanan tidak cukup!

Butuh: ${data.need} ${data.food}
Kamu punya: ${user[data.food] || 0}
`.trim())
  }

  user[data.food] -= data.need
  user[pet] += 1

  let healtKey = `healt${pet}`
  let healthKey = `health${pet}`

  if (!user[healtKey]) user[healtKey] = 100
  if (!user[healthKey]) user[healthKey] = 100

  user[healthKey] += 100
  user[healtKey] += 100

  m.reply(`
✅ Berhasil memberi makan ${data.emoji}

📈 Level: ${user[pet]} / ${data.max}
❤️ Health: ${user[healtKey]} / ${user[healthKey]}

🍖 Makanan dipakai: ${data.need}
`.trim())
}

handler.help = ['feedpet <nama pet>']
handler.tags = ['rpg']
handler.command = /^(feedpet|naiklevelpet|uppet)$/i
handler.limit = true
handler.register = true

export default handler