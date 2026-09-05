/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, command, participants }) => {
  const groupId = '120363299487252901@g.us'
  const ownerJid = '6289520616967@s.whatsapp.net'

  conn.airdrop = conn.airdrop || {}

  let airdrop = conn.airdrop[groupId]
  let allUser = Object.entries(global.db.data.users)

  if (airdrop) {
    return m.reply(`AirDrop udah turun ell`)
  }

  let id = Math.floor(Math.random() * 80000000000)

  let capOwn = `Sukses Menurunkan *🎁 AirDrop*`
  await conn.reply(m.chat, capOwn, m, {
    contextInfo: {
      mentionedJid: [m.sender]
    }
  })

  let capAir = `🎊🎁 AirDrop turun nih!

Dapatkan hadiah spesial dari AirDrop.
AirDrop akan hilang/expired dalam 5 menit.

Ketik: *.buka* untuk membukanya, dan reply pesan ini.

*-ID:* ${id}`

  allUser.forEach(([user, data]) => {
    data.rock = 0
  })

  let mentionedJid = Array.isArray(participants)
    ? participants.map(v => v.id)
    : []

  let msg = await conn.sendMessage(
    groupId,
    {
      text: capAir,
      contextInfo: {
        mentionedJid,
        externalAdReply: {
          showAdAttribution: false,
          title: `[ 🎁 𝖠𝗂𝗋𝖣𝗋𝗈𝗉 ]`,
          body: 'Hadiah spesial telah turun!',
          thumbnailUrl: 'https://telegra.ph/file/c27eee40140de58ffdd24.png',
          sourceUrl: 'https://whatsapp.com',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    },
    {
      quoted: m
    }
  )

  conn.airdrop[groupId] = {
    id,
    msg,
    users: []
  }

  setTimeout(async () => {
    try {
      await conn.sendMessage(groupId, {
        delete: {
          remoteJid: groupId,
          fromMe: true,
          id: msg.key.id,
          participant: msg.key.participant || conn.user.jid
        }
      })
    } catch (e) {
      console.log('Gagal hapus pesan AirDrop:', e)
    }

    try {
      await conn.reply(ownerJid, 'AirDrop udah selesai zall', m)
    } catch (e) {
      console.log('Gagal kirim notif owner:', e)
    }

    delete conn.airdrop[groupId]
  }, 5 * 60 * 1000)
}

handler.command = /^(airdrop)$/i
handler.owner = true
handler.register = true
handler.group = true

export default handler