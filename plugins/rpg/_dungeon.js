/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const ROOM_TIMEOUT = 30 * 60 * 1000;

const SERVER_CONFIG = {
  easy: {
    nameserver: "easy",
    armor: "Leather Armor",
    sword: "Rusty Sword",
    armorserver: 1,
    swordserver: 1,
    adura: 50,
    sdura: 50,
    healtserver: 90,
    monsters: [
      "Goblin",
      "Giant Rat",
      "Skeleton",
      "Zombie",
      "Slime",
      "Bat",
      "Kobold",
      "Giant Spider",
      "Wolf",
      "Bandit",
    ],
  },

  medium: {
    nameserver: "medium",
    armor: "Studded Leather Armor",
    sword: "Bronze Sword",
    armorserver: 3,
    swordserver: 4,
    adura: 350,
    sdura: 650,
    healtserver: 450,
    monsters: [
      "Orc",
      "Hobgoblin",
      "Wraith",
      "Ghoul",
      "Giant Centipede",
      "Dire Wolf",
      "Bugbear",
      "Shadow",
      "Otyugh",
      "Harpy",
    ],
  },

  hard: {
    nameserver: "hard",
    armor: "Half Plate Armor",
    sword: "Dwarven Sword",
    armorserver: 7,
    swordserver: 8,
    adura: 2150,
    sdura: 2850,
    healtserver: 2250,
    monsters: [
      "Troll",
      "Manticore",
      "Wyvern",
      "Wight",
      "Ettin",
      "Basilisk",
      "Minotaur",
      "Succubus",
      "Chimera",
      "Banshee",
    ],
  },

  extreme: {
    nameserver: "extreme",
    armor: "Ethereal Armor",
    sword: "Lightbringer",
    armorserver: 15,
    swordserver: 17,
    adura: 10550,
    sdura: 13650,
    healtserver: 10650,
    monsters: [
      "Lich",
      "Hydra",
      "Beholder",
      "Fire Giant",
      "Frost Giant",
      "Black Dragon",
      "Mind Flayer",
      "Vampire",
      "Stone Golem",
      "Medusa",
    ],
  },

  impossible: {
    nameserver: "impossible",
    armor: "GodSlayer Armor",
    sword: "Legendary Sword",
    armorserver: 20,
    swordserver: 25,
    adura: 19050,
    sdura: 30050,
    healtserver: 19150,
    monsters: [
      "Ancient Red Dragon",
      "Demogorgon",
      "Tarrasque",
      "Balor",
      "Kraken",
      "Pit Fiend",
      "Ancient Gold Dragon",
      "Lich King",
      "Elder Brain",
      "Great Wyrm",
    ],
  },
};

let handler = async (m, { conn, command }) => {
  conn.mabar = conn.mabar || {};
  conn.dungeon = conn.dungeon || {};

  const ruang = conn.mabar[m.chat];
  const difficulty = String(command || "").toLowerCase();
  const server = SERVER_CONFIG[difficulty];

  if (!server) return;

  if (!ruang || ruang.state !== "pilihserver") {
    return m.reply(
      `⚠️ Kamu belum membuat room dungeon.\n\n` +
        `Ketik:\n` +
        `*buat room*\n\n` +
        `Lalu pilih server:\n` +
        `*.easy* / *.medium* / *.hard* / *.extreme* / *.impossible*`
    );
  }

  if (m.sender !== ruang.master) {
    return m.reply(
      `❌ Hanya pembuat room yang bisa memilih server.\n\n` +
        `Pembuat room: @${String(ruang.master).split("@")[0]}`,
      null,
      {
        mentions: [ruang.master],
      }
    );
  }

  if (conn.dungeon[m.chat]) {
    return m.reply(
      `⚠️ Masih ada room dungeon aktif di grup ini.\n\n` +
        `Selesaikan dulu room sebelumnya atau batalkan dungeon.`
    );
  }

  if (!global.db) global.db = {};
  if (!global.db.data) global.db.data = {};
  if (!global.db.data.users) global.db.data.users = {};

  const play = global.db.data.users[ruang.master];

  if (!play) {
    return m.reply("❌ Data RPG kamu tidak ditemukan di database.");
  }

  const stats = getPlayerStats(play);
  const check = checkRequirement(stats, server);

  if (!check.ok) {
    return m.reply(check.message);
  }

  delete conn.mabar[m.chat];

  conn.dungeon[m.chat] = {
    id: createRoomId(),
    p: m.sender,
    master: m.sender,
    players: [m.sender],
    monster: pickRandom(server.monsters),
    status: "wait",
    createdAt: Date.now(),
    expiredAt: Date.now() + ROOM_TIMEOUT,
    cdserver: ROOM_TIMEOUT,

    nameserver: server.nameserver,
    armor: server.armor,
    sword: server.sword,
    armorserver: server.armorserver,
    swordserver: server.swordserver,
    adura: server.adura,
    sdura: server.sdura,
    healtserver: server.healtserver,
  };

  const room = conn.dungeon[m.chat];

  const buatRoom = `
🔱 *DUNGEON ROOM BERHASIL DIBUAT*

🆔 Room ID: *${room.id}*
🌍 Server: *${capitalize(room.nameserver)}*
👹 Monster: *${room.monster}*
👤 Master: @${m.sender.split("@")[0]}
⏳ Expired: *30 menit*

╭─〔 *Syarat Server* 〕
│◦ Health : ${formatNumber(server.healtserver)}
│◦ Armor  : ${server.armor}
│◦ Sword  : ${server.sword}
│◦ Armor Durability : ${formatNumber(server.adura)}
│◦ Sword Durability : ${formatNumber(server.sdura)}
╰──────────────

♻️ Menunggu pemain lain join ke room.

Untuk bergabung:
*join dungeon*

Untuk bermain solo:
*dewekan*

Untuk membatalkan:
*batalkan dungeon*
`.trim();

  await conn.sendMessage(
    m.chat,
    {
      text: buatRoom,
      mentions: [m.sender],
    },
    {
      quoted: m,
    }
  );
};

handler.help = ["easy", "medium", "hard", "extreme", "impossible"];
handler.tags = ["rpg"];
handler.command = /^(easy|medium|hard|extreme|impossible)$/i;

export default handler;

function getPlayerStats(user) {
  const health = Number(
    user.healt !== undefined
      ? user.healt
      : user.health !== undefined
      ? user.health
      : 0
  );

  return {
    health,
    armor: Number(user.armor || 0),
    sword: Number(user.sword || 0),
    armordurability: Number(user.armordurability || 0),
    sworddurability: Number(user.sworddurability || 0),
  };
}

function checkRequirement(stats, server) {
  if (stats.health < server.healtserver) {
    return {
      ok: false,
      message:
        `❕ *Health kamu belum cukup!*\n\n` +
        `❤️ Health kamu: *${formatNumber(stats.health)}*\n` +
        `❤️ Minimal: *${formatNumber(server.healtserver)}*\n\n` +
        `Gunakan potion atau heal terlebih dahulu.`,
    };
  }

  if (stats.armor < server.armorserver) {
    return {
      ok: false,
      message:
        `🧥 *Armor kamu belum cukup!*\n\n` +
        `Armor kamu level: *${formatNumber(stats.armor)}*\n` +
        `Minimal armor: *${server.armor}* / level *${server.armorserver}*`,
    };
  }

  if (stats.sword < server.swordserver) {
    return {
      ok: false,
      message:
        `🗡️ *Sword kamu belum cukup!*\n\n` +
        `Sword kamu level: *${formatNumber(stats.sword)}*\n` +
        `Minimal sword: *${server.sword}* / level *${server.swordserver}*`,
    };
  }

  if (stats.armordurability < server.adura) {
    return {
      ok: false,
      message:
        `🛡️🧥 *Durability armor kurang!*\n\n` +
        `Durability kamu: *${formatNumber(stats.armordurability)}*\n` +
        `Minimal: *${formatNumber(server.adura)}*\n\n` +
        `Repair armor kamu terlebih dahulu.`,
    };
  }

  if (stats.sworddurability < server.sdura) {
    return {
      ok: false,
      message:
        `🛡️🗡️ *Durability sword kurang!*\n\n` +
        `Durability kamu: *${formatNumber(stats.sworddurability)}*\n` +
        `Minimal: *${formatNumber(server.sdura)}*\n\n` +
        `Repair sword kamu terlebih dahulu.`,
    };
  }

  return {
    ok: true,
    message: "",
  };
}

function createRoomId() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function capitalize(str) {
  str = String(str || "");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString("id-ID");
}