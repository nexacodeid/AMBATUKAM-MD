/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

// Simpan di file: rpg-aduayam.js

// Variabel untuk menyimpan lobi di setiap chat.
if (!global.aduayam_rooms) {
  global.aduayam_rooms = {};
}

const handler = async (m, { conn, text, command, args }) => {
  let [subcommand] = args;
  if (!subcommand) {
    return m.reply(`
*🐔 Adu Ayam Multiplayer 🐔*

Gunakan perintah ini untuk bertarung dengan banyak pemain sekaligus!

*Perintah:*
- *${command} create*: Membuat lobi adu ayam di grup ini.
- *${command} join*: Bergabung dengan lobi yang sedang dibuka.
- *${command} start*: Memulai pertarungan (hanya pembuat lobi).
- *${command} cancel*: Membatalkan lobi (hanya pembuat lobi).
- *${command} status*: Melihat siapa saja yang sudah bergabung.

*Fitur Baru:*
- Hadiah lebih besar semakin banyak peserta!
- Jika bot adalah admin, grup akan ditutup sementara selama pertarungan.
    `);
  }

  const room_id = m.chat;
  let room = global.aduayam_rooms[room_id];

  switch (subcommand.toLowerCase()) {
    case 'create': {
      if (room) {
        return m.reply('⚠️ Lobi adu ayam sudah ada di grup ini. Tunggu hingga selesai atau dibatalkan.');
      }
      global.aduayam_rooms[room_id] = {
        id: room_id,
        creator: m.sender,
        players: [m.sender],
        status: 'waiting',
        createdAt: Date.now(),
      };
      
      const createText = `🐔 Lobi adu ayam telah dibuat oleh @${m.sender.split('@')[0]}!\n\nPemain lain bisa bergabung dengan mengetik *.aduayam join*. Pembuat lobi bisa memulai dengan *.aduayam start*.`;
      return conn.sendMessage(m.chat, {
        text: createText,
        mentions: [m.sender]
      });
    }

    case 'join': {
      if (!room) {
        return m.reply('⚠️ Tidak ada lobi adu ayam yang aktif di grup ini. Buat dulu dengan *.aduayam create*.');
      }
      if (room.status !== 'waiting') {
        return m.reply('⚠️ Pertarungan sudah dimulai, tidak bisa bergabung lagi.');
      }
      if (room.players.includes(m.sender)) {
        return m.reply('⚠️ Kamu sudah berada di dalam lobi.');
      }
      
      let user = global.db.data.users[m.sender];
      if (!user) global.db.data.users[m.sender] = {};
      if (user.ayam == null) user.ayam = 1;
      if (user.ayamexp == null) user.ayamexp = 0;

      room.players.push(m.sender);
      return conn.sendMessage(m.chat, { text: `✅ @${m.sender.split('@')[0]} telah bergabung dalam pertarungan!`, mentions: [m.sender] });
    }
    
    case 'start': {
      if (!room) {
        return m.reply('⚠️ Tidak ada lobi adu ayam yang aktif.');
      }
      if (room.creator !== m.sender) {
        return m.reply('⚠️ Hanya pembuat lobi yang bisa memulai pertarungan.');
      }
      if (room.players.length < 2) {
        return m.reply('⚠️ Butuh minimal 2 pemain untuk memulai pertarungan.');
      }

      room.status = 'fighting';
      
      // ==================================================================== //
      // ========== FITUR KUNCI GRUP OTOMATIS DIMULAI ========== //
      // ==================================================================== //
      let isBotAdmin = false;
      try {
        const groupMeta = await conn.groupMetadata(m.chat);
        const botId = conn.user.jid.split(':')[0] + '@s.whatsapp.net';
        const bot = groupMeta.participants.find(p => p.id === botId);
        isBotAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin';
      } catch (e) {
        console.error("Gagal mendapatkan metadata grup:", e);
      }

      if (isBotAdmin) {
        await conn.sendMessage(m.chat, { text: `🔒 *PERHATIAN!* Grup akan ditutup sementara selama pertarungan berlangsung agar tidak ada gangguan!` });
        await delay(2000);
        await conn.groupSettingUpdate(m.chat, 'announcement');
      }
      
      // --- ALUR DRAMATIS PERTARUNGAN ---
      const playersData = room.players.map(jid => {
        let u = global.db.data.users[jid] || {};
        if (u.ayam == null) u.ayam = 1;
        return { jid, name: conn.getName(jid), level: u.ayam };
      });
      
      await conn.sendMessage(m.chat, { text: `🔥 *ARENA TELAH DI BUKA!* 🔥\n\nPara ayam petarung telah memasuki medan laga! Penonton bersorak-sorai!` });
      await delay(3000);

      // --- PENGUMUMAN HADIAH ---
      const totalPlayers = playersData.length;
      const prizePoolMoney = 20000 * (totalPlayers - 1);
      await conn.sendMessage(m.chat, { text: `💰 Dengan *${totalPlayers} peserta*, total hadiah yang diperebutkan adalah *Rp ${prizePoolMoney.toLocaleString()}*! Semakin banyak peserta, semakin besar hadiahnya!` });
      await delay(3000);

      let playerListText = "*Memperkenalkan para penantang:*\n" + playersData.map((p, i) => `${i + 1}. @${p.jid.split('@')[0]} dengan ayam *Lv. ${p.level}*`).join('\n');
      await conn.sendMessage(m.chat, { text: playerListText, mentions: room.players });
      await delay(4000);

      await conn.sendMessage(m.chat, { text: `*RONDE 1* 🔔\n\nAyam-ayam saling menyerang dengan sengit! Patukan dan cakaran tajam beradu di udara!` });
      await delay(4000);

      const randomContender = playersData[Math.floor(Math.random() * playersData.length)];
      await conn.sendMessage(m.chat, { text: `💥 Terlihat ayam milik @${randomContender.jid.split('@')[0]} melepaskan serangan spesial yang merepotkan lawan-lawannya!`, mentions: [randomContender.jid] });
      await delay(4000);

      await conn.sendMessage(m.chat, { text: `*SUASANA MEMANAS!* 🐔💨\n\nBeberapa ayam mulai terlihat kelelahan... Bulu-bulu beterbangan! Siapakah yang akan menjadi juara?` });
      await delay(5000);

      // --- Logika Penentuan Pemenang ---
      playersData.sort((a, b) => b.level - a.level);
      const highestLevel = playersData[0].level;
      const topPlayers = playersData.filter(p => p.level === highestLevel);
      const champion = topPlayers[Math.floor(Math.random() * topPlayers.length)];

      let winner = null;
      let isUpset = false;
      const CHANCE_OF_NO_UPSET = 0.8; 

      if (Math.random() < CHANCE_OF_NO_UPSET && topPlayers.length === 1) {
        winner = champion;
      } else {
        isUpset = true;
        const totalLevel = playersData.reduce((sum, p) => sum + p.level, 0);
        let randomPoint = Math.random() * totalLevel;
        for (const player of playersData) {
          randomPoint -= player.level;
          if (randomPoint <= 0) {
            winner = player;
            break;
          }
        }
      }

      if (isUpset && winner.jid !== champion.jid) {
          await conn.sendMessage(m.chat, { 
              text: `🤯💥 *TIDAK DISANGKA! KEJUTAN BESAR TERJADI!* 💥🤯\n\nAyam milik @${champion.jid.split('@')[0]} (Lv. ${champion.level}) yang diunggulkan, secara tak terduga tumbang!`,
              mentions: [champion.jid]
          });
          await delay(3000);
      }
      
      await conn.sendMessage(m.chat, { text: `Setelah pertarungan yang menguras tenaga... pemenangnya telah ditentukan...` });
      await delay(3000);

      await conn.sendMessage(m.chat, { 
        text: `Dan juaranya adalah... 👑 *@${winner.jid.split('@')[0]}* 👑!!!\n\nSelamat atas kemenangan yang gemilang!`,
        mentions: [winner.jid]
      });
      await delay(2000);
      
      // --- Logika Memberi Hadiah & Membuat Tabel ---
      const results = [];
      const losers = room.players.filter(jid => jid !== winner.jid);

      const winnerDb = global.db.data.users[winner.jid];
      const winExp = 200 * losers.length;
      const winMoney = 20000 * losers.length;
      winnerDb.ayamexp += winExp;
      winnerDb.money = (winnerDb.money || 0) + winMoney;
      const winnerLvlUp = cekLevelAyam(winnerDb);
      
      results.push({
        jid: winner.jid, level: winner.level, newLevel: winnerDb.ayam,
        exp: winExp, money: winMoney, isWinner: true, levelUp: winnerLvlUp
      });

      const loseExp = 50; const loseMoney = 5000;
      losers.forEach(loserJid => {
        const loserDb = global.db.data.users[loserJid];
        const initialLevel = playersData.find(p => p.jid === loserJid).level;
        if (loserDb) {
          loserDb.ayamexp += loseExp;
          loserDb.money = (loserDb.money || 0) + loseMoney;
          const loserLvlUp = cekLevelAyam(loserDb);
          results.push({
            jid: loserJid, level: initialLevel, newLevel: loserDb.ayam,
            exp: loseExp, money: loseMoney, isWinner: false, levelUp: loserLvlUp
          });
        }
      });
      
      let tableText = "Berikut adalah hasil akhir kejuaraan:\n\n┌─「 *🏆 HASIL KEJUARAAN 🏆* 」\n";
      tableText += "│\n";
      
      results.forEach((res, index) => {
        const rank = index + 1;
        const playerTag = `@${res.jid.split('@')[0]}`;
        const levelText = res.levelUp ? `${res.level} -> ${res.newLevel} (Naik Level!)` : `${res.level}`;
        const rewardText = `+Rp ${res.money.toLocaleString()}, +${res.exp} EXP`;
        const icon = res.isWinner ? '👑' : '💔';

        tableText += `├─ ${icon} *Peringkat ${rank}*\n`;
        tableText += `│  • Nama: ${playerTag}\n`;
        tableText += `│  • Ayam Lv: ${levelText}\n`;
        tableText += `│  • Hadiah: ${rewardText}\n`;
        tableText += `${index === results.length - 1 ? '└' : '│'}\n`;
      });

      await conn.sendMessage(m.chat, {
        text: tableText.trim(),
        mentions: results.map(res => res.jid) 
      });
      
      // ==================================================================== //
      // ========== FITUR BUKA GRUP OTOMATIS DIMULAI ========== //
      // ==================================================================== //
      if (isBotAdmin) {
        await delay(2000);
        await conn.groupSettingUpdate(m.chat, 'not_announcement');
        await conn.sendMessage(m.chat, { text: `🔓 Grup telah dibuka kembali! Terima kasih sudah berpartisipasi!` });
      }

      delete global.aduayam_rooms[room_id];
      break;
    }
      
    case 'cancel':
      if (!room) return m.reply('⚠️ Tidak ada lobi untuk dibatalkan.');
      if (room.creator !== m.sender) return m.reply('⚠️ Hanya pembuat lobi yang bisa membatalkan.');
      delete global.aduayam_rooms[room_id];
      return m.reply('✅ Lobi adu ayam berhasil dibatalkan.');

    case 'status':
      if (!room) return m.reply('⚠️ Tidak ada lobi adu ayam yang aktif saat ini.');
      const playerStatusText = room.players.map((jid, i) => {
        const user = global.db.data.users[jid] || { ayam: 1 };
        return `${i + 1}. @${jid.split('@')[0]} (Ayam Lv. ${user.ayam || 1})`;
      }).join('\n');
      return conn.sendMessage(m.chat, {
        text: `*Status Lobi Adu Ayam 🐔*\n\n*Pembuat:* @${room.creator.split('@')[0]}\n*Status:* ${room.status}\n\n*Pemain Terdaftar:*\n${playerStatusText}`,
        mentions: room.players
      });

    default:
      return m.reply(`Perintah tidak valid. Gunakan *.${command}* untuk melihat bantuan.`);
  }
};

handler.command = /^aduayam$/i;
handler.group = true;
handler.register = true;
export default handler;

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
function cekLevelAyam(user) {
  if (user.ayam == null) user.ayam = 1;
  if (user.ayamexp == null) user.ayamexp = 0;
  let batas = user.ayam * 500;
  let naik = false;
  while (user.ayamexp >= batas) {
    user.ayamexp -= batas;
    user.ayam++;
    batas = user.ayam * 500;
    naik = true;
  }
  return naik;
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