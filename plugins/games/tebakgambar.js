import fs from 'fs'

let timeout = 120000
let money = 5000
let limit = 1

let handler = async (m, {
    conn,
    usedPrefix
}) => {
    if (!conn.tebakgambar) conn.tebakgambar = {}
    let id = m.chat

    if (!(id in conn.tebakgambar)) {
        let src = JSON.parse(fs.readFileSync('./json/tebakgambar.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]

        let caption = `
🎮 TEBAK GAMBAR 🎮

📮 Deskripsi: ${json.deskripsi}

⏳ Timeout: ${(timeout / 1000)} detik
💬 Ketik ${usedPrefix}tbghint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit
`.trim()

        conn.tebakgambar[id] = [
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
                if (conn.tebakgambar[id]) {
                    conn.reply(
                        m.chat,
                        `⏰ Waktu habis!\n📑 Jawabannya adalah: ${json.jawaban}`,
                        conn.tebakgambar[id][0]
                    )
                    delete conn.tebakgambar[id]
                }
            }, timeout)
        ]

    } else {
        conn.reply(m.chat, '⚠️ Masih ada soal belum terjawab di chat ini!!', conn.tebakgambar[id][0])
    }
}

handler.help = ['tebakgambar', 'tbgambar']
handler.tags = ['game']
handler.command = /^(tebakgambar|tbgambar)$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler