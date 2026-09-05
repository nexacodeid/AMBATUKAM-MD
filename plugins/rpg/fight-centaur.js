/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const delay = time => new Promise(res => setTimeout(res, time));

let handler = async (m, { conn, participants }) => {
    conn.fightCentaur = conn.fightCentaur || {};

    if (conn.fightCentaur[m.sender]) {
        return m.reply(`⚔️ *Satu per Satu!* Pet-mu yang lain sedang berada di arena. Tidak bisa memulai pertarungan baru saat ini.`);
    }

    const pemain = m.sender;
    const allUsers = participants.map(u => u.id);

    const listLawan = allUsers.filter(id => 
        id !== pemain && 
        global.db.data.users[id] &&
        (global.db.data.users[id].centaur || 0) > 0
    );

    if (listLawan.length < 1) {
        return m.reply(`🧐 *Mencari Lawan...* Tidak ditemukan Centaur lain yang siap bertarung di grup ini. Coba lagi nanti!`);
    }

    const lawan = listLawan[Math.floor(Math.random() * listLawan.length)];

    const pemainData = global.db.data.users[pemain];
    const lawanData = global.db.data.users[lawan];
    const pemainCentaur = pemainData.centaur || 0;
    const lawanCentaur = lawanData.centaur || 0;

    const lamaPertarungan = getRandomInt(8, 20);
    
    const mentionedJids = [pemain, lawan];

    let initialMessage = `🔥 *ARENA CENTAUR TERBUKA* 🔥
═════════════════
🐎 Centaur *@${pemain.split('@')[0]}* (Lv. ${pemainCentaur})
        VS
🐎 Centaur *@${lawan.split('@')[0]}* (Lv. ${lawanCentaur})
═════════════════
⏳ Pertarungan sengit akan berlangsung selama *${lamaPertarungan} menit*!
🏆 Semoga beruntung!`;

    await conn.reply(m.chat, initialMessage, m, { contextInfo: { mentionedJid: mentionedJids } });

    conn.fightCentaur[pemain] = true;

    try {
        await delay(1000 * 60 * lamaPertarungan);

        const alasanKalah = ['kurang latihan', 'terlalu meremehkan', 'kehabisan stamina', 'lemah', 'pemalas'];
        const alasanMenang = ['sangat hebat', 'legendaris', 'memiliki skill dewa', 'sangat kuat', 'ganas'];

        let kesempatan = [];
        for (let i = 0; i < pemainCentaur; i++) kesempatan.push(pemain);
        for (let i = 0; i < lawanCentaur; i++) kesempatan.push(lawan);

        let pointPemain = 0;
        let pointLawan = 0;
        for (let i = 0; i < 10; i++) {
            let unggul = kesempatan[Math.floor(Math.random() * kesempatan.length)];
            if (unggul === pemain) pointPemain++;
            else pointLawan++;
        }
        
        const scoreText = `*@${pemain.split('@')[0]}* [${pointPemain * 10}] ⚔️ [${pointLawan * 10}]  *@${lawan.split('@')[0]}*`;
        const resultHeader = `乂 HASIL PERTARUNGAN 乂`;
        
        let resultMessage = '';

        if (pointPemain > pointLawan) {
            const hadiah = (pointPemain - pointLawan) * 20000;
            pemainData.money = (pemainData.money || 0) + hadiah;
            pemainData.tiketcoin = (pemainData.tiketcoin || 0) + 1;
            resultMessage = `🎉 *S E L A M A T, K A M U   M E N A N G !* 🎉
            
${resultHeader}
${scoreText}

Pet-mu menang karena ${alasanMenang[Math.floor(Math.random() * alasanMenang.length)]}!

💰 *Hadiah:* +Rp ${hadiah.toLocaleString()}
🎟️ *Tiket Coin:* +1`;
        } else if (pointPemain < pointLawan) {
            const denda = (pointLawan - pointPemain) * 100000;
            pemainData.money = (pemainData.money || 0) - denda;
            pemainData.tiketcoin = (pemainData.tiketcoin || 0) + 1;
            resultMessage = `☠️ *Y A H, K A M U   K A L A H !* ☠️

${resultHeader}
${scoreText}

Pet-mu kalah karena ${alasanKalah[Math.floor(Math.random() * alasanKalah.length)]}.

💸 *Denda:* -Rp ${denda.toLocaleString()}
🎟️ *Tiket Coin:* +1`;
        } else {
            pemainData.tiketcoin = (pemainData.tiketcoin || 0) + 1;
            resultMessage = `⚖️ *H A S I L   S E R I !* ⚖️

${resultHeader}
${scoreText}

Pertarungan berakhir imbang, tidak ada yang menang ataupun kalah.

🎟️ *Tiket Coin:* +1`;
        }
        
        await conn.reply(m.chat, resultMessage, m, { contextInfo: { mentionedJid: mentionedJids } });

    } finally {
        delete conn.fightCentaur[pemain];
    }
};

handler.help = ['fightcentaur'];
handler.tags = ['rpg'];
handler.command = /^(fightcentaur)$/i;
handler.limit = true;
handler.group = true;
handler.register = true;

export default handler;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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