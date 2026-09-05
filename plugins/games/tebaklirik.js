import fs from 'fs'

let timeout = 120000
let money = 5000
let limit = 1

let handler = async (m, {
    conn,
    usedPrefix
}) => {
    if (!conn.tebaklirik) conn.tebaklirik = {}
    let id = m.chat

    if (!(id in conn.tebaklirik)) {
        let src = JSON.parse(fs.readFileSync('./json/tebaklirik.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]

        let caption = `
🎮 TEBAK LIRIK 🎮

📝 Lirik: ${json.soal}

⏳ Timeout: ${(timeout / 1000)} detik
💬 Ketik ${usedPrefix}tebaklirikhint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit

Lengkapi lirik lagu ini!
`.trim()

        conn.tebaklirik[id] = [
            await conn.reply(m.chat, caption, m),
            json,
            money,
            4,
            setTimeout(() => {
                if (conn.tebaklirik[id]) {
                    conn.reply(
                        m.chat,
                        `⏰ Waktu habis!\n📑 Jawabannya adalah: ${json.jawaban}`,
                        conn.tebaklirik[id][0]
                    )
                    delete conn.tebaklirik[id]
                }
            }, timeout)
        ]

    } else {
        conn.reply(m.chat, '⚠️ Masih ada soal belum terjawab di chat ini!!', conn.tebaklirik[id][0])
    }
}

handler.help = ['tebaklirik']
handler.tags = ['game']
handler.command = /^(tebaklirik)$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler