/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

// handler/turnamen-naga.js

let handler = async (m, { conn, command, args, isAdmin, participants }) => {
  const chatId = m.chat;
  conn.turnamenNaga = conn.turnamenNaga || {};
  conn.turnamenNaga[chatId] = conn.turnamenNaga[chatId] || {
    peserta: [],
    ronde: 0,
    bracket: [],
    status: 'idle',
    leaderboard: {},
    pembuat: m.sender,
    nextPeserta: [],
    ranking: []
  };
  let turnamen = conn.turnamenNaga[chatId];

  switch (command) {
    case 'daftarturnaga': {
      if (turnamen.status !== 'daftar') return m.reply('❌ Pendaftaran belum dibuka.');
      if (turnamen.peserta.includes(m.sender)) return m.reply('⚠️ Kamu sudah terdaftar.');
      turnamen.peserta.push(m.sender);
      m.reply(`✅ ${conn.getName(m.sender)} berhasil mendaftar ke turnamen.`);
      break;
    }

    case 'cekturnaga': {
      if (turnamen.peserta.length === 0) return m.reply('📭 Belum ada peserta.');
      let teks = `*📋 Daftar Peserta Turnamen:*\n\n` +
        turnamen.peserta.map((u, i) => `${i + 1}. @${u.split('@')[0]}`).join('\n');
      conn.sendMessage(chatId, { text: teks, mentions: turnamen.peserta });
      break;
    }

    case 'lbturnaga': {
      let lb = Object.entries(turnamen.leaderboard || {}).sort((a, b) => b[1] - a[1]);
      if (!lb.length) return m.reply('📭 Belum ada data leaderboard.');
      let teks = `*🏆 Leaderboard Turnamen Naga:*\n\n`;
      lb.forEach(([id, win], i) => teks += `${i + 1}. @${id.split('@')[0]} - ${win} kemenangan\n`);
      conn.sendMessage(chatId, { text: teks, mentions: lb.map(([id]) => id) });
      break;
    }

    case 'statusturnaga': {
      let teks = `📊 *Status Turnamen Naga*\n\nStatus: *${turnamen.status}*\nRonde: ${turnamen.ronde || '-'}\nPeserta: ${turnamen.peserta.length}`;
      m.reply(teks);
      break;
    }

    case 'resetturnaga': {
      if (!isAdmin) return m.reply('⚠️ Hanya admin yang bisa mereset turnamen.');
      delete conn.turnamenNaga[chatId];
      m.reply('✅ Turnamen telah direset.');
      break;
    }

    case 'mulaiturnaga': {
      if (!isAdmin) return m.reply('⚠️ Hanya admin yang bisa memulai turnamen.');
      if (turnamen.status === 'berlangsung') return m.reply('⚠️ Turnamen masih berlangsung.');
      if (turnamen.status === 'daftar') return m.reply('⚠️ Pendaftaran turnamen sedang dibuka.');

      let durasi = parseInt(args[0]) || 60;
      turnamen.status = 'daftar';
      turnamen.peserta = [];
      turnamen.ranking = [];

      m.reply(`📢 Turnamen naga dimulai!\n\n🕒 Waktu pendaftaran: ${durasi} detik\nGunakan *.daftarturnaga* untuk bergabung.`);

      if (durasi * 1000 > 30000) {
        setTimeout(async () => {
          if (turnamen.status === 'daftar') {
            try {
              let grup = await conn.groupMetadata(chatId);
              let semuaMember = grup.participants.map(p => p.id);
              await conn.sendMessage(chatId, {
                text: `⏰ *30 detik lagi sebelum pendaftaran ditutup!*\nKetik *.daftarturnaga* sekarang jika belum mendaftar.`,
                mentions: semuaMember
              });
            } catch (e) {
              console.error('Gagal mengambil data member grup:', e);
            }
          }
        }, (durasi * 1000) - 30000);
      }

      setTimeout(async () => {
        if (turnamen.status !== 'daftar') return;
        if (turnamen.peserta.length < 2) {
          m.reply('❌ Turnamen dibatalkan karena kurang dari 2 peserta.');
          turnamen.status = 'batal';
          return;
        }

        try {
  await conn.groupSettingUpdate(chatId, 'announcement');
  await conn.sendMessage(chatId, {
    text: `🔒 *Grup ditutup!*\nTurnamen naga akan dimulai dalam *5 detik*...`
  });
} catch (e) {
  console.error('Gagal menutup grup:', e);
}
        await delay(5000);
        turnamen.status = 'berlangsung';
        turnamen.ronde = 1;
        turnamen.originalPeserta = turnamen.peserta.length;
        await mulaiRonde(conn, m, chatId, turnamen);
      }, durasi * 1000);
      break;
    }
  }
};

handler.help = ['daftarturnaga', 'cekturnaga', 'lbturnaga', 'statusturnaga', 'mulaiturnaga', 'resetturnaga'];
handler.tags = ['game'];
handler.command = /^(daftarturnaga|cekturnaga|lbturnaga|statusturnaga|mulaiturnaga|resetturnaga)$/i;
handler.group = true;
handler.register = true;

export default handler;

async function mulaiRonde(conn, m, chatId, turnamen) {
  let peserta = turnamen.peserta.slice();
  shuffle(peserta);

  if (peserta.length % 2 === 1) {
    let bye = peserta.pop();
    await conn.sendMessage(chatId, {
      text: `🎉 @${bye.split('@')[0]} langsung lolos ke ronde berikutnya!`,
      mentions: [bye]
    });
    turnamen.nextPeserta = [bye];
    await delay(3000);
  } else {
    turnamen.nextPeserta = [];
  }

  let bracket = [];
  for (let i = 0; i < peserta.length; i += 2) {
    bracket.push([peserta[i], peserta[i + 1]]);
  }

  turnamen.bracket = bracket;

  for (let [user1, user2] of bracket) {
    let u1 = global.db.data.users[user1];
    if (!u1) u1 = global.db.data.users[user1] = {};
    let u2 = global.db.data.users[user2];
    if (!u2) u2 = global.db.data.users[user2] = {};

    const lvl1 = u1.naga || 1;
    const lvl2 = u2.naga || 1;
    const total = lvl1 + lvl2;
    const winner = Math.random() < lvl1 / total ? user1 : user2;
    const loser = winner === user1 ? user2 : user1;

    // Final effect
    if (turnamen.peserta.length === 2) {
      await conn.sendMessage(chatId, { text: '🎬 *BABAK FINAL TELAH TIBA!* 🎬' });
await delay(1000);
await conn.sendMessage(chatId, {
  image: { url: 'https://files.catbox.moe/el5uy4.jpg' },
  caption: '🌌 Dua naga muncul di langit, saling menatap dengan mata menyala!'
});
await delay(3000);
await conn.sendMessage(chatId, {
  audio: { url: 'https://files.catbox.moe/us6dcm.mp3' },
  mimetype: 'audio/mpeg'
});
await delay(3000);
await conn.sendMessage(chatId, { text: '🔥 Angin berhembus... tanah mulai retak...' });
await delay(3000);
await conn.sendMessage(chatId, {
  audio: { url: 'https://files.catbox.moe/be6eei.mp3' },
  mimetype: 'audio/mpeg'
});
await delay(3000);
await conn.sendMessage(chatId, { text: '⚔️ *Dua petarung terakhir berdiri gagah.*' });
await delay(3000);
await conn.sendMessage(chatId, {
  audio: { url: 'https://files.catbox.moe/gxsxai.mp3' },
  mimetype: 'audio/mpeg'
});
await delay(3000);
await conn.sendMessage(chatId, { text: '🎇 3️⃣ ... 2️⃣ ... 1️⃣ ...' });
await delay(1500);
await conn.sendMessage(chatId, { text: '🐉 *PERTARUNGAN AKHIR DIMULAI!!* 🐉' });
      await delay(2000);
    }

    await conn.sendMessage(chatId, {
      text: `⚔️ Pertarungan:\n@${user1.split('@')[0]} (Lv${lvl1}) 🐉 vs @${user2.split('@')[0]} (Lv${lvl2})\n\n⏳ Menentukan Naga Terkuat...`,
      mentions: [user1, user2]
    });

    await delay(3000);
    await conn.sendMessage(chatId, {
      text: `🏆 Pemenangnya: @${winner.split('@')[0]}`,
      mentions: [winner]
    });

    turnamen.nextPeserta.push(winner);
    turnamen.ranking.unshift(loser); // kalah dimasukkan ke ranking bawah
    await delay(4000);
  }

  if (turnamen.nextPeserta.length === 1) {
    let pemenang = turnamen.nextPeserta[0];
    let user = global.db.data.users[pemenang];
    if (!user) user = global.db.data.users[pemenang] = {};

    if (user.money == null) user.money = 0;
    if (user.emas == null) user.emas = 0;
    if (user.naga == null) user.naga = 1;
    if (user.nagaexp == null) user.nagaexp = 0;

    let totalPeserta = turnamen.originalPeserta || 2;
    let hadiahUang = totalPeserta * 500000;
    let hadiahEmas = Math.floor(totalPeserta / 3);
    let hadiahExpNaga = totalPeserta * 100;

    user.money += hadiahUang;
    user.emas += hadiahEmas;
    user.nagaexp += hadiahExpNaga;

    let beforeLevel = user.naga;
    cekLevelUpNaga(user);
    let naikLevel = user.naga > beforeLevel;

    if (!turnamen.leaderboard[pemenang]) turnamen.leaderboard[pemenang] = 0;
    turnamen.leaderboard[pemenang] += 1;

    // Tambahkan juga dia sebagai ranking #1
    turnamen.ranking.unshift(pemenang);

    // Beri EXP ke peserta kalah
    for (let i = 0; i < turnamen.ranking.length; i++) {
      let id = turnamen.ranking[i];
      let u = global.db.data.users[id];
      if (!u) u = global.db.data.users[id] = {};
      if (u.nagaexp == null) u.nagaexp = 0;
      let expBonus = (totalPeserta - i - 1) * 50;
      u.nagaexp += expBonus;
      cekLevelUpNaga(u);
    }

    await conn.sendMessage(chatId, { text: '⏳ Menghitung skor akhir...' });
    await delay(2000);
    await conn.sendMessage(chatId, { text: '🏁 Menentukan juara...' });
    await delay(2000);

    await conn.sendMessage(chatId, {
      text: `🎉 *JUARA TURNAMEN NAGA!*\n\n🏆 @${pemenang.split('@')[0]}\n\n🎁 Hadiah:\n+ 🏅 ${hadiahEmas} Emas\n+ 💰 Rp ${hadiahUang.toLocaleString()}\n+ 🐉 +${hadiahExpNaga} Exp Naga${naikLevel ? `\n\n🎉 Naga kamu naik level menjadi *Level ${user.naga}*!` : ''}`,
      mentions: [pemenang]
    });

    await conn.sendMessage(chatId, {
  text: '🔓 *Turnamen Selesai Group Akan Terbuka Kembali Dalam 3 Detik*\nTerima kasih telah mengikuti *Turnamen Naga*!'
});
await delay(3000)
try {
  await conn.groupSettingUpdate(chatId, 'not_announcement');
} catch (e) {
  console.error('Gagal membuka grup:', e);
}

    turnamen.status = 'selesai';
    return;
  }

  turnamen.peserta = turnamen.nextPeserta;
  turnamen.nextPeserta = [];
  turnamen.ronde += 1;

  await conn.sendMessage(chatId, {
    text: `📣 Ronde ${turnamen.ronde} akan dimulai...`
  });

  await delay(5000);
  await mulaiRonde(conn, m, chatId, turnamen);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cekLevelUpNaga(user) {
  if (user.naga == null) user.naga = 1;
  if (user.nagaexp == null) user.nagaexp = 0;
  let batas = user.naga * 1000;
  while (user.nagaexp >= batas) {
    user.nagaexp -= batas;
    user.naga++;
    batas = user.naga * 1000;
  }
}

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */