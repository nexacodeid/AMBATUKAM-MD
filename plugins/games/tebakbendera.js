import fs from 'fs'
let timeout = 30000
let money = 3000
let limit = 1

let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.tebakbendera) conn.tebakbendera = {}
    let id = m.chat
    if (!(id in conn.tebakbendera)) {
        let src = JSON.parse(fs.readFileSync('./json/tebakbendera.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]
        let caption = `
*🎮 TEBAK BENDERA 🎮*

📷 Bendera: 

⏳ Timeout: *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik ${usedPrefix}tbkbenderahint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit

Negara apakah ini?
`.trim()
        conn.tebakbendera[id] = [
            await conn.sendMessage(m.chat, { 
                image: { url: json.img },
                caption: caption
            }, { quoted: m }),
            json, money, 4,
            setTimeout(() => {
                if (conn.tebakbendera[id]) {
                    conn.reply(m.chat, `⏰ Waktu habis!\n📑 Jawabannya adalah: *${json.name}*`, conn.tebakbendera[id][0])
                    delete conn.tebakbendera[id]
                }
            }, timeout)
        ]
    } else conn.reply(m.chat, '*⚠️ Masih ada soal belum terjawab di chat ini!!*', conn.tebakbendera[id][0])
}

handler.help = ['tebakbendera', 'tbkbendera']
handler.tags = ['game']
handler.command = /^(tebakbendera|tbkbendera)$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler