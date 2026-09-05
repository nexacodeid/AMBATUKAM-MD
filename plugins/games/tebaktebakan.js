import fs from 'fs'
let timeout = 60000
let money = 5000
let limit = 1

let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebaktebakan) conn.tebaktebakan = {}
    let id = m.chat
    if (!(id in conn.tebaktebakan)) {
        let src = JSON.parse(fs.readFileSync('./json/tebaktebakan.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]
        let caption = `
*🎮 TEBAK TEBAKAN 🎮*

📝 Soal: *${json.soal}*

⏳ Timeout: *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik ${usedPrefix}tebaktebakanhint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit

Apa jawabannya?
`.trim()
        conn.tebaktebakan[id] = [
            await conn.reply(m.chat, caption, m),
            json, money, 4,
            setTimeout(() => {
                if (conn.tebaktebakan[id]) {
                    conn.reply(m.chat, `⏰ Waktu habis!\n📑 Jawabannya adalah: *${json.jawaban}*`, conn.tebaktebakan[id][0])
                    delete conn.tebaktebakan[id]
                }
            }, timeout)
        ]
    } else conn.reply(m.chat, '*⚠️ Masih ada soal belum terjawab di chat ini!!*', conn.tebaktebakan[id][0])
}

handler.help = ['tebaktebakan', 'tebaktebak']
handler.tags = ['game']
handler.command = /^(tebaktebakan|tebaktebak)$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler