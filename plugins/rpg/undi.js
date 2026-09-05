/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const items = ['money', 'limit', 'premium']

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function cleanJid(jid = '') {
  return String(jid).split(':')[0]
}

function isRealUserJid(jid = '') {
  return jid.endsWith('@s.whatsapp.net')
}

function normalizeJid(conn, jid = '') {
  jid = cleanJid(jid)

  try {
    if (typeof conn.getJid === 'function') jid = conn.getJid(jid)
    else if (typeof conn.decodeJid === 'function') jid = conn.decodeJid(jid)
  } catch {}

  return cleanJid(jid)
}

function sameUser(a = '', b = '') {
  a = cleanJid(a)
  b = cleanJid(b)

  if (!a || !b) return false
  if (a === b) return true

  const anum = a.split('@')[0].replace(/\D/g, '')
  const bnum = b.split('@')[0].replace(/\D/g, '')

  return anum && bnum && anum === bnum
}

function getParticipantJid(conn, participant = {}) {
  const candidates = [
    participant.jid,
    participant.id,
    participant.phoneNumber,
    participant.lid
  ].filter(Boolean)

  for (const raw of candidates) {
    const jid = normalizeJid(conn, raw)

    // Prioritaskan JID asli nomor WA, bukan @lid
    if (isRealUserJid(jid)) return jid
  }

  // Kalau tidak ada @s.whatsapp.net, return kosong agar tidak salah simpan ke @lid
  return ''
}

let handler = async (m, {
  conn,
  usedPrefix,
  command,
  args,
  groupMetadata,
  isROwner
}) => {
  try {
    const type = String(args[0] || '').toLowerCase()
    const count = Number(args[1])

    if (!type) {
      return m.reply(
        `Masukkan nama item yang ingin diundi.\n\n` +
        `Contoh:\n${usedPrefix + command} money 100`
      )
    }

    if (!items.includes(type)) {
      return m.reply(
        `Item yang bisa diundi:\n\n${items.map(v => `• ${v}`).join('\n')}`
      )
    }

    if (!Number.isInteger(count) || count < 1) {
      return m.reply(
        `Masukkan jumlah item yang valid.\n\n` +
        `Contoh:\n${usedPrefix + command} limit 10`
      )
    }

    if (type === 'premium' && !isROwner) {
      return m.reply('❌ Hanya *owner utama* yang bisa mengundi item *premium*!')
    }

    const users = global.db.data.users

    const senderJid = normalizeJid(conn, m.sender)
    const botJid = normalizeJid(conn, conn.user?.id || conn.user?.jid || '')

    const senderData = users[senderJid] || users[m.sender] || (users[senderJid] = {})

    if (type !== 'premium') {
      senderData[type] = Number(senderData[type]) || 0

      if (senderData[type] < count) {
        return m.reply(
          `⚠️ Item kamu tidak cukup.\n\n` +
          `Kamu hanya punya *${senderData[type]} ${type}*.`
        )
      }
    }

    if (!groupMetadata?.participants?.length) {
      groupMetadata = await conn.groupMetadata(m.chat).catch(() => null)
    }

    const participants = groupMetadata?.participants || []

    const peserta = participants
      .map(v => getParticipantJid(conn, v))
      .filter(id =>
        id &&
        isRealUserJid(id) &&
        !sameUser(id, senderJid) &&
        !sameUser(id, botJid)
      )

    const uniquePeserta = [...new Set(peserta)]

    if (!uniquePeserta.length) {
      return m.reply(
        `Tidak ada peserta valid untuk diundi 😢\n\n` +
        `Debug:\n` +
        `Total member terbaca: ${participants.length}\n` +
        `Sender: ${senderJid}\n` +
        `Bot: ${botJid}\n\n` +
        `Kemungkinan metadata grup hanya memberi @lid dan tidak ada JID nomor asli.`
      )
    }

    await conn.sendMessage(m.chat, {
      text:
        `🎲 *Undian Dimulai!*\n\n` +
        `🎁 Hadiah : *${type === 'premium' ? `${count} hari Premium` : `${count} ${type}`}*\n` +
        `👥 Peserta: *${uniquePeserta.length} user*\n\n` +
        `Sedang mencari pemenang...`
    }, { quoted: m })

    await delay(7000)

    const winner = uniquePeserta[Math.floor(Math.random() * uniquePeserta.length)]
    const winnerData = users[winner] || (users[winner] = {})

    if (type === 'premium') {
      const duration = 86400000 * count
      const now = Date.now()

      winnerData.premiumTime = Math.max(Number(winnerData.premiumTime) || 0, now) + duration
      winnerData.premium = true
    } else {
      winnerData[type] = (Number(winnerData[type]) || 0) + count
      senderData[type] = Math.max(0, Number(senderData[type]) - count)
    }

    const hadiahMsg = type === 'premium'
      ? `🎉 *UNDIAAN SELESAI!*\n\nSelamat kepada *@${winner.split('@')[0]}*!\n\nKamu mendapatkan *Premium* selama *${count} hari*.\n\nHadiah sudah otomatis masuk ke akun kamu.`
      : `🎉 *UNDIAAN SELESAI!*\n\nSelamat kepada *@${winner.split('@')[0]}*!\n\nKamu mendapatkan *${count} ${type}*.\n\nHadiah sudah otomatis masuk ke akun kamu.`

    await conn.sendMessage(m.chat, {
      text: hadiahMsg,
      mentions: [winner]
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan saat menjalankan undian.')
  }
}

handler.help = ['undian <item> <jumlah>']
handler.tags = ['rpg']
handler.command = /^(undi|undian)$/i
handler.group = true
handler.register = true

export default handler