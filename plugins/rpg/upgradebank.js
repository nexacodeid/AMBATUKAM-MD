let handler = async (m, { conn, args, usedPrefix, command }) => {
  const user = global.db.data.users[m.sender];

  user.money = Number(user.money) || 0;
  user.bank = Number(user.bank) || 0;
  user.atm = Number(user.atm) || 0;
  user.fullatm = Number(user.fullatm) || 0;

  if (user.atm <= 0) {
    return m.reply(
      `Kamu belum punya ATM.\n\nBuat dulu dengan:\n${usedPrefix}craft atm`
    );
  }

  if (!user.fullatm || user.fullatm < 1) {
    user.fullatm = 100000000;
  }

  const amountRaw = (args[0] || "").toLowerCase();

  if (!amountRaw) {
    return m.reply(`
「 *UPGRADE KAPASITAS BANK* 」

Kapasitas sekarang:
Rp.${format(user.fullatm)}

Biaya:
Rp.1 = +Rp.1 kapasitas bank

Contoh:
${usedPrefix + command} 1000000
${usedPrefix + command} 10m
${usedPrefix + command} all
`.trim());
  }

  const amount =
    amountRaw === "all"
      ? user.money
      : parseNominal(amountRaw);

  if (!Number.isFinite(amount) || amount < 1) {
    return m.reply("Jumlah tidak valid.");
  }

  if (user.money < amount) {
    return m.reply(`
Uang saku kamu tidak cukup.

Saku: Rp.${format(user.money)}
Butuh: Rp.${format(amount)}
`.trim());
  }

  user.money -= amount;
  user.fullatm += amount;

  return conn.reply(
    m.chat,
    `
✅ Berhasil upgrade kapasitas bank

💸 Biaya: Rp.${format(amount)}
🏦 Kapasitas Bank: Rp.${format(user.fullatm)}
💰 Saku: Rp.${format(user.money)}
`.trim(),
    m
  );
};

handler.help = ["upgradebank <jumlah/all>", "upbank <jumlah/all>"];
handler.tags = ["rpg"];
handler.command = /^(upgradebank|upbank|tambahbank|kapasitasbank)$/i;
handler.register = true;
handler.premium = true
export default handler;

function format(num) {
  return Number(num || 0).toLocaleString("id-ID");
}

function parseNominal(input) {
  const value = String(input || "")
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/,/g, "")
    .trim();

  const match = value.match(/^(\d+(?:\.\d+)?)(k|rb|ribu|m|jt|juta|b|milyar|t|triliun)?$/i);
  if (!match) return NaN;

  const angka = Number(match[1]);
  const suffix = match[2];

  const multiplier = {
    k: 1_000,
    rb: 1_000,
    ribu: 1_000,
    m: 1_000_000,
    jt: 1_000_000,
    juta: 1_000_000,
    b: 1_000_000_000,
    milyar: 1_000_000_000,
    t: 1_000_000_000_000,
    triliun: 1_000_000_000_000,
  };

  return Math.floor(angka * (multiplier[suffix] || 1));
}