/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import fetch from 'node-fetch';
import fs from 'fs';

let handler = async (m, { conn, args, usedPrefix, DevMode }) => {
  try {
    let u = global.db.data.users[m.sender];
    u.lastbansos = u.lastbansos || 0;
    let Aku = `${Math.floor(Math.random() * 101)}`.trim();
    let Kamu = `${Math.floor(Math.random() * 81)}`.trim(); // Menantang 😏
    let A = (Aku * 1);
    let K = (Kamu * 1);
    let kb = 'https://telegra.ph/file/afcf9a7f4e713591080b5.jpg';
    let mb = 'https://telegra.ph/file/d31fcc46b09ce7bf236a7.jpg';
    let t = (Date.now() - u.lastbansos);
    let timers = clockString(604800000 - t);

    if (t > 300000) {
      if (A > K) {
        conn.sendFile(m.chat, kb, 'b.jpg', `*Kamu Tertangkap!* Korupsi dana bansos 🕴️💰, Denda *3 Juta* rupiah 💵`, m);
        u.money -= 3000000;
        u.lastbansos = Date.now();
      } else if (A < K) {
        u.money += 3000000;
        conn.sendFile(m.chat, mb, 'b.jpg', `*Berhasil Korupsi!* Dana bansos 🕴️💰, Dapatkan *3 Juta* rupiah 💵`, m);
        u.lastbansos = Date.now();
      } else {
        conn.reply(m.chat, `*Maaf!* Kamu tidak berhasil melakukan korupsi bansos dan kamu tidak akan masuk penjara karena kamu *melarikan diri* 🏃`, m);
        u.lastbansos = Date.now();
      }
    } else conn.reply(m.chat, `*Sudah Melakukan Korupsi!* 💰\nHarus menunggu selama agar bisa korupsi bansos kembali\n▸ 🕓 ${timers}`, m);
  } catch (e) {
    m.reply(`Terjadi kesalahan`)
  }
};

handler.help = ['bansos'];
handler.tags = ['rpg'];
handler.command = /^(bansos|korupsi)$/i;
handler.group = true;
handler.register = true;
export default handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return ['\n*' + d + '* _Hari_ ☀️\n ', '*' + h + '* _Jam_ 🕐\n ', '*' + m + '* _Menit_ ⏰\n ', '*' + s + '* _Detik_ ⏱️ '].map(v => v.toString().padStart(2, 0)).join('');
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