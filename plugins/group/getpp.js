/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import { readFile } from 'node:fs/promises'
import fetch from 'node-fetch'

const fallbackAvatar = new URL('../../media/avatar_contact.png', import.meta.url)

function getTarget(m) {
  return m.mentionedJid?.[0] || m.quoted?.sender || m.sender || ''
}

function decodeTarget(conn, jid) {
  try {
    const decoded = conn.decodeJid?.(jid)
    return typeof decoded === 'string' && decoded ? decoded : jid
  } catch {
    return jid
  }
}

async function downloadImage(url, timeoutMs = 15_000) {
  if (!url) throw new Error('URL foto profil tidak tersedia')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`Gagal mengunduh foto profil (HTTP ${response.status})`)

    const buffer = Buffer.from(await response.arrayBuffer())
    if (!buffer.length) throw new Error('Foto profil kosong')

    return buffer
  } finally {
    clearTimeout(timeout)
  }
}

async function getProfilePicture(conn, jid) {
  try {
    const url = await conn.profilePictureUrl(jid, 'image', 15_000)
    return await downloadImage(url)
  } catch {
    return await readFile(fallbackAvatar)
  }
}

const handler = async (m, { conn }) => {
  const target = decodeTarget(conn, getTarget(m))

  if (!target) {
    return m.reply('❌ Tag pengguna atau balas pesannya terlebih dahulu.')
  }

  try {
    const image = await getProfilePicture(conn, target)
    const number = String(target).split('@')[0].split(':')[0]

    await conn.sendMessage(
      m.chat,
      {
        image,
        caption: `✅ *Foto profil @${number}*`,
        mentions: [target],
      },
      { quoted: m }
    )
  } catch (error) {
    console.error(`[GETPP] ${error?.message || String(error)}`)
    return m.reply('❌ Foto profil gagal dikirim. Silakan coba kembali.')
  }
}

handler.help = ['getpp <@tag/reply>']
handler.tags = ['group']
handler.command = /^getpp$/i
handler.register = true
handler.group = true

export default handler