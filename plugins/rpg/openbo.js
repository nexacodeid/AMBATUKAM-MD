/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */


let handler = async (m, { conn }) => {
    let __timers = (Date.now() - global.db.data.users[m.sender].lastngojek)
    let _timers = (300000 - __timers)
    let order = global.db.data.users[m.sender].ojekk
    let timers = clockString(_timers) 
let name = conn.getName(m.sender)
    let user = global.db.data.users[m.sender]
    
     if (Date.now() - global.db.data.users[m.sender].lastngojek > 300000) {
let randomaku1 = `${Math.floor(Math.random() * 10)}`
let randomaku2 = `${Math.floor(Math.random() * 10)}`
let randomaku4 = `${Math.floor(Math.random() * 5)}`
let randomaku3 = `${Math.floor(Math.random() * 10)}`
let randomaku5 = `${Math.floor(Math.random() * 10)}`

.trim()

let rbrb1 = (randomaku1 * 2)
let rbrb2 = (randomaku2 * 10) 
let rbrb3 = (randomaku3 * 1)
let rbrb4 = (randomaku4 * 15729)
let rbrb5 = (randomaku5 * 20000)

var zero1 = `${rbrb1}`
var zero2 = `${rbrb2}`
var zero3 = `${rbrb3}`
var zero4 = `${rbrb4}`
var zero5 = `${rbrb5}`

var zaell = `
✔️ Mendapatkan Om Om Gacor....
`

var zaell1 = `
🥵 Mulai Membuka Pakaian.....
`

var zaell2 = `
🥵 Mulai Berpelukan.....
`

var zaell3 = `
🥵 Mulai Dicelupkan.....
`

var zaell4 = `     
🥵Ahhhh, Sakitttt!! >////<
 💦Crotttt.....
`

var zaell5 = `
🥵💦💦Ahhhhhh😫
> Keluar Banyak....
`

var hsl = `
*—[ Hasil Open Bo ${name} ]—*
 ➕ 💹 Uang = [ ${zero4} ]
 ➕ ✨ Exp = [ ${zero5} ] 
 ➕ 📛 Warn = +1		 
 ➕ 😍 Order Selesai = +1
➕  📥Total Order Sebelumnya : ${order}
${wm}
`


global.db.data.users[m.sender].warn += 1
global.db.data.users[m.sender].money += rbrb4
global.db.data.users[m.sender].exp += rbrb5
global.db.data.users[m.sender].ojekk += 1


setTimeout(() => {
                     m.reply(`${hsl}`)
                     }, 40000) 
                     
                     setTimeout(() => {
                     m.reply(`${zaell5}`)
                     }, 35000) 
               
                     setTimeout(() => {
                     m.reply(`${zaell4}`)
                      }, 30000)
                
                     setTimeout(() => {
                     m.reply(`${zaell3}`)
                     }, 25000) 
                        
                     setTimeout(() => {
                     m.reply(`${zaell2}`)
                     }, 20000) 
                     
                     setTimeout(() => {
                     m.reply(`${zaell1}`)
                     }, 15000) 
                    
                     setTimeout(() => {
                     m.reply(`${zaell}`)
                     }, 10000) 
                     
                     setTimeout(() => {
                     m.reply('🔍Mencari Om Om Kaya.....')
                     }, 0) 
  user.lastngojek = Date.now()
    } else conn.reply(m.chat, `Sepertinya Anda Sudah Kecapekan Silahkan Istirahat Dulu sekitar\n🕔 *${timers}*`, m)
}
handler.help = ['openbo']
handler.tags = ['rpg']
handler.command = /^(openbo|anu)$/i
handler.premium = true
handler.group = true
handler.register = true

export default handler


function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
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