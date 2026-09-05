/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { args }) => {
    let [path, property, value] = args
    if (!path || !property || typeof value === 'undefined')
        return m.reply(`Penggunaan salah! 🤨\n\n*Contoh penggunaan:*\n*.setplugin ai/openai.js premium true*`)

    let plugin = global.plugins[path]

    if (!plugin) return m.reply(`❌ *Plugin tidak ditemukan!*\nPastikan path file sudah benar, contoh: *ai/openai.js*`)

    let allowed = ['owner', 'premium', 'limit', 'admin', 'group', 'rpg', 'game', 'nsfw']
    if (!allowed.includes(property))
        return m.reply(`📝 *Properti tidak dikenali!*\n\n📌 *Bisa diatur:*\n${allowed.map(v => `*• ${v}*`).join('\n')}`)

    plugin[property] = value.toLowerCase() === 'true'

    m.reply(`✨ *Berhasil!*\n\nProperti *${property}* untuk plugin *${path}* telah diatur ke *${value}*`)
}

handler.help = ['setplug <path> <property> <true|false>']
handler.tags = ['owner']
handler.command = /^(setplug)$/i
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