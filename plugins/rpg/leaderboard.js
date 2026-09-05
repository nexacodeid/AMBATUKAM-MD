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
	let str = `🔥 *Siap Jadi Pemimpin Utama & Rebut Hadiah Menarik?* 🔥
	
💡 \`[ Top Reward ]\`
> Masuk ke Top 1 Reward dan menangkan hadiah spesial! Hadiah akan dibagikan setiap ahad kepada top reward 1 🥇🥈🥉

✨ *Hadiah untuk Para Juara:*
🏅 Money | 💥 Limit | 💸 Cash | 🎫 Premium

💥 *Tunjukkan Kerja Keras Kalian Untuk Mencapai Top 1!* 💥

Cek leaderboard-mu sekarang:

🔹 Top EXP: .lbexp
🔹 Top Uang: .lbmoney
🔹 Top Damage: .lbdamage
🔹 Top Subscriber: .lbsub
🔹 Top Astronot: .lbastro
🔹 Top Level: .lblevel
🔹 Top Player Reward: .lbreward

🚀 Jadilah yang teratas & dapatkan hadiahnya!`
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
handler.help = ['lb','leaderboard']
handler.command = /^(leaderboard|lb|topglobal)$/i
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