import cron from "node-cron";
import { delay } from "baileys";

const groupJid = "120363299487252901@g.us";
const DAY = 86400000;
const TIMEZONE = "Asia/Jakarta";

const REWARDS = {
  subscriber: {
    title: "🌐 Top Subscriber",
    field: "subscriber",
    resetField: "subscriber",
    key: "subscriber",
    label: "Subs",
    money: 20000000,
    limit: 8000,
    cash: 6000,
    premium: 10,
  },
  astronot: {
    title: "🚀 Top Astronot",
    field: "totalb",
    resetField: "totalb",
    key: "astronot",
    label: "Total Berangkat",
    money: 15000000,
    limit: 5000,
    cash: 5000,
    premium: 7,
  },
  damage: {
    title: "💥 Top Damage",
    field: "resultdamage",
    resetField: "resultdamage",
    key: "damage",
    label: "Total Damage",
    money: 10000000,
    limit: 4000,
    cash: 3000,
    premium: 5,
  },
};

function prepareDatabase() {
  if (!global.db) global.db = {};
  if (!global.db.data) global.db.data = {};
  if (!global.db.data.users) global.db.data.users = {};
  if (!global.db.data.rewardHistory) global.db.data.rewardHistory = {};
  if (!global.db.data.lastWinners) global.db.data.lastWinners = {};
}

function getJakartaDate() {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: TIMEZONE,
    })
  );
}

function getCurrentPeriodKey() {
  const now = getJakartaDate();
  const year = now.getFullYear();
  const firstDay = new Date(year, 0, 1);
  const days = Math.floor((now - firstDay) / DAY);
  const week = Math.ceil((days + firstDay.getDay() + 1) / 7);

  return `${year}-W${String(week).padStart(2, "0")}`;
}

function isRewardAlreadyGiven(periodKey) {
  prepareDatabase();
  return global.db.data.rewardHistory[periodKey] === true;
}

function markRewardAsGiven(periodKey) {
  prepareDatabase();

  global.db.data.rewardHistory[periodKey] = true;

  const keys = Object.keys(global.db.data.rewardHistory).sort();

  if (keys.length > 10) {
    const removeKeys = keys.slice(0, keys.length - 10);

    for (const key of removeKeys) {
      delete global.db.data.rewardHistory[key];
    }
  }
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString("id-ID");
}

function formatDate() {
  return new Date().toLocaleString("id-ID", {
    timeZone: TIMEZONE,
  });
}

function tag(jid) {
  if (!jid) return "@unknown";
  return `@${String(jid).split("@")[0]}`;
}

function normalizeUser(jid, data) {
  return {
    jid,
    name: data.name || data.nama || "Unknown",
    subscriber: Number(data.subscriber || 0),
    totalb: Number(data.totalb || 0),
    resultdamage: Number(data.resultdamage || 0),
  };
}

function getTop(users, field) {
  const filtered = users.filter((user) => Number(user[field] || 0) > 0);

  if (!filtered.length) return null;

  filtered.sort((a, b) => Number(b[field] || 0) - Number(a[field] || 0));

  return filtered[0];
}

function addReward(jid, rewardConfig) {
  prepareDatabase();

  if (!global.db.data.users[jid]) {
    global.db.data.users[jid] = {};
  }

  const user = global.db.data.users[jid];

  const oldPremiumTime = Number(user.premiumTime || 0);
  const basePremiumTime = Math.max(Date.now(), oldPremiumTime);

  user.money = Number(user.money || 0) + Number(rewardConfig.money || 0);
  user.limit = Number(user.limit || 0) + Number(rewardConfig.limit || 0);
  user.cash = Number(user.cash || 0) + Number(rewardConfig.cash || 0);

  user.premium = true;
  user.premiumTime = basePremiumTime + Number(rewardConfig.premium || 0) * DAY;

  user[rewardConfig.resetField] = 0;

  return user;
}

function createWinnerData(topUser, rewardConfig, periodKey, waktu) {
  return {
    jid: topUser.jid,
    name: topUser.name || "Unknown",
    field: rewardConfig.field,
    label: rewardConfig.label,
    value: Number(topUser[rewardConfig.field] || 0),
    hadiah: {
      money: rewardConfig.money,
      limit: rewardConfig.limit,
      cash: rewardConfig.cash,
      premium: rewardConfig.premium,
    },
    waktu,
    periodKey,
  };
}

async function getGroupMembers(conn) {
  const members = [];

  try {
    if (!conn || typeof conn.groupMetadata !== "function") return members;

    const metadata = await conn.groupMetadata(groupJid);
    const participants =
      metadata && Array.isArray(metadata.participants)
        ? metadata.participants
        : [];

    for (const participant of participants) {
      if (participant && participant.id) {
        members.push(participant.id);
      }
    }
  } catch (e) {
    console.error("Gagal mengambil metadata grup:", e);
  }

  return members;
}

async function closeGroup(conn) {
  try {
    if (!conn || typeof conn.groupSettingUpdate !== "function") return false;

    await conn.groupSettingUpdate(groupJid, "announcement");
    return true;
  } catch (e) {
    console.error("Gagal menutup grup:", e);
    return false;
  }
}

async function openGroup(conn) {
  try {
    if (!conn || typeof conn.groupSettingUpdate !== "function") return false;

    await conn.groupSettingUpdate(groupJid, "not_announcement");
    return true;
  } catch (e) {
    console.error("Gagal membuka grup:", e);
    return false;
  }
}

async function sendText(conn, text, mentions) {
  await conn.sendMessage(groupJid, {
    text,
    mentions: mentions || [],
  });
}

async function dramaticOpening(conn, mentions, currentPeriod) {
  await closeGroup(conn);

  await sendText(
    conn,
    `🔒 *GRUP DITUTUP SEMENTARA!*

@everyone

⚠️ Semua aktivitas dihentikan dulu.
🏆 *Weekly Reward Ceremony* akan segera dimulai.

📅 Periode: *${currentPeriod}*
⏳ Mohon tunggu sebentar...

Malam/minggu ini kita akan melihat siapa yang pantas naik ke panggung juara. 🔥`,
    mentions
  );

  await delay(3000);

  await sendText(
    conn,
    `🥁 *PENGUMUMAN PEMENANG DIMULAI DALAM...*

*3*

Siapkan mental kalian.
Data ranking sedang dikunci.`
  );

  await delay(2500);

  await sendText(
    conn,
    `🥁 *PENGUMUMAN PEMENANG DIMULAI DALAM...*

*2*

Hadiah besar sudah menunggu para juara.`
  );

  await delay(2500);

  await sendText(
    conn,
    `🥁 *PENGUMUMAN PEMENANG DIMULAI DALAM...*

*1*

Dan pemenangnya adalah...`
  );

  await delay(3000);
}

function buildNotification(lastWinners, currentPeriod, now) {
  let notif = `🏆 *WEEKLY REWARD RESULT* 🏆

🎉 Selamat kepada para juara minggu ini!

`;

  const order = ["subscriber", "astronot", "damage"];

  for (const key of order) {
    const winner = lastWinners[key];
    if (!winner) continue;

    notif += `${REWARDS[key].title}
• 👤 Pemenang: ${tag(winner.jid)}
• ${winner.label}: *${formatNumber(winner.value)}*

🎁 *Hadiah Diterima:*
• 💵 Money: ${formatNumber(winner.hadiah.money)}
• 💳 Limit: ${formatNumber(winner.hadiah.limit)}
• 💰 Cash: ${formatNumber(winner.hadiah.cash)}
• 🎫 Premium: ${winner.hadiah.premium} hari

`;
  }

  if (!Object.keys(lastWinners).length) {
    notif += `⚠️ Tidak ada pemenang minggu ini.
Semangat untuk minggu depan! 💪

`;
  }

  notif += `🕒 Waktu Reset: ${now}
📅 Periode: ${currentPeriod}

⚠️ Hanya Top 1 yang menerima hadiah.
⚠️ Data ranking pemenang sudah di-reset.

🔓 Grup akan dibuka kembali sebentar lagi.`;

  return notif;
}

async function runWeeklyReward(conn, force = false) {
  prepareDatabase();

  if (!conn || typeof conn.sendMessage !== "function") {
    console.error("Weekly reward gagal: global.conn belum siap.");
    return {
      ok: false,
      message: "global.conn belum siap.",
    };
  }

  const currentPeriod = getCurrentPeriodKey();

  if (!force && isRewardAlreadyGiven(currentPeriod)) {
    return {
      ok: false,
      message: `Reward periode ${currentPeriod} sudah pernah diberikan.`,
    };
  }

  const allMembers = await getGroupMembers(conn);
  const now = formatDate();

  await dramaticOpening(conn, allMembers, currentPeriod);

  const users = Object.entries(global.db.data.users).map(([jid, data]) => {
    return normalizeUser(jid, data || {});
  });

  const lastWinners = {};
  const mentions = [];

  for (const rewardKey of Object.keys(REWARDS)) {
    const rewardConfig = REWARDS[rewardKey];
    const topUser = getTop(users, rewardConfig.field);

    if (!topUser) continue;

    addReward(topUser.jid, rewardConfig);

    lastWinners[rewardConfig.key] = createWinnerData(
      topUser,
      rewardConfig,
      currentPeriod,
      now
    );

    mentions.push(topUser.jid);
  }

  global.db.data.lastWinners = Object.assign(
    {},
    global.db.data.lastWinners,
    lastWinners
  );

  const uniqueMentions = [...new Set([...mentions, ...allMembers])];
  const notif = buildNotification(lastWinners, currentPeriod, now);

  try {
    await sendText(conn, notif, uniqueMentions);

    markRewardAsGiven(currentPeriod);

    await delay(5000);

    await sendText(
      conn,
      `🔓 *GRUP DIBUKA KEMBALI!*

Terima kasih sudah menyaksikan Weekly Reward Ceremony.

Untuk yang belum menang, jangan menyerah.
Minggu depan panggungnya bisa jadi milik kamu. 🔥`,
      allMembers
    );

    await openGroup(conn);

    return {
      ok: true,
      message: `Weekly reward periode ${currentPeriod} berhasil diproses.`,
      winners: lastWinners,
    };
  } catch (e) {
    console.error("Gagal mengirim notifikasi weekly reward:", e);

    await openGroup(conn);

    return {
      ok: false,
      message: "Reward sudah diproses, tetapi notifikasi gagal dikirim.",
      error: e,
    };
  }
}

if (!global.__weeklyRewardCronStarted) {
  global.__weeklyRewardCronStarted = true;

  cron.schedule(
    "0 8 * * 1",
    async () => {
      try {
        await runWeeklyReward(global.conn, false);
      } catch (e) {
        console.error("Weekly reward cron error:", e);

        try {
          await openGroup(global.conn);
        } catch {}
      }
    },
    {
      scheduled: true,
      timezone: TIMEZONE,
    }
  );

  console.log("[WEEKLY REWARD] Cron aktif setiap Senin jam 08:00 WIB");
}

let handler = async (m, { conn, command, isOwner }) => {
  if (!isOwner) return m.reply("Fitur ini hanya untuk owner.");

  if (/^weeklyrewardtest$/i.test(command)) {
    const result = await runWeeklyReward(conn, true);

    return m.reply(
      `✅ *Weekly Reward Test Selesai*\n\n` +
        `Status: ${result.ok ? "Berhasil" : "Gagal"}\n` +
        `Pesan: ${result.message}`
    );
  }

  if (/^weeklyrewardstatus$/i.test(command)) {
    prepareDatabase();

    const currentPeriod = getCurrentPeriodKey();
    const already = isRewardAlreadyGiven(currentPeriod);

    return m.reply(
      `📊 *Weekly Reward Status*\n\n` +
        `Periode: *${currentPeriod}*\n` +
        `Sudah Dibagikan: *${already ? "Ya" : "Belum"}*\n` +
        `Target Grup: *${groupJid}*\n` +
        `Jadwal: *Senin 08:00 WIB*\n\n` +
        `Alur:\n` +
        `1. Grup ditutup\n` +
        `2. Countdown 3 2 1\n` +
        `3. Reward diberikan\n` +
        `4. Grup dibuka kembali`
    );
  }
};

handler.help = ["tesreward", "weeklyrewardtest"];
handler.tags = ["owner"];
handler.command = /^(tesreward|weeklyrewardtest)$/i;
handler.owner = true;

export default handler;