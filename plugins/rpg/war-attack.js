/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

// Helper function untuk mengecek dan menghukum pemain AFK
const checkAfk = (conn, m) => {
  const chat = m.chat;
  if (!conn.war || !conn.war2 || !conn.war2[chat] || !conn.war2[chat].war) return false;

  const warData = conn.war[chat];
  const warInfo = conn.war2[chat];
  const turnUser = warData[warInfo.turn];
  
  if (!warInfo.time) return false;
  const afkTime = 40 * 1000; // 40 detik
  const now = Date.now();

  if (now - warInfo.time > afkTime) {
    const afkUser = turnUser;
    afkUser.hp -= 2500;
    if (afkUser.hp < 0) afkUser.hp = 0;
    
    conn.reply(m.chat, `*AFK!* @${afkUser.user.split('@')[0]} tidak menyerang selama 40 detik dan kehilangan 2500 HP.`, m, {
        contextInfo: { mentionedJid: [afkUser.user] }
    });
    
    return true; // Ada pemain yang AFK
  }
  return false;
};


const handler = async (m, { conn }) => {
  const chat = m.chat;

  // Cek dasar
  if (!conn.war || !conn.war2 || !conn.war2[chat] || !conn.war2[chat].war) return m.reply("Tidak ada game yang sedang berlangsung di grup ini.");
  
  const warData = conn.war[chat];
  const warInfo = conn.war2[chat];
  const turnIndex = warInfo.turn;
  const attacker = warData[turnIndex];

  // Cek AFK sebelum menyerang
  const isAfk = checkAfk(conn, m);
  if (isAfk) {
      // Jika pemain saat ini AFK, ganti giliran dan beritahu pemain berikutnya
      let nextTurn;
      for (let i = 1; i <= 10; i++) {
          let idx = (turnIndex + i) % 10;
          if (warData[idx].user && warData[idx].hp > 0) {
              nextTurn = idx;
              break;
          }
      }
      warInfo.turn = nextTurn;
      warInfo.time = Date.now(); // Reset timer untuk pemain berikutnya
      const nextUserJid = warData[nextTurn].user;
      return conn.reply(chat, `Giliran diganti karena AFK.\n\nSekarang giliran @${nextUserJid.split('@')[0]} untuk menyerang!`, m, {
          contextInfo: { mentionedJid: [nextUserJid] }
      });
  }

  // Validasi penyerang
  if (attacker.user !== m.sender) return m.reply("Bukan giliranmu untuk menyerang!");
  if (attacker.hp <= 0) return m.reply("Kamu sudah KO dan tidak bisa menyerang!");

  // Validasi target
  const mentioned = m.mentionedJid[0];
  if (!mentioned) return m.reply("Tag pemain yang ingin kamu serang!\nContoh: *.attack @user*");
  
  const targetIndex = warData.findIndex(p => p.user === mentioned);
  if (targetIndex === -1) return m.reply("Pemain yang kamu tag tidak ada di dalam game ini.");
  
  const target = warData[targetIndex];
  if (target.hp <= 0) return m.reply("Target sudah KO, cari target lain!");

  // Validasi tim (tidak bisa menyerang teman satu tim)
  const isAttackerTeamA = turnIndex < 5;
  const isTargetTeamA = targetIndex < 5;
  if (isAttackerTeamA === isTargetTeamA) return m.reply("Tidak bisa menyerang teman satu tim!");

  // Kalkulasi damage berdasarkan level
  const lvlAttacker = attacker.lvl;
  const lvlTarget = target.lvl;
  
  const isCrit = Math.random() < (0.1 + (lvlAttacker / 500)); 
  const isMiss = Math.random() < (0.1 + (lvlTarget / 600));

  let attackPower = 0;
  let message = "";

  if (isMiss) {
    attackPower = 0;
    message = `*SERANGAN GAGAL!* 💨\nSerangan @${attacker.user.split('@')[0]} tidak mengenai @${target.user.split('@')[0]}.`;
  } else {
    const baseDamage = 800;
    const levelBonus = Math.floor(Math.random() * (lvlAttacker * 5));
    const levelReduction = Math.floor(Math.random() * (lvlTarget * 4));
    
    attackPower = baseDamage + levelBonus - levelReduction;
    if (attackPower < 50) attackPower = 50; // Minimal damage jika hasil kalkulasi kecil
    attackPower = Math.floor(attackPower);

    if (isCrit) {
        attackPower *= 2;
        message = `*CRITICAL HIT!* 💥\n@${attacker.user.split('@')[0]} menyerang @${target.user.split('@')[0]} dengan serangan dahsyat, mengurangi *${attackPower.toLocaleString()}* HP!`;
    } else {
        message = `*HIT!* ⚔️\n@${attacker.user.split('@')[0]} menyerang @${target.user.split('@')[0]}, mengurangi *${attackPower.toLocaleString()}* HP.`;
    }
  }
  
  target.hp -= attackPower;
  if (target.hp < 0) target.hp = 0;

  // Cek Kemenangan
  let teamA_alive = warData.slice(0, 5).some(p => p.hp > 0 && p.user);
  let teamB_alive = warData.slice(5).some(p => p.hp > 0 && p.user);

  if (!teamA_alive || !teamB_alive) {
    let pemenangText = !teamA_alive ? "⚔️ TEAM B MENANG ⚔️" : "🛡️ TEAM A MENANG 🛡️";
    let winnerTeam = !teamA_alive ? warData.slice(5, 10) : warData.slice(0, 5);
    let winners = winnerTeam.filter(p => p.user);
    let winnerJids = winners.map(p => p.user);
    
    let reward = warInfo.money;
    let replyText = `*🔥 Pertarungan Selesai! 🔥*\n\n🏆 *${pemenangText}*\n\nSelamat kepada:\n${winnerJids.map(j => `@${j.split('@')[0]}`).join('\n')}\n\nMasing-masing mendapatkan hadiah taruhan sebesar *Rp ${reward.toLocaleString()}*!`;
    
    for (let winner of winners) {
        if (global.db.data.users[winner.user]) {
            global.db.data.users[winner.user].money += reward;
        }
    }
    
    delete conn.war[chat];
    delete conn.war2[chat];
    
    return conn.reply(chat, replyText, m, { contextInfo: { mentionedJid: [m.sender, mentioned, ...winnerJids] } });
  }

  // Giliran Berikutnya
  let nextTurn;
  for (let i = 1; i <= 10; i++) {
    let idx = (turnIndex + i) % 10;
    if (warData[idx].user && warData[idx].hp > 0) {
      nextTurn = idx;
      break;
    }
  }
  
  warInfo.turn = nextTurn;
  warInfo.time = Date.now(); // Reset timer AFK untuk pemain berikutnya
  
  const nextUser = warData[nextTurn];
  let fullMessage = `${message}\n\nSisa HP @${target.user.split('@')[0]}: *${target.hp}*\n\nGiliran selanjutnya: @${nextUser.user.split('@')[0]}`;
  
  conn.reply(chat, fullMessage, m, {
    contextInfo: { mentionedJid: [m.sender, mentioned, nextUser.user] }
  });
};

handler.command = /^(attack|serang)$/i; // Menambahkan alias "serang"
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