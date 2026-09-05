/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async(m, { conn, args, usedPrefix, command }) => {
   
   let user = global.db.data.users[m.sender]
   let count = user.armor
   let _count = user.sword
   let nuy = (args[0] || '').toLowerCase()
   let ipah = `*「 R E P A I R 」*
  
⎆ Sword
⎆ Armor

*Contoh:* ${usedPrefix + command} armor
▬▭▬▭▬▭▬▭▬▭`
   
   switch (nuy) {
      case 'armor':
      if (user.armor == 0) return m.reply(`Kamu Tidak Memiliki Armor!`)
      if (user.armordurability == user.bararmor) return m.reply(`❗Armormu Tidak Memiliki Kerusakan\nDurability: ${user.armordurability} / ${user.bararmor}`)
      if (user.leather < 15 * count) return m.reply(`❕Kamu Membutuhkan 🧣${15 * count} Leather, Untuk Repair Armormu, Silahkan Beli Di Shop\nKetik: !shop buy leather`)
      if (user.iron < 13 * count) return m.reply(`❕Kamu Membutuhkan ⚙️${13 * count} Iron, Untuk Repair Armormu, Silahkan Beli Di Shop\nKetik: !shop buy iron`)
      user.leather -= 15 * count
      user.iron -= 13 * count
      user.armordurability = user.bararmor
      await conn.reply(m.chat, `*✅ Armor Telah Di Repair*\nDurability: ${user.armordurability} / ${user.bararmor}`, m)
      break
      case 'sword':
      if (user.sword == 0) return m.reply(`Kamu Tidak Memiliki Sword!`)
      if (user.sworddurability == user.barsword) return m.reply(`❗Sword Tidak Memiliki Kerusakan\nDurability: ${user.sworddurability} / ${user.barsword}`)
      if (user.kayu < 23 * user.sword) return m.reply(`❕Kamu Membutuhkan 🪵${23 * user.sword} Kayu, Untuk Repair Sword, Silahkan Beli Di Shop\nKetik: !shop buy kayu`)
      if (user.iron < 14 * user.sword) return m.reply(`❕Kamu Membutuhkan ⚙️${14 * user.sword} Iron, Untuk Repair Swordmu, Silahkan Beli Di Shop\nKetik: !shop buy iron`)
      user.kayu -= 23 * user.sword
      user.iron -= 14 * user.sword
      user.sworddurability = user.barsword
      await conn.reply(m.chat, `*✅ Sword Telah Di Repair*\nDurability: ${user.sworddurability} / ${user.barsword}`, m)
      break
      default:
    return conn.reply(m.chat, ipah, m)
    }
}
handler.tags = ['rpg']
handler.help = ['repair']
handler.command = /^(repair)/i
handler.register = true

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