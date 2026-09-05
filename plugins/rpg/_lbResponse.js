/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

// Helper functions (tidak perlu diubah)
function sort(property, ascending = false) {
  return (a, b) => (ascending ? a[property] - b[property] : b[property] - a[property]);
}

function toNumber(property, _default = 0) {
  return (a) => ({ ...a, [property]: a[property] === undefined ? _default : a[property] });
}

function formatRank(i) {
  const medals = ['🥇', '🥈', '🥉'];
  return medals[i] || ` ${i + 1} `;
}

function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + ' T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + ' M';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + ' Jt';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + ' Rb';
  return num.toString();
}

// Konfigurasi untuk setiap leaderboard (tidak perlu diubah)
const leaderboardConfig = {
  lbexp: { title: 'XP Leaderboard', key: 'exp', unit: 'XP' },
  lbmoney: { title: 'Money Leaderboard', key: 'money', unit: 'Money' },
  lblimit: { title: 'Limit Leaderboard', key: 'limit', unit: 'Limit' },
  lblevel: { title: 'Level Leaderboard', key: 'level', unit: 'Level' },
  lbsub: { title: 'Subscriber Leaderboard', key: 'subscriber', unit: 'Subs' },
  lbdamage: { title: 'Damage Leaderboard', key: 'resultdamage', unit: 'Damage' },
  lbastro: { title: 'Astronot Leaderboard', key: 'totalb', unit: 'x Berangkat' },
};

const handler = async (m, { conn, command, args, participants }) => {
  const users = Object.values(global.db.data.users).map(user => ({ ...user, jid: user.jid || Object.keys(global.db.data.users).find(key => global.db.data.users[key] === user) }));

  // Handler untuk leaderboard standar (tidak perlu diubah)
  if (leaderboardConfig[command]) {
    const config = leaderboardConfig[command];
    const sortedUsers = users.map(toNumber(config.key)).sort(sort(config.key));
    const userJids = sortedUsers.map(u => u.jid);

    const len = args[0] && args[0].length > 0 ? Math.min(20, Math.max(parseInt(args[0]), 5)) : 10;
    const userRank = userJids.indexOf(m.sender) + 1;

    const topUsers = sortedUsers.slice(0, len);

    let text = `🏆 *${config.title}* 🏆\n\n`;
    text += `Kamu berada di peringkat *#${userRank}* dari *${userJids.length}* pemain.\n\n`;
    text += topUsers.map((user, i) => {
      const name = participants.some(p => p.id === user.jid) ? `*${conn.getName(user.jid)}*` : `@${user.jid.split('@')[0]}`;
      const value = user[config.key];
      const unitText = config.key === 'level' ? `Level ${value}` : `${formatNumber(value)} ${config.unit || ''}`;
      return `${formatRank(i)} ${name}\n     ┗—> *${unitText.trim()}*`;
    }).join('\n\n');
    text += `\n\n▬▭▬▭▬▭▬▭▬▭▬▭\n💪 Terus tingkatkan skormu!`;

    conn.reply(m.chat, text, m, {
      contextInfo: {
        mentionedJid: topUsers.filter(u => !participants.some(p => p.id === u.jid)).map(u => u.jid)
      }
    });
    return;
  }

  // ==================================================================== //
  // ========== BLOK LBREWARD DENGAN DESAIN SIMPLE & RAPI ========== //
  // ==================================================================== //
  if (command === 'lbreward') {
    const top = (key, n = 1) => users.map(toNumber(key)).sort(sort(key)).slice(0, n);

    const topSubscriber = top('subscriber', 1)[0];
    const topAstronot = top('totalb', 1)[0];
    const topDamage = top('resultdamage', 1)[0];

    // Helper untuk menampilkan pemenang dengan format baru
    const formatWinnerLine = (user, key) => {
      if (!user || user[key] === 0) return `  > _(Belum ada)_`;
      const name = participants.some(p => p.id === user.jid) ? `*${conn.getName(user.jid)}*` : `@${user.jid.split('@')[0]}`;
      return `  > ${name} (Skor: *${formatNumber(user[key])}*)`;
    };

    const cap = `
🏆 *INFORMATION TOP 1* 🏆
━━━━━━━━━━━━━━━━━━

Berikut adalah rincian hadiah yang akan diberikan kepada para juara setiap minggunya.

🎁 *RINCIAN HADIAH*

🥇 *TOP 1 SUBSCRIBER*
  • Uang: *Rp 20.000.000*
  • Premium: *10 Hari*
  • Limit: *8.000*
  • Cash: *6.000*

🥇 *TOP 1 ASTRONOT*
  • Uang: *Rp 15.000.000*
  • Premium: *7 Hari*
  • Limit: *5.000*
  • Cash: *5.000*

🥇 *TOP 1 DAMAGE*
  • Uang: *Rp 10.000.000*
  • Premium: *5 Hari*
  • Limit: *4.000*
  • Cash: *3.000*

━━━━━━━━━━━━━━━━━━

👑 *PEMENANG SAAT INI*

• *Top Subscriber:*
${formatWinnerLine(topSubscriber, 'subscriber')}

• *Top Astronot:*
${formatWinnerLine(topAstronot, 'totalb')}

• *Top Damage:*
${formatWinnerLine(topDamage, 'resultdamage')}

━━━━━━━━━━━━━━━━━━

🔔 *INFORMASI PENTING*

• *Jadwal:* Setiap hari *Minggu*, pukul *09:00 WIB*.
• *Sistem:* Hadiah diberikan secara otomatis.
• *Syarat:* Pemenang *wajib* berada di dalam grup untuk klaim hadiah. Hadiah akan *hangus* jika tidak ada di grup.

*Link Grup Wajib:*
https://chat.whatsapp.com/CC4i19fhQ8z2akLtZDSwn6
`.trim();

    const mentionedJid = [topSubscriber, topAstronot, topDamage]
      .filter(user => user && !participants.some(p => p.id === user.jid)) // Hanya mention yg di luar grup
      .map(user => user.jid);

    conn.reply(m.chat, cap, m, {
      contextInfo: {
        mentionedJid
      }
    });
  }
};

handler.command = /^lb(exp|money|limit|level|sub|reward|damage|astro)$/i;
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