/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler  = async (m, { conn, command, args, usedPrefix }) => {

  let kamu = global.db.data.users[m.sender]
  let duraa = kamu.pancingandurability
  let namaka = kamu.name
  let _timie = (Date.now() - (kamu.lastfishing * 1)) * 1
   
     if (_timie < 7200000) return m.reply(`Kamu Sudah Lelah Mancing Ikan,\nTunggu Selama ${clockString(7200000 - _timie)} Lagi`)
     if (kamu.pancingan < 1) return m.reply(`Kamu Tidak Memiliki *Pancingan🎣*, Silahkan Beli Terlebih Dahulu`)
     if (kamu.umpan < 50) return m.reply(`Umpan Kamu Tidak Cukup, Kamu Harus Memiliki Umpan 50, Silahkan Beli Upman Terlebih dahulu`)
     if (duraa < 50) return m.reply(`Durability Pancingan Kamu Kurang Dari 30, Silahkan Repair Pancingan Kamu Terlebih Dahulu\n*Ketik :* .perbaiki pancingan`)
     if (kamu.stamina < 20) return m.reply(`Stamina Kamu Kurang Dari 20, Silahkan Makan Terlebih Untuk Mengisi Stamina\n*Ketik :* .makan`)
     
     
     
     let nila = `${Math.floor(Math.random() * 5)}`.trim()
     let ikan = `${Math.floor(Math.random() * 5)}`.trim()
     let bawal = `${Math.floor(Math.random() * 5)}`.trim()
     let buntal = `${Math.floor(Math.random() * 5)}`.trim()
     let lele = `${Math.floor(Math.random() * 5)}`.trim()
     let orca = `${Math.floor(Math.random() * 5)}`.trim()
     let dory = `${Math.floor(Math.random() * 5)}`.trim()

     let paus = `${Math.floor(Math.random() * 3)}`.trim()
     let hiu = `${Math.floor(Math.random() * 2)}`.trim()
     let gurita = `${Math.floor(Math.random() * 3)}`.trim()
     let lumba = `${Math.floor(Math.random() * 3)}`.trim()
     
     let kepiting = `${Math.floor(Math.random() * 5)}`.trim()
     let lobster = `${Math.floor(Math.random() * 5)}`.trim()
     let cumi = `${Math.floor(Math.random() * 5)}`.trim()
     let udang = `${Math.floor(Math.random() * 5)}`.trim()
     let umpan = `${Math.floor(Math.random() * 5)}`.trim()
     let pancidura = `${Math.floor(Math.random() * 70)}`.trim()

      kamu.nila += nila * 1
      kamu.ikan += ikan * 1
      kamu.bawal += bawal * 1
      kamu.buntal += buntal * 1
      kamu.lele += lele * 1
      kamu.orca += orca * 1
      kamu.hiu += hiu * 1
      kamu.paus += paus * 1
      kamu.lumba += lumba * 1
      kamu.gurita += gurita * 1
      kamu.lobster += lobster * 1
      kamu.kepiting += kepiting * 1
      kamu.udang += udang * 1
      kamu.dory += dory * 1
      kamu.cumi += cumi * 1
      kamu.umpan -= umpan * 1
      kamu.pancingandurability -= pancidura * 1
      kamu.stamina -= 20
      kamu.lastfishing = Date.now()
      
     let umpanmu = kamu.umpan
     let nuyOfc = `Durability Pancinganmu Berkurang *-${pancidura}🎣*
Stamina Kamu Berkurang *-20🛡️*

@${m.sender.replace(/@.+/, '')} *Mendapatkan..*

•🐟 *Nila :* ${nila}
•🐟 *Ikan :* ${ikan}
•🐟 *Bawal :* ${bawal}
•🐟 *Dory :* ${dory}
•🐡 *Buntal :* ${buntal}
•🐟 *Lele :* ${lele}
•🐠 *Orca :* ${orca}

*Ikan Besar*

•🦈 *Hiu :* ${hiu}
•🐋 *Paus :* ${paus}
•🐬 *Lumba Lumba :* ${lumba}

*Lainnya*

•🐙 *Gurita :* ${gurita}
•🦞 *Lobster :* ${lobster}
•🦀 *Kepiting :* ${kepiting}
•🦐 *Udang :* ${udang}
•🦑 *Cumi :* ${cumi}

*Sisa Umpan :* ${umpanmu}

Cek Hasil Mancingmu
*Ketik :* .kolam
`
      
setTimeout(() => {
   let mentionedJid = [m.sender]
			conn.reply(m.chat, nuyOfc, m, {contextInfo: { mentionedJid }})
		}, 15000)
		
		setTimeout(() => {
		let mentionedJid = [m.sender]
			conn.reply(m.chat, `@${m.sender.replace(/@.+/, '')} Mulai Memancing..`, m, {contextInfo: { mentionedJid }})
		}, 7000)
		
		setTimeout(() => {
		let mentionedJid = [m.sender]
			conn.reply(m.chat, `@${m.sender.replace(/@.+/, '')} Pergi Memancing Ikan Di ${pickRandom(['*Lautan Samudra Atlantik*', '*Lautan Samudra Pasifik*', '*Lautan Samudra Hindia*', '*Empang*', '*Kali*', '*Kobakan*', '*Laut Merah*', '*Segitiga Bermuda*'])}`, m, {contextInfo: { mentionedJid }})
		}, 0)
		
		setTimeout(() => {
			conn.reply(m.chat, `Yuu Sudah Waktunya Mancing Ikan Untuk Makan`, m)
		}, 7200000)
}
handler.tags = ['rpg']
handler.help = ['mancing']
handler.command = /^(mancing)$/i

handler.limit = 1
handler.register = true
export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

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