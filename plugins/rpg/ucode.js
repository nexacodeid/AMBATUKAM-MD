/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let confirm = {};

// Fungsi untuk membuat kode unik berdasarkan tanggal hari ini
function generateDailyCode() {
    const today = new Date();
    // Format tanggal menjadi YYYYMMDD
    const dateString = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    // Mengacak string tanggal untuk membuat kode
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let seed = parseInt(dateString);

    for (let i = 0; i < 10; i++) {
        // Menggunakan seed untuk memilih karakter secara deterministik
        result += characters.charAt(seed % characters.length);
        seed = Math.floor(seed / characters.length);
    }
    return result;
}

const CANCEL_TERMS = ['batal', 'cancel'];
const CODE_VALID_TIME = 60000;

async function handler(m, { conn, args }) {
    const EVENT_CODE = generateDailyCode(); // Kode dibuat setiap kali handler dipanggil
    let user = global.db.data.users[m.sender];

    if (m.sender in confirm) {
        m.reply('Anda sudah memiliki permintaan kode yang sedang berjalan. Mohon kirimkan kode yang Anda miliki atau batalkan terlebih dahulu.')
    }

    if (user.lastcode < 1) {
        return m.reply('❗ *Anda belum memiliki kode event.*\nKetik: `.gcode` untuk mendapatkan kode.');
    }
    
    confirm[m.sender] = {
        sender: m.sender,
        timeout: setTimeout(() => {
            m.reply('Waktu untuk menggunakan kode event telah habis. Anda bisa mencoba lagi.');
            delete confirm[m.sender];
        }, CODE_VALID_TIME)
    };
    
    let txt = `Kode yang Anda miliki: *${EVENT_CODE}*\nSilakan balas pesan ini dengan kode event Anda. Jika ingin membatalkan, ketik *Batal* atau *Cancel*.`;
    conn.reply(m.chat, txt, m);
}

handler.before = async m => {
    if (!(m.sender in confirm) || m.isBaileys) {
        return;
    }

    const EVENT_CODE = generateDailyCode(); // Penting: Kode dibuat lagi di sini untuk memastikan konsistensi
    let { timeout } = confirm[m.sender];
    let user = global.db.data.users[m.sender];
    let text = (m.text || '').toLowerCase();

    const cleanUp = () => {
        clearTimeout(timeout);
        delete confirm[m.sender];
    };

    if (CANCEL_TERMS.includes(text)) {
        m.reply(`❌ *Penggunaan kode dibatalkan!*`);
        cleanUp();
        return true;
    }
    
    if (text === EVENT_CODE.toLowerCase()) {
        if (user.lastcode < 1) {
            m.reply(`🚫 *Anda sudah menggunakan kode event ini.*`);
            cleanUp();
            return true;
        }

        let moneyReward = Math.floor(Math.random() * 80000000);
        let expReward = Math.floor(Math.random() * 1000000);
        const cashReward = 500;
        const tomatoReward = 3;

        user.money += moneyReward;
        user.exp += expReward;
        user.cash += cashReward;
        user.tomat += tomatoReward;
        user.lastcode = 0;
        
        m.reply(`*✅ Kupon berhasil digunakan*

Anda mendapatkan hadiah:
*💸 Money:* ${moneyReward.toLocaleString()}
*🧪 Exp:* ${expReward.toLocaleString()}
*💰 Cash:* ${cashReward}

_Jangan lupa bersyukur dan berterima kasih yaa :)_`);
        
        cleanUp();
        return true;

    } else {
        m.reply('Kode yang Anda masukkan salah. Silakan coba lagi atau ketik `Batal`.');
    }
};

handler.help = ['ucode'];
handler.tags = ['rpg'];
handler.command = /^(ucode)$/i;
handler.register = true;
handler.owner = false;
handler.group = true;

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