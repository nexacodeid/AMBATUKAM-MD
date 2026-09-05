/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

let handler = async (m, { text, usedPrefix, command }) => {
if (!text) return m.reply(`✍️ *Contoh penggunaan:* ${usedPrefix + command} tt`)
let pluginsDir = './plugins'
let excludeFiles = ['owner-exec.js', 'owner-exec2.js', 'owner-exec3.js']
let files = getAllJSFiles(pluginsDir).filter(file => !excludeFiles.includes(path.basename(file)))
let hasil = []
for (let file of files) {
let fullPath = path.resolve(file)
let modulePath = pathToFileURL(fullPath).href
try {
let content = readFileSync(fullPath, 'utf8')
let mod = await import(modulePath)
let h = mod.default
if (!h?.command) continue
let raw = h.command.toString().replace(/^\/|\/[gimsuy]*$/g, '')
let cmds = raw.split('|').map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '').trim()).filter(Boolean)
if (cmds.some(cmd => cmd.toLowerCase() === text.toLowerCase())) {
let akses = [
h.owner && '👑 Owner',
h.mods && '🛠️ Mods',
h.premium && '💎 Premium',
h.limit && '⏳ Limit',
h.admin && '👮 Admin',
h.botAdmin && '🤖 Bot Admin',
h.group && '👥 Group Only',
h.private && '📱 Private Only',
h.onlyprem && '🔒 Only Premium',
h.nsfw && '🔞 NSFW',
h.rpg && '🎲 RPG',
h.game && '🎮 Game'
].filter(Boolean).join(', ')
let hasAPI = typeof h === 'function' && h.toString().includes('global.API') ? '✨ Ada' : '—'
let help = Array.isArray(h.help) ? h.help.join(', ') : '-'
let tags = Array.isArray(h.tags) ? h.tags.join(', ') : '-'
let imports = [...content.matchAll(/^import\s+.+?from\s+['"].+?['"]/gm)]
.map(m => `*${m[0]}*`).join('\n') || '—'
hasil.push(`🧸 *File: ${file.replace('./', '')}*
🎯 *Fitur: ${help}*
🌸 *Command: ${cmds.join(', ')}*
🍡 *Jumlah: ${cmds.length}*
🏷️ *Tag: ${tags}*
🔐 *Akses: ${akses || '—'}*
🔮 *API: ${hasAPI}*
📦 *Import:*\n${imports}`)
}
} catch (err) {
m.reply(`💥 *Terjadi error saat baca file ${file}*\n\n📄 *Pesan:* ${err.message}`)
}
}
if (!hasil.length) return m.reply(`💔 *Nggak nemu fitur dengan command: "${text}"*`)
m.reply(`🔍 *Fitur dengan command: "${text}" ditemukan di:*\n\n${hasil.join('\n\n')}`)
}

handler.help = ['carifitur']
handler.tags = ['tools']
handler.command = /^(carifitur|cf)$/i
handler.owner = true

export default handler

function getAllJSFiles(dir) {
let res = []
for (let file of readdirSync(dir, { withFileTypes: true })) {
let full = path.join(dir, file.name)
if (file.isDirectory()) res.push(...getAllJSFiles(full))
else if (file.name.endsWith('.js')) res.push(full)
}
return res
}

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */