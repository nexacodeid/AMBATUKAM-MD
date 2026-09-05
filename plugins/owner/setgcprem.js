const DAY = 86400000

const formatDate = (ms) => {
  if (!ms) return 'Tidak aktif'
  return new Date(ms).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB'
}

const parseDuration = (input = '') => {
  const value = String(input).trim().toLowerCase()
  if (!value) return null
  if (['on', 'true', 'permanen', 'permanent', 'forever'].includes(value)) return 0
  if (['off', 'false', 'delete', 'del', 'hapus'].includes(value)) return -1

  const match = value.match(/^(\d+)(d|h|j|m|menit|jam|hari|minggu|w|bulan|mo)?$/i)
  if (!match) return null

  const amount = Number(match[1])
  const unit = match[2] || 'd'
  if (!Number.isFinite(amount) || amount <= 0) return null

  if (['m', 'menit'].includes(unit)) return amount * 60 * 1000
  if (['h', 'j', 'jam'].includes(unit)) return amount * 60 * 60 * 1000
  if (['w', 'minggu'].includes(unit)) return amount * 7 * DAY
  if (['mo', 'bulan'].includes(unit)) return amount * 30 * DAY
  return amount * DAY
}

const getTargetChat = async (m, conn, args) => {
  if (m.isGroup && !args[1]) return m.chat

  const input = args[1]
  if (!input) return null

  if (/^\d+@g\.us$/i.test(input)) return input

  const codeMatch = input.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/i) || input.match(/^([0-9A-Za-z]{20,})$/)
  if (codeMatch) {
    const code = codeMatch[1]
    try {
      const info = await conn.groupGetInviteInfo(code)
      return info?.id ? `${info.id}@g.us` : null
    } catch {
      return null
    }
  }

  return null
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!global.db.data.chats) global.db.data.chats = {}

  const cmd = command.toLowerCase()
  const isDeleteCommand = ['delgcprem', 'delgcpremium'].includes(cmd)

  if (['listgcprem', 'gcpremiumlist', 'listgcpremium'].includes(cmd)) {
    const entries = Object.entries(global.db.data.chats)
      .filter(([, chat]) => chat?.premium)
      .sort((a, b) => Number(b[1].premiumTime || 0) - Number(a[1].premiumTime || 0))

    if (!entries.length) return m.reply('Belum ada grup premium yang aktif.')

    const text = entries.map(([jid, chat], i) => {
      const left = Number(chat.premiumTime || 0) === 0 ? 'Permanen' : formatDate(chat.premiumTime)
      return `${i + 1}. ${jid}\n   Expired: ${left}`
    }).join('\n\n')

    return m.reply(`📋 *List Group Premium*\n\n${text}`)
  }

  const duration = isDeleteCommand ? -1 : parseDuration(args[0])
  const target = isDeleteCommand && args[0] ? await getTargetChat(m, conn, ['', args[0]]) : await getTargetChat(m, conn, args)

  if (['cekgcprem', 'cekgcpremium', 'checkgcprem'].includes(cmd)) {
    const jid = target || m.chat
    if (!jid || !jid.endsWith('@g.us')) throw `Gunakan di grup atau masukkan jid/link grup.\n\nContoh:\n${usedPrefix + command} 120363xxx@g.us`

    const chat = global.db.data.chats[jid] || {}
    const active = chat.premium && (Number(chat.premiumTime || 0) === 0 || Date.now() < Number(chat.premiumTime || 0))
    return m.reply(
      `📌 *Status Group Premium*\n\n` +
      `Grup: ${jid}\n` +
      `Status: ${active ? 'Aktif' : 'Tidak aktif'}\n` +
      `Expired: ${Number(chat.premiumTime || 0) === 0 && chat.premium ? 'Permanen' : formatDate(chat.premiumTime)}`
    )
  }

  if (!args[0] || duration === null) {
    throw `Format salah.\n\nContoh:\n${usedPrefix + command} on\n${usedPrefix + command} off\n${usedPrefix + command} 30\n${usedPrefix + command} 7d\n${usedPrefix + command} 12h\n${usedPrefix + command} permanen\n${usedPrefix + command} 30 120363xxx@g.us`
  }

  const jid = target || m.chat
  if (!jid || !jid.endsWith('@g.us')) {
    throw `Target grup tidak valid. Gunakan command ini di grup atau masukkan jid/link grup.`
  }

  if (!global.db.data.chats[jid]) global.db.data.chats[jid] = {}

  if (duration === -1) {
    Object.assign(global.db.data.chats[jid], {
      premium: false,
      premiumTime: 0,
      premiumAddedBy: '',
      premiumExpiredNotified: false,
    })
    return m.reply(`✅ Group premium berhasil dimatikan.\n\nGrup: ${jid}`)
  }

  const now = Date.now()
  const old = global.db.data.chats[jid] || {}
  const base = old.premium && Number(old.premiumTime || 0) > now ? Number(old.premiumTime) : now
  const expired = duration === 0 ? 0 : base + duration

  Object.assign(global.db.data.chats[jid], {
    premium: true,
    premiumTime: expired,
    premiumAddedBy: m.sender,
    premiumExpiredNotified: false,
  })

  return m.reply(
    `✅ *Group Premium Aktif*\n\n` +
    `Grup: ${jid}\n` +
    `Durasi: ${duration === 0 ? 'Permanen' : args[0]}\n` +
    `Expired: ${duration === 0 ? 'Permanen' : formatDate(expired)}\n\n` +
    `Semua member di grup ini sekarang bisa memakai command premium.`
  )
}

handler.help = ['setgcprem', 'cekgcprem', 'listgcprem']
handler.tags = ['owner']
handler.command = /^(setgcprem|setgcpremium|gcprem|gcpremium|delgcprem|delgcpremium|cekgcprem|cekgcpremium|checkgcprem|listgcprem|gcpremiumlist|listgcpremium)$/i
handler.owner = true

export default handler