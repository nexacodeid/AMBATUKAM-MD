/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async(m, { text, conn, usedPrefix, command, isOwner, participants }) => {
  conn.airdrop = conn.airdrop || {}
  let airdrop = conn.airdrop['120363374074584416@@g.us']
  let users = global.db.data.users[m.sender]
  let allUser = Object.entries(global.db.data.users)
  if (!airdrop) {
     let id = Math.floor(Math.random() * 80000000000);
     let capOwn = `Sukses Menurunkan *🎁Airdrop*`
     conn.reply(m.chat, capOwn, m, { contextInfo: { mentionedJid: [m.sender] }})
     let capAir = `🎊🎁 AirDrop turun nih!, dapatkan hadiah spesial dari AirDrop, AirDrop akan hilang/expired dalam 5 menit\n\nKetik: *.buka* untuk membukanya, dan reply pesan ini\n\n*-ID:* ${id}`
     allUser.map(([user, data], i) => (Number(data.rock = 0)))
 let msg = await conn.sendMessage('120363299487252901@g.us', {
         text: capAir,
         contextInfo: {
           mentionedJid: participants.map(a => a.id),
           externalAdReply: {
             showAdAttribution: false,
             title: `[ 🎁 𝖠𝗂𝗋𝖣𝗋𝗈𝗉 ]`,
             body: '',
             thumbnailUrl: 'https://telegra.ph/file/c27eee40140de58ffdd24.png', 
             sourceUrl: '',
             mediaType: 1,
             renderLargerThumbnail: true
             }}}, { quoted: m });
     msg
     conn.airdrop['120363299487252901@g.us'] = {
           id: id,
           msg: msg,
           users: []
        }
    setTimeout(() => {
        conn.sendMessage('120363299487252901@g.us', { delete: { remoteJid: '120363299487252901@g.us', fromMe: true, id: msg.key.id, participant: msg.key.participant }})
        conn.reply('6289520616967@s.whatsapp.net', 'AirDrop udah selesai zall', m)
            delete conn.airdrop['120363299487252901@g.us']
      }, 5 * 60 * 1000)
   } else return m.reply(`AirDrop udh turun ell`)
}
handler.command = /^(airdrop)/i
handler.owner = true

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