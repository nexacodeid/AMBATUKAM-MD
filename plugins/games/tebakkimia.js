import fs from 'fs'
let timeout = 60000
let money = 5000
let limit = 1

let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebakkimia) conn.tebakkimia = {}
    let id = m.chat
    if (!(id in conn.tebakkimia)) {
        let src = JSON.parse(fs.readFileSync('./json/tebakkimia.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]
        let caption = `
*🎮 TEBAK KIMIA 🎮*

🧪 Unsur: *${json.unsur}*

⏳ Timeout: *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik ${usedPrefix}tebakkimiahint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit

Apa lambang unsur ini?
`.trim()
        conn.tebakkimia[id] = [
            await conn.reply(m.chat, caption, m),
            json, money, 4,
            setTimeout(() => {
                if (conn.tebakkimia[id]) {
                    conn.reply(m.chat, `⏰ Waktu habis!\n📑 Jawabannya adalah: *${json.lambang}*`, conn.tebakkimia[id][0])
                    delete conn.tebakkimia[id]
                }
            }, timeout)
        ]
    } else conn.reply(m.chat, '*⚠️ Masih ada soal belum terjawab di chat ini!!*', conn.tebakkimia[id][0])
}

handler.help = ['tebakkimia', 'tebakkim']
handler.tags = ['game']
handler.command = /^(tebakkimia|tebakkim)$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler