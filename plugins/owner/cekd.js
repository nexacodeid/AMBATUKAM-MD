import {
  findMatchingWebhookPayment,
  getWebhookPayments,
  loadUsedWebhookIds,
  saveUsedWebhookId
} from '../../lib/payment-webhook.js'

function toRupiah(number) {
  return Number(number || 0).toLocaleString('id-ID')
}

let handler = async (m, { text, usedPrefix, command }) => {
  const amount = Number(String(text || '').replace(/[^0-9]/g, ''))

  try {
    const payments = await getWebhookPayments(global.paymentWebhook?.limit || 20)
    const usedIds = loadUsedWebhookIds()

    if (!amount) {
      if (!payments.length) return m.reply('Belum ada data pembayaran dari webhook.')

      const list = payments
        .slice(0, 10)
        .map((v, i) => {
          const used = usedIds.includes(String(v.event_id)) ? ' ✅ used' : ''
          return `${i + 1}. Rp${toRupiah(v.amount)}${used}\n   ID: ${v.event_id || '-'}\n   Waktu: ${v.received_at || '-'}\n   Info: ${v.message || '-'}`
        })
        .join('\n\n')

      return m.reply(
        `*RIWAYAT WEBHOOK DONASI*\n\n` +
        `${list}\n\n` +
        `Cek nominal tertentu:\n` +
        `${usedPrefix + command} 184`
      )
    }

    const paid = findMatchingWebhookPayment(payments, amount, {
      usedIds,
      minTime: 0,
      maxTime: Date.now() + 60 * 60 * 1000
    })

    if (!paid) {
      const recent = payments
        .slice(0, 5)
        .map((v, i) => `${i + 1}. Rp${toRupiah(v.amount)} | ${v.received_at || '-'} | ${v.message || '-'}`)
        .join('\n')

      return m.reply(
        `❌ Tidak ditemukan pembayaran Rp${toRupiah(amount)} yang belum dipakai.\n\n` +
        `Riwayat terakhir:\n${recent || '-'}`
      )
    }

    saveUsedWebhookId(paid.event_id)

    return m.reply(
      `✅ Pembayaran ditemukan dan ditandai used.\n\n` +
      `💰 Total: Rp${toRupiah(paid.amount)}\n` +
      `🧾 Event ID: ${paid.event_id}\n` +
      `🕒 Waktu: ${paid.received_at || '-'}\n` +
      `🏦 Info: ${paid.message || '-'}`
    )
  } catch (e) {
    console.error('CEK DONASI ERROR:', e)
    return m.reply(`❌ Gagal cek webhook donasi.\n\n${e.message || e}`)
  }
}

handler.help = ['cekdonasi', 'cekdonasi <nominal>']
handler.tags = ['owner']
handler.command = /^(cekdonasi|cekdonate|mutasidonasi)$/i
handler.owner = true

export default handler