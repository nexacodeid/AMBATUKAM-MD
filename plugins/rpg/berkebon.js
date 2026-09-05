/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const timeout = 1800000; // 30 menit

let handler = async (m, { conn, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    let apel = user.bibitapel;
    let anggur = user.bibitanggur;
    let mangga = user.bibitmangga;
    let pisang = user.bibitpisang;
    let jeruk = user.bibitjeruk;
    let time = user.lastberkebon + timeout;

    if (apel < 500 || anggur < 500 || mangga < 500 || pisang < 500 || jeruk < 500) {
        return conn.reply(m.chat, `*Pastikan Kamu Memiliki Minimal 500 dari Setiap Bibit*\n\n📦 Bibit yang kamu miliki:\n🍎 Apel: ${apel}\n🥭 Mangga: ${mangga}\n🍊 Jeruk: ${jeruk}\n🍌 Pisang: ${pisang}\n🍇 Anggur: ${anggur}\n\nKetik:\n${usedPrefix}shop buy bibitmangga 500`, m);
    }

    if (Date.now() - user.lastberkebon < timeout) {
        m.reply(`⏳ Kamu sudah menanam!\nTunggu selama ${msToTime(time - new Date())} lagi untuk panen berikutnya.`)
    }

    // 🌤️ Fitur Cuaca
    const cuacaHariIni = ['cerah', 'hujan', 'kekeringan'][Math.floor(Math.random() * 3)];
    let multiplier = 1;
    if (cuacaHariIni === 'hujan') multiplier = 1.5;
    if (cuacaHariIni === 'kekeringan') multiplier = 0.5;

    // Panen dengan efek cuaca
    let pisangPoin = Math.floor(Math.random() * 500 * multiplier);
    let anggurPoin = Math.floor(Math.random() * 500 * multiplier);
    let manggaPoin = Math.floor(Math.random() * 500 * multiplier);
    let jerukPoin = Math.floor(Math.random() * 500 * multiplier);
    let apelPoin = Math.floor(Math.random() * 500 * multiplier);

    user.pisang += pisangPoin;
    user.anggur += anggurPoin;
    user.mangga += manggaPoin;
    user.jeruk += jerukPoin;
    user.apel += apelPoin;
    user.tiketcoin += 1;
    user.bibitpisang -= 500;
    user.bibitanggur -= 500;
    user.bibitmangga -= 500;
    user.bibitjeruk -= 500;
    user.bibitapel -= 500;
    user.lastberkebon = Date.now();

    // 🎁 Panen Spesial (bonus emas)
    let hadiahSpesial = '';
    if (Math.random() < 0.05) { // 5% peluang
        user.emas = (user.emas || 0) + 1;
        hadiahSpesial = `\n💰 *Bonus Spesial:* Kamu menemukan 1 Emas!`;
    }

    // Pesan hasil panen
    let hasil = `🌤️ *Cuaca Hari Ini:* ${cuacaHariIni.toUpperCase()}\n\n📦 *Hasil Panenmu:*\n🍌 Pisang: +${pisangPoin}\n🥭 Mangga: +${manggaPoin}\n🍇 Anggur: +${anggurPoin}\n🍊 Jeruk: +${jerukPoin}\n🍎 Apel: +${apelPoin}\n🎟️ Tiket Coin: +1${hadiahSpesial}`;

    conn.reply(m.chat, `Selamat ${conn.getName(m.sender)}!\n\n${hasil}`, m);

    // ⏳ Reminder otomatis saat waktu tanam habis
    setTimeout(() => {
        let mentionedJid = [m.sender];
        conn.reply(m.chat, `@${m.sender.replace(/@.+/, '')}, waktunya berkebun lagi! 🌱`, m, {
            contextInfo: { mentionedJid }
        });
    }, timeout);
};

handler.help = ['berkebun'];
handler.tags = ['rpg'];
handler.command = /^(berkebun)$/i;
handler.group = true;
handler.limit = true;
handler.register = true;

export default handler;

function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return `${hours} Jam ${minutes} Menit ${seconds} Detik`;
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