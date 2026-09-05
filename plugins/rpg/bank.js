/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

const BANK_IMAGE = "https://raw.githubusercontent.com/raizell526/dat4/main/uploads/88b34e-1778482225564.jpg";

let handler = async (m, { conn, isOwner }) => {
  try {
    if (!global.db) global.db = {};
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.users) global.db.data.users = {};

    const ownerNumber = "6289520616967";
    const ownerJid = ownerNumber + "@s.whatsapp.net";

    let target =
      m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.fromMe
          ? conn.user.jid || conn.user.id
          : m.sender;

    target = conn.decodeJid ? conn.decodeJid(target) : target;

    if (!global.db.data.users[target]) {
      return m.reply("Pengguna tidak terdaftar di dalam database.");
    }

    if (!isOwner && target === ownerJid) {
      return m.reply("🚫 Dilarang melihat rekening owner!");
    }

    const user = global.db.data.users[target];

    const money = Number(user.money || 0);
    const bank = Number(user.bank || 0);
    const cash = Number(user.cash || 0);
    const atm = Number(user.atm || 0);
    const premiumTime = Number(user.premiumTime || 0);

    const name = user.registered
      ? user.name || conn.getName(target)
      : conn.getName(target);

    const mentionedJid = [target];

    const isTargetOwner = target === ownerJid || isOwner;
    const title = isTargetOwner ? "B A N K  O W N E R" : "B A N K  U S E R";

    const status = isTargetOwner
      ? "Owner 👑"
      : premiumTime > Date.now()
        ? "Premium"
        : "Free";

    const caption = `
╭────⎆【 *${title}* 】
│${isTargetOwner ? "👸🏻" : "👤"} *Pemilik:* @${target.replace(/@.+/, "")}
│📝 *Nama:* ${name}
│💳 *ATM:* ${atm > 0 ? "✅ Punya" : "❌ Tidak punya"}
│🏛️ *Bank:* Rp${formatNumber(bank)}
│💵 *Uang:* Rp${formatNumber(money)}
│💰 *Cash:* Rp${formatNumber(cash)}
│🎋 *Status:* ${status}
│📑 *Registered:* ${user.registered ? "Yes" : "No"}
╰──────━━┉─᳀

${readMore}

╭─〔 *Panduan Bank* 〕
│◦ Menabung : *.nabung <jumlah>*
│◦ Tarik uang : *.tarik <jumlah>*
╰──────────────
`.trim();

    try {
      await conn.sendMessage(
        m.chat,
        {
          image: {
            url: BANK_IMAGE,
          },
          caption,
          mentions: mentionedJid,
        },
        { quoted: m }
      );
    } catch (e) {
      console.error("Gagal kirim gambar bank, fallback ke teks:", e);

      await conn.sendMessage(
        m.chat,
        {
          text: caption,
          mentions: mentionedJid,
        },
        { quoted: m }
      );
    }
  } catch (e) {
    console.error("BANK ERROR:", e);
    m.reply("Terjadi kesalahan saat menampilkan data bank.");
  }
};

handler.help = ["bank"];
handler.tags = ["rpg"];
handler.command = /^(bank(cek)?|cekbank)$/i;
handler.register = true;

export default handler;

function formatNumber(number) {
  return Number(number || 0).toLocaleString("id-ID");
}