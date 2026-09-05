import fs from 'fs'
let timeout = 60000
let money = 5000
let limit = 1

let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.asahotak) conn.asahotak = {}
    let id = m.chat
    if (!(id in conn.asahotak)) {
        let src = JSON.parse(fs.readFileSync('./json/asahotak.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]
        let caption = `
*🎮 ASAH OTAK 🎮*

📮 Soal: *${json.soal}*

⏳ Timeout: *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik ${usedPrefix}asahotakhint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit
`.trim()
        conn.asahotak[id] = [
            await conn.reply(m.chat, caption, m),
            json, money, 4,
            setTimeout(() => {
                if (conn.asahotak[id]) {
                    conn.reply(m.chat, `⏰ Waktu habis!\n📑 Jawabannya adalah: *${json.jawaban}*`, conn.asahotak[id][0])
                    delete conn.asahotak[id]
                }
            }, timeout)
        ]
    } else conn.reply(m.chat, '*⚠️ Masih ada soal belum terjawab di chat ini!!*', conn.asahotak[id][0])
}

handler.help = ['asahotak']
handler.tags = ['game']
handler.command = /^asahotak$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler