/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */


async function handler(m, { conn, text, command, usedPrefix, }) {
    conn.astro = conn.astro || {};
    conn.roket = conn.roket || {};
    let roket = conn.roket[m.chat]
    let bulan = conn.astro[m.chat];
    let user = global.db.data.users[m.sender];
    let timing = (Date.now() - (user.lastroket * 1)) * 1
    if (timing < 1800000) return m.reply(`👨🏻‍🚀: Untuk saat ini, kamu blum bisa pergi ke Antariksa, tunggu selama ${clockString(1800000 - timing)}`)
    if (!roket) {
    let aku = `\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n👨🏻‍🚀: Mengexplorasi luar angkasa, untuk mencari tahu tentang luar angkasa dan seisi galaxy.\n\nKetik:\n*Buat room*\n> untuk memulai permainan`
    
    await conn.reply(m.chat, aku, m)
       
       conn.astro[m.chat] = {
           peran: m.sender,
           status: 'wait',
           waktu: setTimeout(() => {
           if (conn.astro[m.chat]) m.reply(`Mengexplor luar angkasa telah di batalkan`)
           delete conn.astro[m.chat]
           }, 500000)
        }
    } else {
    if (!roket.players.includes(m.sender)) {
        let playerListh = roket.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        let join = `\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n👨🏻‍🚀: Sudah ada yang menunggu nih, yuu bergabung bersama mereka.\n\nKetik:\n*Join / Bergabung*\n> untuk mengikuti permainan`
        await conn.reply(m.chat, join, m)
        } else if (roket.players.includes(m.sender)) {
        let playerList = roket.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        let roomP = roket.master
        let sudah = `\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n👨🏻‍🚀: Kamu Sedang Menunggu Keberangkatan\n*Room ID:* ${roket.id}\n* Tujuan: ${roket.tujuan}\n\n*- PLAYER -*\n${playerList}\n\nMenunggu @${roket.master.replace(/@.+/, '')} Mengetik *Start / Mulai* untuk memulai permainan`
        await conn.reply(m.chat, sudah, m, { contextInfo: { mentionedJid: roket.players }})
     }
  }
}

handler.tags = ['rpg']
handler.command = ['astronot']
handler.command = /^(astronot)/i
handler.group = true
handler.register = true

handler.before = async function(m) {
    const conn = this;
    this.astro = this.astro || {};
    this.roket = this.roket || {};
    let bulan = Object.values(this.astro).find(bulan => bulan.status && [bulan.peran].includes(m.sender));
    let roket = this.roket[m.chat]
 
   if (roket) {
       if (/^(join|bergabung)/i.test(m.text) && !roket.players.includes(m.sender)) {
       let uJoin = global.db.data.users[m.sender];
       let timing = (Date.now() - (uJoin.lastroket* 1)) * 1
    if (timing < 1800000) return m.reply(`👨🏻‍🚀: Untuk saat ini, kamu blum bisa bergaung Bersama Mereka, tunggu selama ${clockString(1800000 - timing)}`)
       if (uJoin.roket < 1) return m.reply('*👨🏻‍🚀: Kamu Tidak Memiliki Roket, Silahkan Beli Terlebih Dahulu*\nKetik: !shop buy roket')
       if (uJoin.aerozine < 50) return m.reply('*👨🏻‍🚀: Aerozine Kamu Kurang Dari *50*, Silahkan Isi Bahan Bakar Roketmu, Silahkan Beli Terlebih Dahulu*\nKetik: !shop buy aerozine')
       let rooms = `1\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n*👨🏻‍🚀: Sukses Bergabung kedalam room*\n* 📌 Room ID: ${roket.id}\n* 🚀 Tujuan: ${roket.tujuan}\n\n\`🕐 Menunggu @${roket.master.replace(/@.+/, '')} Mengetik *Start / Mulai* untuk memulai permainan`
       
       roket.players.push(m.sender);
       await conn.reply(m.chat, rooms, m, { contextInfo: { mentionedJid: [roket.master] }})
     } else if (/^(join|bergabung)/i.test(m.text) && roket.players.includes(m.sender)) {
        let playerList = roket.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        let sudah = `\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n👨🏻‍🚀: Kamu Sedang Menunggu Keberangkatan\n*Room ID:* ${roket.id}\n* Tujuan: ${roket.tujuan}\n\n*- PLAYER -*\n${playerList}\n\nMenunggu @${roket.master.replace(/@.+/, '')} Mengetik *Start / Mulai* untuk memulai permainan`
        await conn.reply(m.chat, sudah, m, { contextInfo: { mentionedJid: roket.players }})
     } else if (/^(start|mulai)/i.test(m.text) && m.sender === roket.master) {
      if (roket.players.length <= 1) {
       let belum = `\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n👨🏻‍🚀: Minimal 1 Pemain Yang Bergabung Ke Dalam Room.\n\nketik:\n*Sendiri / Solo*\n> bermain sendiri`
        await conn.reply(m.chat, belum, m)
        } else if (roket.tujuan) {
          eksplorasiAntariksa(m, roket, conn)
         }
      } else if (/^(sendiri|solo)/i.test(m.text) && m.sender === roket.master) {
      if (roket.players.length >= 2) {
      let playerList = roket.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
      let sudah = `\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n👨🏻‍🚀: Sudah Ada Pemain Yang Bergabung Kedalam Room, Tidak Bisa Bermain Sendiri.\n\n*- PLAYER -*\n${playerList}\nSilahkan Mulai Permainan\n\nKetik:\n*Start / Mulai*\n> memulai permainan`
        await conn.reply(m.chat, sudah, m, { contextInfo: { mentionedJid: roket.players }})
      } else if (roket.tujuan) {
          eksplorasiAntariksa(m, roket, conn)
      }
    } else if (/^(batal|cancel)/i.test(m.text) && m.sender === roket.master) {
    if (roket.players.length >= 2) {
    let playerList = roket.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
    await conn.reply(m.chat, `\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n👨🏻‍🚀: Tidak Bisa Membatalkan Permainan, Karna Sudah Ada Pemain Yang Bergabung Kedalam roket.\n\n*- PLAYER -*\n${playerList}\nSilahkan Mulai Permainan\n\nKetik:\n*Start / Mulai*\n> memulai permainan`, m, { contextInfo: { mentionedJid: roket.players }})
    } else {
       let batalMsg = `Sukses Membatalkan Permainan`
       await conn.reply(m.chat, batalMsg, m, { contextInfo: { mentionedJid: [roket.master] } });
       delete conn.roket[m.chat]
       }
       } else if (/^(player|pemain)/i.test(m.text) && roket.players.includes(m.sender)) {
         let playerList = this.roket[m.chat].players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
         await conn.reply(m.chat, `*[🚀] Astronot*\n👨🏻‍🚀 Player:\n${playerList}\n▬▭▬▭▬▭▬▭`, m, { contextInfo : { mentionedJid: this.roket[m.chat].players }})
        }
  } else if (bulan && bulan.status == 'tujuan') {
 let tuju = ''
 let user = global.db.data.users[bulan.peran]
 if (/^(merkurius)/i.test(m.text) && m.sender == bulan.peran) {
     tuju = 'merkurius'
     } else if (/^(venus)/i.test(m.text) && m.sender == bulan.peran) {
     if (user.roket === 0) return m.reply('_👨🏻‍🚀: Kamu Tidak Memiliki *🚀 Roket*, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy roket')
     if (user.aerozine < 50) return m.reply('_👨🏻‍🚀: Aerozine Kamu Kurang Dari *50*, Isi Bahan Bakar Roketmu, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy aerozine')
     tuju = 'venus'
     let id = Math.floor(Math.random() * 10000000);

     let tujuan = `\t✨ *EXPLORASI ANTARIKSA ✨*\n\n👨🏻‍🚀: Berhasil Membuat Room\n*📌 Room ID:* ${id}\n*🌔 Tujuan:* ${tuju}\n🕐 Menunggu Pemain Lain Untuk Bergabung Kedalam Room\n\nKetik:\n*Join / Bergabung*\n> mengikuti permainan\n*Start / Mulai*\n> memulai permainan\n*Solo / Sendiri*\n> bermain sendiri\n*Batal \ Cancel*\n> membatalkan permainan`;
         await conn.reply(m.chat, tujuan, m)
        conn.roket[m.chat] = {
           master: bulan.peran,
           players: [m.sender],
           id: id,
           tujuan: tuju,
           status: 'waiting',
           del: delete conn.astro[m.chat]
         }
         roket = conn.roket[m.chat]
     } else if (/^(bulan)/i.test(m.text) && m.sender == bulan.peran) {
     if (user.roket === 0) return m.reply('_👨🏻‍🚀: Kamu Tidak Memiliki *🚀 Roket*, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy roket')
     if (user.aerozine < 50) return m.reply('_👨🏻‍🚀: Aerozine Kamu Kurang Dari *50*, Isi Bahan Bakar Roketmu, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy aerozine')
     tuju = 'bulan'
     let id = Math.floor(Math.random() * 10000000);

     let tujuan = `\t✨ *EXPLORASI ANTARIKSA ✨*\n\n👨🏻‍🚀: Berhasil Membuat Room\n*📌 Room ID:* ${id}\n*🌔 Tujuan:* ${tuju}\n🕐 Menunggu Pemain Lain Untuk Bergabung Kedalam Room\n\nKetik:\n*Join / Bergabung*\n> mengikuti permainan\n*Start / Mulai*\n> memulai permainan\n*Solo / Sendiri*\n> bermain sendiri\n*Batal \ Cancel*\n> membatalkan permainan`;
         await conn.reply(m.chat, tujuan, m)
        conn.roket[m.chat] = {
           master: bulan.peran,
           players: [m.sender],
           id: id,
           tujuan: tuju,
           status: 'waiting',
           del: delete conn.astro[m.chat]
         }
         roket = conn.roket[m.chat]
     } else if (/^(jupiter)/i.test(m.text) && m.sender == bulan.peran) {
     if (user.roket === 0) return m.reply('_👨🏻‍🚀: Kamu Tidak Memiliki *🚀 Roket*, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy roket')
     if (user.aerozine < 50) return m.reply('_👨🏻‍🚀: Aerozine Kamu Kurang Dari *50*, Isi Bahan Bakar Roketmu, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy aerozine')
     tuju = 'jupiter'
     let id = Math.floor(Math.random() * 10000000);

     let tujuan = `\t✨ *EXPLORASI ANTARIKSA ✨*\n\n👨🏻‍🚀: Berhasil Membuat Room\n*📌 Room ID:* ${id}\n*🌔 Tujuan:* ${tuju}\n🕐 Menunggu Pemain Lain Untuk Bergabung Kedalam Room\n\nKetik:\n*Join / Bergabung*\n> mengikuti permainan\n*Start / Mulai*\n> memulai permainan\n*Solo / Sendiri*\n> bermain sendiri\n*Batal \ Cancel*\n> membatalkan permainan`;
         await conn.reply(m.chat, tujuan, m)
        conn.roket[m.chat] = {
           master: bulan.peran,
           players: [m.sender],
           id: id,
           tujuan: tuju,
           status: 'waiting',
           del: delete conn.astro[m.chat]
         }
         roket = conn.roket[m.chat]
     } else if (/^(neptunus)/i.test(m.text) && m.sender == bulan.peran) {
     if (user.roket === 0) return m.reply('_👨🏻‍🚀: Kamu Tidak Memiliki *🚀 Roket*, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy roket')
     if (user.aerozine < 50) return m.reply('_👨🏻‍🚀: Aerozine Kamu Kurang Dari *50*, Isi Bahan Bakar Roketmu, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy aerozine')
     tuju = 'neptunus'
     let id = Math.floor(Math.random() * 10000000);

     let tujuan = `\t✨ *EXPLORASI ANTARIKSA ✨*\n\n👨🏻‍🚀: Berhasil Membuat Room\n*📌 Room ID:* ${id}\n*🌔 Tujuan:* ${tuju}\n🕐 Menunggu Pemain Lain Untuk Bergabung Kedalam Room\n\nKetik:\n*Join / Bergabung*\n> mengikuti permainan\n*Start / Mulai*\n> memulai permainan\n*Solo / Sendiri*\n> bermain sendiri\n*Batal \ Cancel*\n> membatalkan permainan`;
         await conn.reply(m.chat, tujuan, m)
        conn.roket[m.chat] = {
           master: bulan.peran,
           players: [m.sender],
           id: id,
           tujuan: tuju,
           status: 'waiting',
           del: delete conn.astro[m.chat]
         }
         roket = conn.roket[m.chat]
     } else if (/^(mars)/i.test(m.text) && m.sender == bulan.peran) {
     if (user.roket === 0) return m.reply('_👨🏻‍🚀: Kamu Tidak Memiliki *🚀 Roket*, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy roket')
     if (user.aerozine < 50) return m.reply('_👨🏻‍🚀: Aerozine Kamu Kurang Dari *50*, Isi Bahan Bakar Roketmu, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy aerozine')
     tuju = 'mars'
     let id = Math.floor(Math.random() * 10000000);

     let tujuan = `\t✨ *EXPLORASI ANTARIKSA ✨*\n\n👨🏻‍🚀: Berhasil Membuat Room\n*📌 Room ID:* ${id}\n*🌔 Tujuan:* ${tuju}\n🕐 Menunggu Pemain Lain Untuk Bergabung Kedalam Room\n\nKetik:\n*Join / Bergabung*\n> mengikuti permainan\n*Start / Mulai*\n> memulai permainan\n*Solo / Sendiri*\n> bermain sendiri\n*Batal \ Cancel*\n> membatalkan permainan`;
         await conn.reply(m.chat, tujuan, m)
        conn.roket[m.chat] = {
           master: bulan.peran,
           players: [m.sender],
           id: id,
           tujuan: tuju,
           status: 'waiting',
           del: delete conn.astro[m.chat]
         }
         roket = conn.roket[m.chat]
     } else if (/^(saturnus)/i.test(m.text) && m.sender == bulan.peran) {
     if (user.roket === 0) return m.reply('_👨🏻‍🚀: Kamu Tidak Memiliki *🚀 Roket*, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy roket')
     if (user.aerozine < 50) return m.reply('_👨🏻‍🚀: Aerozine Kamu Kurang Dari *50*, Isi Bahan Bakar Roketmu, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy aerozine')
     tuju = 'saturnus'
     let id = Math.floor(Math.random() * 10000000);

     let tujuan = `\t✨ *EXPLORASI ANTARIKSA ✨*\n\n👨🏻‍🚀: Berhasil Membuat Room\n*📌 Room ID:* ${id}\n*🌔 Tujuan:* ${tuju}\n🕐 Menunggu Pemain Lain Untuk Bergabung Kedalam Room\n\nKetik:\n*Join / Bergabung*\n> mengikuti permainan\n*Start / Mulai*\n> memulai permainan\n*Solo / Sendiri*\n> bermain sendiri\n*Batal \ Cancel*\n> membatalkan permainan`;
         await conn.reply(m.chat, tujuan, m)
        conn.roket[m.chat] = {
           master: bulan.peran,
           players: [m.sender],
           id: id,
           tujuan: tuju,
           status: 'waiting',
           del: delete conn.astro[m.chat]
         }
         roket = conn.roket[m.chat]
     } else if (/^(uranus)/i.test(m.text) && m.sender == bulan.peran) {
     if (user.roket === 0) return m.reply('_👨🏻‍🚀: Kamu Tidak Memiliki *🚀 Roket*, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy roket')
     if (user.aerozine < 50) return m.reply('_👨🏻‍🚀: Aerozine Kamu Kurang Dari *50*, Isi Bahan Bakar Roketmu, Silahkan Beli Terlebih Dahulu_\n*Ketik:* !shop buy aerozine')
     tuju = 'uranus'
     let id = Math.floor(Math.random() * 10000000);

     let tujuan = `\t✨ *EXPLORASI ANTARIKSA ✨*\n\n👨🏻‍🚀: Berhasil Membuat Room\n*📌 Room ID:* ${id}\n*🌔 Tujuan:* ${tuju}\n🕐 Menunggu Pemain Lain Untuk Bergabung Kedalam Room\n\nKetik:\n*Join / Bergabung*\n> mengikuti permainan\n*Start / Mulai*\n> memulai permainan\n*Solo / Sendiri*\n> bermain sendiri\n*Batal \ Cancel*\n> membatalkan permainan`;
         await conn.reply(m.chat, tujuan, m)
        conn.roket[m.chat] = {
           master: bulan.peran,
           players: [m.sender],
           id: id,
           tujuan: tuju,
           status: 'waiting',
           del: delete conn.astro[m.chat]
         }
         roket = conn.roket[m.chat]
     }
   } else if (bulan && /^(buat room)/i.test(m.text) && m.sender === bulan.peran && bulan.status == 'wait') {
       let pilihServer = `\t⬣─〔 *🚀 Explorasi Antariksa* 〕─⬣\n\n\`👨🏻‍🚀: Pilih Tujuanmu di bawah ini\`\n\n*- LIST TUJUAN -*\n* 🌔 Merkurius\n> : ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ᴍᴇʀᴋᴜʀɪᴜs\n* 🌔 Uranus\n> : ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ᴜʀᴀɴᴜs\n* 🌔 Mars\n> : ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ᴍᴀʀs\n* 🌔 Neptunus\n> : ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ɴᴇᴘᴛᴜɴᴜs\n* 🌔 Jupiter\n> : ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ᴊᴜᴘɪᴛᴇʀ\n* 🌔 Saturnus\n> : ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ sᴀᴛᴜʀɴᴜs\n* 🌔 Venus\n> : ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ᴠᴇɴᴜs\n🌔 Bulan\n> : ᴍᴇɴᴊᴇʟᴀᴊᴀʜɪ ʙᴜʟᴀɴ\n\n👨🏻‍🚀: Contoh *Venus*`;
     await conn.reply(m.chat, pilihServer, m)
     bulan.status = 'tujuan'
    }
}

async function eksplorasiAntariksa(m, roket, conn) {
roket.players.forEach(player => {
  let allUser = global.db.data.users[player]
  allUser.lastroket = Date.now()
})
let startMsg = `*👨🏻‍🚀: Kalian Akan Meluncur Ke Antariksa*\n\n👨🏻‍🚀 Players :\n`;
    roket.players.forEach((player, index) => {
        startMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
    });
    startMsg += `\n*📌Room ID:* ${roket.id}\n*🌔 Tujuan:* ${roket.tujuan}\n\n*🚀 Tunggu Beberapa Saat!!.*`;
    await conn.reply(m.chat, startMsg, m, { contextInfo: { mentionedJid: roket.players } });
    delete conn.roket[m.chat];
    
    setTimeout(async () => {
        let resultsMsg = `*👨🏻‍🚀: Kalian Telah Kembali*\n\n👨🏻‍🚀 Player:\n`;
        roket.players.forEach((player, index) => {
            resultsMsg += `*${index + 1}.* @${player.replace(/@.+/, '')}\n`;
        });
        resultsMsg += `\n*📌 Room ID:* ${roket.id}\n*🌔 Tujuan: ${roket.tujuan}*\n\n*🎁 Reward:*\n`;

        roket.players.forEach(player => {
        let user = global.db.data.users[player];
            let emas = Math.floor(Math.random() * 30);
            let money = Math.floor(Math.random() * 20000000);
            let exp = Math.floor(Math.random() * 50000);

            user.aerozine -= 50;
            user.money += money;
            user.exp += exp;
           // user.lastroket = Date.now();
            user.totalb += 1;

            resultsMsg += `\n[✠]▬▭▬▭▬▭▬▭▬▭[✠]\n👤 @${player.replace(/@.+/, '')}\n💵 *Money:* +Rp.${money.toLocaleString()}\n🧪 *Exp:* +${exp.toLocaleString()}\n*🛢️ Aerozine:* -50\n*👨🏻‍🚀 Pengalaman:* +1`;
        });

        await conn.reply(m.chat, resultsMsg, m, { contextInfo: { mentionedJid: roket.players } });
    }, 10000);

    setTimeout(async () => {
        let playerListt = roket.players.map((player, index) => `*${index + 1}.* @${player.replace(/@.+/, '')}`).join('\n');
        await conn.reply(m.chat, `*👨🏻‍🚀: Hai User*\n${playerListt}\nAyo Saatnya Kita Ekplorasi Antariksa Lagi!!`, m, { contextInfo: { mentionedJid: roket.players } });
    }, 1800000);
}

export default handler;



function clockString(ms) {
  let h = isNaN(ms) ? '60' : Math.floor(ms / 3600000) % 60
  let m = isNaN(ms) ? '60' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60
  return [h, m, s,].map(v => v.toString().padStart(2, 0) ).join(':')
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