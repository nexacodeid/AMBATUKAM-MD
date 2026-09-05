/*
 * Fitur : Security Group
 * Type  : Plugins ESM
 * Desc  : Anti link, anti spam, anti toxic, anti media, anti sticker, anti virtex, anti forward, anti view once.
 */

const FEATURES = {
  antilink: 'Anti Link',
  antiinvite: 'Anti Invite Grup',
  antiwame: 'Anti WA.me',
  antitoxic: 'Anti Toxic',
  antispam: 'Anti Spam',
  antimedia: 'Anti Media',
  antisticker: 'Anti Sticker',
  antivirtex: 'Anti Virtex',
  antiforward: 'Anti Forwarded',
  antiviewonce: 'Anti View Once',
}

const RECOMMENDED = [
  'antilink',
  'antiinvite',
  'antiwame',
  'antispam',
  'antivirtex',
  'antiforward',
]

const LINK_REGEX = /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|id|co|io|me|xyz|site|online|store|shop|link|app|dev|gg|ly)(\/|\b)|t\.me\/|telegram\.me\/|discord\.gg\/|discord\.com\/invite\/|bit\.ly\/|tinyurl\.com\/|youtu\.be\/|youtube\.com\/|instagram\.com\/|facebook\.com\/|fb\.watch\/|x\.com\/|twitter\.com\/|tiktok\.com\/)/i
const INVITE_REGEX = /(chat\.whatsapp\.com\/|whatsapp\.com\/channel\/|wa\.me\/|api\.whatsapp\.com\/send|whatsapp:\/\/send)/i
const TOXIC_REGEX = /\b(anjing|bangsat|bajingan|kontol|memek|ngentot|goblok|tolol|idiot|asu|jancok|pantek|kimak|babi)\b/i
const BIDI_REGEX = /[\u202A-\u202E\u2066-\u2069]/

let handler = async (m, { args, usedPrefix, command, conn }) => {
  const chat = getChatData(m.chat)
  const sub = String(args[0] || '').toLowerCase()
  const value = String(args[1] || '').toLowerCase()

  if (!sub || sub === 'status') {
    return m.reply(renderStatus(chat, usedPrefix, command))
  }

  if (sub === 'on') {
    for (const feature of RECOMMENDED) chat.security[feature] = true
    return m.reply('✅ Security group mode rekomendasi telah *aktif*.')
  }

  if (sub === 'off') {
    for (const feature of Object.keys(FEATURES)) chat.security[feature] = false
    chat.security.warn = {}
    chat.security.spam = {}
    return m.reply('✅ Semua security group telah *dinonaktifkan*.')
  }

  if (sub === 'resetwarn') {
    chat.security.warn = {}
    chat.security.spam = {}
    return m.reply('✅ Data warning dan spam security berhasil direset.')
  }

  if (sub === 'maxwarn') {
    const amount = Number(value)
    if (!Number.isInteger(amount) || amount < 1 || amount > 10) {
      throw `Masukkan angka 1-10.\nContoh: ${usedPrefix + command} maxwarn 3`
    }
    chat.security.maxWarn = amount
    return m.reply(`✅ Max warning security diubah menjadi *${amount}*.`)
  }

  if (sub === 'action') {
    if (!['delete', 'warn', 'kick'].includes(value)) {
      throw `Pilihan action: delete / warn / kick\nContoh: ${usedPrefix + command} action warn`
    }
    chat.security.action = value
    return m.reply(`✅ Action security diubah menjadi *${value}*.`)
  }

  if (sub === 'whitelist') {
    const act = String(args[1] || '').toLowerCase()
    if (!['add', 'del', 'delete', 'list'].includes(act)) {
      throw `Contoh:\n${usedPrefix + command} whitelist add @user\n${usedPrefix + command} whitelist del @user\n${usedPrefix + command} whitelist list`
    }

    if (act === 'list') {
      const list = chat.security.whitelist || []
      if (!list.length) return m.reply('Whitelist security masih kosong.')
      return m.reply(`*Whitelist Security*\n\n${list.map((jid, i) => `${i + 1}. @${jid.split('@')[0]}`).join('\n')}`, null, { mentions: list })
    }

    let target = m.quoted?.sender || m.mentionedJid?.[0]
    if (!target && args[2]) {
      const num = String(args[2]).replace(/[^0-9]/g, '')
      if (num.length >= 8) target = `${num}@s.whatsapp.net`
    }
    if (!target) throw 'Reply/tag user yang ingin diatur whitelist.'

    target = normalizeJid(conn.getJid ? conn.getJid(target) : target)
    chat.security.whitelist = chat.security.whitelist || []

    if (act === 'add') {
      if (!chat.security.whitelist.includes(target)) chat.security.whitelist.push(target)
      return m.reply(`✅ @${target.split('@')[0]} ditambahkan ke whitelist security.`, null, { mentions: [target] })
    }

    chat.security.whitelist = chat.security.whitelist.filter((jid) => jid !== target)
    return m.reply(`✅ @${target.split('@')[0]} dihapus dari whitelist security.`, null, { mentions: [target] })
  }

  if (FEATURES[sub]) {
    if (!['on', 'off'].includes(value)) {
      throw `Format salah.\nContoh: ${usedPrefix + command} ${sub} on\nContoh: ${usedPrefix + command} ${sub} off`
    }
    chat.security[sub] = value === 'on'
    if (!chat.security[sub]) {
      clearFeatureWarn(chat, sub)
    }
    return m.reply(`✅ ${FEATURES[sub]} telah *${value === 'on' ? 'diaktifkan' : 'dinonaktifkan'}*.`)
  }

  throw renderStatus(chat, usedPrefix, command)
}

handler.all = async function (m) {
  try {
    if (!m.isGroup) return

    const conn = this
    const chat = getChatData(m.chat)
    const security = chat.security || {}
    if (!Object.keys(FEATURES).some((key) => security[key])) return

    const sender = normalizeJid(m.key?.participant || m.participant || m.sender || '')
    if (!sender || sender === normalizeJid(conn.user?.jid || conn.user?.id || '')) return
    if ((security.whitelist || []).map(normalizeJid).includes(sender)) return

    const meta = await conn.groupMetadata(m.chat).catch(() => null)
    const participants = meta?.participants || []
    const senderInfo = findParticipant(conn, participants, sender)
    const botInfo = findBot(conn, participants)

    const isSenderAdmin = isAdmin(senderInfo)
    const isBotAdmin = isAdmin(botInfo)
    const isOwner = isOwnerJid(sender, conn)

    if (isSenderAdmin || isOwner) return

    const text = getMessageText(m)
    const msgType = getMessageType(m)
    const reasons = []

    if (security.antispam && isSpam(chat, sender)) reasons.push('Anti Spam')
    if (security.antivirtex && isVirtex(text, m)) reasons.push('Anti Virtex')
    if (security.antiinvite && INVITE_REGEX.test(text)) reasons.push('Anti Invite Grup')
    if (security.antiwame && /(wa\.me\/|api\.whatsapp\.com\/send|whatsapp:\/\/send)/i.test(text)) reasons.push('Anti WA.me')
    if (security.antilink && LINK_REGEX.test(text)) reasons.push('Anti Link')
    if (security.antitoxic && TOXIC_REGEX.test(text)) reasons.push('Anti Toxic')
    if (security.antisticker && msgType === 'stickerMessage') reasons.push('Anti Sticker')
    if (security.antimedia && isMediaType(msgType)) reasons.push('Anti Media')
    if (security.antiforward && isForwarded(m)) reasons.push('Anti Forwarded')
    if (security.antiviewonce && isViewOnce(m)) reasons.push('Anti View Once')

    if (!reasons.length) return

    if (!isBotAdmin) {
      if (Date.now() - (chat.security.lastBotAdminNotice || 0) > 60_000) {
        chat.security.lastBotAdminNotice = Date.now()
        await conn.sendMessage(m.chat, { text: '⚠️ Security aktif, tapi bot belum admin. Jadikan bot admin supaya bisa hapus/kick pelanggar.' })
      }
      return
    }

    await punish(conn, m, chat, sender, reasons)
    return true
  } catch (e) {
    console.error('SECURITY GROUP ERROR:', e)
  }
}

handler.help = ['security', 'security on/off', 'security status']
handler.tags = ['group']
handler.command = /^(satpamgc|security|keamanan|guard)$/i
handler.group = true
handler.admin = true
handler.botAdmin = false
handler.register = true

export default handler

async function punish(conn, m, chat, sender, reasons) {
  const security = chat.security
  const maxWarn = Number(security.maxWarn || 3)
  const action = security.action || 'warn'
  const featureKey = reasons[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  const warnKey = `${featureKey}:${normalizeJid(sender)}`

  security.warn = security.warn || {}
  security.warn[warnKey] = (security.warn[warnKey] || 0) + 1
  const count = security.warn[warnKey]

  if (['delete', 'warn', 'kick'].includes(action)) {
    try {
      await conn.sendMessage(m.chat, { delete: m.key })
    } catch {}
  }

  if (action === 'delete') return

  if (action === 'kick' || count >= maxWarn) {
    await conn.sendMessage(m.chat, {
      text: `🚫 @${sender.split('@')[0]} dikeluarkan.\n\nPelanggaran: ${reasons.join(', ')}\nWarning: ${count}/${maxWarn}`,
      mentions: [sender],
    })
    await conn.groupParticipantsUpdate(m.chat, [sender], 'remove').catch(async () => {
      await conn.sendMessage(m.chat, { text: `Gagal kick @${sender.split('@')[0]}. Cek izin admin bot.`, mentions: [sender] })
    })
    delete security.warn[warnKey]
    return
  }

  await conn.sendMessage(m.chat, {
    text: `⚠️ @${sender.split('@')[0]} melanggar security group.\n\nPelanggaran: ${reasons.join(', ')}\nWarning: ${count}/${maxWarn}`,
    mentions: [sender],
  })
}

function renderStatus(chat, usedPrefix, command) {
  const security = chat.security || {}
  const lines = Object.entries(FEATURES)
    .map(([key, label]) => `${security[key] ? '✅' : '❌'} ${label}`)
    .join('\n')

  return `
╭─〔 SECURITY GROUP 〕
${lines}
├ Action : ${security.action || 'warn'}
├ Max warn : ${security.maxWarn || 3}
╰──────────────

*Command cepat:*
${usedPrefix + command} on
${usedPrefix + command} off
${usedPrefix + command} status
${usedPrefix + command} resetwarn
${usedPrefix + command} action warn/delete/kick
${usedPrefix + command} maxwarn 3

*Aktif/nonaktif per fitur:*
${usedPrefix + command} antilink on
${usedPrefix + command} antiinvite on
${usedPrefix + command} antiwame on
${usedPrefix + command} antitoxic on
${usedPrefix + command} antispam on
${usedPrefix + command} antimedia on
${usedPrefix + command} antisticker on
${usedPrefix + command} antivirtex on
${usedPrefix + command} antiforward on
${usedPrefix + command} antiviewonce on

*Whitelist:*
${usedPrefix + command} whitelist add @user
${usedPrefix + command} whitelist del @user
${usedPrefix + command} whitelist list
`.trim()
}

function getChatData(chatId) {
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.chats = global.db.data.chats || {}

  const chat = global.db.data.chats[chatId] || {}
  global.db.data.chats[chatId] = chat

  chat.security = {
    antilink: false,
    antiinvite: false,
    antiwame: false,
    antitoxic: false,
    antispam: false,
    antimedia: false,
    antisticker: false,
    antivirtex: false,
    antiforward: false,
    antiviewonce: false,
    action: 'warn',
    maxWarn: 3,
    warn: {},
    spam: {},
    whitelist: [],
    ...chat.security,
  }

  chat.security.warn = chat.security.warn || {}
  chat.security.spam = chat.security.spam || {}
  chat.security.whitelist = Array.isArray(chat.security.whitelist) ? chat.security.whitelist : []

  return chat
}

function getMessageText(m) {
  const msg = m.message || {}
  return String(
    m.text ||
      msg.conversation ||
      msg.extendedTextMessage?.text ||
      msg.imageMessage?.caption ||
      msg.videoMessage?.caption ||
      msg.documentMessage?.caption ||
      msg.buttonsResponseMessage?.selectedDisplayText ||
      msg.listResponseMessage?.title ||
      ''
  )
}

function getMessageType(m) {
  const msg = m.message || {}
  const type = Object.keys(msg)[0] || ''
  if (type === 'ephemeralMessage') return Object.keys(msg.ephemeralMessage?.message || {})[0] || type
  if (type === 'viewOnceMessage') return Object.keys(msg.viewOnceMessage?.message || {})[0] || type
  if (type === 'viewOnceMessageV2') return Object.keys(msg.viewOnceMessageV2?.message || {})[0] || type
  return type
}

function isMediaType(type) {
  return ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage'].includes(type)
}

function isForwarded(m) {
  const msg = m.message || {}
  const json = JSON.stringify(msg)
  return /"isForwarded":true|"forwardingScore":([1-9]|[1-9][0-9]+)/.test(json)
}

function isViewOnce(m) {
  const msg = m.message || {}
  return !!(msg.viewOnceMessage || msg.viewOnceMessageV2 || JSON.stringify(msg).includes('viewOnce'))
}

function isVirtex(text, m) {
  const raw = `${text || ''}\n${JSON.stringify(m.message || {})}`
  if (raw.length > 8000) return true
  if ((text || '').length > 4000) return true
  if (BIDI_REGEX.test(raw)) return true
  if (/(.)\1{700,}/u.test(raw)) return true
  if ((raw.match(/[\u200B-\u200F\uFEFF]/g) || []).length > 200) return true
  return false
}

function isSpam(chat, sender) {
  const now = Date.now()
  const limit = 5
  const windowMs = 8000
  const key = normalizeJid(sender)
  chat.security.spam = chat.security.spam || {}
  chat.security.spam[key] = (chat.security.spam[key] || []).filter((time) => now - time <= windowMs)
  chat.security.spam[key].push(now)
  return chat.security.spam[key].length >= limit
}

function findBot(conn, participants = []) {
  const botIds = [
    conn.user?.id,
    conn.user?.jid,
    conn.decodeJid ? conn.decodeJid(conn.user?.id || '') : '',
    conn.decodeJid ? conn.decodeJid(conn.user?.jid || '') : '',
    conn.user?.lid,
  ].filter(Boolean).map(normalizeJid)

  return participants.find((p) => {
    const ids = [p.id, p.jid, p.lid, p.phoneNumber].filter(Boolean).map(normalizeJid)
    return ids.some((id) => botIds.includes(id))
  })
}

function findParticipant(conn, participants = [], jid = '') {
  const normalized = normalizeJid(conn.getJid ? conn.getJid(jid) : jid)
  const userIds = [jid, normalized].filter(Boolean).map(normalizeJid)
  return participants.find((p) => {
    const ids = [p.id, p.jid, p.lid, p.phoneNumber].filter(Boolean).map((id) => normalizeJid(conn.getJid ? conn.getJid(id) : id))
    return ids.some((id) => userIds.includes(id))
  })
}

function isAdmin(participant = {}) {
  return participant?.admin === 'admin' || participant?.admin === 'superadmin' || participant?.isAdmin === true
}

function isOwnerJid(jid, conn) {
  const normalized = normalizeJid(conn.getJid ? conn.getJid(jid) : jid)
  const owners = [conn.decodeJid?.(global.conn?.user?.id || '') || '', ...(global.owner || []).map(([number]) => `${String(number).replace(/[^0-9]/g, '')}@s.whatsapp.net`)]
  return owners.map(normalizeJid).includes(normalized)
}

function clearFeatureWarn(chat, feature) {
  const prefix = feature.toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const key of Object.keys(chat.security.warn || {})) {
    if (key.startsWith(prefix)) delete chat.security.warn[key]
  }
}

function normalizeJid(jid = '') {
  return String(jid).replace(/:\d+@/g, '@').trim()
}