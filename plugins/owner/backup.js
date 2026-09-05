/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import fs from 'fs';
import archiver from 'archiver';
import path from 'path';

const handler = async (m, { conn }) => {
  m.reply('Code Backup Sedang Dikirim...');
  let d = new Date(Date.now() + 3600000)
  let locale = 'id'
  let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    })
  const safeBotName = String(global.getBotName?.() || global.namebot || 'WhatsApp Bot').replace(/[^a-z0-9._-]+/gi, '_');
  let backupName = `${safeBotName} || ${date}.zip`;
  let output = fs.createWriteStream(backupName);
  let archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', function () {
    let caption = `\`Backup Code Bot\`\n* *File Name:* ${backupName}\n* *File Size:* ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB\n\n*${date}*`;
    conn.sendFile('6288975645268@s.whatsapp.net', backupName, backupName, caption, m)
    m.reply(`*[✅]* Sukses Backup Script Bot`)
      .then(() => {
        fs.unlinkSync(backupName); // Menghapus file backup setelah terkirim
      })
      .catch((err) => {
        throw err;
      });
  });

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);
  archive.glob('**/*', {
    cwd: process.cwd(),
    ignore: ['node_modules/**', 'sessions/', 'tmp/**', '.npm/**', backupName]
  });
  archive.finalize();
};

handler.help = ['backup'];
handler.tags = ['owner'];
handler.command = /^backup$/i;
handler.owner = true;

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