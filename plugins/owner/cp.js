/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

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
import path from 'path';

const readPluginFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (err) {
    return null; // Jika terjadi error, kembalikan null
  }
  return null; // Jika file tidak ditemukan, kembalikan null
};

let handler = async (m, { conn, isROwner, usedPrefix, command, text }) => {
  switch (command) {
    case 'allplugins':
      let allPlugins = Object.keys(global.plugins);
      
      if (allPlugins.length === 0) {
        return m.reply(`*Tidak Ditemukan*\n\nTidak ada plugin yang tersedia.`);
      }
      
      let countCJS = 0;
      let countESM = 0;

      let allPluginsStatus = allPlugins.map(file => {
        let type = file.endsWith('.js') ? '(ESM)' : '(CJS)';

        if (file.endsWith('.js')) countESM++;
        if (file.endsWith('.cjs')) countCJS++;

        return `- ${file} ${type}`
      }).join('\n');

      m.reply(
        `*📂 Plugins Tersedia:*\n` +
        `- 🟢 Plugins CJS: ${countCJS}\n` +
        `- 🔵 Plugins ESM: ${countESM}\n\n` +
        `*📜 Daftar Semua Plugin:*\n${allPluginsStatus}`
      );
      break;

    case 'cp':
    case 'cekplugin':
    case 'cekplugins':
      if (!isROwner) return;
      if (!text) m.reply(`Masukkan nama plugin yang ingin dicari`)

      let pluginsList = Object.keys(global.plugins);
      
      let matchedPlugins = pluginsList.filter(v => v.includes(text));

      if (matchedPlugins.length === 0) {
        return m.reply(`*Tidak Ditemukan*\n\nPlugin yang cocok tidak ditemukan dengan nama "${text}".`);
      }

      let results = matchedPlugins.map(file => {
        let type = file.endsWith('.js') ? '(ESM)' : '(CJS)';

        return `- ${file} ${type}`
      }).join('\n');

      m.reply(`*Plugin yang cocok dengan "${text}":*\n${results}`);
      break;
  }
};

handler.help = ['cp', 'cekplugins', 'allplugins'];
handler.command = /^(cp|cekplugin|cekplugins|allplugins)$/i;
handler.tags = ['owner']
handler.rowner = false;
handler.owner = true;

export default handler

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */