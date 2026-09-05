const TOURNAMENTS = {}

const PETS = {
  kucing: { name: 'Kucing', emoji: '🐈' },
  anjing: { name: 'Anjing', emoji: '🐕' },
  kuda: { name: 'Kuda', emoji: '🐎' },
  rubah: { name: 'Rubah', emoji: '🦊' },
  wolf: { name: 'Serigala', emoji: '🐺' },
  serigala: { name: 'Serigala', emoji: '🐺', key: 'wolf' },
  robo: { name: 'Robo', emoji: '🤖' },
  lion: { name: 'Lion', emoji: '🦁' },
  rhinoceros: { name: 'Rhinoceros', emoji: '🦏' },
  badak: { name: 'Rhinoceros', emoji: '🦏', key: 'rhinoceros' },
  naga: { name: 'Naga', emoji: '🐉' },
  kyubi: { name: 'Kyubi', emoji: '🦊' },
  centaur: { name: 'Centaur', emoji: '🦖' },
  griffin: { name: 'Griffin', emoji: '🦅' },
  phonix: { name: 'Phonix', emoji: '🕊️' },
  phoenix: { name: 'Phonix', emoji: '🕊️', key: 'phonix' }
}

let handler = async (m, { conn, args, usedPrefix, command, participants }) => {
  let chat = m.chat
  let user = global.db.data.users[m.sender]
  let action = (args[0] || '').toLowerCase()
  let petName = (args[1] || '').toLowerCase()

  if (!TOURNAMENTS[chat]) {
    TOURNAMENTS[chat] = {
      status: 'open',
      players: []
    }
  }

  let tour = TOURNAMENTS[chat]

  if (!action) {
    return m.reply(`
🏆 *PET TOURNAMENT*

Command:
${usedPrefix + command} join <pet>
${usedPrefix + command} list
${usedPrefix + command} start
${usedPrefix + command} reset

Contoh:
${usedPrefix + command} join naga

Pet:
${Object.keys(PETS).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
`.trim())
  }

  if (action === 'join') {
    if (tour.status !== 'open') {
      return m.reply('❌ Turnamen sedang berjalan. Tunggu selesai atau reset.')
    }

    let pet = PETS[petName]
    if (!pet) return m.reply('❌ Pet tidak ditemukan.')

    let key = pet.key || petName

    if (!user[key] || user[key] <= 0) {
      return m.reply(`❌ Kamu belum punya pet ${pet.emoji} ${pet.name}.`)
    }

    if (tour.players.find(v => v.id === m.sender)) {
      return m.reply('❌ Kamu sudah terdaftar di turnamen ini.')
    }

    let healthKey = `healt${key}`
    let maxHealthKey = `health${key}`

    if (typeof user[healthKey] !== 'number') user[healthKey] = 100
    if (typeof user[maxHealthKey] !== 'number') user[maxHealthKey] = 100

    if (user[healthKey] <= 0) {
      return m.reply(`❌ Health pet kamu habis. Pulihkan dulu sebelum ikut turnamen.`)
    }

    tour.players.push({
      id: m.sender,
      pet: key,
      petName: pet.name,
      emoji: pet.emoji,
      level: user[key],
      health: user[healthKey],
      maxHealth: user[maxHealthKey]
    })

    return m.reply(`
✅ Berhasil masuk turnamen!

👤 Player: @${m.sender.split('@')[0]}
${pet.emoji} Pet: ${pet.name}
📈 Level: ${user[key]}
❤️ Health: ${user[healthKey]} / ${user[maxHealthKey]}

Total peserta: ${tour.players.length}
`.trim(), null, {
      mentions: [m.sender]
    })
  }

  if (action === 'list') {
    if (!tour.players.length) return m.reply('Belum ada peserta.')

    let txt = `🏆 *DAFTAR PESERTA PET TOURNAMENT*\n\n`
    txt += tour.players.map((p, i) => {
      return `${i + 1}. @${p.id.split('@')[0]}\n${p.emoji} ${p.petName} Lv.${p.level} ❤️ ${p.health}/${p.maxHealth}`
    }).join('\n\n')

    return conn.reply(m.chat, txt, m, {
      mentions: tour.players.map(v => v.id)
    })
  }

  if (action === 'reset') {
    delete TOURNAMENTS[chat]
    return m.reply('✅ Turnamen pet berhasil direset.')
  }

  if (action === 'start') {
    if (tour.status !== 'open') return m.reply('❌ Turnamen sedang berjalan.')
    if (tour.players.length < 2) return m.reply('❌ Minimal 2 peserta untuk mulai turnamen.')

    tour.status = 'running'

    let players = [...tour.players]
    let logs = [`🏆 *PET TOURNAMENT DIMULAI!*`, `Total peserta: ${players.length}`, '']

    while (players.length > 1) {
      shuffle(players)

      let nextRound = []

      for (let i = 0; i < players.length; i += 2) {
        let a = players[i]
        let b = players[i + 1]

        if (!b) {
          logs.push(`🎟️ @${a.id.split('@')[0]} mendapat bye ke ronde berikutnya.`)
          nextRound.push(a)
          continue
        }

        let result = battle(a, b)
        let winner = result.winner
        let loser = result.loser

        logs.push(`⚔️ @${a.id.split('@')[0]} ${a.emoji} ${a.petName} Lv.${a.level} VS @${b.id.split('@')[0]} ${b.emoji} ${b.petName} Lv.${b.level}`)
        logs.push(`🏅 Menang: @${winner.id.split('@')[0]} ${winner.emoji} ${winner.petName}`)
        logs.push(`📊 Power: ${result.powerA} vs ${result.powerB}`)
        logs.push('')

        nextRound.push(winner)

        let loserUser = global.db.data.users[loser.id]
        if (loserUser) {
          let healtKey = `healt${loser.pet}`
          loserUser[healtKey] = Math.max(1, (loserUser[healtKey] || loser.health) - randomInt(10, 35))
        }
      }

      players = nextRound
    }

    let champion = players[0]
    let championUser = global.db.data.users[champion.id]

    if (championUser) {
      championUser.money = (championUser.money || 0) + 250000
      championUser.exp = (championUser.exp || 0) + 5000
      championUser.emas = (championUser.emas || 0) + 2
      championUser.pettrophy = (championUser.pettrophy || 0) + 1
    }

    logs.push(`👑 *JUARA PET TOURNAMENT*`)
    logs.push(`@${champion.id.split('@')[0]} dengan ${champion.emoji} *${champion.petName}* Lv.${champion.level}`)
    logs.push('')
    logs.push(`🎁 Hadiah:`)
    logs.push(`💰 +250.000 Money`)
    logs.push(`✨ +5.000 Exp`)
    logs.push(`🪙 +2 Emas`)
    logs.push(`🏆 +1 Pet Trophy`)

    delete TOURNAMENTS[chat]

    return conn.reply(m.chat, logs.join('\n'), m, {
      mentions: tour.players.map(v => v.id)
    })
  }

  return m.reply(`Command tidak dikenal.\nKetik ${usedPrefix + command} untuk melihat menu.`)
}

handler.help = ['pettour']
handler.tags = ['rpg']
handler.command = /^(pettour|turnamenpet|petturnamen)$/i
handler.group = true
handler.limit = true
handler.register = true

export default handler

function battle(a, b) {
  let powerA = Math.floor((a.level * 100) + (a.health * 0.5) + randomInt(1, 250))
  let powerB = Math.floor((b.level * 100) + (b.health * 0.5) + randomInt(1, 250))

  if (powerA === powerB) {
    powerA += randomInt(1, 50)
    powerB += randomInt(1, 50)
  }

  return powerA > powerB
    ? { winner: a, loser: b, powerA, powerB }
    : { winner: b, loser: a, powerA, powerB }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}