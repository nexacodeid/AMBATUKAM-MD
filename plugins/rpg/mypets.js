let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]

  const pets = [
    ['🐈', 'Kucing', 'kucing', 5],
    ['🐕', 'Anjing', 'anjing', 5],
    ['🐎', 'Kuda', 'kuda', 10],
    ['🦊', 'Rubah', 'rubah', 10],
    ['🐺', 'Serigala', 'wolf', 15],
    ['🤖', 'Robo', 'robo', 15],
    ['🦁', 'Lion', 'lion', 15],
    ['🦏', 'Rhinoceros', 'rhinoceros', 15],
    ['🐉', 'Naga', 'naga', 20],
    ['🦊', 'Kyubi', 'kyubi', 20],
    ['🦖', 'Centaur', 'centaur', 20],
    ['🦅', 'Griffin', 'griffin', 15],
    ['🕊️', 'Phonix', 'phonix', 15]
  ]

  if (typeof user.makananpet !== 'number') user.makananpet = 0

  let cap = `*〔 P E T  C O N D I T I O N 〕*

*[👤] Pemilik:*
* @${m.sender.replace(/@.+/, '')}

`

  for (let [emoji, name, key, maxLevel] of pets) {
    if (typeof user[key] !== 'number') user[key] = 0

    let healtKey = `healt${key}`
    let healthKey = `health${key}`

    if (typeof user[healthKey] !== 'number') user[healthKey] = user[key] > 0 ? getDefaultHealth(key) : 0
    if (typeof user[healtKey] !== 'number') user[healtKey] = user[key] > 0 ? user[healthKey] : 0

    cap += `*[${emoji}] ${name}:*
* *Level:* ${formatLevel(user[key], maxLevel)}
* *Healt:* ${formatNumber(user[healtKey])} / ${formatNumber(user[healthKey])}

`
  }

  cap += `*[🍬] Makanan Pet:*
* *Makanan:* ${formatNumber(user.makananpet)}
`.trim()

  await conn.sendMessage(m.chat, {
    text: cap,
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        mediaUrl: '',
        mediaType: 1,
        title: 'M y. P e t s',
        body: '',
        thumbnailUrl: 'https://telegra.ph/file/d6249aa40851107832c9f.png',
        sourceUrl: 'https://whatsapp.com/channel/0029VaLENMi6buMBmpIYBT0A',
        renderLargerThumbnail: true,
        showAdAttribution: false
      }
    }
  }, { quoted: m })
}

handler.tags = ['rpg']
handler.help = ['pets', 'mypets']
handler.command = /^(mypets|pets)$/i
handler.register = true

export default handler

function formatLevel(level, max) {
  if (!level || level <= 0) return 'Tidak Punya'
  if (level >= max) return 'Level Max'
  return `${level} / Max ${max}`
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString()
}

function getDefaultHealth(key) {
  const health = {
    kucing: 100,
    anjing: 100,
    kuda: 150,
    rubah: 200,
    wolf: 300,
    robo: 350,
    lion: 350,
    rhinoceros: 350,
    naga: 500,
    kyubi: 500,
    centaur: 500,
    griffin: 400,
    phonix: 400
  }

  return health[key] || 100
}