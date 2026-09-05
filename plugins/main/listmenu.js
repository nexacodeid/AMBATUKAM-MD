// plugins/main/listmenu.js

import fs from 'fs'
import { ButtonV2 } from '../../lib/messagebutton.js'

const CATEGORIES = {
  ai: { icon: '✦', title: 'AI & ASSISTANT' },
  anime: { icon: '❀', title: 'ANIME' },
  bypass: { icon: '⌁', title: 'BYPASS' },
  database: { icon: '▣', title: 'DATABASE' },
  downloader: { icon: '⇩', title: 'DOWNLOADER' },
  fun: { icon: '☻', title: 'FUN' },
  game: { icon: '🎮', title: 'GAME' },
  group: { icon: '♟', title: 'GROUP' },
  info: { icon: 'ⓘ', title: 'INFORMATION' },
  internet: { icon: '◎', title: 'INTERNET' },
  jadibot: { icon: '♙', title: 'JADIBOT' },
  main: { icon: '⌂', title: 'MAIN' },
  maker: { icon: '✎', title: 'MAKER' },
  owner: { icon: '♛', title: 'OWNER' },
  premium: { icon: '◆', title: 'PREMIUM' },
  rpg: { icon: '⚔', title: 'RPG' },
  search: { icon: '⌕', title: 'SEARCH' },
  stalk: { icon: '◉', title: 'STALK' },
  sticker: { icon: '❖', title: 'STICKER' },
  tools: { icon: '⚙', title: 'TOOLS' },
  topup: { icon: '◇', title: 'TOP UP' },
  user: { icon: '♙', title: 'USER' },
  xp: { icon: '✧', title: 'EXPERIENCE' },
}

function asArray(value) {
  return Array.isArray(value) ? value : [value]
}

function cleanInline(value, fallback = '') {
  const text = String(value ?? '')
    .replace(/[`\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return text || fallback
}

function cleanLabel(value, fallback = '') {
  return cleanInline(value, fallback).replace(/[*_~]/g, '').trim() || fallback
}

function pluginFlags(plugin) {
  return [
    plugin.limit ? 'Ⓛ' : '',
    plugin.premium ? 'Ⓟ' : '',
    plugin.owner ? 'Ⓞ' : '',
    plugin.jadibotPaid ? 'Ⓙ' : '',
  ].filter(Boolean)
}

function commandsForCategory(plugins, category, prefix) {
  const commands = new Map()

  for (const plugin of plugins) {
    const tags = asArray(plugin.tags).map(tag => String(tag).toLowerCase())
    if (!tags.includes(category)) continue

    for (const help of asArray(plugin.help).map(value => cleanInline(value)).filter(Boolean)) {
      const command = `${prefix}${help}`
      const key = command.toLocaleLowerCase('id')
      const entry = commands.get(key) || { command, flags: new Set() }

      for (const flag of pluginFlags(plugin)) entry.flags.add(flag)
      commands.set(key, entry)
    }
  }

  return [...commands.entries()]
    .sort(([left], [right]) => left.localeCompare(right, 'id'))
    .map(([, entry]) => {
      const flags = [...entry.flags].join(' ')
      return `> • ${entry.command}${flags ? `  ${flags}` : ''}`
    })
}

function greetingForHour(hour) {
  if (hour < 4) return 'Selamat malam'
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

function jakartaNow() {
  const parts = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const get = type => parts.find(part => part.type === type)?.value || ''

  return {
    greeting: greetingForHour(Number(get('hour')) || 0),
    date: `${get('weekday')}, ${get('day')} ${get('month')} ${get('year')}`,
    time: `${get('hour')}.${get('minute')} WIB`,
  }
}

function getDisplayName(m, conn) {
  const candidates = [m.pushName, m.name]

  try {
    candidates.push(conn.getName?.(m.sender))
  } catch {}

  return cleanLabel(candidates.find(value => typeof value === 'string' && value.trim()), 'Kak')
}

function getMembership(m) {
  const senderNumber = String(m.sender || '').replace(/\D/g, '')
  const isOwner = asArray(global.owner || []).some(owner => {
    const number = Array.isArray(owner) ? owner[0] : owner
    return String(number || '').replace(/\D/g, '') === senderNumber
  })

  if (isOwner) return 'Owner ♛'

  const user = global.db?.data?.users?.[m.sender]
  return Number(user?.premiumTime || 0) > Date.now() ? 'Premium ◆' : 'Free'
}

function activePlugins(plugins) {
  return Object.values(plugins).filter(plugin => {
    if (!plugin || plugin.disabled || !plugin.help || !plugin.tags) return false
    return asArray(plugin.help).some(help => cleanInline(help))
  })
}

export function buildListMenu({
  m,
  conn,
  type,
  usedPrefix = '.',
  plugins = global.plugins || {},
}) {
  const category = CATEGORIES[type]
  if (!category) return null

  const prefix = cleanInline(usedPrefix, '.')
  const commands = commandsForCategory(activePlugins(plugins), type, prefix)
  const botName = cleanLabel(global.getBotName?.() || global.namebot || conn.user?.name, 'Shinomiya - MD')
  const displayName = getDisplayName(m, conn)
  const now = jakartaNow()
  const commandLines = commands.length
    ? commands
    : ['> • Belum ada perintah pada kategori ini.']

  const body = [
    `╭━━〔 *${botName.toUpperCase()}* 〕━━╮`,
    `│ ${now.greeting}, *${displayName}* ♡`,
    `│ ${now.date} • ${now.time}`,
    '├────────────────',
    `│ ${category.icon} Menu: ${category.title}`,
    `│ ✦ ${commands.length} perintah`,
    `│ ✦ Prefix: ${prefix}`,
    `│ ✦ Akses: ${getMembership(m)}`,
    '╰━━━━━━━━━━━━━━━━╯',
    '',
    `_Daftar perintah pilihan untuk kategori ${category.title}._`,
    '',
    `╭─ ${category.icon}  *${category.title}*  · ${commands.length}`,
    ...commandLines,
    '╰──────────────',
    '',
    '╭─ *KETERANGAN*',
    '│ Ⓛ Limit  •  Ⓟ Premium',
    '│ Ⓞ Owner  •  Ⓙ Jadibot berbayar',
    '╰────────────────',
  ].join('\n')

  return {
    body,
    botName,
    category,
    commandCount: commands.length,
    prefix,
  }
}

const handler = async (m, { conn, args = [], usedPrefix = '.' }) => {
  const type = cleanInline(args[0]).toLowerCase()
  const menu = buildListMenu({ m, conn, type, usedPrefix })

  if (!menu) {
    const available = Object.keys(CATEGORIES).join(', ')
    return m.reply(
      [
        '*KATEGORI TIDAK DITEMUKAN*',
        `> Contoh: ${cleanInline(usedPrefix, '.')}listmenu ai`,
        `> Pilihan: ${available}`,
      ].join('\n')
    )
  }

  const thumbnail = fs.existsSync('./media/menu.jpg')
    ? fs.readFileSync('./media/menu.jpg')
    : global.thumbmenu

  const message = new ButtonV2(conn)
    .setTitle(`${menu.botName} • Menu ${menu.category.title}`)
    .setSubtitle(`${menu.commandCount} perintah • kategori ${type}`)
    .setBody(menu.body)
    .setFooter(`© ${new Date().getFullYear()} ${menu.botName}`)

  if (thumbnail) message.setThumbnail(thumbnail)

  await message
    .addButton('⌂ MENU UTAMA', `${menu.prefix}menu`)
    .addButton('▤ SEMUA MENU', `${menu.prefix}allmenu`)
    .addButton('🛒 STOK OWNER', `${menu.prefix}stok`)
    .send(m.chat, { quoted: m })
}

handler.help = ['listmenu']
handler.tags = ['main']
handler.command = /^listmenu$/i

export default handler