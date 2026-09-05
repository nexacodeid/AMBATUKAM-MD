/**
 * Struk Jadibot
 * Watermark: Instagram @zzallxx | TikTok @raizell966
 */

import { createCanvas, loadImage } from '@napi-rs/canvas'

const CHARACTER_URL = 'https://raw.githubusercontent.com/raizell526/dat4/main/uploads/62781c-1778251535128.jpg'

export async function createJadibotStruk({
  toko = global.getBotName?.() || global.namebot || 'WhatsApp Bot',
  id_trx,
  nomor_pelanggan,
  tanggal,
  metode = 'QRIS',
  masa_aktif,
  items = []
}) {
  nomor_pelanggan = String(nomor_pelanggan || '').replace(/[^0-9]/g, '')

  if (!id_trx) id_trx = `TRX${Math.floor(Math.random() * 1000000)}`
  if (!tanggal) {
    tanggal = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta'
    })
  }

  if (!items.length) {
    items = [
      {
        nama: 'Akses Jadibot 30 Hari',
        harga: 15000
      }
    ]
  }

  const width = 900
  const itemHeight = 58
  const height = 930 + items.length * itemHeight

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  let character = null
  try {
    character = await loadImage(CHARACTER_URL)
  } catch (e) {
    console.error('Gagal load character:', e)
  }

  const navy = '#0b2d75'
  const blue = '#3b82f6'
  const soft = '#eff6ff'
  const border = '#bfdbfe'
  const dark = '#111827'

  ctx.fillStyle = '#f8fbff'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#ffffff'
  roundRect(ctx, 28, 28, width - 56, height - 56, 30)
  ctx.fill()

  ctx.strokeStyle = '#93c5fd'
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = '#bfdbfe'
  for (let i = 0; i < 70; i++) {
    ctx.globalAlpha = 0.35
    ctx.beginPath()
    ctx.arc(70 + Math.random() * 330, 55 + Math.random() * 180, 2, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  if (character) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(130, 130, 62, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    drawCoverImage(ctx, character, 68, 68, 124, 124)
    ctx.restore()

    ctx.strokeStyle = blue
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(130, 130, 65, 0, Math.PI * 2)
    ctx.stroke()
  }

  if (character) {
    ctx.save()
    roundRect(ctx, 560, 40, 300, 300, 30)
    ctx.clip()
    drawCoverImage(ctx, character, 560, 40, 300, 300)
    ctx.restore()

    let overlay = ctx.createLinearGradient(560, 40, 560, 340)
    overlay.addColorStop(0, 'rgba(255,255,255,0)')
    overlay.addColorStop(1, 'rgba(255,255,255,0.42)')
    ctx.fillStyle = overlay
    roundRect(ctx, 560, 40, 300, 300, 30)
    ctx.fill()
  }

  ctx.fillStyle = navy
  ctx.font = 'bold 44px Sans'
  ctx.fillText(toko, 215, 118)

  ctx.fillStyle = blue
  ctx.font = 'bold 22px Sans'
  ctx.fillText('— JADIBOT SERVICE —', 245, 158)

  ctx.fillStyle = '#93c5fd'
  roundRect(ctx, 250, 178, 315, 42, 21)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 16px Sans'
  ctx.fillText('Terima kasih sudah berlangganan!', 272, 205)

  drawSparkle(ctx, 515, 112, blue)
  drawSparkle(ctx, 790, 92, blue)
  drawSparkle(ctx, 735, 95, '#60a5fa')
  drawHeart(ctx, 770, 175, '#93c5fd')

  let y = 330

  ctx.fillStyle = soft
  roundRect(ctx, 60, y, 505, 190, 20)
  ctx.fill()

  ctx.strokeStyle = border
  ctx.lineWidth = 2
  ctx.stroke()

  drawInfo(ctx, 'ID TRANSAKSI', id_trx, 100, y + 42)
  drawInfo(ctx, 'TANGGAL', tanggal, 100, y + 82)
  drawInfo(ctx, 'PELANGGAN', nomor_pelanggan, 100, y + 122)
  drawInfo(ctx, 'METODE', metode.toUpperCase(), 100, y + 162)

  ctx.fillStyle = blue
  roundRect(ctx, 640, 390, 200, 60, 18)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 31px Sans'
  ctx.fillText('✓ LUNAS', 670, 430)

  y = 575

  ctx.fillStyle = navy
  roundRect(ctx, 60, y, 300, 56, 18)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px Sans'
  ctx.fillText('DAFTAR ORDER', 110, y + 37)

  y += 90

  const tableX = 60
  const tableW = width - 120

  ctx.fillStyle = navy
  roundRect(ctx, tableX, y, tableW, 62, 16)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 21px Sans'
  ctx.fillText('NO.', tableX + 40, y + 40)
  ctx.fillText('NAMA ORDER', tableX + 245, y + 40)
  ctx.fillText('HARGA', tableX + 690, y + 40)

  y += 62

  ctx.fillStyle = '#ffffff'
  roundRect(ctx, tableX, y, tableW, items.length * itemHeight + 30, 16)
  ctx.fill()

  ctx.strokeStyle = border
  ctx.lineWidth = 2
  ctx.stroke()

  let total = 0

  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    total += item.harga

    let rowY = y + 43 + i * itemHeight

    ctx.fillStyle = '#dbeafe'
    roundRect(ctx, tableX + 35, rowY - 28, 62, 36, 10)
    ctx.fill()

    ctx.fillStyle = navy
    ctx.font = 'bold 19px Sans'
    ctx.fillText(String(i + 1).padStart(2, '0'), tableX + 53, rowY - 4)

    ctx.fillStyle = dark
    ctx.font = '22px Sans'
    ctx.fillText(shortText(ctx, item.nama, 380), tableX + 170, rowY)

    ctx.fillStyle = dark
    ctx.font = 'bold 22px Sans'
    ctx.fillText(formatRupiah(item.harga), tableX + 650, rowY)

    if (i < items.length - 1) {
      ctx.strokeStyle = '#dbeafe'
      ctx.setLineDash([7, 6])
      ctx.beginPath()
      ctx.moveTo(tableX + 40, rowY + 23)
      ctx.lineTo(tableX + tableW - 40, rowY + 23)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  y += items.length * itemHeight + 65

  let gradient = ctx.createLinearGradient(60, y, 840, y)
  gradient.addColorStop(0, '#eff6ff')
  gradient.addColorStop(1, navy)

  ctx.fillStyle = gradient
  roundRect(ctx, 60, y, width - 120, 75, 18)
  ctx.fill()

  ctx.strokeStyle = '#60a5fa'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = navy
  ctx.font = 'bold 25px Sans'
  ctx.fillText('TOTAL PEMBAYARAN', 120, y + 48)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 38px Sans'
  ctx.fillText(formatRupiah(total), 600, y + 50)

  drawSparkle(ctx, 520, y + 35, '#93c5fd')
  drawHeart(ctx, 800, y + 40, '#bfdbfe')

  y += 105

  ctx.fillStyle = soft
  roundRect(ctx, 60, y, width - 120, 130, 18)
  ctx.fill()

  ctx.strokeStyle = border
  ctx.lineWidth = 2
  ctx.setLineDash([8, 6])
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = navy
  ctx.font = '18px Sans'
  ctx.fillText('Akses Jadibot kamu sudah aktif.', 105, y + 36)
  ctx.fillText('Simpan struk ini sebagai bukti pembayaran.', 105, y + 64)

  if (masa_aktif) {
    ctx.font = 'bold 18px Sans'
    ctx.fillText('Aktif sampai: ' + masa_aktif + ' WIB', 105, y + 92)
  }

  ctx.font = 'bold 20px Sans'
  ctx.fillText('Instagram @zzallxx', 565, y + 42)
  ctx.fillText('TikTok @raizell966', 565, y + 72)

  ctx.fillStyle = navy
  roundRect(ctx, 28, height - 92, width - 56, 64, 0)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 21px Sans'
  ctx.fillText(`${toko || global.getBotName?.() || global.namebot || 'WhatsApp Bot'} • Jadibot Service`, 65, height - 52)

  ctx.fillStyle = '#dbeafe'
  ctx.font = '18px Sans'
  ctx.fillText('@zzallxx  |  @raizell966', 610, height - 52)

  return canvas.toBuffer('image/png')
}

function drawInfo(ctx, label, value, x, y) {
  ctx.fillStyle = '#1e3a8a'
  ctx.font = 'bold 17px Sans'
  ctx.fillText(label, x, y)

  ctx.fillStyle = '#111827'
  ctx.font = 'bold 17px Sans'
  ctx.fillText(':  ' + String(value), x + 190, y)
}

function drawCoverImage(ctx, img, x, y, w, h) {
  const iw = img.width
  const ih = img.height
  const scale = Math.max(w / iw, h / ih)
  const nw = iw * scale
  const nh = ih * scale
  const nx = x + (w - nw) / 2
  const ny = y + (h - nh) / 2
  ctx.drawImage(img, nx, ny, nw, nh)
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number)
}

function shortText(ctx, text, maxWidth) {
  text = String(text)
  if (ctx.measureText(text).width <= maxWidth) return text

  while (ctx.measureText(text + '...').width > maxWidth && text.length > 0) {
    text = text.slice(0, -1)
  }

  return text + '...'
}

function roundRect(ctx, x, y, width, height, radius) {
  if (radius === 0) {
    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.closePath()
    return
  }

  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function drawSparkle(ctx, x, y, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y - 14)
  ctx.lineTo(x + 5, y - 5)
  ctx.lineTo(x + 14, y)
  ctx.lineTo(x + 5, y + 5)
  ctx.lineTo(x, y + 14)
  ctx.lineTo(x - 5, y + 5)
  ctx.lineTo(x - 14, y)
  ctx.lineTo(x - 5, y - 5)
  ctx.closePath()
  ctx.fill()
}

function drawHeart(ctx, x, y, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y + 8)
  ctx.bezierCurveTo(x - 20, y - 6, x - 10, y - 24, x, y - 12)
  ctx.bezierCurveTo(x + 10, y - 24, x + 20, y - 6, x, y + 8)
  ctx.fill()
}
