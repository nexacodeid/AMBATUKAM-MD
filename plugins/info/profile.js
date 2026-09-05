/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'
import { xpRange } from '../../lib/levelling.js'

try {
  GlobalFonts.registerFromPath('./CL8QHRYN.ttf', 'BotFont')
} catch {}

let handler = async (m, { conn, isOwner }) => {
  let who = m.mentionedJid && m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.fromMe
      ? conn.user.jid
      : m.sender

  if (!global.db.data.users[who]) {
    return m.reply('❌ Pengguna tidak ada di database.')
  }

  let user = global.db.data.users[who]
  let username = await conn.getName(who)

  let pp = await conn.profilePictureUrl(who, 'image')
    .catch(() => 'https://files.catbox.moe/v4zgsm.jpg')

  let level = user.level || 0
  let exp = user.exp || 0
  let role = user.role || 'Newbie'
  let money = user.money || 0
  let bank = user.bank || 0
  let cash = user.cash || 0
  let limit = user.limit || 0
  let age = user.age || '-'
  let registered = user.registered ? 'Sudah Terdaftar' : 'Belum Terdaftar'
  let premium = user.premiumTime > Date.now() ? 'Premium' : 'Free User'

  let { min, xp, max } = xpRange(level, global.multiplier || 1)
  let currentXp = exp - min
  let needXp = max - min
  let percent = Math.min(100, Math.max(0, currentXp / needXp * 100))

  let image = await makeProfileCard({
    pp,
    name: user.name || username,
    username,
    number: who.split('@')[0],
    premium,
    registered,
    age,
    level,
    role,
    exp,
    currentXp,
    needXp,
    percent,
    money,
    bank,
    cash,
    limit
  })

  await conn.sendMessage(m.chat, {
    image,
    caption: `✦ *${user.name || username}*\n@${who.split('@')[0]} • Level ${level} • ${premium}`,
    mentions: [who]
  }, { quoted: m })
}

handler.tags = ['rpg', 'info']
handler.help = ['profile @user', 'me', 'my']
handler.command = /^(profile|pp|me|my)$/i

export default handler

async function makeProfileCard(data) {
  const width = 1200
  const height = 720
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const palette = {
    ink: '#08090f',
    panel: '#11121c',
    panelSoft: '#181923',
    crimson: '#e11d48',
    wine: '#881337',
    gold: '#f6d27a',
    goldSoft: '#fff1c7',
    text: '#fffaf2',
    muted: '#aaa5ad',
    line: 'rgba(246, 210, 122, 0.22)'
  }

  // Latar gelap dengan glow merah dan emas khas Shinomiya.
  const bg = ctx.createLinearGradient(0, 0, width, height)
  bg.addColorStop(0, '#06070c')
  bg.addColorStop(0.52, '#130b12')
  bg.addColorStop(1, '#310815')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  drawGlow(ctx, 1090, 70, 430, 'rgba(225, 29, 72, 0.34)')
  drawGlow(ctx, 85, 690, 360, 'rgba(246, 210, 122, 0.11)')
  drawBackgroundPattern(ctx, width, height, palette.gold)

  // Ornamen pita di sudut.
  ctx.save()
  ctx.globalAlpha = 0.55
  ctx.fillStyle = palette.wine
  ctx.beginPath()
  ctx.moveTo(930, 0)
  ctx.lineTo(1200, 0)
  ctx.lineTo(1200, 205)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = palette.crimson
  ctx.globalAlpha = 0.18
  ctx.beginPath()
  ctx.moveTo(1020, 0)
  ctx.lineTo(1200, 0)
  ctx.lineTo(1200, 295)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // Kartu utama.
  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
  ctx.shadowBlur = 32
  ctx.shadowOffsetY = 14
  roundRect(ctx, 38, 38, 1124, 644, 38, 'rgba(10, 11, 18, 0.94)')
  ctx.restore()
  strokeRoundRect(ctx, 38, 38, 1124, 644, 38, 'rgba(246, 210, 122, 0.34)', 2)
  strokeRoundRect(ctx, 48, 48, 1104, 624, 30, 'rgba(225, 29, 72, 0.18)', 1)

  const topLine = ctx.createLinearGradient(78, 0, 1122, 0)
  topLine.addColorStop(0, 'rgba(246, 210, 122, 0)')
  topLine.addColorStop(0.18, palette.gold)
  topLine.addColorStop(0.78, palette.crimson)
  topLine.addColorStop(1, 'rgba(225, 29, 72, 0)')
  ctx.fillStyle = topLine
  ctx.fillRect(78, 61, 1044, 2)

  // Header dan monogram.
  drawMonogram(ctx, 89, 102, palette)
  ctx.fillStyle = palette.goldSoft
  ctx.font = 'bold 28px BotFont'
  ctx.fillText('SHINOMIYA', 126, 98)
  ctx.fillStyle = palette.muted
  ctx.font = '13px BotFont'
  ctx.fillText('PREMIUM IDENTITY SYSTEM', 126, 120)

  const botName = global.getBotName?.() || global.namebot || 'WhatsApp Bot'
  ctx.textAlign = 'right'
  ctx.fillStyle = palette.gold
  ctx.font = 'bold 15px BotFont'
  ctx.fillText('MEMBER PROFILE', 1110, 96)
  ctx.fillStyle = '#77737b'
  ctx.font = '12px BotFont'
  ctx.fillText(`${botName.toUpperCase()}  •  ${new Date().getFullYear()}`, 1110, 119)
  ctx.textAlign = 'left'

  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  ctx.fillRect(78, 146, 1044, 1)

  // Panel profil kiri.
  const leftGradient = ctx.createLinearGradient(74, 170, 404, 624)
  leftGradient.addColorStop(0, 'rgba(136, 19, 55, 0.22)')
  leftGradient.addColorStop(0.5, 'rgba(24, 25, 35, 0.92)')
  leftGradient.addColorStop(1, 'rgba(246, 210, 122, 0.05)')
  roundRect(ctx, 74, 170, 330, 452, 30, leftGradient)
  strokeRoundRect(ctx, 74, 170, 330, 452, 30, 'rgba(246, 210, 122, 0.15)', 1)

  let avatar
  try {
    avatar = await loadImage(data.pp)
  } catch {
    avatar = createAvatarPlaceholder(data.name, palette)
  }

  drawAvatar(ctx, avatar, 239, 303, 112, palette)
  drawLevelSeal(ctx, 329, 383, data.level, palette)

  // Identitas pengguna.
  const displayName = String(data.name || data.username || 'User')
  setFittedFont(ctx, displayName, 275, 34, 22, 'bold')
  ctx.fillStyle = palette.text
  ctx.textAlign = 'center'
  ctx.fillText(ellipsize(ctx, displayName, 275), 239, 460)
  ctx.fillStyle = palette.muted
  ctx.font = '17px BotFont'
  ctx.fillText(`@${data.number}`, 239, 490)

  const premiumLabel = data.premium === 'Premium' ? 'PREMIUM' : 'FREE USER'
  const registerLabel = data.registered === 'Sudah Terdaftar' ? 'VERIFIED' : 'UNVERIFIED'
  const firstWidth = pillWidth(ctx, premiumLabel)
  const secondWidth = pillWidth(ctx, registerLabel)
  const totalBadgeWidth = firstWidth + secondWidth + 10
  let badgeX = 239 - totalBadgeWidth / 2
  drawPill(ctx, badgeX, 514, premiumLabel, data.premium === 'Premium' ? palette.gold : '#52525b', data.premium === 'Premium' ? palette.ink : palette.text)
  badgeX += firstWidth + 10
  drawPill(ctx, badgeX, 514, registerLabel, data.registered === 'Sudah Terdaftar' ? palette.crimson : '#3f3f46', palette.text)

  ctx.fillStyle = 'rgba(246, 210, 122, 0.25)'
  ctx.fillRect(122, 568, 234, 1)
  ctx.fillStyle = '#77737b'
  ctx.font = '11px BotFont'
  ctx.fillText('OFFICIAL MEMBER CARD', 239, 590)
  ctx.font = '10px BotFont'
  ctx.fillStyle = '#5f5b62'
  ctx.fillText(`ID • ${maskNumber(data.number)}`, 239, 608)

  // Pemisah panel.
  const divider = ctx.createLinearGradient(0, 170, 0, 622)
  divider.addColorStop(0, 'rgba(246, 210, 122, 0)')
  divider.addColorStop(0.2, 'rgba(246, 210, 122, 0.25)')
  divider.addColorStop(0.8, 'rgba(225, 29, 72, 0.25)')
  divider.addColorStop(1, 'rgba(225, 29, 72, 0)')
  ctx.fillStyle = divider
  ctx.fillRect(432, 170, 1, 452)

  // Ringkasan level dan role.
  ctx.textAlign = 'left'
  ctx.fillStyle = palette.text
  ctx.font = 'bold 24px BotFont'
  ctx.fillText('PROFILE OVERVIEW', 470, 199)
  ctx.fillStyle = '#77737b'
  ctx.font = '12px BotFont'
  ctx.fillText('PERSONAL PROGRESS & ACCOUNT ASSETS', 470, 220)

  const roleLabel = ellipsizeWithFont(ctx, String(data.role || 'Newbie').toUpperCase(), 190, 'bold 13px BotFont')
  const roleWidth = Math.max(100, ctx.measureText(roleLabel).width + 38)
  drawOutlinePill(ctx, 1110 - roleWidth, 183, roleWidth, roleLabel, palette)

  const xpX = 470
  const xpY = 242
  const xpW = 640
  const xpH = 116
  const xpGradient = ctx.createLinearGradient(xpX, xpY, xpX + xpW, xpY + xpH)
  xpGradient.addColorStop(0, 'rgba(136, 19, 55, 0.24)')
  xpGradient.addColorStop(1, 'rgba(24, 25, 35, 0.82)')
  roundRect(ctx, xpX, xpY, xpW, xpH, 24, xpGradient)
  strokeRoundRect(ctx, xpX, xpY, xpW, xpH, 24, 'rgba(225, 29, 72, 0.22)', 1)

  ctx.fillStyle = palette.gold
  ctx.font = 'bold 12px BotFont'
  ctx.fillText('CURRENT LEVEL', xpX + 26, xpY + 31)
  ctx.fillStyle = palette.text
  ctx.font = 'bold 31px BotFont'
  ctx.fillText(String(data.level), xpX + 26, xpY + 67)
  ctx.fillStyle = palette.muted
  ctx.font = '15px BotFont'
  ctx.fillText(ellipsizeWithFont(ctx, data.role || 'Newbie', 150, '15px BotFont'), xpX + 68, xpY + 65)

  const progress = Math.max(0, Math.min(100, Number(data.percent) || 0))
  const progressCurrent = Math.min(Math.max(0, Number(data.currentXp) || 0), Math.max(1, Number(data.needXp) || 1))
  const progressTarget = Math.max(1, Number(data.needXp) || 1)
  const barX = xpX + 210
  const barY = xpY + 52
  const barW = 350
  const barH = 14
  roundRect(ctx, barX, barY, barW, barH, 7, 'rgba(255,255,255,0.09)')
  if (progress > 0) {
    const fill = ctx.createLinearGradient(barX, 0, barX + barW, 0)
    fill.addColorStop(0, palette.crimson)
    fill.addColorStop(1, palette.gold)
    roundRect(ctx, barX, barY, Math.max(barH, barW * progress / 100), barH, 7, fill)
  }
  ctx.fillStyle = '#8d8991'
  ctx.font = '11px BotFont'
  ctx.fillText('PROGRESS TO NEXT LEVEL', barX, xpY + 36)
  ctx.fillStyle = palette.text
  ctx.font = 'bold 13px BotFont'
  ctx.fillText(`${formatNumber(progressCurrent)} / ${formatNumber(progressTarget)} XP`, barX, xpY + 91)
  ctx.textAlign = 'right'
  ctx.fillStyle = palette.gold
  ctx.font = 'bold 16px BotFont'
  ctx.fillText(`${Math.round(progress)}%`, barX + barW, xpY + 91)
  ctx.textAlign = 'left'
  drawProgressRing(ctx, xpX + 600, xpY + 58, 27, progress, palette)

  // Statistik dalam grid 3 x 2.
  const stats = [
    { code: 'MN', label: 'MONEY', value: formatNumber(data.money), accent: '#f59e0b' },
    { code: 'BK', label: 'BANK', value: formatNumber(data.bank), accent: '#d4af37' },
    { code: 'CS', label: 'CASH', value: formatNumber(data.cash), accent: '#10b981' },
    { code: 'LM', label: 'LIMIT', value: formatNumber(data.limit), accent: '#ec4899' },
    { code: 'XP', label: 'TOTAL EXP', value: formatNumber(data.exp), accent: '#e11d48' },
    { code: 'AG', label: 'UMUR', value: data.age === '-' ? '-' : `${data.age} TH`, accent: '#a78bfa' }
  ]

  const statX = 470
  const statY = 382
  const statW = 204
  const statH = 96
  const gapX = 14
  const gapY = 14
  stats.forEach((stat, index) => {
    const x = statX + (index % 3) * (statW + gapX)
    const y = statY + Math.floor(index / 3) * (statH + gapY)
    drawStatCard(ctx, x, y, statW, statH, stat, palette)
  })

  // Footer signature.
  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  ctx.fillRect(470, 608, 640, 1)
  ctx.fillStyle = '#77737b'
  ctx.font = '11px BotFont'
  ctx.fillText('ELEGANCE  •  INTELLIGENCE  •  AMBITION', 470, 635)
  ctx.textAlign = 'right'
  ctx.fillStyle = palette.gold
  ctx.font = 'bold 11px BotFont'
  ctx.fillText(botName.toUpperCase(), 1110, 635)
  ctx.textAlign = 'left'

  return canvas.toBuffer('image/png')
}

function drawGlow(ctx, x, y, radius, color) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
  glow.addColorStop(0, color)
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
}

function drawBackgroundPattern(ctx, width, height, color) {
  ctx.save()
  ctx.globalAlpha = 0.09
  ctx.fillStyle = color
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 12; col++) {
      const x = 28 + col * 108 + (row % 2 ? 54 : 0)
      const y = 28 + row * 108
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(Math.PI / 4)
      ctx.fillRect(-3, -3, 6, 6)
      ctx.restore()
    }
  }
  ctx.restore()
}

function drawMonogram(ctx, x, y, palette) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(Math.PI / 4)
  const mark = ctx.createLinearGradient(-20, -20, 20, 20)
  mark.addColorStop(0, palette.wine)
  mark.addColorStop(1, palette.crimson)
  ctx.fillStyle = mark
  ctx.fillRect(-20, -20, 40, 40)
  ctx.strokeStyle = palette.gold
  ctx.lineWidth = 2
  ctx.strokeRect(-20, -20, 40, 40)
  ctx.rotate(-Math.PI / 4)
  ctx.fillStyle = palette.goldSoft
  ctx.font = 'bold 21px BotFont'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('S', 0, 1)
  ctx.restore()
}

function drawAvatar(ctx, image, cx, cy, radius, palette) {
  ctx.save()
  ctx.shadowColor = 'rgba(225, 29, 72, 0.55)'
  ctx.shadowBlur = 30
  ctx.fillStyle = palette.crimson
  ctx.beginPath()
  ctx.arc(cx, cy, radius + 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.clip()
  drawCoverImage(ctx, image, cx - radius, cy - radius, radius * 2, radius * 2)
  const shade = ctx.createLinearGradient(0, cy - radius, 0, cy + radius)
  shade.addColorStop(0.55, 'rgba(0,0,0,0)')
  shade.addColorStop(1, 'rgba(0,0,0,0.28)')
  ctx.fillStyle = shade
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
  ctx.restore()

  ctx.strokeStyle = palette.gold
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, radius - 3, 0, Math.PI * 2)
  ctx.stroke()
}

function drawCoverImage(ctx, image, x, y, width, height) {
  const imageWidth = image.width || width
  const imageHeight = image.height || height
  const scale = Math.max(width / imageWidth, height / imageHeight)
  const drawWidth = imageWidth * scale
  const drawHeight = imageHeight * scale
  ctx.drawImage(
    image,
    x + (width - drawWidth) / 2,
    y + (height - drawHeight) / 2,
    drawWidth,
    drawHeight
  )
}

function createAvatarPlaceholder(name, palette) {
  const canvas = createCanvas(320, 320)
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 320, 320)
  gradient.addColorStop(0, palette.wine)
  gradient.addColorStop(1, palette.ink)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 320, 320)
  ctx.fillStyle = 'rgba(246, 210, 122, 0.12)'
  ctx.beginPath()
  ctx.arc(250, 55, 150, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = palette.goldSoft
  ctx.font = 'bold 132px BotFont'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(name || 'U').trim().charAt(0).toUpperCase() || 'U', 160, 172)
  return canvas
}

function drawLevelSeal(ctx, x, y, level, palette) {
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.55)'
  ctx.shadowBlur = 14
  ctx.fillStyle = palette.ink
  ctx.beginPath()
  ctx.arc(x, y, 36, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  ctx.strokeStyle = palette.gold
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(x, y, 34, 0, Math.PI * 2)
  ctx.stroke()
  ctx.textAlign = 'center'
  ctx.fillStyle = palette.gold
  ctx.font = 'bold 10px BotFont'
  ctx.fillText('LEVEL', x, y - 5)
  ctx.fillStyle = palette.text
  ctx.font = 'bold 18px BotFont'
  ctx.fillText(String(level), x, y + 16)
  ctx.textAlign = 'left'
}

function drawProgressRing(ctx, x, y, radius, progress, palette) {
  ctx.strokeStyle = 'rgba(255,255,255,0.09)'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.stroke()
  if (progress > 0) {
    ctx.strokeStyle = palette.gold
    ctx.lineCap = 'round'
    ctx.beginPath()
    const visibleProgress = Math.min(99.999, progress)
    ctx.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * visibleProgress / 100)
    ctx.stroke()
    ctx.lineCap = 'butt'
  }
  ctx.fillStyle = palette.goldSoft
  ctx.font = 'bold 8px BotFont'
  ctx.textAlign = 'center'
  ctx.fillText(progress >= 100 ? 'MAX' : String(Math.round(progress)), x, y + 3)
  ctx.textAlign = 'left'
}

function drawStatCard(ctx, x, y, width, height, stat, palette) {
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height)
  gradient.addColorStop(0, 'rgba(255,255,255,0.075)')
  gradient.addColorStop(1, 'rgba(255,255,255,0.025)')
  roundRect(ctx, x, y, width, height, 20, gradient)
  strokeRoundRect(ctx, x, y, width, height, 20, 'rgba(255,255,255,0.075)', 1)

  ctx.fillStyle = `${stat.accent}22`
  ctx.beginPath()
  ctx.arc(x + 36, y + 37, 21, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = stat.accent
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = stat.accent
  ctx.font = 'bold 10px BotFont'
  ctx.textAlign = 'center'
  ctx.fillText(stat.code, x + 36, y + 41)

  ctx.textAlign = 'left'
  ctx.fillStyle = palette.muted
  ctx.font = '11px BotFont'
  ctx.fillText(stat.label, x + 68, y + 31)
  const value = String(stat.value)
  setFittedFont(ctx, value, width - 86, 23, 16, 'bold')
  ctx.fillStyle = palette.text
  ctx.fillText(ellipsize(ctx, value, width - 86), x + 68, y + 61)

  ctx.fillStyle = stat.accent
  roundRect(ctx, x + 17, y + height - 8, width - 34, 2, 1, stat.accent)
  ctx.textAlign = 'left'
}

function pillWidth(ctx, text) {
  ctx.font = 'bold 10px BotFont'
  return Math.max(78, ctx.measureText(String(text)).width + 32)
}

function drawPill(ctx, x, y, text, background, color) {
  const width = pillWidth(ctx, text)
  roundRect(ctx, x, y, width, 28, 14, background)
  ctx.fillStyle = color
  ctx.font = 'bold 10px BotFont'
  ctx.textAlign = 'center'
  ctx.fillText(text, x + width / 2, y + 18)
  ctx.textAlign = 'left'
}

function drawOutlinePill(ctx, x, y, width, text, palette) {
  roundRect(ctx, x, y, width, 31, 15, 'rgba(225,29,72,0.10)')
  strokeRoundRect(ctx, x, y, width, 31, 15, 'rgba(225,29,72,0.42)', 1)
  ctx.fillStyle = palette.crimson
  ctx.beginPath()
  ctx.arc(x + 16, y + 15.5, 3.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = palette.goldSoft
  ctx.font = 'bold 13px BotFont'
  ctx.textAlign = 'center'
  ctx.fillText(text, x + width / 2 + 5, y + 20)
  ctx.textAlign = 'left'
}

function roundRect(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.fill()
}

function strokeRoundRect(ctx, x, y, w, h, r, color, lineWidth = 1) {
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.stroke()
}

function setFittedFont(ctx, text, maxWidth, maxSize, minSize, weight = 'normal') {
  let size = maxSize
  do {
    ctx.font = `${weight} ${size}px BotFont`
    if (ctx.measureText(String(text)).width <= maxWidth) break
    size--
  } while (size > minSize)
  return size
}

function ellipsize(ctx, text, maxWidth) {
  let value = String(text || '')
  if (ctx.measureText(value).width <= maxWidth) return value
  while (value.length && ctx.measureText(`${value}…`).width > maxWidth) {
    value = value.slice(0, -1)
  }
  return `${value}…`
}

function ellipsizeWithFont(ctx, text, maxWidth, font) {
  ctx.font = font
  return ellipsize(ctx, text, maxWidth)
}

function maskNumber(number) {
  const value = String(number || '').replace(/\D/g, '')
  if (value.length <= 7) return value || '-'
  return `${value.slice(0, 4)}••••${value.slice(-3)}`
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString('id-ID')
}