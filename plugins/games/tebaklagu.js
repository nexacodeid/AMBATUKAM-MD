import fs from 'fs'

let timeout = 120000
let money = 5000
let limit = 1

let handler = async (m, {
    conn,
    usedPrefix
}) => {
    if (!conn.tebaklagu) conn.tebaklagu = {}
    let id = m.chat

    if (!(id in conn.tebaklagu)) {
        let src = JSON.parse(fs.readFileSync('./json/tebaklagu.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]

        let caption = `
🎮 TEBAK LAGU 🎮

⏳ Timeout: ${(timeout / 1000)} detik
💬 Ketik ${usedPrefix}tebaklaguhint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit

Apa judul lagu ini?
`.trim()

        conn.tebaklagu[id] = [
            await conn.sendMessage(m.chat, {
                audio: {
                    url: json.lagu
                },
                mimetype: 'audio/mpeg',
                fileName: 'tebaklagu.mp3'
            }, {
                quoted: m
            }),
            json,
            money,
            4,
            setTimeout(() => {
                if (conn.tebaklagu[id]) {
                    conn.reply(
                        m.chat,
                        `⏰ Waktu habis!\n📑 Jawabannya adalah: ${json.judul} - ${json.artis}`,
                        conn.tebaklagu[id][0]
                    )
                    delete conn.tebaklagu[id]
                }
            }, timeout)
        ]

        await conn.reply(m.chat, caption, conn.tebaklagu[id][0])

    } else {
        conn.reply(m.chat, '⚠️ Masih ada soal belum terjawab di chat ini!!', conn.tebaklagu[id][0])
    }
}

handler.help = ['tebaklagu', 'tebakl']
handler.tags = ['game']
handler.command = /^(tebaklagu|tebakl)$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler