import fs from 'fs'

const OWNER_FILE = './json/owners.json'

function ensureOwnerFile() {
  if (!fs.existsSync('./json')) fs.mkdirSync('./json', { recursive: true })
  if (!fs.existsSync(OWNER_FILE)) fs.writeFileSync(OWNER_FILE, '[]')
}

function readOwners() {
  ensureOwnerFile()
  try {
    const data = JSON.parse(fs.readFileSync(OWNER_FILE, 'utf8'))
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function saveOwners(data) {
  ensureOwnerFile()
  fs.writeFileSync(OWNER_FILE, JSON.stringify(data, null, 2))
}

function cleanNumber(input = '') {
  return String(input).replace(/[^0-9]/g, '')
}

function normalizeOwnerNumber(number = '') {
  const clean = cleanNumber(number)
  if (!clean) return ''
  if (clean.startsWith('0')) return '62' + clean.slice(1)
  return clean
}

function jidToNumber(jid = '') {
  return normalizeOwnerNumber(String(jid).split('@')[0])
}

function getTargetNumber(m, text = '') {
  if (m.mentionedJid?.[0]) return jidToNumber(m.mentionedJid[0])
  if (m.quoted?.sender) return jidToNumber(m.quoted.sender)
  return normalizeOwnerNumber(text.split('|')[0] || text.split(/\s+/)[0] || '')
}

function getName(text = '', number = '') {
  const parts = String(text).split('|')
  if (parts[1]) return parts.slice(1).join('|').trim()
  const withoutNumber = String(text).replace(number, '').replace(/@\d+/g, '').trim()
  return withoutNumber || 'Owner'
}

function syncOwners() {
  const stored = readOwners()
  if (!Array.isArray(global.owner)) global.owner = []

  for (const item of stored) {
    const number = normalizeOwnerNumber(item?.number || item?.id || item?.[0])
    if (!number) continue
    const exists = global.owner.some(([id]) => normalizeOwnerNumber(id) === number)
    if (!exists) global.owner.push([number, item?.name || item?.[1] || 'Owner', true])
  }
}

function ownerList() {
  syncOwners()
  const seen = new Set()
  return (global.owner || [])
    .map(([number, name, developer]) => ({
      number: normalizeOwnerNumber(number),
      name: name || 'Owner',
      developer: Boolean(developer)
    }))
    .filter(item => {
      if (!item.number || seen.has(item.number)) return false
      seen.add(item.number)
      return true
    })
}

syncOwners()

let handler = async (m, { conn, text, command, usedPrefix }) => {
  const cmd = command.toLowerCase()

  if (cmd === 'listowner' || cmd === 'owners') {
    const list = ownerList()
    if (!list.length) return m.reply('Belum ada owner terdaftar.')

    const teks = list.map((item, i) => {
      return `${i + 1}. ${item.name}\n   wa.me/${item.number}`
    }).join('\n\n')

    return m.reply(`👑 *DAFTAR OWNER*\n\n${teks}`)
  }

  if (cmd === 'addowner') {
    if (!text && !m.quoted && !m.mentionedJid?.length) {
      return m.reply(
        `Format:\n` +
        `${usedPrefix}addowner nomor|nama\n` +
        `${usedPrefix}addowner @tag nama\n` +
        `reply user lalu ${usedPrefix}addowner nama\n\n` +
        `Contoh:\n${usedPrefix}addowner 6281234567890|Rizal`
      )
    }

    const number = getTargetNumber(m, text)
    if (!number || number.length < 8) return m.reply('Nomor tidak valid.')

    const name = getName(text, number)
    const stored = readOwners()
    const alreadyStored = stored.some(item => normalizeOwnerNumber(item.number || item.id || item[0]) === number)
    const alreadyGlobal = (global.owner || []).some(([id]) => normalizeOwnerNumber(id) === number)

    if (!alreadyStored) {
      stored.push({ number, name, addedAt: new Date().toISOString(), addedBy: jidToNumber(m.sender) })
      saveOwners(stored)
    }

    if (!alreadyGlobal) global.owner.push([number, name, true])

    return m.reply(
      `✅ Owner berhasil ditambahkan.\n\n` +
      `Nama : ${name}\n` +
      `Nomor: wa.me/${number}\n\n` +
      `Data tersimpan di json/owners.json.`
    )
  }

  if (cmd === 'delowner' || cmd === 'removeowner') {
    if (!text && !m.quoted && !m.mentionedJid?.length) {
      return m.reply(
        `Format:\n` +
        `${usedPrefix}delowner nomor/@tag\n` +
        `atau reply user lalu ${usedPrefix}delowner`
      )
    }

    const number = getTargetNumber(m, text)
    if (!number) return m.reply('Nomor tidak valid.')

    const configOwners = (global.owner || []).filter(([id]) => normalizeOwnerNumber(id) === number)
    const stored = readOwners()
    const filtered = stored.filter(item => normalizeOwnerNumber(item.number || item.id || item[0]) !== number)

    if (filtered.length === stored.length && configOwners.length) {
      return m.reply('Owner ini berasal dari config.js. Hapus manual di config.js kalau benar-benar ingin menghapus owner utama.')
    }

    saveOwners(filtered)
    global.owner = (global.owner || []).filter(([id]) => normalizeOwnerNumber(id) !== number || configOwners.length)
    syncOwners()

    return m.reply(`✅ Owner wa.me/${number} berhasil dihapus dari json/owners.json.`)
  }
}

handler.help = ['addowner <nomor|nama>', 'delowner <nomor>', 'listowner']
handler.tags = ['owner']
handler.command = /^(addowner|delowner|removeowner|listowner|owners)$/i
handler.rowner = true
handler.owner = true

export default handler