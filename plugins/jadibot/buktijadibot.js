let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `❌ *Format salah!*\n\n` +
        `Kirim bukti pembayaran dengan caption:\n\n` +
        `${usedPrefix + command} ORDER_ID\n\n` +
        `Contoh:\n` +
        `${usedPrefix + command} SB-482913`
    );
  }

  var orderId = text.trim().split(/\s+/)[0].toUpperCase();

  if (!global.db) global.db = {};
  if (!global.db.data) global.db.data = {};
  if (!global.db.data.jadibotOrders) global.db.data.jadibotOrders = {};

  var order = global.db.data.jadibotOrders[orderId];

  if (!order) {
    return m.reply(
      `❌ Order ID *${orderId}* tidak ditemukan.\n\n` +
        `Pastikan Order ID benar.\n` +
        `Contoh: *SB-482913*`
    );
  }

  if (order.user !== m.sender) {
    return m.reply("❌ Order ID ini bukan milik kamu.");
  }

  if (order.status === "completed") {
    return m.reply("✅ Order ini sudah lunas dan sudah aktif.");
  }

  if (order.status === "rejected") {
    return m.reply("❌ Order ini sebelumnya sudah ditolak owner.");
  }

  if (order.method === "qris") {
    return m.reply("⚠️ Order QRIS tidak perlu kirim bukti. Sistem akan mengecek otomatis.");
  }

  var q = m.quoted ? m.quoted : m;
  var mime = (q.msg || q).mimetype || q.mimetype || "";

  if (!/image|video|application\/pdf/.test(mime)) {
    return m.reply(
      `❌ Kirim bukti pembayaran berupa gambar/video/pdf.\n\n` +
        `Caranya:\n` +
        `1. Kirim foto bukti transfer\n` +
        `2. Isi caption:\n` +
        `${usedPrefix + command} ${orderId}`
    );
  }

  var media = null;

  try {
    media = await q.download();
  } catch (e) {
    console.error(e);
    return m.reply("❌ Gagal mengambil media bukti pembayaran.");
  }

  if (!media) {
    return m.reply("❌ Media bukti pembayaran tidak ditemukan.");
  }

  order.status = "waiting_owner";
  order.proofAt = Date.now();
  order.proofFrom = m.sender;

  var userNumber = m.sender.split("@")[0];
  var methodName = String(order.method || "").toUpperCase();
  var amount = Number(order.amount || 15000);

  var caption =
    `🧾 *BUKTI PEMBAYARAN JADIBOT*\n\n` +
    `👤 User: @${userNumber}\n` +
    `🧾 Order ID: *${orderId}*\n` +
    `💳 Metode: *${methodName}*\n` +
    `💰 Nominal: *Rp${amount.toLocaleString("id-ID")}*\n` +
    `📌 Status: *Menunggu ACC Owner*\n\n` +
    `Silakan cek bukti pembayaran.\n\n` +
    `Pilih tombol di bawah:\n` +
    `✅ ACC = aktifkan akses Jadibot\n` +
    `❌ Tolak = batalkan order`;

  var owners = getOwnerJids();

  if (!owners.length) {
    return m.reply("❌ Owner belum terdeteksi di global.owner.");
  }

  for (var i = 0; i < owners.length; i++) {
    var ownerJid = owners[i];

    try {
      if (/image/.test(mime)) {
        await conn.sendButton(
          ownerJid,
          {
            image: media,
            caption: caption,
            footer: global.namebot || "Bot",
            mentions: [m.sender],
            buttons: [
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "✅ ACC",
                  id: `.accjadibot ${orderId}`,
                }),
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "❌ Tolak",
                  id: `.tolakjadibot ${orderId}`,
                }),
              },
            ],
          },
          { quoted: m }
        );
      } else if (/video/.test(mime)) {
        await conn.sendButton(
          ownerJid,
          {
            video: media,
            caption: caption,
            footer: global.namebot || "Bot",
            mentions: [m.sender],
            buttons: [
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "✅ ACC",
                  id: `.accjadibot ${orderId}`,
                }),
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "❌ Tolak",
                  id: `.tolakjadibot ${orderId}`,
                }),
              },
            ],
          },
          { quoted: m }
        );
      } else {
        await conn.sendButton(
          ownerJid,
          {
            document: media,
            mimetype: mime,
            fileName: `Bukti-${orderId}.pdf`,
            caption: caption,
            footer: global.namebot || "Bot",
            mentions: [m.sender],
            buttons: [
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "✅ ACC",
                  id: `.accjadibot ${orderId}`,
                }),
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "❌ Tolak",
                  id: `.tolakjadibot ${orderId}`,
                }),
              },
            ],
          },
          { quoted: m }
        );
      }
    } catch (e) {
      console.error("Gagal kirim bukti ke owner:", e);

      await conn.sendMessage(ownerJid, {
        text:
          caption +
          `\n\n⚠️ Media gagal dikirim, tapi order tetap masuk.\n\n` +
          `Manual:\n` +
          `.accjadibot ${orderId}\n` +
          `.tolakjadibot ${orderId}`,
        mentions: [m.sender],
      });
    }
  }

  return m.reply(
    `✅ *Bukti pembayaran berhasil dikirim ke owner!*\n\n` +
      `🧾 Order ID: *${orderId}*\n` +
      `📌 Status: *Menunggu ACC Owner*\n\n` +
      `Kamu akan diberi notifikasi setelah owner ACC atau menolak pembayaran.`
  );
};

handler.help = ["buktijadibot"];
handler.tags = ["jadibot"];
handler.command = /^(buktijadibot|buktibayarjadibot)$/i;

export default handler;

function getOwnerJids() {
  var result = [];
  var owner = global.owner || [];

  if (!Array.isArray(owner)) owner = [owner];

  for (var i = 0; i < owner.length; i++) {
    var item = owner[i];
    var number = "";

    if (Array.isArray(item)) {
      number = String(item[0] || "");
    } else {
      number = String(item || "");
    }

    number = number.replace(/[^0-9]/g, "");

    if (!number) continue;

    result.push(number + "@s.whatsapp.net");
  }

  return result;
}