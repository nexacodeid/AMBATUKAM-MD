import fs from 'fs'

let timeout = 120000
let money = 10000
let limit = 2

let handler = async (m, {
    conn,
    usedPrefix
}) => {
    if (!conn.family100) conn.family100 = {}
    let id = m.chat

    if (!(id in conn.family100)) {
        let src = JSON.parse(fs.readFileSync('./json/family100.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]

        let caption = `
🎮 FAMILY 100 🎮

📮 Soal: ${json.soal}

⏳ Timeout: ${(timeout / 1000)} detik
💬 Ketik ${usedPrefix}fam100hint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit

Jawaban bisa lebih dari 1! Ketik jawabanmu.
`.trim()

        conn.family100[id] = [
            await conn.reply(m.chat, caption, m),
            json,
            money,
            4,
            setTimeout(() => {
                if (conn.family100[id]) {
                    conn.reply(
                        m.chat,
                        `⏰ Waktu habis!\n📑 Jawabannya adalah:\n${json.jawaban.map(j => `• ${j}`).join('\n')}`,
                        conn.family100[id][0]
                    )
                    delete conn.family100[id]
                }
            }, timeout)
        ]

    } else {
        conn.reply(m.chat, '⚠️ Masih ada soal belum terjawab di chat ini!!', conn.family100[id][0])
    }
}

handler.help = ['family100', 'fam100']
handler.tags = ['game']
handler.command = /^(family100|fam100)$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler