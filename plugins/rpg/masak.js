/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, {
	conn,
	command,
	usedPrefix,
	DevMode,
	args
}) => {
	let type = (args[0] || '').toLowerCase()
    let msk = (args[0] || '').toLowerCase()
    let user = global.db.data.users[m.sender]
    let coal = user.coal
    let author = global.author
let cok = `
【 *_Menu Makanan_* 】

❅🍖 *Ayam Bakar*
❅🍗 *Ayam Goreng*
❅🍜 *Opor Ayam*
❅🥩 *Steak*
❅🥘 *Rendang*
❅🍲 *Gulai Ayam*
❅🥠 *Babi Panggang*
❅🐟 *Ikan Bakar*
❅🐟 *Lele Bakar*
❅🐟 *Nila Bakar*
❅🐟 *Bawal Bakar*
❅🦐 *Udang Bakar*
❅🐳 *Paus Bakar*
❅🦀 *Kepiting Bakar*

【 *_Menu Minuman_* 】

❅🍌 *Jus Pisang*
❅🍎 *Jus Apel*
❅🥭 *Jus Mangga*
❅🍇 *Jus Anggur*
❅🍊 *Jus Jeruk*

*Coal Kamu:* ${coal}

Contoh Menggunaan
.masak ayambakar
`

try {
       if (/masak|cook/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
            switch (type) {
            	case 'ayambakar':
            if (user.ayam < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak ayam bakar\nAnda butuh 2 ayam dan 1 coal untuk memasak`)
                           user.ayam >= count * 1
                            user.ayam -= count * 2
                            user.coal -= count * 1
                            user.ayambakar += count * 1
                            conn.reply(m.chat, `Sukses memasak ${count} ayam bakar🍖`, m)
					break
				  case 'gulaiayam':
            if (user.ayam < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak gulai ayam\nAnda butuh 2 ayam dan 1 coal untuk memasak`)
                            user.ayam >= count * 1
                            user.ayam -= count * 2
                            user.coal -= count * 1
                            user.gulai += count * 1
                            conn.reply(m.chat, `Sukses memasak ${ count } Gulai Ayam🍜`, m)
                       
					break
                  case 'rendang':
            if (user.sapi < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak dimasak rendang\nAnda butuh 2 sapi dan 1 coal untuk memasak`)
                            user.sapi >= count * 1
                            user.sapi -= count * 2
                            user.coal -= count * 1
                            user.rendang += count * 1
                            conn.reply(m.chat, `Sukses memasak ${ count } Rendang 🍜`, m)
                    
					break
                   case 'ayamgoreng':
            if (user.ayam < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak ayam goreng\nAnda butuh 2 ayam dan 1 coal untuk memasak`)
                           user.ayam >= count * 1
                            user.ayam -= count * 2
                            user.coal -= count * 1
                            user.ayamgoreng += count * 1
                            conn.reply(m.chat, `Sukses memasak ${ count } ayam goreng🍗`, m)
                    
					break
                        case 'oporayam':
            if (user.lele < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak opor ayam\nAnda butuh 2 ayam dan 1 coal untuk memasak`)
                          user.lele >= count * 1
                            user.lele -= count * 2
                            user.coal -= count * 1
                            user.oporayam += count * 1
                            conn.reply(m.chat, `Sukses memasak ${ count } opor ayam`, m)
                    
					break
                        case 'steak':
            if (user.sapi < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak steak\nAnda butuh 2 sapi dan 1 coal untuk memasak`)
                            user.sapi >= count * 1
                            user.sapi -= count * 2
                            user.coal -= count * 1
                            user.steak += count * 1
                            conn.reply(m.chat, `Sukses memasak ${ count } Steak`, m)
                 
				break
             case 'babipanggang':
            if (user.babi < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak babi panggang\nAnda butuh 2 babi dan 1 coal untuk memasak`)
                            user.babi >= count * 1
                            user.babi -= count * 2
                            user.coal -= count * 1
                            user.babipanggang += count * 1
                            conn.reply(m.chat, `Sukses memasak ${ count } babi panggang`, m)
                   
				break
				case 'ikanbakar':
            if (user.ikan < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak ikan bakar\nAnda butuh 2 ikan dan 1 coal untuk memasak`)
                           user.ikan >= count * 1
                            user.ikan -= count * 2
                            user.coal -= count * 1
                            user.ikanbakar += count * 1
                            conn.reply(m.chat, `Sukses memasak ${count} ikan bakar🍖`, m)
            
					break
					case 'lelebakar':
            if (user.lele < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak lele bakar\nAnda butuh 2 lele dan 1 coal untuk memasak`)
                           user.lele >= count * 1
                            user.lele -= count * 2
                            user.coal -= count * 1
                            user.lelebakar += count * 1
                            conn.reply(m.chat, `Sukses memasak ${count} lele bakar🍖`, m)
         
					break
					case 'nilabakar':
            if (user.nila < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak nila bakar\nAnda butuh 2 nila dan 1 coal untuk memasak`)
                           user.nila >= count * 1
                            user.nila -= count * 2
                            user.coal -= count * 1
                            user.nilabakar += count * 1
                            conn.reply(m.chat, `Sukses memasak ${count} nila bakar🍖`, m)
     
					break
					case 'bawalbakar':
            if (user.bawal < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak bawal bakar\nAnda butuh 2 bawal dan 1 coal untuk memasak`)
                           user.bawal >= count * 1
                            user.bawal -= count * 2
                            user.coal -= count * 1
                            user.bawalbakar += count * 1
                            conn.reply(m.chat, `Sukses memasak ${count} bawal bakar🍖`, m)
  
					break
					case 'udangbakar':
            if (user.udang < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak udang bakar\nAnda butuh 2 udang dan 1 coal untuk memasak`)
                           user.udang >= count * 1
                            user.udang -= count * 2
                            user.coal -= count * 1
                            user.udangbakar += count * 1
                            conn.reply(m.chat, `Sukses memasak ${count} udang bakar🍖`, m)
  
					break
					case 'pausbakar':
            if (user.paus < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak paus bakar\nAnda butuh 2 paus dan 1 coal untuk memasak`)
                           user.paus >= count * 1
                            user.paus -= count * 2
                            user.coal -= count * 1
                            user.pausbakar += count * 1
                            conn.reply(m.chat, `Sukses memasak ${count} paus bakar🍖`, m)
     
					break
					case 'kepitingbakar':
            if (user.kepiting < count * 2 || user.coal < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk memasak kepiting bakar\nAnda butuh 2 kepiting dan 1 coal untuk memasak`)
                           user.kepiting >= count * 1
                            user.kepiting -= count * 2
                            user.coal -= count * 1
                            user.kepitingbakar += count * 1
                            conn.reply(m.chat, `Sukses memasak ${count} kepiting bakar🍖`, m)
    
					break
					case 'juspisang':
            if (user.pisang < count * 2 || user.aqua < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk membuat jus\nAnda butuh 2 buah 🍌 pisang dan 1 aqua untuk membuat jus`)
                           user.pisang >= count * 1
                            user.pisang -= count * 2
                            user.aqua -= count * 1
                            user.juspisang += count * 1
                            conn.reply(m.chat, `Sukses membuat ${count} jus 🍌 Pisang`, m)
    
					break
					case 'jusapel':
            if (user.apel < count * 2 || user.aqua < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk membuat jus\nAnda butuh 2 buah 🍎 apel dan 1 aqua untuk membuat jus`)
                           user.apel >= count * 1
                            user.apel -= count * 2
                            user.aqua -= count * 1
                            user.jusapel += count * 1
                            conn.reply(m.chat, `Sukses membuat ${count} jus 🍎 Apel`, m)
    
					break
					case 'jusjeruk':
            if (user.jeruk < count * 2 || user.aqua < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk membuat jus\nAnda butuh 2 buah 🍊 jeruk dan 1 aqua untuk membuat jus`)
                           user.jeruk >= count * 1
                            user.jeruk -= count * 2
                            user.aqua -= count * 1
                            user.jusjeruk += count * 1
                            conn.reply(m.chat, `Sukses membuat ${count} jus 🍊 Jeruk`, m)
    
					break
					case 'jusmangga':
            if (user.mangga < count * 2 || user.aqua < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk membuat jus\nAnda butuh 2 buah 🥭 mangga dan 1 aqua untuk membuat jus`)
                           user.mangga >= count * 1
                            user.mangga -= count * 2
                            user.aqua -= count * 1
                            user.jusmangga += count * 1
                            conn.reply(m.chat, `Sukses membuat ${count} jus 🥭 Mangga`, m)
    
					break
					case 'jusanggur':
            if (user.anggur < count * 2 || user.aqua < 1 * count) return m.reply(`Anda tidak memiliki bahan untuk membuat jus\nAnda butuh 2 buah 🍇 anggur dan 1 aqua untuk membuat jus`)
                           user.anggur >= count * 1
                            user.anggur -= count * 2
                            user.aqua -= count * 1
                            user.jusanggur += count * 1
                            conn.reply(m.chat, `Sukses membuat ${count} jus 🍇 Anggur`, m)
    
					break
                default:
                await conn.sendMessage(m.chat, { text: cok })
            }
        }
    } catch (e) {
        conn.reply(m.chat, `Sepertinya ada yg eror,coba laporin ke owner deh`, m)
        console.log(e)
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.sendMessage(jid, { text: 'shop.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*' })
            }
        }
    }
}

handler.help = ['masak <masakan> <jumlah>', 'cook <masakan> <jumlah>']
handler.tags = ['rpg']
handler.command = /^(masak|cook)$/i
handler.register = true
handler.group = true

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