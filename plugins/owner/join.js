/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

let handler = async (m, { conn, text }) => {
  if (!text) throw 'Masukkan link grup WhatsApp!\nContoh: *.join https://chat.whatsapp.com/xxxxx*'

  let match = text.match(linkRegex)
  if (!match) throw 'Link tidak valid!'

  let [_, code] = match
  let res

  try {
    res = await conn.groupAcceptInvite(code)
  } catch (error) {
    if (error?.message?.includes('not-authorized')) {
      return m.reply('Tidak dapat bergabung karena sebelumnya terkena kick.\nSilakan tunggu maksimal 7 hari.')
    } else if (error?.message?.includes('gone')) {
      return m.reply('Link tidak valid atau sudah diatur ulang oleh admin.')
    } else {
      throw error
    }
  }

  m.reply(`✅ *Berhasil bergabung ke grup:*\n${res}\n\nJika grup menggunakan persetujuan admin, silakan ACC nomor ini.`)
}

handler.help = ['join <linkgrup>']
handler.tags = ['owner']
handler.command = /^join$/i
handler.rowner = true
handler.owner = true

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