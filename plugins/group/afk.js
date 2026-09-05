// AFK single file: command .afk + auto reply mention + auto comeback
// Pakai file ini saja. Hapus/nonaktifkan file AFK lama lain seperti _afk.js agar tidak dobel reply.

const TZ = 'Asia/Jakarta'
const LOCALE = 'id-ID'
const afkNotifyCooldown = new Map()

function nowJakarta() {
  const date = new Date()
  return {
    dateText: date.toLocaleDateString(LOCALE, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: TZ
    }),
    timeText: date.toLocaleTimeString(LOCALE, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: TZ
    }).replace(/\./g, ':')
  }
}

function formatDuration(ms = 0) {
  ms = Math.max(0, Number(ms) || 0)

  const second = Math.floor(ms / 1000) % 60
  const minute = Math.floor(ms / 60000) % 60
  const hour = Math.floor(ms / 3600000) % 24
  const day = Math.floor(ms / 86400000)

  const parts = []
  if (day) parts.push(`${day} hari`)
  if (hour) parts.push(`${hour} jam`)
  if (minute) parts.push(`${minute} menit`)
  if (second || !parts.length) parts.push(`${second} detik`)

  return parts.join(' ')
}

function getUser(jid) {
  if (!jid) return null
  global.db.data.users[jid] = global.db.data.users[jid] || {}
  const user = global.db.data.users[jid]

  if (typeof user.afk !== 'number') user.afk = -1
  if (typeof user.afkReason !== 'string') user.afkReason = ''
  if (typeof user.afkTime !== 'string') user.afkTime = ''

  return user
}

async function handler(m, { conn, text }) {
  const user = getUser(m.sender)
  const { dateText, timeText } = nowJakarta()
  const reason = (text || '').trim()

  user.afk = Date.now()
  user.afkReason = reason
  user.afkTime = timeText

  const tag = m.sender.replace(/@.+/, '')
  const name = user.name || m.name || tag

  await conn.reply(
    m.chat,
    `*@${tag} Telah AFK*\n\n` +
      `🔖 *Nama:* ${name}\n` +
      `📝 *Alasan:* ${reason || 'Tanpa Alasan'}\n` +
      `🕓 *Pada Jam:* _${timeText}_\n\n` +
      `⎙ *${dateText}*`,
    m,
    { contextInfo: { mentionedJid: [m.sender] } }
  )
}

handler.before = async function beforeAfk(m, { conn } = {}) {
  conn = conn || this

  // Penting: mencegah bot membalas pesan AFK miliknya sendiri secara berulang.
  if (!m || m.fromMe) return false
  if (!m.sender || !m.chat) return false
  if (m.isBaileys) return false

  const senderUser = getUser(m.sender)
  const { dateText } = nowJakarta()

  // Jika user yang AFK mengirim pesan lagi, hapus status AFK.
  if (senderUser && typeof senderUser.afk === 'number' && senderUser.afk > -1) {
    const duration = formatDuration(Date.now() - senderUser.afk)
    const reason = senderUser.afkReason
    const fromTime = senderUser.afkTime || '-'
    const tag = m.sender.replace(/@.+/, '')

    senderUser.afk = -1
    senderUser.afkReason = ''
    senderUser.afkTime = ''

    await conn.reply(
      m.chat,
      `*@${tag} Telah Kembali*\n\n` +
        `${reason ? `♻️ *Setelah:* ${reason}\n` : ''}` +
        `⏱️ *AFK Selama:* ${duration}\n` +
        `🕓 *Dari Jam:* _${fromTime}_\n\n` +
        `⎙ *${dateText}*`,
      m,
      { contextInfo: { mentionedJid: [m.sender] } }
    )
  }

  // Beri tahu kalau pesan men-tag atau reply user yang sedang AFK.
  const jids = [
    ...(Array.isArray(m.mentionedJid) ? m.mentionedJid : []),
    ...(m.quoted?.sender ? [m.quoted.sender] : [])
  ]

  const uniqueJids = [...new Set(jids)].filter(jid => jid && jid !== m.sender)

  for (const jid of uniqueJids) {
    const user = global.db.data.users[jid]
    if (!user || typeof user.afk !== 'number' || user.afk < 0) continue

    // Cooldown supaya satu user AFK tidak dispam berkali-kali di chat yang sama.
    const cooldownKey = `${m.chat}:${jid}`
    const lastNotify = afkNotifyCooldown.get(cooldownKey) || 0
    if (Date.now() - lastNotify < 15000) continue
    afkNotifyCooldown.set(cooldownKey, Date.now())

    const tag = jid.replace(/@.+/, '')
    const reason = user.afkReason || 'Tanpa Alasan'
    const fromTime = user.afkTime || '-'
    const duration = formatDuration(Date.now() - user.afk)

    await conn.reply(
      m.chat,
      `*@${tag} Sedang AFK*\n\n` +
        `📝 *Dengan Alasan:* ${reason}\n` +
        `⏱️ *Selama:* ${duration}\n` +
        `🕑 *Dari Jam:* ${fromTime}`,
      m,
      { contextInfo: { mentionedJid: [jid] } }
    )
  }

  // Jangan return true, agar command lain tetap bisa lanjut diproses.
  return false
}

handler.help = ['afk [alasan]']
handler.tags = ['user']
handler.command = /^afk$/i
handler.register = true
handler.group = true

export default handler