let handler = async (m, { conn, args, usedPrefix }) => {
  try {
    conn.judi = conn.judi || {}

    if (conn.judi[m.chat]) {
      return m.reply("Masih ada yang bermain judi disini, tunggu!")
    }

    conn.judi[m.chat] = true

    // ===== FIX DATABASE =====
    global.db.data = global.db.data || {}
    global.db.data.users = global.db.data.users || {}

    let user = global.db.data.users[m.sender]

    if (!user) {
      global.db.data.users[m.sender] = {
        money: 1000,
        judilast: 0
      }
      user = global.db.data.users[m.sender]
    }

    // ===== COOLDOWN =====
    let now = Date.now()
    let cooldown = 5000

    if (now - user.judilast < cooldown) {
      return m.reply(
        `Tunggu ${clockString(cooldown - (now - user.judilast))} lagi`
      )
    }

    if (!args[0]) {
      return m.reply(`${usedPrefix}judi 1000\n${usedPrefix}judi all`)
    }

    let count
    if (/all/i.test(args[0])) {
      count = user.money
    } else {
      count = parseInt(args[0])
    }

    if (!count || count < 1) {
      return m.reply("Jumlah tidak valid")
    }

    if (user.money < count) {
      return m.reply("Money tidak cukup")
    }

    user.judilast = now
    user.money -= count

    let bot = Math.floor(Math.random() * 100) + 1
    let player = Math.floor(Math.random() * 100) + 1

    if (player > bot) {
      let win = count * 2
      user.money += win
      return m.reply(`🎰 MENANG!\nBot: ${bot}\nKamu: ${player}\n+${win}`)
    }

    if (player < bot) {
      return m.reply(`🎰 KALAH!\nBot: ${bot}\nKamu: ${player}\n-${count}`)
    }

    user.money += count
    return m.reply(`🎰 SERI!\nBot: ${bot}\nKamu: ${player}`)

  } catch (e) {
    console.error(e)
    m.reply("Error!! cek console")
  } finally {
    delete conn.judi[m.chat]
  }
}

handler.help = ['judi <jumlah>']
handler.tags = ['game']
handler.command = /^(judi)$/i
handler.register = true

export default handler

function clockString(ms) {
  let s = Math.floor(ms / 1000)
  let m = Math.floor(s / 60)
  s %= 60
  return `${m}m ${s}s`
}