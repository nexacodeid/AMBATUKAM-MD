import { delay } from 'baileys'
import {
  createDynamicQris,
  findMatchingWebhookPayment,
  getWebhookPayments,
  loadUsedWebhookIds,
  saveUsedWebhookId
} from '../../lib/payment-webhook.js'

function toRupiah(number) {
  return Number(number || 0).toLocaleString('id-ID')
}

function dataUrlToBuffer(value) {
  const text = String(value || '')

  if (!text.startsWith('data:image/')) return null

  const base64 = text.split(',')[1]
  if (!base64) return null

  return Buffer.from(base64, 'base64')
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw (
      `Masukkan nominal donasi.\n\n` +
      `Contoh:\n` +
      `${usedPrefix + command} 5000`
    )
  }

  const nominal = Number(String(text).replace(/[^0-9]/g, ''))

  if (!nominal || isNaN(nominal)) throw 'Nominal tidak valid.'
  if (nominal < 100) throw 'Minimal donasi Rp100.'
  if (nominal > 1000000) throw 'Maksimal donasi Rp1.000.000.'

  const unique = Math.floor(Math.random() * 90) + 10
  const amount = nominal + unique
  const createdAt = Date.now()
  const expiredAt = createdAt + 10 * 60 * 1000

  let payment

  try {
    payment = await createDynamicQris(amount, {
      baseAmount: nominal,
      uniqueCode: unique
    })
  } catch (e) {
    console.error('CREATE DONATE QRIS ERROR:', e)
    throw `Gagal membuat QRIS donasi.\n\n${e.message || e}`
  }

  const expiredTime = new Date(expiredAt).toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  const caption = `
💳 *DONASI ${global.namebot || 'BOT'}*

📦 ID : ${payment.id}
💰 Nominal : Rp${toRupiah(nominal)}
🧩 Kode Unik : ${unique}
💵 Total Bayar : Rp${toRupiah(amount)}
🕒 Expired : ${expiredTime} WIB

Silakan scan QRIS di atas.
Pembayaran akan dicek otomatis lewat webhook.
`.trim()

  const imageBuffer = dataUrlToBuffer(payment.image)

  const msg = await conn.sendMessage(
    m.chat,
    {
      image: imageBuffer ? imageBuffer : { url: payment.image },
      caption
    },
    { quoted: m }
  )

  while (true) {
    const now = Date.now()

    if (now >= expiredAt) {
      try {
        await conn.sendMessage(m.chat, { delete: msg.key })
      } catch (e) {
        console.log('DELETE DONATE QR ERROR:', e)
      }

      return m.reply('⚠️ QRIS donasi telah expired.')
    }

    try {
      const usedIds = loadUsedWebhookIds()
      const payments = await getWebhookPayments(global.paymentWebhook?.limit || 20)
      const paid = findMatchingWebhookPayment(payments, amount, {
        usedIds,
        minTime: createdAt,
        maxTime: expiredAt
      })

      if (paid) {
        saveUsedWebhookId(paid.event_id)

        try {
          await conn.sendMessage(m.chat, { delete: msg.key })
        } catch (e) {
          console.log('DELETE DONATE QR ERROR:', e)
        }

        return await conn.sendMessage(
          m.chat,
          {
            text:
`✅ *Donasi berhasil diterima*

💰 Total : Rp${toRupiah(amount)}
🧩 Kode Unik : ${unique}
🧾 Event ID : ${paid.event_id}
🏦 Info : ${paid.message || 'Webhook payment'}
🕒 Waktu : ${paid.received_at || '-'}

Terima kasih sudah donasi 🙏`
          },
          { quoted: m }
        )
      }
    } catch (e) {
      console.log('CHECK DONATE WEBHOOK ERROR:', e.message || e)
    }

    await delay(10000)
  }
}

handler.help = ['donasi <nominal>']
handler.tags = ['main']
handler.command = /^(donasi|donate|traktir)$/i

export default handler
