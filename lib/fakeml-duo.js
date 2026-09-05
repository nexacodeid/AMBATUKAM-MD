import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

const require = createRequire(import.meta.url)
const fakeMlEntry = require.resolve('fake-ml')
const assetsDir = path.join(path.dirname(fakeMlEntry), 'assets')

export const FAKE_ML_DUO_RANKS = Object.freeze({
  epic: 'Epic',
  glory: 'Mythical Glory',
  gm: 'Grandmaster',
  honor: 'Mythical Honor',
  imo: 'Mythical Immortal',
  legend: 'Legend',
  mawi: 'Mythic'
})

export const FAKE_ML_DUO_BORDERS = Object.freeze(
  Array.from({ length: 17 }, (_, index) => index)
)

const WIDTH = 1080
const HEIGHT = 1920
const PANEL_Y = 350
const PANEL_WIDTH = 400
const PANEL_HEIGHT = 1135
const PANEL_X = [90, 590]

const BORDER_OFFSET = Object.freeze({
  1: 26,
  2: 36,
  3: 26,
  4: 26,
  5: 26,
  6: 26,
  7: 26,
  8: 26,
  9: 26,
  10: 26,
  11: 22,
  12: 28,
  13: 26,
  14: 21,
  15: 26,
  16: 26
})

try {
  GlobalFonts.registerFromPath(
    path.join(assetsDir, 'noto-sans.regular.ttf'),
    'MLDuo'
  )
} catch {}

try {
  if (fs.existsSync('./CL8QHRYN.ttf')) {
    GlobalFonts.registerFromPath('./CL8QHRYN.ttf', 'MLDuoDisplay')
  }
} catch {}

export function sanitizeFakeMlName(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N} _.-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 16) || 'Player'
}

export async function createFakeMlDuoCard({
  players,
  title = 'CLASSIC',
  botName = global.getBotName?.() || global.namebot || 'Shinomiya - MD'
} = {}) {
  if (!Array.isArray(players) || players.length !== 2) {
    throw new TypeError('Fake ML Duo membutuhkan tepat dua pemain.')
  }

  const normalizedPlayers = players.map(normalizePlayer)
  const resources = await Promise.all(
    normalizedPlayers.map(async player => {
      const borderPath = player.border > 0
        ? path.join(assetsDir, 'border', `${player.border}.webp`)
        : null

      return {
        player,
        avatar: await loadImage(player.avatar),
        rank: await loadImage(path.join(assetsDir, 'rank', `${player.rank}.webp`)),
        border: borderPath ? await loadImage(borderPath) : null
      }
    })
  )

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  drawBackground(ctx)
  drawHeader(ctx, title, botName)
  drawConnectionBadge(ctx)

  resources.forEach((resource, index) => {
    drawPlayerBanner(ctx, PANEL_X[index], PANEL_Y, resource, index)
  })

  drawLobbyControls(ctx, botName)

  return canvas.toBuffer('image/png')
}

function normalizePlayer(player, index) {
  if (!player?.avatar) {
    throw new TypeError(`Avatar pemain ${index + 1} tidak tersedia.`)
  }

  const rank = String(player.rank || '').toLowerCase()
  const border = Number(player.border)

  if (!FAKE_ML_DUO_RANKS[rank]) {
    throw new TypeError(`Rank pemain ${index + 1} tidak valid.`)
  }

  if (!Number.isInteger(border) || !FAKE_ML_DUO_BORDERS.includes(border)) {
    throw new TypeError(`Border pemain ${index + 1} tidak valid.`)
  }

  return {
    avatar: player.avatar,
    username: sanitizeFakeMlName(player.username),
    rank,
    border,
    ping: Math.max(8, Math.min(999, Number(player.ping) || 52))
  }
}

function drawBackground(ctx) {
  const background = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  background.addColorStop(0, '#071325')
  background.addColorStop(0.45, '#112d54')
  background.addColorStop(1, '#071b38')
  ctx.fillStyle = background
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  drawGlow(ctx, 75, 200, 420, 'rgba(73, 135, 255, 0.26)')
  drawGlow(ctx, 1010, 710, 440, 'rgba(40, 195, 255, 0.14)')
  drawGlow(ctx, 540, 1300, 560, 'rgba(10, 32, 71, 0.72)')

  ctx.save()
  ctx.globalAlpha = 0.15
  ctx.strokeStyle = '#86b4ef'
  ctx.lineWidth = 2
  for (let y = 240; y < HEIGHT; y += 118) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(165, y - 72)
    ctx.lineTo(370, y - 72)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(WIDTH, y + 34)
    ctx.lineTo(WIDTH - 125, y - 22)
    ctx.lineTo(WIDTH - 302, y - 22)
    ctx.stroke()
  }
  ctx.restore()

  const floor = ctx.createLinearGradient(0, 1400, 0, HEIGHT)
  floor.addColorStop(0, 'rgba(7, 22, 47, 0)')
  floor.addColorStop(1, 'rgba(2, 9, 22, 0.88)')
  ctx.fillStyle = floor
  ctx.fillRect(0, 1350, WIDTH, HEIGHT - 1350)

  ctx.save()
  ctx.globalAlpha = 0.17
  ctx.strokeStyle = '#6fa6db'
  ctx.lineWidth = 1
  for (let x = -400; x < WIDTH + 400; x += 125) {
    ctx.beginPath()
    ctx.moveTo(WIDTH / 2, 1420)
    ctx.lineTo(x, HEIGHT)
    ctx.stroke()
  }
  for (let y = 1480; y < HEIGHT; y += 80) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(WIDTH, y)
    ctx.stroke()
  }
  ctx.restore()

  const vignette = ctx.createRadialGradient(
    WIDTH / 2,
    HEIGHT / 2,
    310,
    WIDTH / 2,
    HEIGHT / 2,
    1120
  )
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(1, 'rgba(0, 4, 16, 0.7)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

function drawHeader(ctx, title, botName) {
  ctx.save()

  const topBar = ctx.createLinearGradient(0, 0, 0, 275)
  topBar.addColorStop(0, 'rgba(4, 10, 26, 0.82)')
  topBar.addColorStop(1, 'rgba(4, 10, 26, 0)')
  ctx.fillStyle = topBar
  ctx.fillRect(0, 0, WIDTH, 280)

  ctx.shadowColor = 'rgba(117, 165, 255, 0.85)'
  ctx.shadowBlur = 24
  ctx.strokeStyle = '#a9c5ff'
  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(110, 105)
  ctx.lineTo(47, 105)
  ctx.lineTo(85, 67)
  ctx.moveTo(48, 105)
  ctx.lineTo(86, 143)
  ctx.stroke()

  ctx.shadowBlur = 0
  ctx.textAlign = 'center'
  ctx.fillStyle = '#f2f5ff'
  fitFont(ctx, String(title || 'CLASSIC').toUpperCase(), 575, 68, 44, 'bold', 'MLDuoDisplay, MLDuo, sans-serif')
  ctx.fillText(String(title || 'CLASSIC').toUpperCase(), WIDTH / 2, 120)

  ctx.fillStyle = '#8fb7e8'
  ctx.font = '22px MLDuo, sans-serif'
  ctx.fillText('DUO LOBBY', WIDTH / 2, 162)

  ctx.fillStyle = 'rgba(255,255,255,0.38)'
  ctx.font = '16px MLDuo, sans-serif'
  ctx.fillText(String(botName).toUpperCase(), WIDTH / 2, 199)

  const line = ctx.createLinearGradient(180, 0, 900, 0)
  line.addColorStop(0, 'rgba(114,171,239,0)')
  line.addColorStop(0.5, 'rgba(181,215,255,0.68)')
  line.addColorStop(1, 'rgba(114,171,239,0)')
  ctx.fillStyle = line
  ctx.fillRect(180, 228, 720, 2)

  ctx.restore()
}

function drawConnectionBadge(ctx) {
  ctx.save()
  ctx.shadowColor = 'rgba(255, 201, 77, 0.5)'
  ctx.shadowBlur = 20

  const badge = ctx.createLinearGradient(500, 0, 580, 0)
  badge.addColorStop(0, '#7e4c0e')
  badge.addColorStop(0.5, '#ffe8a0')
  badge.addColorStop(1, '#7e4c0e')
  fillDiamond(ctx, WIDTH / 2, 895, 52, 52, badge)

  ctx.shadowBlur = 0
  ctx.fillStyle = '#17223a'
  ctx.textAlign = 'center'
  ctx.font = 'bold 24px MLDuo, sans-serif'
  ctx.fillText('DUO', WIDTH / 2, 903)
  ctx.restore()
}

function drawPlayerBanner(ctx, x, y, resource, index) {
  const { player, avatar, rank, border } = resource
  const w = PANEL_WIDTH
  const h = PANEL_HEIGHT

  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.74)'
  ctx.shadowBlur = 28
  ctx.shadowOffsetY = 20
  const panelFill = ctx.createLinearGradient(x, y, x + w, y + h)
  panelFill.addColorStop(0, 'rgba(67, 46, 18, 0.95)')
  panelFill.addColorStop(0.36, 'rgba(24, 29, 39, 0.97)')
  panelFill.addColorStop(0.76, 'rgba(27, 25, 25, 0.98)')
  panelFill.addColorStop(1, 'rgba(75, 44, 8, 0.96)')
  bannerPath(ctx, x, y, w, h)
  ctx.fillStyle = panelFill
  ctx.fill()
  ctx.restore()

  const gold = ctx.createLinearGradient(x, y, x + w, y + h)
  gold.addColorStop(0, '#7a4612')
  gold.addColorStop(0.18, '#f8d36e')
  gold.addColorStop(0.4, '#fff0a5')
  gold.addColorStop(0.72, '#bd771d')
  gold.addColorStop(1, '#ffe789')
  ctx.strokeStyle = gold
  ctx.lineWidth = 7
  bannerPath(ctx, x, y, w, h)
  ctx.stroke()

  drawBannerCrown(ctx, x, y, w, gold, index)
  drawBannerLines(ctx, x, y, w, h, gold)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#65ee39'
  ctx.shadowColor = 'rgba(78, 255, 48, 0.45)'
  ctx.shadowBlur = 12
  ctx.font = 'bold 34px MLDuo, sans-serif'
  ctx.fillText(`${player.ping}ms`, x + w / 2, y + 160)
  ctx.shadowBlur = 0

  const avatarSize = 246
  const avatarX = x + (w - avatarSize) / 2
  const avatarY = y + 206

  drawAvatarHolder(ctx, avatarX, avatarY, avatarSize)
  drawCoverImage(ctx, avatar, avatarX, avatarY, avatarSize, avatarSize, 22)

  if (border) {
    const sourceOffset = BORDER_OFFSET[player.border] || 26
    const offset = sourceOffset * (avatarSize / 204)
    ctx.drawImage(
      border,
      avatarX - offset,
      avatarY - offset,
      avatarSize + offset * 2,
      avatarSize + offset * 2
    )
  } else {
    strokeRoundRect(ctx, avatarX, avatarY, avatarSize, avatarSize, 22, '#f5ce6c', 6)
  }

  drawIndonesiaFlag(ctx, avatarX + 3, avatarY + 18, 37)

  const safeName = player.username
  fitFont(ctx, safeName, w - 52, 34, 21, 'bold', 'MLDuo, sans-serif')
  ctx.fillStyle = '#fff9df'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
  ctx.shadowBlur = 8
  ctx.fillText(safeName, x + w / 2, y + 520)
  ctx.shadowBlur = 0

  ctx.fillStyle = 'rgba(255, 255, 255, 0.48)'
  ctx.font = '15px MLDuo, sans-serif'
  ctx.fillText(`PLAYER ${index + 1}  •  BORDER ${player.border}`, x + w / 2, y + 553)

  const divider = ctx.createLinearGradient(x + 48, 0, x + w - 48, 0)
  divider.addColorStop(0, 'rgba(255,218,112,0)')
  divider.addColorStop(0.5, 'rgba(255,224,138,0.7)')
  divider.addColorStop(1, 'rgba(255,218,112,0)')
  ctx.fillStyle = divider
  ctx.fillRect(x + 48, y + 584, w - 96, 2)

  const rankBoxY = y + 625
  drawRankAura(ctx, x + w / 2, rankBoxY + 155)
  drawImageContained(ctx, rank, x + 69, rankBoxY, w - 138, 302)

  ctx.fillStyle = '#ffe49b'
  ctx.font = 'bold 24px MLDuo, sans-serif'
  ctx.fillText(FAKE_ML_DUO_RANKS[player.rank].toUpperCase(), x + w / 2, y + 958)

  ctx.fillStyle = 'rgba(219, 232, 255, 0.52)'
  ctx.font = '15px MLDuo, sans-serif'
  ctx.fillText('RANKED PROFILE', x + w / 2, y + 990)

  drawReadyIndicator(ctx, x + w / 2, y + 1036)
}

function drawBannerCrown(ctx, x, y, w, gold, index) {
  ctx.save()
  ctx.shadowColor = 'rgba(255, 192, 50, 0.58)'
  ctx.shadowBlur = 20
  ctx.fillStyle = gold

  ctx.beginPath()
  ctx.moveTo(x - 18, y + 48)
  ctx.lineTo(x + 55, y - 16)
  ctx.lineTo(x + 122, y + 6)
  ctx.lineTo(x + w / 2, y - 42)
  ctx.lineTo(x + w - 122, y + 6)
  ctx.lineTo(x + w - 55, y - 16)
  ctx.lineTo(x + w + 18, y + 48)
  ctx.lineTo(x + w - 28, y + 112)
  ctx.lineTo(x + 28, y + 112)
  ctx.closePath()
  ctx.fill()

  ctx.shadowBlur = 0
  ctx.fillStyle = 'rgba(29, 21, 14, 0.5)'
  ctx.beginPath()
  ctx.moveTo(x + 56, y + 67)
  ctx.lineTo(x + 127, y + 25)
  ctx.lineTo(x + w / 2, y + 58)
  ctx.lineTo(x + w - 127, y + 25)
  ctx.lineTo(x + w - 56, y + 67)
  ctx.lineTo(x + w - 80, y + 101)
  ctx.lineTo(x + 80, y + 101)
  ctx.closePath()
  ctx.fill()

  const badgeX = index === 0 ? x + w - 39 : x + 39
  const badgeColor = index === 0 ? '#bf765d' : '#b92b52'
  ctx.fillStyle = badgeColor
  ctx.beginPath()
  ctx.arc(badgeX, y + 55, 30, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.strokeStyle = '#fff4e6'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (index === 0) {
    drawHomeIcon(ctx, badgeX, y + 55, 14)
  } else {
    ctx.beginPath()
    ctx.moveTo(badgeX - 9, y + 46)
    ctx.lineTo(badgeX + 9, y + 64)
    ctx.moveTo(badgeX + 9, y + 46)
    ctx.lineTo(badgeX - 9, y + 64)
    ctx.stroke()
  }
  ctx.restore()
}

function drawBannerLines(ctx, x, y, w, h, gold) {
  ctx.save()
  ctx.strokeStyle = gold
  ctx.lineWidth = 3
  ctx.globalAlpha = 0.58

  const left = x + 42
  const right = x + w - 42
  const mid = x + w / 2

  for (const side of [-1, 1]) {
    const edge = side < 0 ? left : right
    ctx.beginPath()
    ctx.moveTo(edge, y + 610)
    ctx.bezierCurveTo(edge + 50 * side, y + 725, mid + 80 * side, y + 865, mid + 92 * side, y + 1030)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(edge + 27 * side, y + 650)
    ctx.bezierCurveTo(edge + 72 * side, y + 760, mid + 36 * side, y + 895, mid + 38 * side, y + 1050)
    ctx.stroke()
  }

  ctx.globalAlpha = 0.9
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(x + 75, y + h - 130)
  ctx.lineTo(mid, y + h - 30)
  ctx.lineTo(x + w - 75, y + h - 130)
  ctx.stroke()
  ctx.restore()
}

function drawAvatarHolder(ctx, x, y, size) {
  ctx.save()
  ctx.shadowColor = 'rgba(255, 195, 64, 0.38)'
  ctx.shadowBlur = 18
  fillRoundRect(ctx, x - 12, y - 12, size + 24, size + 24, 28, '#6f471b')
  ctx.shadowBlur = 0
  strokeRoundRect(ctx, x - 12, y - 12, size + 24, size + 24, 28, '#f4d078', 4)
  ctx.restore()
}

function drawRankAura(ctx, cx, cy) {
  const aura = ctx.createRadialGradient(cx, cy, 20, cx, cy, 155)
  aura.addColorStop(0, 'rgba(255, 229, 126, 0.42)')
  aura.addColorStop(0.42, 'rgba(255, 168, 37, 0.18)')
  aura.addColorStop(1, 'rgba(255, 174, 42, 0)')
  ctx.fillStyle = aura
  ctx.beginPath()
  ctx.arc(cx, cy, 160, 0, Math.PI * 2)
  ctx.fill()
}

function drawReadyIndicator(ctx, cx, y) {
  ctx.save()
  ctx.textAlign = 'center'
  fillRoundRect(ctx, cx - 72, y, 144, 38, 19, 'rgba(35, 192, 95, 0.16)')
  strokeRoundRect(ctx, cx - 72, y, 144, 38, 19, 'rgba(88, 255, 144, 0.5)', 1)
  ctx.fillStyle = '#63f18e'
  ctx.beginPath()
  ctx.arc(cx - 47, y + 19, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = 'bold 15px MLDuo, sans-serif'
  ctx.fillText('READY', cx + 8, y + 25)
  ctx.restore()
}

function drawLobbyControls(ctx, botName) {
  const y = 1665
  const controls = [
    { x: 335, icon: 'speaker', label: 'SPEAKER' },
    { x: 540, icon: 'mic', label: 'MIC' },
    { x: 745, icon: 'chat', label: 'CHAT' }
  ]

  ctx.save()
  for (const control of controls) {
    ctx.fillStyle = 'rgba(7, 21, 46, 0.78)'
    ctx.beginPath()
    ctx.arc(control.x, y, 57, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(139, 190, 244, 0.42)'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.strokeStyle = '#9ab9db'
    ctx.fillStyle = '#9ab9db'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (control.icon === 'speaker') drawSpeakerIcon(ctx, control.x, y, 24)
    if (control.icon === 'mic') drawMicIcon(ctx, control.x, y, 24)
    if (control.icon === 'chat') drawChatIcon(ctx, control.x, y, 24)

    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(189, 215, 243, 0.5)'
    ctx.font = '12px MLDuo, sans-serif'
    ctx.fillText(control.label, control.x, y + 86)
  }

  const footer = ctx.createLinearGradient(180, 0, 900, 0)
  footer.addColorStop(0, 'rgba(104,157,218,0)')
  footer.addColorStop(0.5, 'rgba(104,157,218,0.48)')
  footer.addColorStop(1, 'rgba(104,157,218,0)')
  ctx.fillStyle = footer
  ctx.fillRect(180, 1812, 720, 1)

  ctx.fillStyle = '#acc8e8'
  ctx.font = 'bold 17px MLDuo, sans-serif'
  ctx.fillText('READY TO ENTER BATTLE', WIDTH / 2, 1850)
  ctx.fillStyle = 'rgba(172, 200, 232, 0.46)'
  ctx.font = '13px MLDuo, sans-serif'
  ctx.fillText(String(botName).toUpperCase(), WIDTH / 2, 1880)
  ctx.restore()
}

function drawHomeIcon(ctx, cx, cy, size) {
  ctx.beginPath()
  ctx.moveTo(cx - size, cy)
  ctx.lineTo(cx, cy - size)
  ctx.lineTo(cx + size, cy)
  ctx.moveTo(cx - size + 4, cy - 2)
  ctx.lineTo(cx - size + 4, cy + size)
  ctx.lineTo(cx + size - 4, cy + size)
  ctx.lineTo(cx + size - 4, cy - 2)
  ctx.stroke()
}

function drawSpeakerIcon(ctx, cx, cy, size) {
  ctx.beginPath()
  ctx.moveTo(cx - size, cy - 9)
  ctx.lineTo(cx - 11, cy - 9)
  ctx.lineTo(cx + 4, cy - size)
  ctx.lineTo(cx + 4, cy + size)
  ctx.lineTo(cx - 11, cy + 9)
  ctx.lineTo(cx - size, cy + 9)
  ctx.closePath()
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(cx + 5, cy, 18, -0.8, 0.8)
  ctx.stroke()
}

function drawMicIcon(ctx, cx, cy, size) {
  strokeRoundRect(ctx, cx - 11, cy - size, 22, 35, 11, '#9ab9db', 5)
  ctx.beginPath()
  ctx.moveTo(cx - 22, cy - 4)
  ctx.quadraticCurveTo(cx - 22, cy + 21, cx, cy + 21)
  ctx.quadraticCurveTo(cx + 22, cy + 21, cx + 22, cy - 4)
  ctx.moveTo(cx, cy + 21)
  ctx.lineTo(cx, cy + 31)
  ctx.moveTo(cx - 13, cy + 31)
  ctx.lineTo(cx + 13, cy + 31)
  ctx.stroke()
}

function drawChatIcon(ctx, cx, cy, size) {
  roundRectPath(ctx, cx - size, cy - 18, size * 2, 35, 10)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(cx - 8, cy + 17)
  ctx.lineTo(cx - 16, cy + 27)
  ctx.lineTo(cx + 1, cy + 17)
  ctx.stroke()

  for (const offset of [-11, 0, 11]) {
    ctx.beginPath()
    ctx.arc(cx + offset, cy, 2.8, 0, Math.PI * 2)
    ctx.fill()
  }
}

function bannerPath(ctx, x, y, width, height) {
  ctx.beginPath()
  ctx.moveTo(x + 34, y)
  ctx.lineTo(x + width - 34, y)
  ctx.lineTo(x + width, y + 54)
  ctx.lineTo(x + width - 12, y + height - 184)
  ctx.lineTo(x + width - 72, y + height - 76)
  ctx.lineTo(x + width / 2, y + height)
  ctx.lineTo(x + 72, y + height - 76)
  ctx.lineTo(x + 12, y + height - 184)
  ctx.lineTo(x, y + 54)
  ctx.closePath()
}

function drawCoverImage(ctx, image, x, y, width, height, radius) {
  const scale = Math.max(width / image.width, height / image.height)
  const sourceWidth = width / scale
  const sourceHeight = height / scale
  const sourceX = (image.width - sourceWidth) / 2
  const sourceY = (image.height - sourceHeight) / 2

  ctx.save()
  roundRectPath(ctx, x, y, width, height, radius)
  ctx.clip()
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height
  )
  ctx.restore()
}

function drawImageContained(ctx, image, x, y, width, height) {
  const scale = Math.min(width / image.width, height / image.height)
  const targetWidth = image.width * scale
  const targetHeight = image.height * scale
  const targetX = x + (width - targetWidth) / 2
  const targetY = y + (height - targetHeight) / 2

  ctx.save()
  ctx.shadowColor = 'rgba(255, 198, 71, 0.5)'
  ctx.shadowBlur = 24
  ctx.drawImage(image, targetX, targetY, targetWidth, targetHeight)
  ctx.restore()
}

function drawIndonesiaFlag(ctx, cx, cy, radius) {
  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)'
  ctx.shadowBlur = 10
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(cx, cy, radius + 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.clip()
  ctx.fillStyle = '#d60032'
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(cx - radius, cy, radius * 2, radius)
  ctx.restore()
}

function drawGlow(ctx, x, y, radius, color) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
  glow.addColorStop(0, color)
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
}

function fillDiamond(ctx, cx, cy, width, height, style) {
  ctx.beginPath()
  ctx.moveTo(cx, cy - height)
  ctx.lineTo(cx + width, cy)
  ctx.lineTo(cx, cy + height)
  ctx.lineTo(cx - width, cy)
  ctx.closePath()
  ctx.fillStyle = style
  ctx.fill()
}

function fillRoundRect(ctx, x, y, width, height, radius, style) {
  roundRectPath(ctx, x, y, width, height, radius)
  ctx.fillStyle = style
  ctx.fill()
}

function strokeRoundRect(ctx, x, y, width, height, radius, style, lineWidth) {
  roundRectPath(ctx, x, y, width, height, radius)
  ctx.strokeStyle = style
  ctx.lineWidth = lineWidth
  ctx.stroke()
}

function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function fitFont(ctx, text, maxWidth, maxSize, minSize, weight, family) {
  let size = maxSize
  do {
    ctx.font = `${weight} ${size}px ${family}`
    if (ctx.measureText(text).width <= maxWidth) return size
    size -= 1
  } while (size > minSize)

  ctx.font = `${weight} ${minSize}px ${family}`
  return minSize
}
