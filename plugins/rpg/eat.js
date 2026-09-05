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
	command,
	usedPrefix,
	args
}) => {
	let user = global.db.data.users[m.sender]
	let author = global.author
	let upgrd = (args[0] || '').toLowerCase()
    let type = (args[0] || '').toLowerCase()
    let _type = (args[1] || '').toLowerCase()
    let jualbeli = (args[0] || '').toLowerCase()
    let ayamba = global.db.data.users[m.sender].ayambakar
    let ayamgo = global.db.data.users[m.sender].ayamgoreng
    let renda = global.db.data.users[m.sender].rendang
    let stea = global.db.data.users[m.sender].steak
    let babipangga = global.db.data.users[m.sender].babipanggang
    let gulaiaya = global.db.data.users[m.sender].gulaiayam
    let oporay = global.db.data.users[m.sender].ayamgoreng
    let rotie = global.db.data.users[m.sender].roti
    let ikanbaka = global.db.data.users[m.sender].ikanbakar
    let nilabaka = global.db.data.users[m.sender].nilabakar
    let lelebaka = global.db.data.users[m.sender].lelebakar
    let bawalbaka = global.db.data.users[m.sender].bawalbakar
    let udangbaka = global.db.data.users[m.sender].udangbakar
    let pausbaka = global.db.data.users[m.sender].pausbakar
    let kepitibaka = global.db.data.users[m.sender].kepitingbakar 
    let jusp = global.db.data.users[m.sender].juspisang
    let jusa = global.db.data.users[m.sender].jusapel
    let jusj = global.db.data.users[m.sender].jusjeruk
    let jusm = global.db.data.users[m.sender].jusmangga
    let jusan = global.db.data.users[m.sender].jusanggur
    const list = `
╭──『 _Makanan_ 』
│•🍗 *Ayam Bakar :*    ${ayamba}
│•🍗 *Ayam Goreng :*    ${ayamgo}
│•🍲 *Rendang :*    ${renda}
│•🥩 *Steak :*    ${stea}
│•🍖 *Babi Panggang :*    ${babipangga}
│•🍲 *Gulai Ayam :*    ${gulaiaya}
│•🍲 *Opor Ayam :*    ${oporay}
│•🍞 *Roti :*    ${rotie}
│•🐟 *Ikan Bakar :*    ${ikanbaka}
│•🐟 *Lele Bakar :*    ${lelebaka}
│•🐟 *Nila Bakar :*    ${nilabaka}
│•🐟 *Bawal Bakar :*    ${bawalbaka}
│•🍤 *Udang Bakar :*    ${udangbaka}
│•🐋 *Paus Bakar :*    ${pausbaka}
│•🦀 *Kepiting Bakar :*    ${kepitibaka}
╰───────────────

╭──『 _Minuman_ 』
│•🍌 *Jus Pisang :*    ${jusp}
│•🍎 *Jus Apel :*    ${jusa}
│•🍊 *Jus Jeruk :*    ${jusj}
│•🥭 *Jus Mangga :*    ${jusm}
│•🍇 *Jus Anggur :*    ${jusan}
╰───────────────

*Contoh:*
_.makan ayambakar_
_.minum juspisang_
`.trim()
    //try {
    if (/makan|minum/i.test(command)) {
      let count = args[1] && args[1].length > 0 ? Math.min(5, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
      let juice = (count == 1 ? 10 : '' || count == 2 ? 20 : '' || count == 3 ? 30 : '' || count == 4 ? 40 : '' || count == 5 ? 50 : '')
      let foods = (count == 1 ? 20 : '' || count == 2 ? 40 : '' || count == 3 ? 60 : '' || count == 4 ? 80 : '' || count == 5 ? 100 : '')
        switch (type) {
          case 'ayamgoreng':
        if (user.stamina < user.fullstamina) {
        	if (user.ayamgoreng >= count * 1) {
                            user.ayamgoreng -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Ayam goreng kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'ayambakar':
        if (user.stamina < user.fullstamina) {
        	if (user.ayambakar >= count * 1) {
                            user.ayambakar -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Ayam bakar kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'oporayam':
        if (user.stamina < user.fullstamina) {
        	if (user.oporayam >= count * 1) {
                            user.oporayam -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Opor ayam kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'rendang':
        if (user.stamina < user.fullstamina) {
        	if (user.rendang >= count * 1) {
                            user.rendang -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Rendang kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'steak':
        if (user.stamina < user.fullstamina) {
        	if (user.steak >= count * 1) {
                            user.steak -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Steak kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'gulaiayam':
        if (user.stamina < user.fullstamina) {
        	if (user.gulaiayam >= count * 1) {
                            user.gulaiayam -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Gulai ayam kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'babipanggang':
        if (user.stamina < user.fullstamina) {
        	if (user.babipanggang >= count * 1) {
                            user.babipanggang -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Babi panggang kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'soda':
        if (user.stamina < user.fullstamina) {
        	if (user.soda >= count * 1) {
                            user.soda -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Glek glek glek`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Soda kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'vodka':
        if (user.stamina < user.fullstamina) {
        	if (user.vodka >= count * 1) {
                            user.vodka -= count * 1
                            user.stamina += 25 * count
                            conn.reply(m.chat, `Glek Glek Glek`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Vodka kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'ganja':
        if (user.stamina < user.fullstamina) {
        	if (user.ganja >= count * 1) {
                            user.ganja -= count * 1
                            user.healt += 90 * count
                            conn.reply(m.chat, `ngefly`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Ganja kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'bandage':
        if (user.stamina < user.fullstamina) {
        	if (user.bandage >= count * 1) {
                            user.bandage -= count * 1
                            user.healt += 25 * count
                            conn.reply(m.chat, `Sretset`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Bandage kamu kurang` ,m)
        } else conn.reply( m.chat, `Healt kamu sudah penuh`, m)
        break
        case 'sushi':
        if (user.stamina < user.fullstamina) {
        	if (user.sushi >= count * 1) {
                            user.sushi -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Sushi kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        break
        case 'roti':
        if (user.stamina < user.fullstamina) {
        	if (user.roti >= count * 1) {
                            user.roti -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` Roti kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'ikanbakar':
        if (user.stamina < user.fullstamina) {
        	if (user.ikanbakar >= count * 1) {
                            user.ikanbakar -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` ikan bakar kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'lelebakar':
        if (user.stamina < user.fullstamina) {
        	if (user.lelebakar >= count * 1) {
                            user.lelebakar -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` lele bakar kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'nilabakar':
        if (user.stamina < user.fullstamina) {
        	if (user.nilabakar >= count * 1) {
                            user.nilabakar -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` nila bakar kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'bawalbakar':
        if (user.stamina < user.fullstamina) {
        	if (user.bawalbakar >= count * 1) {
                            user.bawalbakar -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` bawal bakar kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'udangbakar':
        if (user.stamina < user.fullstamina) {
        	if (user.udangbakar >= count * 1) {
                            user.udangbakar -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` udang bakar kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'pausbakar':
        if (user.stamina < user.fullstamina) {
        	if (user.pausbakar >= count * 1) {
                            user.pausbakar -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` paus bakar kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'kepitingbakar':
        if (user.stamina < user.fullstamina) {
        	if (user.kepitingbakar >= count * 1) {
                            user.kepitingbakar -= count * 1
                            user.stamina += 20 * count
                            conn.reply(m.chat, `Eumm Lezatt😋\n🛡️ Stamina +${foods}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, ` kepiting bakar kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'juspisang':
        if (user.stamina < user.fullstamina) {
        	if (user.juspisang >= count * 1) {
                            user.juspisang -= count * 1
                            user.stamina += 10 * count
                            conn.reply(m.chat, `Eumm Seger🤤\n🛡️ Stamina +${juice}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, `Jus 🍌 Pisang kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'jusapel':
        if (user.stamina < user.fullstamina) {
        	if (user.jusapel >= count * 1) {
                            user.jusapel -= count * 1
                            user.stamina += 10 * count
                            conn.reply(m.chat, `Eumm Seger🤤\n🛡️ Stamina +${juice}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, `Jus 🍎 Apel kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'jusjeruk':
        if (user.stamina < user.fullstamina) {
        	if (user.jusjeruk >= count * 1) {
                            user.jusjeruk -= count * 1
                            user.stamina += 10 * count
                            conn.reply(m.chat, `Eumm Seger🤤\n🛡️ Stamina +${juice}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, `Jus 🍊 Jeruk kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'jusmangga':
        if (user.stamina < user.fullstamina) {
        	if (user.jusmangga >= count * 1) {
                            user.jusmangga -= count * 1
                            user.stamina += 10 * count
                            conn.reply(m.chat, `Eumm Seger🤤\n🛡️ Stamina +${juice}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, `Jus 🥭 Mangga kamu kurang` ,m)
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
        case 'jusanggur':
        if (user.stamina < user.fullstamina) {
        	if (user.jusanggur >= count * 1) {
                            user.jusanggur -= count * 1
                            user.stamina += 10 * count
                            conn.reply(m.chat, `Eumm Seger🤤\n🛡️ Stamina +${juice}`, m)
                            if (user.stamina > user.fullstamina) user.stamina = user.fullstamina
                            } else conn.reply(m.chat, `Jus 🍇 Anggur kamu kurang` ,m)
                            
        } else conn.reply( m.chat, `Stamina kamu sudah penuh`, m)
        break
          default:
       await conn.reply(m.chat, list, m)
            }
    } else if (/p/i.test(command)) {
      const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 :Math.min(1, count)
      switch (_type) {
        case 'p':
         break
         default:
		return conn.reply(m.chat, list,m)
         }
                            
        console.log(e)
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
            conn.reply(jid, 'shop.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*',m)
                
            }
        }
    }
}

handler.help = ['makan']
handler.tags = ['rpg']
handler.register = true
handler.group = true
handler.command = /^(minum|makan)$/i
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