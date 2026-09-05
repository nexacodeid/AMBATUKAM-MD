/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const timeout = 1800000;

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let lastMulung = user.lastmulung || 0;
  let time = Date.now() - lastMulung;

  if (time < timeout) {
    return m.reply(`Kamu sudah lelah mencari sampah.\nTunggu selama *${clockString(timeout - time)}* lagi.`);
  }

  let botol = Math.floor(Math.random() * 700);
  let kaleng = Math.floor(Math.random() * 700);
  let kardus = Math.floor(Math.random() * 700);
  let pelastik = Math.floor(Math.random() * 700);

  user.botol = (user.botol || 0) + botol;
  user.kaleng = (user.kaleng || 0) + kaleng;
  user.kardus = (user.kardus || 0) + kardus;
  user.pelastik = (user.pelastik || 0) + pelastik;
  
  user.lastmulung = Date.now();

  let senderNumber = m.sender.split('@')[0];
  let caption = `*Ini hasil dari @${senderNumber} membersihkan lingkungan:*\n\n` +
                `🍶 *Botol:* ${botol}\n` +
                `📦 *Kardus:* ${kardus}\n` +
                `🗑️ *Kaleng:* ${kaleng}\n` +
                `🥡 *Plastik:* ${pelastik}\n\n` +
                `Cek hasilmu dengan ketik *.sampah*`;

  conn.reply(m.chat, caption, m, {
    contextInfo: { mentionedJid: [m.sender] }
  });

  setTimeout(() => {
    conn.reply(m.chat, `Hei @${senderNumber}, sudah waktunya mulung kembali agar lingkungan bersih!`, m, {
        contextInfo: { mentionedJid: [m.sender] }
    });
  }, timeout);
};

handler.help = ['mulung'];
handler.tags = ['rpg'];
handler.command = /^(mulung)/i;

handler.group = true;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.limit = true;
handler.exp = 0;
handler.money = 0;
handler.register = true;

export default handler;

function clockString(ms) {
  if (isNaN(ms)) return '00:00:00';
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
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