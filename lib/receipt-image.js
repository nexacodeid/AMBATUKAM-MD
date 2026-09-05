import { createCanvas } from '@napi-rs/canvas'

function rupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

function angka(value) {
  return Number(value || 0).toLocaleString('id-ID')
}

function waktuJakarta(value = new Date()) {
  const parts = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(new Date(value))
  const get = type => parts.find(part => part.type === type)?.value || '00'
  return {
    tanggal: `${get('year')}-${get('month')}-${get('day')}`,
    jam: `${get('hour')}.${get('minute')}`,
    fileTanggal: `${get('year')}${get('month')}${get('day')}`,
    fileJam: `${get('hour')}${get('minute')}`
  }
}

function onlyNumber(jid = '') {
  return String(jid).split('@')[0].replace(/\D/g, '')
}

function truncate(text, max = 34) {
  text = String(text || '')
  return text.length > max ? text.slice(0, max - 1) + '…' : text
}

function drawDashedLine(ctx, x1, y, x2) {
  ctx.save()
  ctx.setLineDash([10, 8])
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x1, y)
  ctx.lineTo(x2, y)
  ctx.stroke()
  ctx.restore()
}

function drawStoreIcon(ctx, cx, y) {
  ctx.save()
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const x = cx - 28
  ctx.strokeRect(x + 8, y + 28, 56, 42)
  ctx.beginPath()
  ctx.moveTo(x + 10, y + 28)
  ctx.lineTo(x + 20, y + 8)
  ctx.lineTo(x + 52, y + 8)
  ctx.lineTo(x + 62, y + 28)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + 8, y + 28)
  ctx.lineTo(x + 64, y + 28)
  ctx.stroke()
  ctx.strokeRect(x + 30, y + 48, 13, 22)
  ctx.beginPath()
  ctx.moveTo(x + 28, y + 39)
  ctx.lineTo(x + 45, y + 39)
  ctx.stroke()
  ctx.restore()
}

function textCenter(ctx, text, y, font = '28px Arial', color = '#111') {
  ctx.save()
  ctx.fillStyle = color
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(String(text || ''), 360, y)
  ctx.restore()
}

function textLeft(ctx, text, x, y, font = '24px Arial') {
  ctx.save()
  ctx.fillStyle = '#111'
  ctx.font = font
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(String(text || ''), x, y)
  ctx.restore()
}

function textRight(ctx, text, x, y, font = '24px Arial') {
  ctx.save()
  ctx.fillStyle = '#111'
  ctx.font = font
  ctx.textAlign = 'right'
  ctx.textBaseline = 'top'
  ctx.fillText(String(text || ''), x, y)
  ctx.restore()
}

function hitungTinggi(items, hasDiscount, hasUnique, hasRef) {
  return 610 + (items.length * 92) + (hasDiscount ? 34 : 0) + (hasUnique ? 34 : 0) + (hasRef ? 48 : 0)
}

export async function generateReceiptImage(trx = {}) {
  const qty = Number(trx.qty || 1)
  const price = Number(trx.price || 0)
  const subtotal = Number(trx.subtotal || (qty * price))
  const discount = Number(trx.discount || 0)
  const unique = Number(trx.unique || 0)
  const amount = Number(trx.amount || Math.max(0, subtotal - discount + unique))
  const productName = String(trx.productName || 'Produk')
  const buyer = onlyNumber(trx.user || trx.buyer || '-') || '-'
  const now = waktuJakarta(trx.createdAt || Date.now())

  const toko = {
    nama: global?.receiptStore?.nama || global?.strukStore?.nama || global?.getBotName?.() || global?.namebot || 'WhatsApp Bot',
    alamat: global?.receiptStore?.alamat || global?.strukStore?.alamat || '',
    kota: global?.receiptStore?.kota || global?.strukStore?.kota || '',
    telp: global?.receiptStore?.telp || global?.strukStore?.telp || ''
  }

  const kasir = global?.receiptStore?.kasir || global?.strukStore?.kasir || 'system'
  const metodeBayar = trx.via || 'QRIS'
  const nomorStruk = trx.id || `INV-${Date.now().toString().slice(-8)}`
  const items = [{ nama: productName, qty, satuan: 'item', harga: price, subtotal }]
  const hasRef = Boolean(trx.ref || trx.paymentId)

  const width = 720
  const margin = 58
  const right = width - margin
  const height = hitungTinggi(items, discount > 0, unique > 0, hasRef)
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  // efek sobekan kecil di atas, biar berasa struk thermal
  ctx.fillStyle = '#111'
  ctx.fillRect(width / 2 - 34, 0, 68, 10)
  ctx.fillRect(width / 2 - 21, 10, 42, 10)

  let y = 35
  drawStoreIcon(ctx, width / 2, y)
  y += 92

  textCenter(ctx, toko.nama, y, '30px Arial')
  y += 36
  if (toko.alamat) { textCenter(ctx, toko.alamat, y, '20px Arial'); y += 26 }
  if (toko.kota) { textCenter(ctx, toko.kota, y, '20px Arial'); y += 26 }
  if (toko.telp) { textCenter(ctx, `No. Telp ${toko.telp}`, y, '20px Arial'); y += 26 }

  y += 18
  drawDashedLine(ctx, margin, y, right)
  y += 28

  textLeft(ctx, now.tanggal, margin, y, '24px Arial')
  textRight(ctx, kasir, right, y, '24px Arial')
  y += 44
  textLeft(ctx, now.jam, margin, y, '24px Arial')
  textRight(ctx, buyer, right, y, '24px Arial')
  y += 52
  textLeft(ctx, nomorStruk, margin, y, '24px Arial')
  y += 34

  drawDashedLine(ctx, margin, y, right)
  y += 32

  items.forEach((item, index) => {
    textLeft(ctx, `${index + 1}. ${truncate(item.nama, 30)}`, margin, y, 'bold 26px Arial')
    y += 34
    const detail = item.satuan
      ? `  ${item.qty} ${item.satuan} x ${angka(item.harga)}`
      : `  ${item.qty} x ${angka(item.harga)}`
    textLeft(ctx, detail, margin, y, '22px Arial')
    textRight(ctx, rupiah(item.subtotal), right, y, '24px Arial')
    y += 58
  })

  drawDashedLine(ctx, margin, y, right)
  y += 34

  textLeft(ctx, `Total QTY : ${qty}`, margin, y, '24px Arial')
  y += 58

  textLeft(ctx, 'Sub Total', margin, y, '24px Arial')
  textRight(ctx, rupiah(subtotal), right, y, '24px Arial')
  y += 36

  if (discount > 0) {
    textLeft(ctx, `Voucher ${truncate(trx.voucher?.code || '', 14)}`.trim(), margin, y, '24px Arial')
    textRight(ctx, `-${rupiah(discount)}`, right, y, '24px Arial')
    y += 36
  }

  if (unique > 0) {
    textLeft(ctx, 'Kode Unik', margin, y, '24px Arial')
    textRight(ctx, rupiah(unique), right, y, '24px Arial')
    y += 36
  }

  textLeft(ctx, 'Total', margin, y, 'bold 30px Arial')
  textRight(ctx, rupiah(amount), right, y - 2, 'bold 34px Arial')
  y += 56

  textLeft(ctx, `Bayar (${metodeBayar})`, margin, y, '24px Arial')
  textRight(ctx, rupiah(amount), right, y, '24px Arial')
  y += 36
  textLeft(ctx, 'Kembali', margin, y, '24px Arial')
  textRight(ctx, rupiah(0), right, y, '24px Arial')
  y += 42

  if (hasRef) {
    textLeft(ctx, `Ref: ${truncate(trx.ref || trx.paymentId, 38)}`, margin, y, '18px Arial')
    y += 40
  }

  y += 14
  textCenter(ctx, 'Terimakasih Telah Berbelanja', y, '24px Arial')
  y += 32
  textCenter(ctx, 'Simpan struk ini sebagai bukti pembayaran', y, '18px Arial')

  return {
    status: true,
    buffer: canvas.toBuffer('image/png'),
    fileName: `${nomorStruk}.png`,
    invoice: nomorStruk,
    totalQty: qty,
    subtotal,
    discount,
    unique,
    total: amount
  }
}
