const SIM_PRICE = 300_000;
const FUEL_PRICE = 10_000;

const TRAINS = {
  commuter: { name: "Commuter", price: 1_000_000, fuelUse: 5 },
  lrt: { name: "LRT", price: 3_000_000, fuelUse: 4 },
  mrt: { name: "MRT", price: 5_000_000, fuelUse: 3 },
  krl: { name: "KRL", price: 8_000_000, fuelUse: 2 },
  shinkansen: { name: "Shinkansen", price: 12_000_000, fuelUse: 1 },
};

const STATIONS = [
  { name: "Stasiun Gambir", duration: 2, reward: 10_000 },
  { name: "Stasiun Bandung", duration: 4, reward: 20_000 },
  { name: "Stasiun Surabaya", duration: 6, reward: 30_000 },
  { name: "Stasiun Medan", duration: 8, reward: 40_000 },
  { name: "Stasiun Yogyakarta", duration: 5, reward: 25_000 },
  { name: "Stasiun Semarang", duration: 3, reward: 15_000 },
  { name: "Stasiun Malang", duration: 7, reward: 35_000 },
];

const RISKS = [
  { message: "Perjalanan lancar tanpa kendala.", effect: 0 },
  { message: "Penumpang memberi bonus tips.", effect: 5_000 },
  { message: "Kereta terlambat sedikit, tapi tetap aman.", effect: 0 },
  { message: "Ada kerusakan kecil, biaya perbaikan dipotong.", effect: -5_000 },
  { message: "Cuaca buruk, pendapatan sedikit berkurang.", effect: -2_000 },
];

let handler = async (m, { conn, command, args, usedPrefix }) => {
  let user = global.db.data.users[m.sender];
  let name = user.name || conn.getName(m.sender);

  initMasinis(user);

  switch (command.toLowerCase()) {
    case "masinis":
      return showMenu(m, user, name, usedPrefix);

    case "simmasinis":
    case "buatsimmasinis":
      return buySim(m, user, usedPrefix);

    case "kereta":
      return showKereta(m, user, usedPrefix);

    case "belikereta":
      return beliKereta(m, user, args, usedPrefix);

    case "jalan":
    case "perjalanan":
    case "jalanmasinis":
      return jalan(m, conn, user);

    case "bbmkereta":
    case "isibbmkereta":
      return isiBbm(m, user);
  }
};

handler.help = [
  "masinis",
  "simmasinis",
  "kereta",
  "belikereta <nama>",
  "jalan",
  "bbmkereta",
];

handler.tags = ["rpg"];
handler.command =
  /^(masinis|simmasinis|buatsimmasinis|kereta|belikereta|jalan|perjalanan|jalanmasinis|bbmkereta|isibbmkereta)$/i;

handler.register = true;

export default handler;

function initMasinis(user) {
  user.money = Number(user.money) || 0;

  if (!user.masinisRpg || typeof user.masinisRpg !== "object") {
    user.masinisRpg = {
      license: false,
      tripCount: 0,
      stations: [],
      earnings: 0,
      currentTrain: null,
      fuel: 100,
    };
  }

  user.masinisRpg.license = Boolean(user.masinisRpg.license);
  user.masinisRpg.tripCount = Number(user.masinisRpg.tripCount) || 0;
  user.masinisRpg.stations = Array.isArray(user.masinisRpg.stations)
    ? user.masinisRpg.stations
    : [];
  user.masinisRpg.earnings = Number(user.masinisRpg.earnings) || 0;
  user.masinisRpg.currentTrain = user.masinisRpg.currentTrain || null;
  user.masinisRpg.fuel = Number.isFinite(Number(user.masinisRpg.fuel))
    ? Number(user.masinisRpg.fuel)
    : 100;
}

function showMenu(m, user, name, usedPrefix) {
  const data = user.masinisRpg;
  const train = data.currentTrain
    ? TRAINS[data.currentTrain]?.name || data.currentTrain
    : "Belum punya";

  return m.reply(`
🚂 *MASINIS RPG*

👤 Nama: ${name}
🪪 SIM: ${data.license ? "Sudah punya" : "Belum punya"}
🚆 Kereta: ${train}
⛽ BBM: ${data.fuel}%
🛤️ Perjalanan: ${data.tripCount}x
💰 Total Hasil: Rp${rupiah(data.earnings)}
💵 Uang: Rp${rupiah(user.money)}

*Cara Main:*
1. ${usedPrefix}simmasinis
2. ${usedPrefix}kereta
3. ${usedPrefix}belikereta commuter
4. ${usedPrefix}jalan
5. ${usedPrefix}bbmkereta
`.trim());
}

function buySim(m, user, usedPrefix) {
  const data = user.masinisRpg;

  if (data.license) return m.reply("Kamu sudah punya SIM Masinis.");

  if (user.money < SIM_PRICE) {
    return m.reply(`
Uang kamu kurang.

Harga SIM: Rp${rupiah(SIM_PRICE)}
Uang kamu: Rp${rupiah(user.money)}
`.trim());
  }

  user.money -= SIM_PRICE;
  data.license = true;

  return m.reply(`
✅ Berhasil membuat SIM Masinis.

Lanjut beli kereta:
${usedPrefix}kereta
`.trim());
}

function showKereta(m, user, usedPrefix) {
  const data = user.masinisRpg;

  const list = Object.entries(TRAINS)
    .map(([id, v]) => {
      const active = data.currentTrain === id ? " ✅ Dipakai" : "";
      return `• *${id}*
Nama: ${v.name}
Harga: Rp${rupiah(v.price)}
BBM: ${v.fuelUse}%/jam${active}`;
    })
    .join("\n\n");

  return m.reply(`
🚆 *DAFTAR KERETA*

${list}

*Cara beli:*
${usedPrefix}belikereta commuter
`.trim());
}

function beliKereta(m, user, args, usedPrefix) {
  const data = user.masinisRpg;

  if (!data.license) {
    return m.reply(`
Kamu belum punya SIM Masinis.

Buat dulu:
${usedPrefix}simmasinis
`.trim());
  }

  const input = (args[0] || "").toLowerCase();

  if (!input || !TRAINS[input]) {
    return m.reply(`
Kereta tidak ditemukan.

Lihat daftar:
${usedPrefix}kereta

Contoh:
${usedPrefix}belikereta commuter
`.trim());
  }

  const train = TRAINS[input];

  if (user.money < train.price) {
    return m.reply(`
Uang kamu kurang.

Kereta: ${train.name}
Harga: Rp${rupiah(train.price)}
Uang kamu: Rp${rupiah(user.money)}
`.trim());
  }

  user.money -= train.price;
  data.currentTrain = input;
  data.fuel = 100;

  return m.reply(`
✅ Berhasil membeli kereta *${train.name}*.

BBM otomatis penuh 100%.

Mulai perjalanan:
${usedPrefix}jalan
`.trim());
}

async function jalan(m, conn, user) {
  const data = user.masinisRpg;

  if (!data.license) return m.reply("Kamu belum punya SIM Masinis.\nKetik *.simmasinis* dulu.");
  if (!data.currentTrain) return m.reply("Kamu belum punya kereta.\nKetik *.kereta* lalu beli kereta.");

  const train = TRAINS[data.currentTrain];
  const station = pick(STATIONS);
  const risk = pick(RISKS);
  const fuelCost = station.duration * train.fuelUse;

  if (data.fuel < fuelCost) {
    return m.reply(`
BBM tidak cukup.

Butuh: ${fuelCost}%
BBM kamu: ${data.fuel}%

Isi dulu:
*.bbmkereta*
`.trim());
  }

  await m.react?.("⏳");

  const key = await conn.sendMessage(
    m.chat,
    { text: `🚂 Kereta *${train.name}* sedang menuju ${station.name}...` },
    { quoted: m }
  );

  await delay(Math.min(station.duration * 1000, 8000));

  const reward = Math.max(0, station.reward + risk.effect);

  user.money += reward;
  data.fuel -= fuelCost;
  data.tripCount += 1;
  data.earnings += reward;
  data.stations.push(station.name);

  if (data.stations.length > 20) data.stations = data.stations.slice(-20);

  await conn.sendMessage(
    m.chat,
    {
      text: `
✅ *PERJALANAN SELESAI*

🚆 Kereta: ${train.name}
📍 Tujuan: ${station.name}
⏱️ Durasi: ${station.duration} jam
📌 Kejadian: ${risk.message}

💰 Pendapatan: Rp${rupiah(reward)}
⛽ BBM Terpakai: ${fuelCost}%
⛽ Sisa BBM: ${data.fuel}%
💵 Uang Sekarang: Rp${rupiah(user.money)}
`.trim(),
      edit: key.key,
    },
    { quoted: m }
  );

  await m.react?.("✅");
}

function isiBbm(m, user) {
  const data = user.masinisRpg;

  if (!data.currentTrain) return m.reply("Kamu belum punya kereta.");
  if (data.fuel >= 100) return m.reply("BBM kereta kamu masih penuh.");

  if (user.money < FUEL_PRICE) {
    return m.reply(`
Uang kamu kurang.

Biaya isi BBM: Rp${rupiah(FUEL_PRICE)}
Uang kamu: Rp${rupiah(user.money)}
`.trim());
  }

  user.money -= FUEL_PRICE;
  data.fuel = 100;

  return m.reply(`
✅ BBM kereta berhasil diisi penuh.

Sisa uang: Rp${rupiah(user.money)}
`.trim());
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rupiah(num) {
  return Number(num || 0).toLocaleString("id-ID");
}