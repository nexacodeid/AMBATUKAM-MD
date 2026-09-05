// trialjadibot.js

import { ButtonV2 } from "../../lib/messagebutton.js"

let handler = async (
  m,
  { conn, text, usedPrefix, command }
) => {

  const phoneNumber =
    text.replace(/[^0-9]/g, "")

  // VALIDASI INPUT
  if (!phoneNumber) {
    return m.reply(
      `*Free Trial Jadibot 3 Hari*\n\n` +
      `Silahkan ketik:\n` +
      `${usedPrefix + command} 628xxxx`
    )
  }

  // VALIDASI PANJANG NOMOR
  if (
    phoneNumber.length < 10 ||
    phoneNumber.length > 15
  ) {
    return m.reply(
      "❌ Nomor tidak valid.\n\nGunakan format:\n628xxxx"
    )
  }

  // HARUS DIAWALI 62
  if (!phoneNumber.startsWith("62")) {
    return m.reply(
      "❌ Gunakan format nomor Indonesia.\n\nContoh:\n628xxxx"
    )
  }

  // CEK NOMOR WHATSAPP VALID
  let check

  try {

    check =
      await conn.onWhatsApp(
        `${phoneNumber}@s.whatsapp.net`
      )

  } catch {

    return m.reply(
      "❌ Gagal memvalidasi nomor WhatsApp."
    )
  }

  if (!check?.length) {
    return m.reply(
      "❌ Nomor WhatsApp tidak ditemukan / tidak valid."
    )
  }

  const db = global.db.data

  if (!db.users[m.sender])
    db.users[m.sender] = {}

  const user =
    db.users[m.sender]

  // SUDAH PERNAH TRIAL
  if (user.usedTrialJadibot) {
    return m.reply(
      "❌ Kamu sudah pernah trial Jadibot."
    )
  }

  // DB JADIBOT
  if (!db.jadibotNumbers)
    db.jadibotNumbers = {}

  // NOMOR SUDAH DIGUNAKAN
  if (db.jadibotNumbers[phoneNumber]) {
    return m.reply(
      "❌ Nomor sudah digunakan."
    )
  }

  const expired =
    Date.now() + (3 * 86400000)

  // SINKRON USER DATABASE
  user.jadibotExpired =
    expired

  user.jadibotNumber =
    phoneNumber

  db.jadibotNumbers[phoneNumber] = {
    owner: m.sender,
    expired,
    trial: true
  }

  user.usedTrialJadibot = true

  const txt =
`✅ *TRIAL JADIBOT BERHASIL*

📱 Nomor : ${phoneNumber}
⏳ Durasi : 3 Hari
📅 Expired :
${formatDate(expired)}

Sekarang kamu bisa langsung mengaktifkan bot.`

  const buttons =
    new ButtonV2(conn)

  await buttons
    .setBody(txt)
    .setFooter(
      global.namebot || "Bot"
    )
    .addButton(
      "🚀 Aktifkan Bot",
      `.jadibot ${phoneNumber}`
    )
    .send(m.chat, {
      quoted: m
    })
}

handler.help = ["trialjb"]
handler.tags = ["jadibot"]
handler.command = /^trialjb$/i

export default handler

function formatDate(ms) {

  return new Date(ms)
    .toLocaleString(
      "id-ID",
      {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    )
}