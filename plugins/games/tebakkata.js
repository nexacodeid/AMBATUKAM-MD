import fs from 'fs'
let timeout = 60000
let money = 5000
let limit = 1

let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebakkata) conn.tebakkata = {}
    let id = m.chat
    if (!(id in conn.tebakkata)) {
        let src = JSON.parse(fs.readFileSync('./json/tebakkata.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]
        let caption = `
*🎮 TEBAK KATA 🎮*

📮 Soal: *${json.soal}*

⏳ Timeout: *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik ${usedPrefix}tbkatahint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit

Tebak kata apakah ini?
`.trim()
        conn.tebakkata[id] = [
            await conn.reply(m.chat, caption, m),
            json, money, 4,
            setTimeout(() => {
                if (conn.tebakkata[id]) {
                    conn.reply(m.chat, `⏰ Waktu habis!\n📑 Jawabannya adalah: *${json.jawaban}*`, conn.tebakkata[id][0])
                    delete conn.tebakkata[id]
                }
            }, timeout)
        ]
    } else conn.reply(m.chat, '*⚠️ Masih ada soal belum terjawab di chat ini!!*', conn.tebakkata[id][0])
}

handler.help = ['tebakkata', 'tbkata']
handler.tags = ['game']
handler.command = /^(tebakkata|tbkata)$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler