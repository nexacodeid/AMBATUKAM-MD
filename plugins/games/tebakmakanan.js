import fs from 'fs'
let timeout = 60000
let money = 5000
let limit = 1

let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebakmakanan) conn.tebakmakanan = {}
    let id = m.chat
    if (!(id in conn.tebakmakanan)) {
        let src = JSON.parse(fs.readFileSync('./json/tebakmakanan.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]
        let caption = `
*🎮 TEBAK MAKANAN 🎮*

📮 Deskripsi: ${json.deskripsi}

⏳ Timeout: *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik ${usedPrefix}tebakmakananhint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit

Makanan apakah ini?
`.trim()
        conn.tebakmakanan[id] = [
            await conn.sendMessage(m.chat, {
                image: { url: json.img },
                caption
            }, { quoted: m }),
            json, money, 4,
            setTimeout(() => {
                if (conn.tebakmakanan[id]) {
                    conn.reply(m.chat, `⏰ Waktu habis!\n📑 Jawabannya adalah: *${json.jawaban}*`, conn.tebakmakanan[id][0])
                    delete conn.tebakmakanan[id]
                }
            }, timeout)
        ]
    } else conn.reply(m.chat, '*⚠️ Masih ada soal belum terjawab di chat ini!!*', conn.tebakmakanan[id][0])
}

handler.help = ['tebakmakanan', 'tebakmak']
handler.tags = ['game']
handler.command = /^(tebakmakanan|tebakmak)$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler