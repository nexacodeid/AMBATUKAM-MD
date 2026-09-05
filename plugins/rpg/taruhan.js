/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let timeout = 60000;
//let poin = 500;
let poin_lose = -100;

async function handler(m, { conn, args, isOwner }) {
//if (!isOwner) return m.reply(`bisa nhertiin owner gak?, ini tuh lagi di perbaiki!!!`)
    try {
        conn.judi = conn.judi ? conn.judi : {};

        if (Object.values(conn.judi).find(room => room.id.startsWith('judi') && [room.p, room.p2].includes(m.sender))) m.reply('Selesaikan judi mu yang sebelumnya')
        if (Object.values(conn.judi).find(room => room.id.startsWith('judi') && [room.p, room.p2].includes(m.mentionedJid[0]))) m.reply(`Orang yang kamu tantang sedang bermain judi bersama orang lain :(`)

        let musuh = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
        if (!musuh) return m.reply('Tag pengguna yang ingin Anda ajak taruhan!');
        if (musuh == m.sender) return m.reply('Anda tidak bisa mengajak diri sendiri untuk taruhan.');
        if (!isOwner && musuh === '13467991863@s.whatsapp.net') return m.reply(`zaellnya sibuk, sama yang lain aja`)

        let count = (args[0] && number(parseInt(args[0]))) ? Math.max(parseInt(args[0]), 1) : 1;

        let user = global.db.data.users[m.sender];
        let dia = global.db.data.users[musuh];
        let id = m.chat

        if (user.money < count) return m.reply('Uang Anda tidak mencukupi untuk taruhan ini.');
        if (dia.money < count) return m.reply('User yang kamu tantang Uangnya tidak mencukupi untuk taruhan ini.');

        let caption = `*⚠️ ${conn.getName(m.sender)}* Menantang *${conn.getName(musuh)}* Taruhan Sebesar Rp.${count.toLocaleString()} money.`;
        let footer = `\n\nKetik *Terima / Gas* untuk melanjutkan taruhan.\nKetik *Tolak / Gamau* untuk membatalkan taruhan.\nTime Out 60 detik otomatis dibatalkan`;

        conn.judi[id] = {
            chat: await conn.reply(m.chat, caption + footer, m, { mentions: conn.parseMention(caption) }),
            id: id,
            p: m.sender,
            p2: musuh,
            status: 'wait',
            waktu: setTimeout(() => {
                if (conn.judi[id]) conn.reply(m.chat, `_Waktu habis, taruhan di batalkan_`, m)
                delete conn.judi[id];
            }, timeout),
            poin: count,
            poin_lose: poin_lose,
            timeout: timeout
        };

    } catch (e) {
        console.error(e);
        m.reply('Tunggu sampai taruhan selesai');
    }
}

handler.help = ['taruhan'];
handler.tags = ['game'];
handler.command = /^taruhan$/i;
handler.register = true;
handler.group = true

function number(x = 0) {
    x = parseInt(x);
    return !isNaN(x) && typeof x == 'number';
}

handler.before = async function (m) {
    const conn = this;
    try {
        this.judi = this.judi ? this.judi : {};
        if (global.db.data.users[m.sender] && global.db.data.users[m.sender].judi < 0) global.db.data.users[m.sender].judi = 0;
        let room = Object.values(this.judi).find(room => room.id && room.status && [room.p, room.p2].includes(m.sender));
        if (room && m.sender === room.p2 && m.isGroup && room.status == 'wait' && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa)/i.test(m.text)) {
            let musuh = room.p2;
            if (/^(tolak|gamau|nanti|ga(k.)?bisa)/i.test(m.text)) {
                conn.reply(m.chat, `*${conn.getName(musuh)}* Menolak tantanganmu, taruhan dibatalkan`, m);
                delete this.judi[room.id];
                return;
            }
          //  if (m.sender !== room.p2) return;
            let user = global.db.data.users[room.p];
            let dia = global.db.data.users[room.p2];
            let count = room.poin;

            let rdia = `${Math.floor(Math.random() * 100)}`.trim();
            let raku = `${Math.floor(Math.random() * 100)}`.trim();

            if (raku > rdia) {
                user.money += count * 1;
                dia.money -= count * 1;
                conn.reply(m.chat, `🎉 Pemenang ${conn.getName(room.p)}\n\n*${conn.getName(room.p)} Roll:* ${raku}\n*${conn.getName(room.p2)} Roll:* ${rdia}\nSelamat ${conn.getName(room.p)} Kamu Memenangkan Rp.${count.toLocaleString()}, dari taruhan ini`.trim(), m);
            } else if (raku < rdia) {
                user.money -= count * 1;
                dia.money += count * 1;
                conn.reply(m.chat, `🎉 Pemenang ${conn.getName(room.p2)}\n\n*${conn.getName(room.p)} Roll:* ${raku}\n*${conn.getName(room.p2)} Roll:* ${rdia}\nSelamat ${conn.getName(room.p2)} Kamu Memenangkan Rp.${count.toLocaleString()}, dari taruhan ini`.trim(), m);
            } else {
                conn.reply(m.chat, `Seri!!!\n*${conn.getName(room.p)} Roll:* ${raku}\n*${conn.getName(room.p2)} Roll:* ${rdia}\nUang dikembalikan`.trim(), m);
            }

            delete this.judi[room.id];
        }
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan dalam memproses taruhan.');
    }
}

handler.exp = 0;
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