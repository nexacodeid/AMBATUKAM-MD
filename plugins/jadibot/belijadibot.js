// belijadibot.js
// VERSION ORKUT QRIS

import { delay } from "baileys"
import fetch from "node-fetch"
import fs from "fs"
import { resolveBranding, encodeBranding } from '../../lib/branding.js'

const HARGA_JADIBOT = 15000
const DURASI_HARI = 30
const PRODUK_FILE = './json/produk.json'
const JADIBOT_PRODUCT_NAME = `JADIBOT ${DURASI_HARI} HARI`

	// CONFIG
	const APIKEY = 'raizell'
	const USERNAME = 'zaellmods'
	const TOKEN = '2208862:2rBylnUC4wRvN160c8Q9umMjg3sXhoez'
	const CODEQR = global.Orkut?.qr || '00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214543542135164540303UMI51440014ID.CO.QRIS.WWW0215ID20253689233680303UMI5204541153033605802ID5919ZAELL RAI OK22088626006BEKASI61051711162070703A016304C68C'

let handler = async (
  m,
  { conn, text, usedPrefix, command }
) => {

  const args = text.split(" ")

  const phoneNumber =
    (args[0] || "")
      .replace(/[^0-9]/g, "")

  const method =
    (args[1] || "")
      .toLowerCase()

  const jadibotStock = getJadibotStockInfo(true)
  const hargaJadibot = Number(jadibotStock.product?.harga || HARGA_JADIBOT)
  const sisaStokJadibot = Number(jadibotStock.stock || 0)

  if (!phoneNumber || !method) {
    return m.reply(
      `🤖 *BELI AKSES JADIBOT*\n\n` +
      `📦 Paket: Jadibot ${DURASI_HARI} Hari\n` +
      `💰 Harga: *Rp${hargaJadibot.toLocaleString("id-ID")}*\n` +
      `📦 Sisa stok: *${sisaStokJadibot} slot*\n\n` +

      `Contoh:\n` +
      `• ${usedPrefix + command} 628xxxx qris\n` +
      `• ${usedPrefix + command} 628xxxx dana\n` +
      `• ${usedPrefix + command} 628xxxx seabank\n\n` +

      `1 pembayaran hanya untuk 1 nomor bot.`
    )
  }

  if (phoneNumber.length < 8) {
    return m.reply("❌ Nomor tidak valid.")
  }

  if (
    !["qris", "dana", "seabank"]
      .includes(method)
  ) {
    return m.reply(
      "❌ Metode pembayaran tidak valid."
    )
  }

  if (sisaStokJadibot <= 0) {
    return m.reply(
      `❌ *Stok Jadibot sedang habis.*\n\n` +
      `Owner perlu menambah stok dulu supaya VPS tidak terlalu berat.\n\n` +
      `Command owner:\n` +
      `*.setstok ${JADIBOT_PRODUCT_NAME}|1*\n\n` +
      `Atau cek daftar stok:\n` +
      `*.stok*`
    )
  }

  if (!global.db)
    global.db = {}

  if (!global.db.data)
    global.db.data = {}

  if (!global.db.data.jadibotOrders)
    global.db.data.jadibotOrders = {}

  if (!global.db.data.jadibotNumbers)
    global.db.data.jadibotNumbers = {}

  const oldData =
    global.db.data.jadibotNumbers[phoneNumber]

  if (
    oldData &&
    Date.now() < oldData.expired
  ) {
    return m.reply(
      "❌ Nomor tersebut masih memiliki akses aktif."
    )
  }

  // ======================
  // QRIS ORKUT
  // ======================

  if (method === "qris") {

    if (!TOKEN || !CODEQR) {
      return m.reply(
        "❌ Config ORKUT belum diisi."
      )
    }

    const unique =
      Math.floor(Math.random() * 90) + 10

    const amount =
      hargaJadibot + unique

    const orderId =
      generateJadibotOrderId("qris")

    const create =
      await fetch(
        `https://api.apocalypse.web.id/orderkouta/createpayment?amount=${amount}&codeqr=${encodeURIComponent(CODEQR)}&apikey=${APIKEY}`
      )

    const createJson =
      await create.json()

    if (!createJson.status) {
      return m.reply(
        "❌ Gagal membuat QRIS."
      )
    }

    const pay =
      createJson.result

    const expired =
      new Date(pay.expired)

    const expiredTime =
      expired.toLocaleTimeString(
        "id-ID",
        {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }
      )

    global.db.data.jadibotOrders[orderId] = {
      id: orderId,
      user: m.sender,
      phoneNumber,
      method: "qris",
      amount,
      status: "pending",
      createdAt: Date.now(),
      expiredAt: expired.getTime(),
      productName: jadibotStock.product?.nama || JADIBOT_PRODUCT_NAME,
      productIndex: jadibotStock.index,
    }

    const msg =
      await conn.sendMessage(
        m.chat,
        {
          image: {
            url: pay.imageqris.url
          },
          caption:
`💳 *PEMBAYARAN JADIBOT*

📱 Nomor Bot : ${phoneNumber}
📦 Paket : ${DURASI_HARI} Hari
💰 Harga : Rp${hargaJadibot.toLocaleString("id-ID")}
🧩 Kode Unik : ${unique}
💵 Total Bayar : Rp${amount.toLocaleString("id-ID")}

🧾 Order ID : ${orderId}
🕒 Expired : ${expiredTime} WIB

Silakan scan QRIS di atas`
        },
        { quoted: m }
      )

    let paid = false
    let checkedIds = []

    while (!paid) {

      const now = new Date()

      // EXPIRED
      if (now >= expired) {

        try {
          await conn.sendMessage(
            m.chat,
            {
              delete: msg.key
            }
          )
        } catch {}

        global.db.data.jadibotOrders[
          orderId
        ].status = "expired"

        return m.reply(
          "⚠️ QRIS telah expired"
        )
      }

      try {

        const check =
          await fetch(
            `https://api.apocalypse.web.id/orderkouta/mutasiqr?username=${USERNAME}&token=${encodeURIComponent(TOKEN)}&apikey=${APIKEY}`
          )

        const checkJson =
          await check.json()

        if (
          checkJson.status &&
          Array.isArray(checkJson.result)
        ) {

          for (const trx of checkJson.result) {

            if (
              checkedIds.includes(trx.id)
            ) continue

            checkedIds.push(trx.id)

            const kredit =
              Number(
                String(trx.kredit)
                  .replace(/\./g, "")
              )

            // PAYMENT DETECTED
            if (
              trx.status === "IN" &&
              kredit === amount
            ) {

              paid = true

              try {
                await conn.sendMessage(
                  m.chat,
                  {
                    delete: msg.key
                  }
                )
              } catch {}

              const stockResult =
                reduceJadibotStock(1)

              if (!stockResult.ok) {
                global.db.data.jadibotOrders[
                  orderId
                ].status = "need_owner_stock"

                return m.reply(
                  `⚠️ Pembayaran terdeteksi, tapi stok Jadibot sudah habis.\n\n` +
                  `🧾 Order ID: ${orderId}\n` +
                  `Owner perlu tambah stok lalu aktifkan manual.`
                )
              }

              const expiredAccess =
                addJadibotAccess(
                  m.sender,
                  phoneNumber,
                  DURASI_HARI,
                  false
                )

              global.db.data.jadibotOrders[
                orderId
              ].status = "completed"

              global.db.data.jadibotOrders[
                orderId
              ].paidAt = Date.now()

              global.db.data.jadibotOrders[
                orderId
              ].stockReduced = true

              global.db.data.jadibotOrders[
                orderId
              ].stockProduct = stockResult.productName

              global.db.data.jadibotOrders[
                orderId
              ].accessExpiredAt =
                expiredAccess

              await conn.sendMessage(
                m.chat,
                {
                  text:
`✅ Pembayaran berhasil

📱 Nomor Bot : ${phoneNumber}
💰 Rp${amount.toLocaleString("id-ID")}
🏦 ${trx.brand?.name || "QRIS"}

🧾 ${orderId}

⏳ Aktif sampai:
${formatDate(expiredAccess)}

Gunakan:
.jadibot ${phoneNumber}`
                },
                { quoted: m }
              )

              break
            }
          }
        }

      } catch (e) {
        console.log(e)
      }

      await delay(10000)
    }

    return
  }

  // ======================
  // MANUAL PAYMENT
  // ======================

  const orderId =
    generateJadibotOrderId(method)

  const rekening =
    method === "dana"
      ? global.jadibotPayment?.dana
      : global.jadibotPayment?.seabank

  const atasNama =
    method === "dana"
      ? global.jadibotPayment?.namaDana
      : global.jadibotPayment?.namaSeabank

  const methodName =
    method === "dana"
      ? "DANA"
      : "SEABANK"

  global.db.data.jadibotOrders[orderId] = {
    id: orderId,
    user: m.sender,
    phoneNumber,
    method,
    amount: hargaJadibot,
    status: "pending",
    createdAt: Date.now(),
    productName: jadibotStock.product?.nama || JADIBOT_PRODUCT_NAME,
    productIndex: jadibotStock.index,
  }

  return m.reply(
`💳 *PEMBAYARAN JADIBOT*

📱 Nomor Bot : *${phoneNumber}*
📦 Paket : ${DURASI_HARI} Hari
💰 Nominal : *Rp${hargaJadibot.toLocaleString("id-ID")}*

• ${methodName}: *${rekening}*
• Atas Nama: *${atasNama}*

🧾 Order ID : *${orderId}*

Kirim bukti pembayaran:
.buktijadibot ${orderId}`
  )
}

handler.help = ["belijadibot"]
handler.tags = ["jadibot"]

handler.command =
  /^(belijadibot|bayarjadibot)$/i

export default handler


function ensureProdukFile() {
  if (!fs.existsSync('./json')) fs.mkdirSync('./json', { recursive: true })
  if (!fs.existsSync(PRODUK_FILE)) fs.writeFileSync(PRODUK_FILE, '[]')
}

function readProduk() {
  ensureProdukFile()
  try {
    const data = JSON.parse(fs.readFileSync(PRODUK_FILE, 'utf8'))
    return Array.isArray(data) ? resolveBranding(data) : []
  } catch {
    return []
  }
}

function saveProduk(data) {
  ensureProdukFile()
  fs.writeFileSync(PRODUK_FILE, JSON.stringify(encodeBranding(data), null, 2))
}

function isJadibotProduct(item = {}) {
  const name = String(item.nama || item.name || '').toLowerCase()
  return item.jadibot === true || item.type === 'jadibot' || /jadi\s*bot|jadibot/.test(name)
}

function findJadibotProduct(list = []) {
  let index = list.findIndex(isJadibotProduct)
  if (index >= 0) return index

  list.push({
    nama: JADIBOT_PRODUCT_NAME,
    harga: HARGA_JADIBOT,
    jumlah: 0,
    deskripsi: `Akses Jadibot ${DURASI_HARI} hari. Stok = slot aktif yang boleh dijual.`,
    terjual: 0,
    data: [],
    jadibot: true,
    type: 'jadibot'
  })
  saveProduk(list)
  return list.length - 1
}

function stokTersediaProduk(item = {}) {
  if (Array.isArray(item.data) && item.data.length) return item.data.length
  return Number(item.jumlah) || 0
}

function getJadibotStockInfo(autoCreate = false) {
  const produk = readProduk()
  let index = produk.findIndex(isJadibotProduct)

  if (index < 0 && autoCreate) index = findJadibotProduct(produk)
  if (index < 0) return { index: -1, product: null, stock: 0 }

  return {
    index,
    product: produk[index],
    stock: stokTersediaProduk(produk[index])
  }
}

function reduceJadibotStock(qty = 1) {
  const produk = readProduk()
  const index = findJadibotProduct(produk)
  const item = produk[index]
  const stock = stokTersediaProduk(item)
  const amount = Math.max(1, Number(qty) || 1)

  if (stock < amount) {
    return {
      ok: false,
      stock,
      productName: item?.nama || JADIBOT_PRODUCT_NAME
    }
  }

  if (Array.isArray(item.data) && item.data.length) {
    item.data.splice(0, amount)
    item.jumlah = item.data.length
  } else {
    item.jumlah = Math.max(0, stock - amount)
  }

  item.terjual = (Number(item.terjual) || 0) + amount
  item.jadibot = true
  item.type = 'jadibot'

  saveProduk(produk)

  return {
    ok: true,
    stockBefore: stock,
    stockAfter: stokTersediaProduk(item),
    productName: item.nama || JADIBOT_PRODUCT_NAME
  }
}


function generateJadibotOrderId(
  method = "qris"
) {

  const prefix = {
    qris: "QR",
    dana: "DN",
    seabank: "SB",
  }[
    String(method)
      .toLowerCase()
  ] || "JB"

  return (
    `${prefix}-` +
    Math.floor(
      100000 +
      Math.random() * 900000
    )
  )
}

function addJadibotAccess(
  jid,
  phoneNumber,
  days = 30,
  trial = false
) {

  const db = global.db.data

  if (!db.jadibotNumbers)
    db.jadibotNumbers = {}

  const now = Date.now()

  const current =
    db.jadibotNumbers[phoneNumber]
      ?.expired || 0

  const start =
    current > now
      ? current
      : now

  const expired =
    start + (
      days *
      24 *
      60 *
      60 *
      1000
    )

  db.jadibotNumbers[phoneNumber] = {
    owner: jid,
    expired,
    trial
  }

  return expired
}

function formatDate(ms) {
  return new Date(ms)
    .toLocaleString(
      "id-ID",
      {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    )
}