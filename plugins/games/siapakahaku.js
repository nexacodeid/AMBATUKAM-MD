import fs from 'fs'
let timeout = 60000
let money = 5000
let limit = 1

let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.siapakahaku) conn.siapakahaku = {}
    let id = m.chat
    if (!(id in conn.siapakahaku)) {
        let src = JSON.parse(fs.readFileSync('./json/siapakahaku.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]
        let caption = `
*🎮 SIAPAKAH AKU 🎮*

📮 Soal: *${json.soal}*

⏳ Timeout: *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik ${usedPrefix}siapakahakuhint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit

Siapakah aku?
`.trim()
        conn.siapakahaku[id] = [
            await conn.reply(m.chat, caption, m),
            json, money, 4,
            setTimeout(() => {
                if (conn.siapakahaku[id]) {
                    conn.reply(m.chat, `⏰ Waktu habis!\n📑 Jawabannya adalah: *${json.jawaban}*`, conn.siapakahaku[id][0])
                    delete conn.siapakahaku[id]
                }
            }, timeout)
        ]
    } else conn.reply(m.chat, '*⚠️ Masih ada soal belum terjawab di chat ini!!*', conn.siapakahaku[id][0])
}

handler.help = ['siapakahaku', 'siapaaku']
handler.tags = ['game']
handler.command = /^(siapakahaku|siapaaku)$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler