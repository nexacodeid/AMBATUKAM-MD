import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'

const CARD_WIDTH = 1280
const CARD_HEIGHT = 720

try {
  GlobalFonts.registerFromPath('./CL8QHRYN.ttf', 'BotFont')
} catch {}

const palette = {
  ink: '#08090f',
  panel: '#11121c',
  crimson: '#e11d48',
  wine: '#881337',
  gold: '#f6d27a',
  goldSoft: '#fff1c7',
  text: '#fffaf2',
  muted: '#aaa5ad'
}

export async function createLevelCard({
  avatarSource,
  name = 'User',
  number = '',
  role = 'Newbie',
  beforeLevel = 0,
  afterLevel = 0,
  expNow = 0,
  expNeed = 1,
  reward = 0,
  botName = global.getBotName?.() || global.namebot || 'WhatsApp Bot',
  mode = afterLevel > beforeLevel ? 'levelup' : 'progress'
} = {}) {
  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT)
  const ctx = canvas.getContext('2d')
  const leveledUp = mode === 'levelup' && Number(afterLevel) > Number(beforeLevel)
  const currentLevel = Math.max(0, Number(afterLevel) || 0)
  const targetLevel = leveledUp ? currentLevel : currentLevel + 1
  const targetXp = Math.max(1, Number(expNeed) || 1)
  const currentXp = Math.max(0, Number(expNow) || 0)
  const progress = Math.max(0, Math.min(100, currentXp / targetXp * 100))

  drawBackground(ctx)
  drawMainCard(ctx)
  drawHeader(ctx, botName, leveledUp)

  const avatar = await resolveAvatar(avatarSource, name)
  drawIdentityPanel(ctx, avatar, { name, number, role, currentLevel, leveledUp })
  drawLevelPanel(ctx, {
    beforeLevel: leveledUp ? beforeLevel : currentLevel,
    afterLevel: targetLevel,
    leveledUp,
    currentXp,
    targetXp,
    progress,
    reward,
    role
  })

  return canvas.toBuffer('image/png')
}

function drawBackground(ctx) {
  const background = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT)
  background.addColorStop(0, '#06070c')
  background.addColorStop(0.52, '#130b12')
  background.addColorStop(1, '#310815')
  ctx.fillStyle = background
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  drawGlow(ctx, 1110, 55, 470, 'rgba(225, 29, 72, 0.38)')
  drawGlow(ctx, 90, 690, 360, 'rgba(246, 210, 122, 0.12)')

  ctx.save()
  ctx.globalAlpha = 0.09
  ctx.fillStyle = palette.gold
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 13; col++) {
      const x = 25 + col * 105 + (row % 2 ? 52 : 0)
      const y = 25 + row * 108
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(Math.PI / 4)
      ctx.fillRect(-3, -3, 6, 6)
      ctx.restore()
    }
  }
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.52
  ctx.fillStyle = palette.wine
  ctx.beginPath()
  ctx.moveTo(1000, 0)
  ctx.lineTo(CARD_WIDTH, 0)
  ctx.lineTo(CARD_WIDTH, 215)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = palette.crimson
  ctx.globalAlpha = 0.16
  ctx.beginPath()
  ctx.moveTo(1100, 0)
  ctx.lineTo(CARD_WIDTH, 0)
  ctx.lineTo(CARD_WIDTH, 310)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawMainCard(ctx) {
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.72)'
  ctx.shadowBlur = 34
  ctx.shadowOffsetY = 14
  fillRoundRect(ctx, 38, 38, 1204, 644, 38, 'rgba(10, 11, 18, 0.95)')
  ctx.restore()
  strokeRoundRect(ctx, 38, 38, 1204, 644, 38, 'rgba(246,210,122,0.34)', 2)
  strokeRoundRect(ctx, 48, 48, 1184, 624, 30, 'rgba(225,29,72,0.18)', 1)

  const topLine = ctx.createLinearGradient(78, 0, 1200, 0)
  topLine.addColorStop(0, 'rgba(246,210,122,0)')
  topLine.addColorStop(0.16, palette.gold)
  topLine.addColorStop(0.78, palette.crimson)
  topLine.addColorStop(1, 'rgba(225,29,72,0)')
  ctx.fillStyle = topLine
  ctx.fillRect(78, 61, 1122, 2)
}

function drawHeader(ctx, botName, leveledUp) {
  drawMonogram(ctx, 89, 102)
  ctx.fillStyle = palette.goldSoft
  ctx.font = 'bold 28px BotFont'
  ctx.fillText('SHINOMIYA', 126, 98)
  ctx.fillStyle = palette.muted
  ctx.font = '13px BotFont'
  ctx.fillText('PREMIUM PROGRESSION SYSTEM', 126, 120)

  ctx.textAlign = 'right'
  ctx.fillStyle = palette.gold
  ctx.font = 'bold 15px BotFont'
  ctx.fillText(leveledUp ? 'LEVEL ASCENSION' : 'LEVEL PROGRESS', 1190, 96)
  ctx.fillStyle = '#77737b'
  ctx.font = '12px BotFont'
  ctx.fillText(String(botName).toUpperCase(), 1190, 119)
  ctx.textAlign = 'left'

  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  ctx.fillRect(78, 146, 1122, 1)
}

function drawIdentityPanel(ctx, avatar, data) {
  const panelGradient = ctx.createLinearGradient(74, 170, 415, 635)
  panelGradient.addColorStop(0, 'rgba(136,19,55,0.24)')
  panelGradient.addColorStop(0.52, 'rgba(24,25,35,0.93)')
  panelGradient.addColorStop(1, 'rgba(246,210,122,0.07)')
  fillRoundRect(ctx, 74, 170, 340, 466, 30, panelGradient)
  strokeRoundRect(ctx, 74, 170, 340, 466, 30, 'rgba(246,210,122,0.16)', 1)

  drawAvatar(ctx, avatar, 244, 315, 114)
  drawLevelSeal(ctx, 337, 393, data.currentLevel)

  const displayName = String(data.name || 'User')
  setFittedFont(ctx, displayName, 282, 36, 22, 'bold')
  ctx.fillStyle = palette.text
  ctx.textAlign = 'center'
  ctx.fillText(ellipsize(ctx, displayName, 282), 244, 476)
  ctx.fillStyle = palette.muted
  ctx.font = '17px BotFont'
  ctx.fillText(data.number ? `@${String(data.number).replace(/\D/g, '')}` : '@member', 244, 505)

  const roleText = ellipsizeWithFont(ctx, String(data.role || 'Newbie').toUpperCase(), 244, 'bold 11px BotFont')
  const roleWidth = Math.min(268, Math.max(116, ctx.measureText(roleText).width + 44))
  fillRoundRect(ctx, 244 - roleWidth / 2, 531, roleWidth, 31, 15, 'rgba(225,29,72,0.14)')
  strokeRoundRect(ctx, 244 - roleWidth / 2, 531, roleWidth, 31, 15, 'rgba(225,29,72,0.44)', 1)
  ctx.fillStyle = palette.crimson
  ctx.beginPath()
  ctx.arc(244 - roleWidth / 2 + 17, 546.5, 3.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = palette.goldSoft
  ctx.font = 'bold 11px BotFont'
  ctx.fillText(roleText, 244, 551)

  ctx.fillStyle = 'rgba(246,210,122,0.24)'
  ctx.fillRect(123, 584, 242, 1)
  ctx.fillStyle = '#77737b'
  ctx.font = '11px BotFont'
  ctx.fillText(data.leveledUp ? 'ASCENSION COMPLETE' : 'PROGRESS TRACKER', 244, 607)
  ctx.fillStyle = '#5f5b62'
  ctx.font = '10px BotFont'
  ctx.fillText(`ID • ${maskNumber(data.number)}`, 244, 624)
  ctx.textAlign = 'left'

  const divider = ctx.createLinearGradient(0, 170, 0, 636)
  divider.addColorStop(0, 'rgba(246,210,122,0)')
  divider.addColorStop(0.2, 'rgba(246,210,122,0.26)')
  divider.addColorStop(0.8, 'rgba(225,29,72,0.26)')
  divider.addColorStop(1, 'rgba(225,29,72,0)')
  ctx.fillStyle = divider
  ctx.fillRect(442, 170, 1, 466)
}

function drawLevelPanel(ctx, data) {
  ctx.fillStyle = palette.text
  ctx.font = 'bold 25px BotFont'
  ctx.fillText(data.leveledUp ? 'LEVEL ASCENSION' : 'LEVEL JOURNEY', 480, 198)
  ctx.fillStyle = '#77737b'
  ctx.font = '12px BotFont'
  ctx.fillText(
    data.leveledUp ? 'A NEW RANK HAS BEEN UNLOCKED' : 'KEEP INTERACTING TO UNLOCK THE NEXT RANK',
    480,
    220
  )

  const transitionX = 480
  const transitionY = 242
  const transitionW = 710
  const transitionH = 214
  const transitionGradient = ctx.createLinearGradient(transitionX, transitionY, transitionX + transitionW, transitionY + transitionH)
  transitionGradient.addColorStop(0, 'rgba(136,19,55,0.26)')
  transitionGradient.addColorStop(1, 'rgba(24,25,35,0.86)')
  fillRoundRect(ctx, transitionX, transitionY, transitionW, transitionH, 26, transitionGradient)
  strokeRoundRect(ctx, transitionX, transitionY, transitionW, transitionH, 26, 'rgba(225,29,72,0.24)', 1)

  drawLevelBox(ctx, 515, 278, 220, 137, data.beforeLevel, data.leveledUp ? 'PREVIOUS' : 'CURRENT', false)
  drawAscensionMark(ctx, 835, 346, data.leveledUp)
  drawLevelBox(ctx, 935, 278, 220, 137, data.afterLevel, data.leveledUp ? 'UNLOCKED' : 'NEXT', true)

  const progressX = 480
  const progressY = 480
  const progressW = 710
  const progressH = 105
  fillRoundRect(ctx, progressX, progressY, progressW, progressH, 22, 'rgba(255,255,255,0.045)')
  strokeRoundRect(ctx, progressX, progressY, progressW, progressH, 22, 'rgba(255,255,255,0.075)', 1)

  ctx.fillStyle = palette.muted
  ctx.font = '11px BotFont'
  ctx.fillText('EXP PROGRESS', progressX + 24, progressY + 27)
  ctx.textAlign = 'right'
  ctx.fillStyle = palette.gold
  ctx.font = 'bold 13px BotFont'
  ctx.fillText(`${formatNumber(Math.min(data.currentXp, data.targetXp))} / ${formatNumber(data.targetXp)} XP`, progressX + progressW - 24, progressY + 28)
  ctx.textAlign = 'left'

  const barX = progressX + 24
  const barY = progressY + 48
  const barW = progressW - 104
  const barH = 15
  fillRoundRect(ctx, barX, barY, barW, barH, 7.5, 'rgba(255,255,255,0.09)')
  if (data.progress > 0) {
    const progressGradient = ctx.createLinearGradient(barX, 0, barX + barW, 0)
    progressGradient.addColorStop(0, palette.crimson)
    progressGradient.addColorStop(1, palette.gold)
    fillRoundRect(ctx, barX, barY, Math.max(barH, barW * data.progress / 100), barH, 7.5, progressGradient)
  }
  drawProgressRing(ctx, progressX + progressW - 45, progressY + 56, 22, data.progress)
  ctx.fillStyle = '#77737b'
  ctx.font = '10px BotFont'
  ctx.fillText(data.leveledUp ? 'Progress menuju level berikutnya' : 'Selesaikan aktivitas untuk mendapatkan EXP', barX, progressY + 84)

  const rewardText = data.reward > 0
    ? `REWARD  +${formatNumber(data.reward)} MONEY`
    : `${formatNumber(Math.max(0, data.targetXp - data.currentXp))} XP TO NEXT LEVEL`
  drawInfoPill(ctx, 480, 607, 334, rewardText, palette.gold)
  drawInfoPill(ctx, 832, 607, 358, ellipsizeWithFont(ctx, String(data.role || 'Newbie').toUpperCase(), 300, 'bold 11px BotFont'), palette.crimson)

  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  ctx.fillRect(480, 657, 710, 1)
  ctx.fillStyle = '#77737b'
  ctx.font = '10px BotFont'
  ctx.fillText('ELEGANCE  •  INTELLIGENCE  •  AMBITION', 480, 674)
  ctx.textAlign = 'right'
  ctx.fillStyle = palette.gold
  ctx.font = 'bold 10px BotFont'
  ctx.fillText('SHINOMIYA • MD', 1190, 674)
  ctx.textAlign = 'left'
}

function drawLevelBox(ctx, x, y, width, height, level, label, highlighted) {
  const background = highlighted
    ? ctx.createLinearGradient(x, y, x + width, y + height)
    : 'rgba(255,255,255,0.035)'
  if (highlighted) {
    background.addColorStop(0, 'rgba(225,29,72,0.23)')
    background.addColorStop(1, 'rgba(246,210,122,0.08)')
  }
  fillRoundRect(ctx, x, y, width, height, 22, background)
  strokeRoundRect(ctx, x, y, width, height, 22, highlighted ? 'rgba(246,210,122,0.46)' : 'rgba(255,255,255,0.08)', highlighted ? 2 : 1)
  ctx.fillStyle = highlighted ? palette.gold : palette.muted
  ctx.font = 'bold 11px BotFont'
  ctx.textAlign = 'center'
  ctx.fillText(label, x + width / 2, y + 30)
  ctx.fillStyle = palette.text
  ctx.font = 'bold 62px BotFont'
  ctx.fillText(String(level), x + width / 2, y + 101)
  ctx.textAlign = 'left'
}

function drawAscensionMark(ctx, x, y, leveledUp) {
  ctx.save()
  ctx.shadowColor = 'rgba(225,29,72,0.45)'
  ctx.shadowBlur = 18
  ctx.fillStyle = palette.ink
  ctx.beginPath()
  ctx.arc(x, y, 42, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  ctx.strokeStyle = palette.gold
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(x, y, 40, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = palette.goldSoft
  ctx.font = leveledUp ? 'bold 31px BotFont' : 'bold 19px BotFont'
  ctx.textAlign = 'center'
  ctx.fillText(leveledUp ? '›' : 'NEXT', x, y + (leveledUp ? 10 : 6))
  ctx.textAlign = 'left'
}

function drawInfoPill(ctx, x, y, width, text, accent) {
  fillRoundRect(ctx, x, y, width, 36, 18, 'rgba(255,255,255,0.04)')
  strokeRoundRect(ctx, x, y, width, 36, 18, `${accent}55`, 1)
  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.arc(x + 19, y + 18, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = palette.text
  ctx.font = 'bold 11px BotFont'
  ctx.textAlign = 'center'
  ctx.fillText(text, x + width / 2 + 5, y + 23)
  ctx.textAlign = 'left'
}

async function resolveAvatar(source, name) {
  if (source?.width && source?.height) return source
  if (source) {
    try {
      return await loadImage(source)
    } catch {}
  }
  return createAvatarPlaceholder(name)
}

function createAvatarPlaceholder(name) {
  const canvas = createCanvas(360, 360)
  const ctx = canvas.getContext('2d')
  const background = ctx.createLinearGradient(0, 0, 360, 360)
  background.addColorStop(0, palette.wine)
  background.addColorStop(1, palette.ink)
  ctx.fillStyle = background
  ctx.fillRect(0, 0, 360, 360)
  ctx.fillStyle = 'rgba(246,210,122,0.12)'
  ctx.beginPath()
  ctx.arc(285, 65, 165, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = palette.goldSoft
  ctx.font = 'bold 145px BotFont'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(name || 'U').trim().charAt(0).toUpperCase() || 'U', 180, 192)
  return canvas
}

function drawAvatar(ctx, image, cx, cy, radius) {
  ctx.save()
  ctx.shadowColor = 'rgba(225,29,72,0.58)'
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
  shade.addColorStop(0.56, 'rgba(0,0,0,0)')
  shade.addColorStop(1, 'rgba(0,0,0,0.28)')
  ctx.fillStyle = shade
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
  ctx.restore()

  ctx.strokeStyle = palette.gold
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2)
  ctx.stroke()
}

function drawLevelSeal(ctx, x, y, level) {
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.55)'
  ctx.shadowBlur = 14
  ctx.fillStyle = palette.ink
  ctx.beginPath()
  ctx.arc(x, y, 37, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  ctx.strokeStyle = palette.gold
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(x, y, 35, 0, Math.PI * 2)
  ctx.stroke()
  ctx.textAlign = 'center'
  ctx.fillStyle = palette.gold
  ctx.font = 'bold 10px BotFont'
  ctx.fillText('LEVEL', x, y - 6)
  ctx.fillStyle = palette.text
  ctx.font = 'bold 19px BotFont'
  ctx.fillText(String(level), x, y + 17)
  ctx.textAlign = 'left'
}

function drawProgressRing(ctx, x, y, radius, progress) {
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.lineWidth = 5
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
  ctx.fillText(`${Math.round(progress)}%`, x, y + 3)
  ctx.textAlign = 'left'
}

function drawMonogram(ctx, x, y) {
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

function drawGlow(ctx, x, y, radius, color) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
  glow.addColorStop(0, color)
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
}

function drawCoverImage(ctx, image, x, y, width, height) {
  const imageWidth = image.width || width
  const imageHeight = image.height || height
  const scale = Math.max(width / imageWidth, height / imageHeight)
  const drawWidth = imageWidth * scale
  const drawHeight = imageHeight * scale
  ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight)
}

function fillRoundRect(ctx, x, y, width, height, radius, fillStyle) {
  ctx.fillStyle = fillStyle
  roundedPath(ctx, x, y, width, height, radius)
  ctx.fill()
}

function strokeRoundRect(ctx, x, y, width, height, radius, strokeStyle, lineWidth = 1) {
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = lineWidth
  roundedPath(ctx, x, y, width, height, radius)
  ctx.stroke()
}

function roundedPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

function setFittedFont(ctx, text, maxWidth, maxSize, minSize, weight = 'normal') {
  let size = maxSize
  do {
    ctx.font = `${weight} ${size}px BotFont`
    if (ctx.measureText(String(text)).width <= maxWidth) break
    size--
  } while (size > minSize)
}

function ellipsize(ctx, text, maxWidth) {
  let value = String(text || '')
  if (ctx.measureText(value).width <= maxWidth) return value
  while (value.length && ctx.measureText(`${value}…`).width > maxWidth) value = value.slice(0, -1)
  return `${value}…`
}

function ellipsizeWithFont(ctx, text, maxWidth, font) {
  ctx.font = font
  return ellipsize(ctx, text, maxWidth)
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('id-ID')
}

function maskNumber(number) {
  const value = String(number || '').replace(/\D/g, '')
  if (value.length <= 7) return value || '-'
  return `${value.slice(0, 4)}••••${value.slice(-3)}`
}
