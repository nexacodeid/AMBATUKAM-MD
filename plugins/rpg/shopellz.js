/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import fs from 'fs'

let handler = async (m, { conn }) => {
const fkontak = {
	"key": {
        "participant": '0@s.whatsapp.net',
            "remoteJid": "status@broadcast",
		    "fromMe": false,
		    "id": "Halo"
                        },
       "message": {
                    "locationMessage": {
                    "name": `✪ ${global.namabot}`,
                    "jpegThumbnail": ''
                          }
                        }
                      }
	let str = `✨ Shop ${global.namabot}! ✨
*Ayo Tukarkan Cash Mu Menjadi Beberapa Pilihan Dibawah*!!

🏅 Money

moneyp1: 250JT Money (Rp. 1,000 Cash)

moneyp2: 550JT Money (Rp. 2,000 Cash)

moneyp3: 2M Money (Rp. 5,000 Cash)

moneyp4: 7M Money (Rp. 11,000 Cash)


💥 Limit

limitp1: 1K Limit (Rp. 500 Cash)

limitp2: 2,5K Limit (Rp. 1,500 Cash)

limitp3: 5K Limit (Rp. 2,500 Cash)

limitp4: 13( Limit (Rp. 5,000 Cash)


📈 Premium

premp1: 1 Hari (Rp. 1,000 Cash)

premp2: 3 Hari (Rp. 2,000 Cash)

premp3: 1 Minggu (Rp. 7,000)

premp4: 1 Bulan (Rp. 12,000 Cash)

> Jika Ingin Membeli Item Di Atas Silahkan Ketik Command Nya *Contoh*: .premp3 Untuk Membeli 1 Minggu Premium!!

Jangan Lupa Follow Chanel ${global.namabot}!!`
 conn.sendMessage(m.chat, {
    text: str. trim(), 
    contextInfo: {
    externalAdReply :{
    mediaUrl: '', 
    mediaType: 1,
    title: `© ${global.namabot} 🤖`,
    body: `${global.ownername} 👨‍💻`, 
    thumbnailUrl: thumbmenu, 
    sourceUrl: myweb,
    renderLargerThumbnail: true, 
    }}}, {quoted: fkontak})
}
handler.tags = ['rpg']
handler.help = ['buy','tokoellz']
handler.command = /^(buy|tokoellz)$/i
handler.group = true
handler.register = true

export default handler

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */