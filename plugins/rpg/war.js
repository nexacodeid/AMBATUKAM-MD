/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

// File: war.js (atau rpg-war.js)

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
    
    return true;
  }
  return false;
};

let handler = async (m, { conn, usedPrefix, args, command }) => {
  conn.war = conn.war || {};
  conn.war2 = conn.war2 || {};

  // ... (Blok HELP tidak berubah) ...
  if (!args[0] || args[0] == "help") return m.reply(`*❏  W A R - Z O N E*

[1] Game perang tim berbasis giliran
[2] Bisa dimainkan 1v1 hingga 5v5
[3] Modal perang adalah taruhan jika tim kamu menang
[4] Semua pemain memiliki 5000 HP
[5] Giliran menyerang bergantian sesuai urutan
[6] Serangan berhasil/gagal tergantung level penyerang & musuh
[7] Jika pemain tidak menyerang dalam 40 detik, dianggap AFK (HP -2500)
[8] Tim menang jika semua musuh HP-nya habis (HP <= 0)

*❏  C O M M A N D S*
${usedPrefix}war join A/B
${usedPrefix}war left
${usedPrefix}war money 1000000
${usedPrefix}war player
${usedPrefix}war start
${usedPrefix}war reset
${usedPrefix}attack @user
`);

  // RESET
  if (args[0] == "reset") {
    delete conn.war[m.chat];
    delete conn.war2[m.chat];
    return m.reply("*Game telah di-reset.*");
  }

  // MONEY
  if (args[0] == "money") {
    if (!(m.chat in conn.war)) return m.reply("Buat room dulu dengan .war join");
    if (m.sender == conn.war[m.chat][0].user) {
      let val = parseInt(args[1]);
      if (isNaN(val)) return m.reply("Masukkan angka contoh:\n.war money 1000000");
      if (val < 1000000) return m.reply("Minimal taruhan Rp 1.000.000");
      conn.war2[m.chat].money = val;
      return m.reply("Taruhan diatur ke Rp " + val.toLocaleString());
    } else {
      return conn.reply(m.chat, `Hanya @${conn.war[m.chat][0].user.split('@')[0]} yang bisa mengatur taruhan`, m, {
        contextInfo: { mentionedJid: [conn.war[m.chat][0].user] }
      });
    }
  }

  // JOIN
  if (args[0] == "join") {
    let userLevel = global.db.data.users[m.sender]?.level;
    if (userLevel == undefined) return m.reply("Kamu belum terdaftar di database bot. Ketik .menu untuk memulai.");
    if (global.db.data.users[m.sender].money < 10000) return m.reply("Uang minimal Rp. 10.000");
    
    if (!(m.chat in conn.war)) {
      conn.war2[m.chat] = { war: false, turn: 0, time: 0, money: 0 };
      conn.war[m.chat] = Array.from({ length: 10 }, (_, i) => ({
        user: i == 0 ? m.sender : "", hp: i == 0 ? 5000 : 0, lvl: i == 0 ? userLevel : 0, turn: false
      }));
      // [FIXED] Menggunakan conn.reply dengan argumen yang benar
      const text = `Room berhasil dibuat oleh @${m.sender.split('@')[0]}\nMasuk sebagai Team A.\n\nGunakan .war join A/B untuk gabung\n.war start untuk mulai`;
      return conn.reply(m.chat, text, m, { contextInfo: { mentionedJid: [m.sender] }});
    }
    
    if (conn.war2[m.chat].war) return m.reply("Game sudah dimulai");
    if (conn.war[m.chat].some(p => p.user === m.sender)) return m.reply("Kamu sudah join");
    if (!args[1]) return m.reply("Pilih tim A atau B\n.war join A\n.war join B");

    let team = args[1].toLowerCase();
    if (!['a', 'b'].includes(team)) return m.reply("Pilih tim A atau B saja.");
    
    let teamIndex = team === "a" ? [1, 2, 3, 4] : [5, 6, 7, 8, 9];
    if (conn.war2[m.chat].money == 0) {
      return conn.reply(m.chat, `@${conn.war[m.chat][0].user.split('@')[0]} tetapkan modal dulu\n.war money 1000000`, m, {
        contextInfo: { mentionedJid: [conn.war[m.chat][0].user] }
      });
    }
    if (global.db.data.users[m.sender].money < conn.war2[m.chat].money) return m.reply("Uang tidak cukup untuk join");

    for (let i of teamIndex) {
      if (conn.war[m.chat][i].user == "") {
        conn.war[m.chat][i] = { user: m.sender, hp: 5000, lvl: userLevel, turn: false };
        // [FIXED] Menggunakan conn.reply dengan argumen yang benar
        const text = `@${m.sender.split('@')[0]} berhasil masuk ke Team ${team.toUpperCase()}`;
        return conn.reply(m.chat, text, m, { contextInfo: { mentionedJid: [m.sender] }});
      }
    }
    return m.reply(`Team ${team.toUpperCase()} sudah penuh`);
  }

  // ... (Blok kode lainnya seperti LEFT, PLAYER, START tidak ada perubahan fatal dan seharusnya sudah benar) ...
  // LEFT
  if (args[0] == "left") {
    if (!(m.chat in conn.war)) return m.reply("Kamu belum join di room manapun.");
    if (conn.war2[m.chat].war) return m.reply("Game sudah dimulai, tidak bisa keluar.");
    
    if (conn.war[m.chat][0].user === m.sender && conn.war[m.chat].filter(p => p.user).length > 1) {
        return m.reply("Kamu adalah pembuat room. Gunakan .war reset untuk membubarkan permainan.");
    }

    let playerIndex = conn.war[m.chat].findIndex(p => p.user === m.sender);
    if (playerIndex !== -1) {
        if (playerIndex === 0 && conn.war[m.chat].filter(p => p.user).length === 1) {
            delete conn.war[m.chat];
            delete conn.war2[m.chat];
            return m.reply("Kamu keluar dari game dan room dibubarkan.");
        }
        conn.war[m.chat][playerIndex] = { user: "", hp: 0, lvl: 0, turn: false };
        return m.reply("Kamu keluar dari game.");
    } else {
        return m.reply("Kamu belum join.");
    }
  }
  
  // PLAYER
  if (args[0] == "player") {
    if (!(m.chat in conn.war)) return m.reply("Belum ada yang join");
    
    if (conn.war2[m.chat].war) {
        const isAfk = checkAfk(conn, m);
        if (isAfk) {
            let nextTurn;
            for (let i = 1; i <= 10; i++) {
                let idx = (conn.war2[m.chat].turn + i) % 10;
                if (conn.war[m.chat][idx].user && conn.war[m.chat][idx].hp > 0) {
                    nextTurn = idx;
                    break;
                }
            }
            conn.war2[m.chat].turn = nextTurn;
            conn.war2[m.chat].time = Date.now();
        }
    }
    
    let A = [], B = [], all = [];
    for (let i = 0; i < 10; i++) {
      let p = conn.war[m.chat][i];
      if (p.user != "") {
        let status = p.hp > 0 ? "❤️" : "☠️";
        let txt = `${status} @${p.user.split('@')[0]} (Lv.${p.lvl} | HP: ${p.hp})`;
        if (i < 5) A.push(txt);
        else B.push(txt);
        all.push(p.user);
      }
    }
    let giliran = conn.war2[m.chat].war ? `\n*Giliran:* @${conn.war[m.chat][conn.war2[m.chat].turn].user.split('@')[0]}` : "";
    conn.reply(m.chat, `*Taruhan: Rp ${conn.war2[m.chat].money.toLocaleString()}*\n${giliran}\n\n*🛡️ TEAM A*\n${A.join('\n') || 'Kosong'}\n\n*⚔️ TEAM B*\n${B.join('\n') || 'Kosong'}`, m, {
      contextInfo: { mentionedJid: all }
    });
  }

  // START
  if (args[0] == "start") {
    if (!(m.chat in conn.war)) return m.reply("Buat room dulu dengan .war join");
    if (conn.war2[m.chat].war) return m.reply("Game sudah dimulai");
    if (m.sender !== conn.war[m.chat][0].user) return m.reply("Hanya pembuat room yang bisa memulai permainan.");

    let A = conn.war[m.chat].slice(0, 5).filter(p => p.user != "");
    let B = conn.war[m.chat].slice(5).filter(p => p.user != "");
    if (A.length < 1 || B.length < 1) return m.reply("Minimal harus ada 1 pemain di setiap tim.");
    
    conn.war2[m.chat].war = true;
    conn.war2[m.chat].turn = 0;
    conn.war2[m.chat].time = Date.now();
    
    let turnUser = conn.war[m.chat][0].user;
    const text = `*🔥 Game Dimulai! 🔥*\n\nGiliran pertama untuk @${turnUser.split('@')[0]}. Silakan serang musuh dengan perintah:\n*.attack @tagmusuh*`;
    return conn.reply(m.chat, text, m, {
      contextInfo: { mentionedJid: [turnUser] }
    });
  }

}

handler.command = /^(war)$/i;
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