/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

// Helper function untuk format waktu
function formatTime(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [d, ' H ', h, ' J ', m, ' M ', s, ' D'].map(v => v.toString().padStart(2, 0)).join('');
}

// Helper function untuk jeda
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const handler = async (m, { conn, isGroup }) => {
  let player = global.db.data.users[m.sender];

  // Inisialisasi data RPG untuk pemain jika belum ada
  if (!player) global.db.data.users[m.sender] = {};
  if (player.level === undefined) player.level = 1;
  if (player.hp === undefined) player.hp = 100;
  if (player.energi === undefined) player.energi = 20;
  if (player.money === undefined) player.money = 1000;
  if (player.lastngepet === undefined) player.lastngepet = 0;

  const cooldown = 6 * 60 * 60 * 1000; // 6 jam
  const energyCost = 20;

  const lastNgepetTime = player.lastngepet;
  const timeSinceLast = Date.now() - lastNgepetTime;

  if (timeSinceLast < cooldown) {
    const timeLeft = cooldown - timeSinceLast;
    return m.reply(`🩸 Kamu masih harus memulihkan diri dari ritual terakhir.\nHarap tunggu *${formatTime(timeLeft)}* lagi sebelum bisa ngepet kembali.`);
  }

  if (player.energi < energyCost) {
    return m.reply(`⚡ Energimu tidak cukup untuk melakukan ritual ngepet.\nKamu butuh *${energyCost}* energi, sementara energimu hanya *${player.energi}*.`);
  }
  
  if (player.hp <= 40) {
      return m.reply(`💔 Nyawamu terlalu sedikit untuk melakukan ritual berbahaya ini. Pulihkan dulu HP-mu!`);
  }

  const participants = (await conn.groupMetadata(m.chat)).participants;
  const potentialVictims = participants.filter(p => 
    p.id !== m.sender &&
    p.id !== conn.user.id &&
    global.db.data.users[p.id] &&
    global.db.data.users[p.id].money > 500
  );

  if (potentialVictims.length < 1) {
    return m.reply('Tidak ada target yang cocok untuk di-ngepet di grup ini.');
  }

  const victim = potentialVictims[Math.floor(Math.random() * potentialVictims.length)];
  const victimData = global.db.data.users[victim.id];
  
  // Langsung kurangi energi dan set cooldown
  player.energi -= energyCost;
  player.lastngepet = Date.now();

  const victimName = conn.getName(victim.id);
  let initialText = `*🕯️ Ritual Ngepet Dimulai...*\n\n`;
  initialText += `Kamu memjamkan mata, memusatkan kekuatan batinmu untuk menyelinap ke rumah *${victimName}*...\n\n`;
  initialText += `Bayanganmu bergerak dalam gelap...`;
  
  await conn.sendMessage(m.chat, {
      text: initialText,
      mentions: [victim.id]
  }, { quoted: m });

  // ==================================================================== //
  // ========== INTI LOGIKA PERMAINAN (BERHASIL/GAGAL) ========== //
  // ==================================================================== //

  await sleep(4000); // Jeda dramatis 4 detik

  const successChance = 0.50; // Peluang dasar 50%
  const levelBonus = Math.floor(player.level / 10) * 0.01; // Bonus 1% setiap 10 level
  const totalChance = successChance + levelBonus;

  let resultText = '';
  let mentionedJids = [victim.id];

  if (Math.random() < totalChance) {
    // --- BERHASIL ---
    const stealPercentage = Math.random() * (0.25 - 0.10) + 0.10; // Curi antara 10% - 25%
    const maxSteal = 50000; // Batas maksimal mencuri
    
    let amountStolen = Math.floor(victimData.money * stealPercentage);
    if (amountStolen > maxSteal) amountStolen = maxSteal;
    if (victimData.money < amountStolen) amountStolen = victimData.money;

    player.money += amountStolen;
    victimData.money -= amountStolen;

    resultText = `*BERHASIL!* ✅\n\nDengan gesit, kamu berhasil menyusup dan membawa kabur 💰 *Rp ${amountStolen.toLocaleString()}* dari dompet *${victimName}*!`;
    
  } else {
    // --- GAGAL ---
    const hpLoss = Math.floor(Math.random() * 21) + 30; // Kehilangan 30-50 HP
    const fine = 25000;

    player.hp -= hpLoss;
    player.money -= fine;
    if (player.hp < 0) player.hp = 0;
    if (player.money < 0) player.money = 0;

    resultText = `*KETAHUAN WARGA!* 💥\n\nSial! Aksimu dipergoki! Kamu digebukin hingga kehilangan 💔 *${hpLoss} HP* dan harus membayar denda 💸 *Rp ${fine.toLocaleString()}*.`;
    mentionedJids.push(m.sender); // Mention pelaku yang gagal
  }

  // Mengirim pesan hasil akhir
  await conn.sendMessage(m.chat, {
    text: resultText,
    mentions: mentionedJids
  }, { quoted: m });

};

handler.help = ['ngepet'];
handler.tags = ['rpg'];
handler.command = /^ngepet$/i;
handler.group = true;
handler.register = true;

export default handler;

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */