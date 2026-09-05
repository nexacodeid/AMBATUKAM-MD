/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { text, conn, isOwner, usedPrefix, command }) => {
  // if (!isOwner) return m.reply('fitur ini masih dalam proses')

  const groupId = '120363299487252901@g.us'

  conn.airdrop = conn.airdrop || {}

  let airdrop = conn.airdrop[groupId]
  let users = global.db.data.users[m.sender]

  if (!users) {
    global.db.data.users[m.sender] = {}
    users = global.db.data.users[m.sender]
  }

  users.money = users.money || 0
  users.exp = users.exp || 0
  users.diamond = users.diamond || 0
  users.boxs = users.boxs || 0
  users.rock = users.rock || 0

  const fakeQuoted = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'Halo'
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  }

  if (!airdrop) return

  let msg = airdrop.msg

  if (!Array.isArray(airdrop.users)) airdrop.users = []

  if (airdrop.users.includes(m.sender)) {
    return m.reply(`❕Kamu sudah mengambil hadiah ini, tunggu *🎁 AirDrop* selanjutnya yang akan jatuh.`)
  }

  if (airdrop.users.length >= 5) {
    return m.reply(`*Yahh kamu kehabisan AirDrop-nya :/*`)
  }

  if (
    command === 'buka' &&
    (
      !m.quoted ||
      !m.quoted.fromMe ||
      !m.quoted.isBaileys ||
      !m.quoted.text ||
      !/Ketik.*buka/i.test(m.quoted.text)
    )
  ) {
    return conn.reply(
      m.chat,
      `Balas pesan AirDrop ini untuk membuka hadiah!`,
      msg,
      {
        contextInfo: {
          mentionedJid: [m.sender]
        }
      }
    )
  }

  let money = Math.floor(Math.random() * 30000000)
  let exp = Math.floor(Math.random() * 130000)
  let dm = Math.floor(Math.random() * 40)
  let boxs = Math.floor(Math.random() * 60)

  let cap = `*[ 🎁🎉 Kamu Telah Membuka AirDrop ]*

\`AirDrop-ID:\` ${airdrop.id}

*Hadiah AirDrop:*
* *💵 Money:* ${money.toLocaleString()}
* *🧪 Exp:* ${exp.toLocaleString()}
* *💎 Diamond:* ${dm}
* *📦 Boxs:* ${boxs}

\`Setiap user hadiahnya berbeda-beda\``.trim()

  users.money += money
  users.exp += exp
  users.diamond += dm
  users.boxs += boxs
  users.rock += 1

  airdrop.users.push(m.sender)

  await conn.sendMessage(
    m.chat,
    {
      text: cap,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          showAdAttribution: false,
          title: `[🎉🎀 Open AirDrop ]`,
          body: '👨‍💻 raizell',
          thumbnailUrl: 'https://telegra.ph/file/2481af9d807753ed42fd8.jpg',
          sourceUrl: 'https://whatsapp.com/channel/0029VaLENMi6buMBmpIYBT0A',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    },
    {
      quoted: fakeQuoted
    }
  )

  if (airdrop.users.length >= 5) {
    await conn.sendMessage(groupId, {
      delete: {
        remoteJid: groupId,
        fromMe: true,
        id: msg.key.id,
        participant: msg.key.participant
      }
    }).catch(() => {})

    await conn.reply(
      m.chat,
      `*🎁 AirDrop* telah habis, maksimum 5 player yang mendapatkannya.`,
      m
    )

    delete conn.airdrop[groupId]
  }
}

handler.command = /^(buka)$/i

export default handler