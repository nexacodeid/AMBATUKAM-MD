// plugins/main/allmenu.js

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
  ]
    .filter(Boolean)
    .join(' ')
}

function commandsForCategory(plugins, category, prefix) {
  const commands = new Map()

  for (const plugin of plugins) {
    const tags = asArray(plugin.tags).map(tag => String(tag).toLowerCase())
    if (!tags.includes(category)) continue

    const flags = pluginFlags(plugin).split(' ').filter(Boolean)

    for (const help of asArray(plugin.help).map(value => cleanInline(value)).filter(Boolean)) {
      const command = `${prefix}${help}`
      const key = command.toLocaleLowerCase('id')
      const entry = commands.get(key) || { command, flags: new Set() }

      for (const flag of flags) entry.flags.add(flag)
      commands.set(key, entry)
    }
  }

  return [...commands.entries()]
    .sort(([left], [right]) => left.localeCompare(right, 'id'))
    .map(([, entry]) => {
      const flags = [...entry.flags].join(' ')
      return { line: `> • ${entry.command}${flags ? `  ${flags}` : ''}` }
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
  const hour = Number(get('hour')) || 0

  return {
    greeting: greetingForHour(hour),
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
  const isPremium = Number(user?.premiumTime || 0) > Date.now()
  return isPremium ? 'Premium ◆' : 'Free'
}

export function buildAllMenu({ m, conn, usedPrefix = '.', plugins = global.plugins || {} }) {
  const prefix = cleanInline(usedPrefix, '.')
  const activePlugins = Object.values(plugins).filter(plugin => {
    if (!plugin || plugin.disabled || !plugin.help || !plugin.tags) return false
    return asArray(plugin.help).some(help => cleanInline(help))
  })

  const sections = []
  let totalCommands = 0

  for (const [category, meta] of Object.entries(CATEGORIES)) {
    const commands = commandsForCategory(activePlugins, category, prefix)
    if (!commands.length) continue

    totalCommands += commands.length
    const number = String(sections.length + 1).padStart(2, '0')

    sections.push(
      [
        `╭─ ${number}  ${meta.icon}  *${meta.title}*  · ${commands.length}`,
        ...commands.map(command => command.line),
        '╰──────────────',
      ].join('\n')
    )
  }

  const botName = cleanLabel(global.getBotName?.() || global.namebot || conn.user?.name, 'Shinomiya - MD')
  const displayName = getDisplayName(m, conn)
  const now = jakartaNow()

  const body = [
    `╭━━〔 *${botName.toUpperCase()}* 〕━━╮`,
    `│ ${now.greeting}, *${displayName}* ♡`,
    `│ ${now.date} • ${now.time}`,
    '├────────────────',
    `│ ✦ ${totalCommands} ᴍᴇɴᴜ ᴛᴇʀꜱᴇᴅɪᴀ`,
    `│ ✦ ${sections.length} ᴋᴀᴛᴇɢᴏʀɪ ꜰɪᴛᴜʀ`,
    `│ ✦ ᴘʀᴇꜰɪx: ${prefix}`,
    `│ ✦ ꜱᴛᴀᴛᴜꜱ: ${getMembership(m)}`,
    '╰━━━━━━━━━━━━━━━━╯',
    '',
    '🛒 *ᴛᴇᴍᴘᴀᴛ ᴘᴀɴᴇʟ & ᴊᴀꜱᴀ ʀᴇɴᴀᴍᴇ ᴛᴇʀᴘᴇʀᴄᴀʏᴀ:*',
    'https://fallxd-store-alpha.vercel.app',
    '',
    '_ꜱᴇᴍᴜᴀ ꜰɪᴛᴜʀ ᴀᴍʙᴀᴛᴜᴋᴀᴍ ꜱɪᴀᴘ ᴍᴇᴍʙᴀɴᴛᴜ ᴍᴜ!_',
    `_ᴋᴇᴛɪᴋ ${prefix}ʟɪꜱᴛᴍᴇɴᴜ ᴜɴᴛᴜᴋ ᴛɪᴘᴇ ꜱɪɴɢᴋᴀᴛ._`,
    '',
    sections.join('\n\n'),
    '',
    '╭─ *ɪɴꜰᴏ ɪᴋᴏɴ*',
    '│ Ⓛ ʟɪᴍɪᴛ  •  Ⓟ ᴘʀᴇᴍɪᴜᴍ',
    '│ Ⓞ ᴏᴡɴᴇʀ  •  Ⓙ ᴊᴀᴅɪʙᴏᴛ',
    '╰────────────────'
,
  ].join('\n')

  return {
    body,
    botName,
    categoryCount: sections.length,
    totalCommands,
  }
}

const handler = async (m, { conn, usedPrefix }) => {
  const menu = buildAllMenu({ m, conn, usedPrefix })
  const thumbnail = fs.existsSync('./media/menu.jpg')
    ? fs.readFileSync('./media/menu.jpg')
    : global.thumbmenu

  const message = new ButtonV2(conn)
    .setTitle(`${menu.botName} • All Menu`)
    .setSubtitle(`${menu.totalCommands} perintah • ${menu.categoryCount} kategori`)
    .setBody(menu.body)
    .setFooter(`© ${new Date().getFullYear()} ${menu.botName}`)

  if (thumbnail) message.setThumbnail(thumbnail)

  await message
    .addButton('⌂ MENU UTAMA', `${cleanInline(usedPrefix, '.')}menu`)
    .addButton('🛒 STOK OWNER', `${cleanInline(usedPrefix, '.')}stok`)
    .send(m.chat, { quoted: m })
}

handler.help = ['allmenu']
handler.tags = ['main']
handler.command = /^allmenu$/i

export default handler