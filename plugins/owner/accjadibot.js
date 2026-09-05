import fs from "fs";
import { resolveBranding, encodeBranding } from '../../lib/branding.js';

const HARGA_JADIBOT = 15000;
const DURASI_HARI = 30;
const DAY = 86400000;
const PRODUK_FILE = './json/produk.json';
const JADIBOT_PRODUCT_NAME = `JADIBOT ${DURASI_HARI} HARI`;

let handler = async (m, { conn, text, args, command, usedPrefix, isOwner }) => {
  if (!isOwner) return m.reply("❌ Fitur ini hanya untuk owner.");

  var orderId = "";

  if (text) {
    orderId = text.trim().split(/\s+/)[0].toUpperCase();
  } else if (args && args[0]) {
    orderId = String(args[0]).trim().toUpperCase();
  }

  if (!orderId) {
    return m.reply(
      `❌ *Format salah!*\n\n` +
        `Gunakan:\n` +
        `${usedPrefix + command} ORDER_ID\n\n` +
        `Contoh:\n` +
        `${usedPrefix + command} SB-285835`
    );
  }

  prepareDatabase();

  var order = getOrder(orderId);

  if (!order) {
    return m.reply(
      `❌ Order ID *${orderId}* tidak ditemukan.\n\n` +
        `Pastikan Order ID benar.`
    );
  }

  var userJid = order.user || order.jid || order.buyer || order.proofFrom;
  var phoneNumber = String(order.phoneNumber || order.number || order.nomor || '').replace(/[^0-9]/g, '');

  if (!userJid) {
    return m.reply(`❌ Data user pada order *${orderId}* tidak ditemukan.`);
  }

  if (!phoneNumber) {
    return m.reply(`❌ Data nomor Jadibot pada order *${orderId}* tidak ditemukan.`);
  }

  var isAcc = /^(accjadibot|accjb|approvejadibot)$/i.test(command);
  var isReject = /^(tolakjadibot|tolakjb|rejectjadibot)$/i.test(command);

  if (isAcc) {
    if (!order.stockReduced) {
      var stockResult = reduceJadibotStock(1);

      if (!stockResult.ok) {
        return m.reply(
          `❌ *Stok Jadibot habis.*\n\n` +
          `Order belum bisa di-ACC agar VPS tidak terlalu berat.\n\n` +
          `Tambah stok dulu:\n` +
          `*.setstok ${JADIBOT_PRODUCT_NAME}|1*\n\n` +
          `Lalu jalankan lagi:\n` +
          `*${usedPrefix + command} ${orderId}*`
        );
      }

      order.stockReduced = true;
      order.stockProduct = stockResult.productName;
    }

    var expiredAccess = addJadibotAccess(userJid, phoneNumber, DURASI_HARI);
    var expiredText = formatDate(expiredAccess);

    order.status = "completed";
    order.accBy = m.sender;
    order.approvedBy = m.sender;
    order.accAt = Date.now();
    order.approvedAt = Date.now();
    order.paidAt = Date.now();
    order.expiredAt = expiredAccess;
    order.accessExpiredAt = expiredAccess;
    order.phoneNumber = phoneNumber;

    await conn.sendMessage(userJid, {
      text:
        `✅ *PEMBAYARAN JADIBOT DI-ACC OWNER!*\n\n` +
        `🧾 Order ID: *${orderId}*\n` +
        `📦 Paket: Jadibot ${DURASI_HARI} Hari\n` +
        `📱 Nomor Bot: ${phoneNumber}\n` +
        `📱 Nomor Bot: ${phoneNumber}\n` +
        `💰 Nominal: Rp${Number(order.amount || HARGA_JADIBOT).toLocaleString("id-ID")}\n` +
        `💳 Metode: ${String(order.method || order.metode || "MANUAL").toUpperCase()}\n` +
        `⏳ Aktif sampai: *${expiredText} WIB*\n\n` +
        `Sekarang kamu sudah bisa memakai fitur:\n` +
        `*.jadibot <nomor>*`,
    });

    await sendJadibotReceipt(conn, userJid, userJid, {
      orderId: orderId,
      metode: String(order.method || order.metode || "MANUAL").toUpperCase(),
      expired: expiredAccess,
      amount: Number(order.amount || HARGA_JADIBOT),
    });

    return m.reply(
      `✅ *Order berhasil di-ACC!*\n\n` +
        `🧾 Order ID: *${orderId}*\n` +
        `👤 User: @${userJid.split("@")[0]}\n` +
        `📱 Nomor Bot: *${phoneNumber}*\n` +
        `📦 Stok dikurangi: *1 slot*\n` +
        `⏳ Aktif sampai: *${expiredText} WIB*`,
      null,
      {
        mentions: [userJid],
      }
    );
  }

  if (isReject) {
    if (order.status === "completed" || order.status === "approved") {
      return m.reply(`❌ Order *${orderId}* sudah lunas, tidak bisa ditolak.`);
    }

    var reason = "";
    if (args && args.length > 1) reason = args.slice(1).join(" ");
    if (!reason) reason = "Bukti pembayaran tidak valid.";

    order.status = "rejected";
    order.rejectedBy = m.sender;
    order.rejectedAt = Date.now();
    order.reason = reason;

    await conn.sendMessage(userJid, {
      text:
        `❌ *PEMBAYARAN JADIBOT DITOLAK OWNER*\n\n` +
        `🧾 Order ID: *${orderId}*\n` +
        `💳 Metode: ${String(order.method || order.metode || "MANUAL").toUpperCase()}\n` +
        `💰 Nominal: Rp${Number(order.amount || HARGA_JADIBOT).toLocaleString("id-ID")}\n` +
        `📌 Alasan: ${reason}\n\n` +
        `Silakan cek kembali bukti transfer kamu atau hubungi owner.`,
    });

    return m.reply(
      `❌ *Order berhasil ditolak!*\n\n` +
        `🧾 Order ID: *${orderId}*\n` +
        `👤 User: @${userJid.split("@")[0]}`,
      null,
      {
        mentions: [userJid],
      }
    );
  }
};

handler.help = ["accjadibot <order_id>", "tolakjadibot <order_id>"];
handler.tags = ["owner"];
handler.command = /^(accjadibot|accjb|approvejadibot|tolakjadibot|tolakjb|rejectjadibot)$/i;
handler.owner = true;

export default handler;

function prepareDatabase() {
  if (!global.db) global.db = {};
  if (!global.db.data) global.db.data = {};
  if (!global.db.data.users) global.db.data.users = {};
  if (!global.db.data.jadibotOrders) global.db.data.jadibotOrders = {};
  if (!global.db.data.jadibotAccess) global.db.data.jadibotAccess = {};
  if (!global.db.data.jadibotNumbers) global.db.data.jadibotNumbers = {};

  if (!global.db.data.settings) global.db.data.settings = {};
  if (!global.db.data.settings.jadibotPayment) {
    global.db.data.settings.jadibotPayment = {
      manual: {},
    };
  }
  if (!global.db.data.settings.jadibotPayment.manual) {
    global.db.data.settings.jadibotPayment.manual = {};
  }
}

function getOrder(orderId) {
  prepareDatabase();

  if (global.db.data.jadibotOrders[orderId]) {
    return global.db.data.jadibotOrders[orderId];
  }

  if (
    global.db.data.settings &&
    global.db.data.settings.jadibotPayment &&
    global.db.data.settings.jadibotPayment.manual &&
    global.db.data.settings.jadibotPayment.manual[orderId]
  ) {
    return global.db.data.settings.jadibotPayment.manual[orderId];
  }

  return null;
}

function getUser(jid) {
  prepareDatabase();

  if (!global.db.data.users[jid]) {
    global.db.data.users[jid] = {};
  }

  var user = global.db.data.users[jid];

  if (typeof user.jadibotTime !== "number") user.jadibotTime = 0;
  if (typeof user.jadibotPaid !== "boolean") user.jadibotPaid = false;

  return user;
}

function addJadibotAccess(jid, phoneNumber, days) {
  prepareDatabase();

  if (!global.db.data.jadibotNumbers) global.db.data.jadibotNumbers = {};

  var user = getUser(jid);
  var now = Date.now();
  var current = Number(global.db.data.jadibotNumbers[phoneNumber]?.expired || user.jadibotTime || 0);
  var start = current > now ? current : now;
  var expired = start + days * DAY;

  user.jadibotTime = expired;
  user.jadibotPaid = true;

  global.db.data.jadibotAccess[jid] = expired;
  global.db.data.jadibotNumbers[phoneNumber] = {
    owner: jid,
    expired: expired,
    trial: false
  };

  return expired;
}


function ensureProdukFile() {
  if (!fs.existsSync('./json')) fs.mkdirSync('./json', { recursive: true });
  if (!fs.existsSync(PRODUK_FILE)) fs.writeFileSync(PRODUK_FILE, '[]');
}

function readProduk() {
  ensureProdukFile();

  try {
    var data = JSON.parse(fs.readFileSync(PRODUK_FILE, 'utf8'));
    return Array.isArray(data) ? resolveBranding(data) : [];
  } catch {
    return [];
  }
}

function saveProduk(data) {
  ensureProdukFile();
  fs.writeFileSync(PRODUK_FILE, JSON.stringify(encodeBranding(data), null, 2));
}

function isJadibotProduct(item = {}) {
  var name = String(item.nama || item.name || '').toLowerCase();
  return item.jadibot === true || item.type === 'jadibot' || /jadi\s*bot|jadibot/.test(name);
}

function findJadibotProduct(list = []) {
  var index = list.findIndex(isJadibotProduct);

  if (index >= 0) return index;

  list.push({
    nama: JADIBOT_PRODUCT_NAME,
    harga: HARGA_JADIBOT,
    jumlah: 0,
    deskripsi: `Akses Jadibot ${DURASI_HARI} hari. Stok = slot aktif yang boleh dijual.`,
    terjual: 0,
    data: [],
    jadibot: true,
    type: 'jadibot'
  });

  saveProduk(list);
  return list.length - 1;
}

function stokTersediaProduk(item = {}) {
  if (Array.isArray(item.data) && item.data.length) return item.data.length;
  return Number(item.jumlah) || 0;
}

function reduceJadibotStock(qty = 1) {
  var produk = readProduk();
  var index = findJadibotProduct(produk);
  var item = produk[index];
  var stock = stokTersediaProduk(item);
  var amount = Math.max(1, Number(qty) || 1);

  if (stock < amount) {
    return {
      ok: false,
      stock: stock,
      productName: item?.nama || JADIBOT_PRODUCT_NAME
    };
  }

  if (Array.isArray(item.data) && item.data.length) {
    item.data.splice(0, amount);
    item.jumlah = item.data.length;
  } else {
    item.jumlah = Math.max(0, stock - amount);
  }

  item.terjual = (Number(item.terjual) || 0) + amount;
  item.jadibot = true;
  item.type = 'jadibot';

  saveProduk(produk);

  return {
    ok: true,
    stockBefore: stock,
    stockAfter: stokTersediaProduk(item),
    productName: item.nama || JADIBOT_PRODUCT_NAME
  };
}


function formatDate(ms) {
  return new Date(ms).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

async function sendJadibotReceipt(conn, chat, jid, data) {
  try {
    var mod = await import("../../lib/jadibot-struk.js");

    var createReceipt =
      mod.createJadibotStruk ||
      mod.createJadibotReceipt ||
      mod.default;

    if (typeof createReceipt !== "function") {
      throw new Error("Function pembuat struk tidak ditemukan di lib/jadibot-struk.js");
    }

    var nomor = String(jid).split("@")[0];

    var buffer = await createReceipt({
      toko: global.getBotName?.() || global.namebot || 'WhatsApp Bot',
      id_trx: data.orderId,
      nomor_pelanggan: nomor,
      tanggal: new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
      }),
      metode: data.metode,
      masa_aktif: formatDate(data.expired),
      expired: formatDate(data.expired),
      items: [
        {
          nama: `Akses Jadibot ${DURASI_HARI} Hari`,
          harga: Number(data.amount || HARGA_JADIBOT),
        },
      ],
    });

    await conn.sendMessage(chat, {
      image: buffer,
      caption:
        `🧾 *Struk Pembelian Jadibot*\n\n` +
        `✅ Status: *LUNAS / ACC OWNER*\n` +
        `🧾 Order ID: *${data.orderId}*\n` +
        `📦 Paket: Jadibot ${DURASI_HARI} Hari\n` +
        `💳 Metode: *${String(data.metode).toUpperCase()}*\n` +
        `🕓 Aktif sampai: *${formatDate(data.expired)} WIB*`,
    });
  } catch (e) {
    console.error("Gagal membuat struk Jadibot:", e);

    await conn.sendMessage(chat, {
      text:
        `⚠️ Akses Jadibot sudah aktif, tapi struk gagal dibuat.\n\n` +
        `Penyebab kemungkinan:\n` +
        `• package canvas belum terinstall\n` +
        `• file lib/jadibot-struk.js belum ada\n` +
        `• nama function struk tidak sesuai\n\n` +
        `Cek log terminal untuk detail error.`,
    });
  }
}