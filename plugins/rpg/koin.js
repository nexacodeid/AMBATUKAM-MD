/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import axios from 'axios'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

let handler = async(m, { conn, args, text }) => {
var arr = ["atas", "bawah"]
if (!arr.includes(args[0])) m.reply("Pilih Atas Atau Bawah?")
var terbang = arr.getRandom()
var res
var pesan
var stiker
var MiliSecond = 3000 //1 second

let coins = parseInt(Math.floor(Math.random() * 50000))
let koins = parseInt(Math.floor(Math.random() * 20000))
let exp = parseInt(Math.floor(Math.random() * 20000))
let xp = parseInt(Math.floor(Math.random() * 15000))
let player = global.db.data.users[m.sender]
    if (player.money < 20000 ) return m.reply(`Uang Kamu Harus Di Atas 20000 untuk bermain Putar Koin`)
    if (player.exp < 15000 ) return m.reply(`Exp Kamu Harus Di Atas 15000 untuk bermain Putar Koin`)
    if (terbang == "atas") {
        res = "https://cdn-icons-png.flaticon.com/512/1490/1490832.png"
        stiker = await createSticker(false, res, global.getBotName?.() || global.namebot || 'WhatsApp Bot', `by ${global.getOwnerName?.() || global.ownerName || global.author || 'Owner'}`, 30)
    m.reply(stiker)
    
     pesan = `*[ 🌹Menang ]*

Kamu Mendapatkan:
${new Intl.NumberFormat('en-US').format(coins)} Money
${new Intl.NumberFormat('en-US').format(exp)} XP
`

setTimeout(function() {
 conn.reply(m.chat, pesan, m)
}, MiliSecond)

    player.money += coins * 1
    player.exp += exp * 1
    global.db.data.users[m.sender].tiketcoin += 1
    } else if (terbang == "bawah") {
        res = "https://cdn-icons-png.flaticon.com/512/4315/4315581.png"
        stiker = await createSticker(false, res, global.getBotName?.() || global.namebot || 'WhatsApp Bot', `by ${global.getOwnerName?.() || global.ownerName || global.author || 'Owner'}`, 30)
    m.reply(stiker)
    
   pesan = `*[ 🥀Kalah ]*

Kamu Kehilangan::
${new Intl.NumberFormat('en-US').format(coins)} Money
${new Intl.NumberFormat('en-US').format(exp)} XP
`
setTimeout(function() {
 conn.reply(m.chat, pesan, m)
}, MiliSecond)

    player.money -= koins * 1
    player.exp -= xp * 1
    global.db.data.users[m.sender].tiketcoin -= 1
    }
}
handler.help = ["putarkoin"]
handler.tags = ["rpg"]
handler.command = /^(putarkoin)$/i
handler.register = true
export default handler

async function createSticker(img, url, packName, authorName, quality) {
    let stickerMetadata = {
        type: 'full',
        pack: packName,
        author: authorName,
        quality
    }
    return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
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