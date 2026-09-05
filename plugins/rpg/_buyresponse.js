/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const moneya = 1000
const moneyb = 2000
const moneyc = 5000
const moneyd = 11000

const limita = 500
const limitb = 1500
const limitc = 2500
const limitd = 5000

const expa = 1000
const expb = 2000
const expc = 5000
const expd = 10000

const prema = 1000
const premb = 2000
const premc = 7000
const premd = 12000

let handler = async (m, { conn, text, args, command }) => {
   let user = global.db.data.users[m.sender]
 switch (command) {
       case 'moneyp1':
     if (user.cash >= moneya) {
     user.money += 250000000
     user.cash -= moneya
     conn.reply(m.chat, `✅ Sukses Membeli 250,000,000 Money, dengan Rp.${moneya.toLocaleString()} Cash`, m)
    // delete conn.buy[m.chat]
     } else conn.reply(m.chat, `Cash anda tidak cukup untuk membeli paket ini`, m)
     break
     case 'moneyp2':
     if (user.cash >= moneyb) {
     user.money += 550000000
     user.cash -= moneyb
     conn.reply(m.chat, `✅ Sukses Membeli 550,000,000 Money, dengan Rp.${moneyb.toLocaleString()} Cash`, m)
   //  delete conn.buy[m.chat]
     } else conn.reply(m.chat, `Cash anda tidak cukup untuk membeli paket ini`, m)
     break
     case 'moneyp3':
     if (user.cash >= moneyc) {
     user.money += 2000000000
     user.cash -= moneyc
     conn.reply(m.chat, `✅ Sukses Membeli 2,000,000,000 Money, dengan Rp.${moneyc.toLocaleString()} Cash`, m)
   //  delete conn.buy[m.chat]
     } else conn.reply(m.chat, `Cash anda tidak cukup untuk membeli paket ini`, m)
     break
     case 'moneyp4':
     if (user.cash >= moneyd) {
     user.money += 7000000000
     user.cash -= moneyd
     conn.reply(m.chat, `✅ Sukses Membeli 7,000,000,000 Money, dengan Rp.${moneyd.toLocaleString()} Cash`, m)
   //  delete conn.buy[m.chat]
     } else conn.reply(m.chat, `Cash anda tidak cukup untuk membeli paket ini`, m)
     break
     case 'limitp1':
     if (user.cash >= limita) {
     user.limit += 1000
     user.cash -= limita
     conn.reply(m.chat, `✅ Sukses Membeli 1,000 Limit, dengan Rp.${limita.toLocaleString()} Cash`, m)
   //  delete conn.buy[m.chat]
     } else conn.reply(m.chat, `Cash anda tidak cukup untuk membeli paket ini`, m)
     break
     case 'limitp2':
     if (user.cash >= limitb) {
     user.limit += 2500
     user.cash -= limitb
     conn.reply(m.chat, `✅ Sukses Membeli 2,500 Limit, dengan Rp.${limitb.toLocaleString()} Cash`, m)
   //  delete conn.buy[m.chat]
     } else conn.reply(m.chat, `Cash anda tidak cukup untuk membeli paket ini`, m)
     break
     case 'limitp3':
     if (user.cash >= limitc) {
     user.limit += 5000
     user.cash -= limitc
     conn.reply(m.chat, `✅ Sukses Membeli 5,000 Limit, dengan Rp.${limitc.toLocaleString()} Cash`, m)
  //   delete conn.buy[m.chat]
     } else conn.reply(m.chat, `Cash anda tidak cukup untuk membeli paket ini`, m)
     break
     case 'limitp4':
     if (user.cash >= limitd) {
     user.limit += 13000
     user.cash -= limitd
     conn.reply(m.chat, `✅ Sukses Membeli 13,000 Limit, dengan Rp.${limitd.toLocaleString()} Cash`, m)
    // delete conn.buy[m.chat]
     } else conn.reply(m.chat, `Cash anda tidak cukup untuk membeli paket ini`, m)
     break
     case 'premp1':
     if (user.cash >= prema) {
       let jumlahHari = 86400000 * 1
       let now = Date.now()
       if (now < user.premiumTime) user.premiumTime += jumlahHari
      else user.premiumTime = now + jumlahHari 
      user.premium = true
      user.cash -= prema
      conn.reply(m.chat, `✅ *Sukses Membeli*\n* 📅 Prem: 1 Hari\n* 💰 Dengan Cash: ${prema.toLocaleString()}\n* 👤 Pembeli: ${user.name}\n\nCek Ketik: !listprem\nNote!\n\`Jika Tidak Masuk, Segera Lapor Owner!\``, m)
    // delete conn.buy[m.chat]
     } else conn.reply(m.chat, `Cash kamu tidak cukup, untuk membeli paket premium`)
     break
     case 'premp2':
     if (user.cash >= premb) {
       let jumlahHari = 86400000 * 3
       let now = Date.now()
       if (now < user.premiumTime) user.premiumTime += jumlahHari
      else user.premiumTime = now + jumlahHari
      user.premium = true
      user.cash -= premb
      conn.reply(m.chat, `✅ *Sukses Membeli*\n* 📅 Prem: 3 Hari\n* 💰 Dengan Cash: ${premb.toLocaleString()}\n* 👤 Pembeli: ${user.name}\n\nCek Ketik: !listprem\nNote!\n\`Jika Tidak Masuk, Segera Lapor Owner!\``, m)
    // delete conn.buy[m.chat]
     } else conn.reply(m.chat, `Cash kamu tidak cukup, untuk membeli paket premium`)
     break
     case 'premp3':
     if (user.cash >= premc) {
       let jumlahHari = 86400000 * 7
       let now = Date.now()
       if (now < user.premiumTime) user.premiumTime += jumlahHari
      else user.premiumTime = now + jumlahHari
      user.premium = true
      user.cash -= premc
      conn.reply(m.chat, `✅ *Sukses Membeli*\n* 📅 Prem: 1 Minggu\n* 💰 Dengan Cash: ${premc.toLocaleString()}\n* 👤 Pembeli: ${user.name}\n\nCek Ketik: !listprem\nNote!\n\`Jika Tidak Masuk, Segera Lapor Owner!\``, m)
    // delete conn.buy[m.chat]
     } else conn.reply(m.chat, `Cash kamu tidak cukup, untuk membeli paket premium`)
     break
     case 'premp4':
     if (user.cash >= premd) {
       let jumlahHari = 86400000 * 30
       let now = Date.now()
       if (now < user.premiumTime) user.premiumTime += jumlahHari
      else user.premiumTime = now + jumlahHari
      user.premium = true
      user.cash -= premd
      conn.reply(m.chat, `✅ *Sukses Membeli*\n* 📅 Prem: 1 Bulan\n* 💰 Dengan Cash: ${premd.toLocaleString()}\n* 👤 Pembeli: ${user.name}\n\nCek Ketik: !listprem\nNote!\n\`Jika Tidak Masuk, Segera Lapor Owner!\``, m)
     // delete conn.buy[m.chat]
     } else conn.reply(m.chat, `Cash kamu tidak cukup, untuk membeli paket premium`)
     break
   default:
     return;
    }
}
handler.command = /^(moneyp1|moneyp2|moneyp3|moneyp4|premp1|premp2|premp3|premp4|limitp1|limitp2|limitp3|limitp4)/i

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