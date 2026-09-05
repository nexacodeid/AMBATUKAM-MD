import fs from 'fs'

let timeout = 120000
let money = 5000
let limit = 1

let handler = async (m, {
    conn,
    usedPrefix
}) => {
    if (!conn.tebakgame) conn.tebakgame = {}
    let id = m.chat

    if (!(id in conn.tebakgame)) {
        let src = JSON.parse(fs.readFileSync('./json/tebakgame.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]

        let caption = `
🎮 TEBAK GAME 🎮

⏳ Timeout: ${(timeout / 1000)} detik
💬 Ketik ${usedPrefix}tebakgamehint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit

Game apakah ini?
`.trim()

        conn.tebakgame[id] = [
            await conn.sendMessage(m.chat, {
                image: {
                    url: json.img
                },
                caption: caption
            }, {
                quoted: m
            }),
            json,
            money,
            4,
            setTimeout(() => {
                if (conn.tebakgame[id]) {
                    conn.reply(
                        m.chat,
                        `⏰ Waktu habis!\n📑 Jawabannya adalah: ${json.jawaban}`,
                        conn.tebakgame[id][0]
                    )
                    delete conn.tebakgame[id]
                }
            }, timeout)
        ]

    } else {
        conn.reply(m.chat, '⚠️ Masih ada soal belum terjawab di chat ini!!', conn.tebakgame[id][0])
    }
}

handler.help = ['tebakgame', 'tebakg']
handler.tags = ['game']
handler.command = /^(tebakgame|tebakg)$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler