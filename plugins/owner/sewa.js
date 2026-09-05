const DAY = 86400000

const formatDate = (ms) => {
  if (!ms) return 'Tidak aktif'
  return new Date(ms).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB'
}

const parseDuration = (input = '') => {
  const value = String(input).trim().toLowerCase()
  if (!value) return null
  if (['permanen', 'permanent', 'forever'].includes(value)) return 0

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
      const jid = await conn.groupAcceptInvite(code)
      return jid
    } catch {
      try {
        const info = await conn.groupGetInviteInfo(code)
        return info?.id ? `${info.id}@g.us` : null
      } catch {
        return null
      }
    }
  }

  return null
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!global.db.data.chats) global.db.data.chats = {}

  const cmd = command.toLowerCase()
  const isDeleteCommand = ['delsewa', 'hapussewa', 'unsewa'].includes(cmd)
  const isCheckCommand = ['ceksewa', 'checksewa'].includes(cmd)
  const duration = isDeleteCommand || isCheckCommand ? null : parseDuration(args[0])
  const target = (isDeleteCommand || isCheckCommand) && args[0] ? await getTargetChat(m, conn, ['', args[0]]) : await getTargetChat(m, conn, args)

  if (['listsewa', 'sewalist'].includes(cmd)) {
    const entries = Object.entries(global.db.data.chats)
      .filter(([, chat]) => chat?.sewa)
      .sort((a, b) => Number(b[1].sewaTime || 0) - Number(a[1].sewaTime || 0))

    if (!entries.length) return m.reply('Belum ada grup yang aktif sewa.')

    const text = entries.map(([jid, chat], i) => {
      const left = Number(chat.sewaTime || 0) === 0 ? 'Permanen' : formatDate(chat.sewaTime)
      return `${i + 1}. ${jid}\n   Expired: ${left}`
    }).join('\n\n')

    return m.reply(`📋 *List Sewa Grup*\n\n${text}`)
  }

  if (['ceksewa', 'checksewa'].includes(cmd)) {
    const jid = target || m.chat
    if (!jid || !jid.endsWith('@g.us')) throw `Gunakan di grup atau masukkan jid/link grup.\n\nContoh:\n${usedPrefix + command} 120363xxx@g.us`

    const chat = global.db.data.chats[jid] || {}
    const active = chat.sewa && (Number(chat.sewaTime || 0) === 0 || Date.now() < Number(chat.sewaTime || 0))
    return m.reply(
      `📌 *Status Sewa*\n\n` +
      `Grup: ${jid}\n` +
      `Status: ${active ? 'Aktif' : 'Tidak aktif'}\n` +
      `Expired: ${Number(chat.sewaTime || 0) === 0 && chat.sewa ? 'Permanen' : formatDate(chat.sewaTime)}`
    )
  }

  if (['delsewa', 'hapussewa', 'unsewa'].includes(cmd)) {
    const jid = target || m.chat
    if (!jid || !jid.endsWith('@g.us')) throw `Gunakan di grup atau masukkan jid/link grup.\n\nContoh:\n${usedPrefix + command} 120363xxx@g.us`

    if (!global.db.data.chats[jid]) global.db.data.chats[jid] = {}
    Object.assign(global.db.data.chats[jid], {
      sewa: false,
      sewaTime: 0,
      sewaAddedBy: '',
      sewaExpiredNotified: false,
    })

    return m.reply(`✅ Sewa grup berhasil dihapus.\n\nGrup: ${jid}`)
  }

  if (!args[0] || duration === null) {
    throw `Format salah.\n\nContoh:\n${usedPrefix + command} 30\n${usedPrefix + command} 7d\n${usedPrefix + command} 12h\n${usedPrefix + command} permanen\n${usedPrefix + command} 30 120363xxx@g.us\n${usedPrefix + command} 30 https://chat.whatsapp.com/xxxx`
  }

  if (!target || !target.endsWith('@g.us')) {
    throw `Target grup tidak valid. Gunakan command ini di grup atau masukkan jid/link grup.`
  }

  const now = Date.now()
  const old = global.db.data.chats[target] || {}
  const base = old.sewa && Number(old.sewaTime || 0) > now ? Number(old.sewaTime) : now
  const expired = duration === 0 ? 0 : base + duration

  global.db.data.chats[target] = {
    ...old,
    sewa: true,
    sewaTime: expired,
    sewaAddedBy: m.sender,
    sewaExpiredNotified: false,
  }

  return m.reply(
    `✅ *Sewa Grup Aktif*\n\n` +
    `Grup: ${target}\n` +
    `Durasi: ${duration === 0 ? 'Permanen' : args[0]}\n` +
    `Expired: ${duration === 0 ? 'Permanen' : formatDate(expired)}`
  )
}

handler.help = ['addsewa', 'delsewa', 'ceksewa', 'listsewa']
handler.tags = ['owner']
handler.command = /^(addsewa|tambahsewa|\+sewa|delsewa|hapussewa|unsewa|ceksewa|checksewa|listsewa|sewalist)$/i
handler.owner = true

export default handler