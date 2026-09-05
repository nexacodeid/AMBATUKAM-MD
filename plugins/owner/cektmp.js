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

let handler = async (m, { text, conn }) => {
    const tmpDir = './tmp';
    try {
        const files = fs.readdirSync(tmpDir);

        let totalSize = 0;

        files.forEach(file => {
            const filePath = path.join(tmpDir, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                totalSize += stats.size;
            }
        });

        let totalSizeMB = totalSize / (1024 * 1024);

        let sizeOutput;
        if (totalSizeMB >= 1000) {
            let totalSizeGB = totalSizeMB / 1024;
            sizeOutput = `${totalSizeGB.toFixed(2)} GB`;
        } else {
            sizeOutput = `${totalSizeMB.toFixed(2)} MB`;
        }

        conn.reply(m.chat, `\`Sampah Folder TMP\`\n* *Jumlah File:* ${files.length.toLocaleString()}\n* *Total Size File:* ${sizeOutput}`, m);
    } catch (error) {
        conn.reply(m.chat, 'Terjadi kesalahan saat membaca folder /tmp.', m);
    }
}

handler.tags = ['owner']
handler.help = ['cektmp']
handler.command = /^(cektmp|tmp)$/i;
handler.owner = true

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