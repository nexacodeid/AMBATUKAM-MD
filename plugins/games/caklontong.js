import fs from 'fs'
let timeout = 60000
let money = 5000
let limit = 1

let handler = async (m, { conn, usedPrefix }) => {
    if (!conn.caklontong) conn.caklontong = {}
    let id = m.chat
    if (!(id in conn.caklontong)) {
        let src = JSON.parse(fs.readFileSync('./json/caklontong.json', 'utf-8'))
        let json = src[Math.floor(Math.random() * src.length)]
        let caption = `
*🎮 CAK LONTONG 🎮*

📝 Soal: *${json.soal}*

⏳ Timeout: *${(timeout / 1000).toFixed(2)} detik*
💬 Ketik ${usedPrefix}caklontonghint untuk bantuan
➕ Bonus: ${money} Money
🎟️ Limit: ${limit} Limit

${json.deskripsi ? '💡 ' + json.deskripsi : ''}

Apa jawabannya?
`.trim()
        conn.caklontong[id] = [
            await conn.reply(m.chat, caption, m),
            json, money, 4,
            setTimeout(() => {
                if (conn.caklontong[id]) {
                    conn.reply(m.chat, `⏰ Waktu habis!\n📑 Jawabannya adalah: *${json.jawaban}*\n💡 ${json.deskripsi}`, conn.caklontong[id][0])
                    delete conn.caklontong[id]
                }
            }, timeout)
        ]
    } else conn.reply(m.chat, '*⚠️ Masih ada soal belum terjawab di chat ini!!*', conn.caklontong[id][0])
}

handler.help = ['caklontong', 'caklontong']
handler.tags = ['game']
handler.command = /^(caklontong|caklontong)$/i

handler.limit = true
handler.register = true
handler.group = true

export default handler