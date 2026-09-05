const GAME_SESSIONS = [
  { key: 'asahotak', name: 'Asah Otak', answer: (json) => json.jawaban },
  { key: 'caklontong', name: 'Cak Lontong', answer: (json) => json.jawaban },
  { key: 'siapakahaku', name: 'Siapakah Aku', answer: (json) => json.jawaban },
  { key: 'susunkata', name: 'Susun Kata', answer: (json) => json.jawaban },
  { key: 'tebakbendera', name: 'Tebak Bendera', answer: (json) => json.name || json.jawaban },
  { key: 'tebakgambar', name: 'Tebak Gambar', answer: (json) => json.jawaban },
  { key: 'tebakgame', name: 'Tebak Game', answer: (json) => json.jawaban },
  { key: 'tebakkata', name: 'Tebak Kata', answer: (json) => json.jawaban },
  { key: 'tebakkimia', name: 'Tebak Kimia', answer: (json) => json.lambang || json.jawaban },
  { key: 'tebaklagu', name: 'Tebak Lagu', answer: (json) => [json.judul, `${json.judul || ''} ${json.artis || ''}`] },
  { key: 'tebaklirik', name: 'Tebak Lirik', answer: (json) => json.jawaban },
  { key: 'tebaklogo', name: 'Tebak Logo', answer: (json) => json.jawaban },
  { key: 'tebakmakanan', name: 'Tebak Makanan', answer: (json) => json.jawaban },
  { key: 'tebaktebakan', name: 'Tebak Tebakan', answer: (json) => json.jawaban }
]

const PREFIX_REGEX = /^[‎xzXZ/!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\-]/

function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' dan ')
    .replace(/[^a-z0-9]+/g, '')
    .trim()
}

function levenshtein(a = '', b = '') {
  if (a === b) return 0
  if (!a) return b.length
  if (!b) return a.length

  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) matrix[0][j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  return matrix[a.length][b.length]
}

function isAnswer(userAnswer, validAnswer) {
  const user = normalize(userAnswer)
  const answer = normalize(validAnswer)

  if (!user || !answer) return false
  if (user === answer) return true

  // Toleransi typo kecil untuk jawaban panjang: Burberry tetap aman kalau user typo 1 huruf.
  if (answer.length >= 6 && user.length >= 6 && levenshtein(user, answer) <= 1) return true

  return false
}

function toAnswerList(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean)
}

function getQuotedId(m) {
  return m?.quoted?.id || m?.quoted?.key?.id || m?.quoted?.stanzaId || ''
}

function getRoomMessageId(room) {
  return room?.[0]?.key?.id || room?.[0]?.id || ''
}

function isReplyToGameMessage(m, room) {
  const quotedId = getQuotedId(m)
  const roomId = getRoomMessageId(room)
  return Boolean(quotedId && roomId && quotedId === roomId)
}

function addReward(m, amount = 0) {
  const user = global.db.data.users[m.sender]
  if (!user) return
  user.money = Number(user.money || 0) + Number(amount || 0)
}

async function answerSingleGame(m, conn, game) {
  const room = conn[game.key]?.[m.chat]
  if (!room) return false

  const json = room[1]
  const money = Number(room[2] || 0)
  const timer = room[4]
  const answers = toAnswerList(game.answer(json))
  const correctAnswer = answers[0]

  if (!answers.some((answer) => isAnswer(m.text, answer))) {
    if (isReplyToGameMessage(m, room)) {
      await m.reply('❌ Jawaban salah, coba lagi!')
      return true
    }
    return false
  }

  clearTimeout(timer)
  addReward(m, money)
  await conn.reply(
    m.chat,
    `✅ *Benar!*

🎮 Game: *${game.name}*
👤 Pemenang: @${m.sender.split('@')[0]}
📑 Jawaban: *${correctAnswer}*
💵 Bonus: *${money.toLocaleString()} Money*`,
    m,
    { mentions: [m.sender] }
  )

  delete conn[game.key][m.chat]
  return true
}

async function answerFamily100(m, conn) {
  const room = conn.family100?.[m.chat]
  if (!room) return false

  const json = room[1]
  const money = Number(room[2] || 0)
  const timer = room[4]
  const answers = Array.isArray(json.jawaban) ? json.jawaban : []

  room[5] = Array.isArray(room[5]) ? room[5] : []

  const index = answers.findIndex((answer, i) => {
    return !room[5].includes(i) && isAnswer(m.text, answer)
  })

  if (index < 0) {
    if (isReplyToGameMessage(m, room)) {
      await m.reply('❌ Jawaban salah atau sudah dijawab, coba jawaban lain!')
      return true
    }
    return false
  }

  room[5].push(index)

  const reward = Math.max(1, Math.floor(money / Math.max(answers.length, 1)))
  addReward(m, reward)

  const remaining = answers.length - room[5].length
  await conn.reply(
    m.chat,
    `✅ *Benar!*

👤 Penjawab: @${m.sender.split('@')[0]}
📑 Jawaban: *${answers[index]}*
💵 Bonus: *${reward.toLocaleString()} Money*
📌 Sisa jawaban: *${remaining}*`,
    m,
    { mentions: [m.sender] }
  )

  if (remaining <= 0) {
    clearTimeout(timer)
    await conn.reply(
      m.chat,
      `🎉 *Family 100 selesai!*

Semua jawaban sudah terjawab:
${answers.map((answer) => `• ${answer}`).join('\n')}`,
      room[0]
    )
    delete conn.family100[m.chat]
  }

  return true
}

let handler = async () => {}

handler.before = async function (m, { conn }) {
  if (!m.isGroup) return false
  if (!m.text || typeof m.text !== 'string') return false
  if (m.fromMe || m.isBaileys) return false
  if (PREFIX_REGEX.test(m.text.trim())) return false

  if (await answerFamily100(m, conn)) return true

  for (const game of GAME_SESSIONS) {
    if (await answerSingleGame(m, conn, game)) return true
  }

  return false
}

export default handler
