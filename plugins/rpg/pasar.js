/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const Skepiting = 15000
const Slobster = 15000
const Sudang = 12000
const Scumi = 13000
const Sgurita = 50000
const Sbuntal = 20000
const Sdory = 16000
const Sorca = 15000
const Slumba = 50000
const Spaus = 60000
const Sikan = 12000
const Shiu = 60000
const Sbanteng = 40000
const Sharimau = 45000
const Sgajah = 55000
const Skambing = 25000
const Spanda = 34000
const Sbuaya = 30000
const Skerbau = 43000
const Ssapi= 53000
const Smonyet = 24000
const Sbabihutan = 34000
const Sbabi = 30000
const Sayam = 13000
let handler  = async (m, { conn, command, args, usedPrefix, DevMode }) => {
    const _armor = global.db.data.users[m.sender].armor
    const armor = (_armor == 0 ? 20000 : '' || _armor == 1 ? 49999 : '' || _armor == 2 ? 99999 : '' || _armor == 3 ? 149999 : '' || _armor == 4 ? 299999 : '')
    let type = (args[0] || '').toLowerCase()
    let _type = (args[1] || '').toLowerCase()
    let jualbeli = (args[0] || '').toLowerCase()
    const Kchat = `
*Hewan Darat | Harga Jual*

🐃 *Banteng :*      ${Sbanteng}
🐅 *Harimau :*      ${Sharimau}
🐘 *Gajah :*      ${Sgajah}
🐐 *Kambing :*      ${Skambing}
🐼 *Panda :*      ${Spanda}
🐂 *Kerbau :*      ${Skerbau}
🐊 *Buaya :*      ${Sbuaya}
🐄 *Sapi :*      ${Ssapi}
🐒 *Monyet :*      ${Smonyet}
🐗 *Babi Hutan :*      ${Sbabihutan}
🐖 *Babi :*       ${Sbabi}
🐔 *Ayam :*      ${Sayam}


*Contoh :*
.pasar jual ayam
`.trim()
    try {
        if (/pasar|toko/i.test(command)) {
            const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 :Math.min(1, count)
            const sampah = global.db.data.users[m.sender].sampah
            switch (jualbeli) {
            case 'jual': 
                switch (_type) {                  
                     case 'banteng':
                        if (global.db.data.users[m.sender].banteng >= count * 1) {
                            global.db.data.users[m.sender].money += Spaus * count
                            global.db.data.users[m.sender].banteng -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Banteng Dengan Harga ${Sbanteng * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Banteng Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'harimau':
                        if (global.db.data.users[m.sender].harimau >= count * 1) {
                            global.db.data.users[m.sender].money += Sharimau * count
                            global.db.data.users[m.sender].harimau -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Harimau Dengan Harga ${Sharimau * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Harimau Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'gajah':
                        if (global.db.data.users[m.sender].gajah >= count * 1) {
                            global.db.data.users[m.sender].money += Sgajah * count
                            global.db.data.users[m.sender].gajah -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Gajah Dengan Harga ${Sgajah * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Gajah Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'kambing':
                        if (global.db.data.users[m.sender].kambing >= count * 1) {
                            global.db.data.users[m.sender].money += Skambing * count
                            global.db.data.users[m.sender].kambing -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Kambing Dengan Harga ${Skambing * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Kambing Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'panda':
                        if (global.db.data.users[m.sender].panda >= count * 1) {
                            global.db.data.users[m.sender].money += Spanda * count
                            global.db.data.users[m.sender].panda -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Panda Dengan Harga ${Sbuaya * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Panda Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'buaya':
                        if (global.db.data.users[m.sender].buaya >= count * 1) {
                            global.db.data.users[m.sender].money += Sbuaya * count
                            global.db.data.users[m.sender].buaya -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Buaya Dengan Harga ${Sbuaya * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Buaya Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'kerbau':
                        if (global.db.data.users[m.sender].kerbau >= count * 1) {
                            global.db.data.users[m.sender].money += Skerbau * count
                            global.db.data.users[m.sender].kerbau -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Kerbau Dengan Harga ${Skerbau * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Kerbau Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'sapi':
                        if (global.db.data.users[m.sender].sapi >= count * 1) {
                            global.db.data.users[m.sender].money += Ssapi * count
                            global.db.data.users[m.sender].sapi -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Sapi Dengan Harga ${Ssapi * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Sapi Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'monyet':
                        if (global.db.data.users[m.sender].monyet >= count * 1) {
                            global.db.data.users[m.sender].money += Smonyet * count
                            global.db.data.users[m.sender].monyet -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Monyet Dengan Harga ${Smonyet * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Monyet Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'babi':
                        if (global.db.data.users[m.sender].babi >= count * 1) {
                            global.db.data.users[m.sender].money += Skepiting * count
                            global.db.data.users[m.sender].babi -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Babi Dengan Harga ${Sbabi * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Babi Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'babihutan':
                        if (global.db.data.users[m.sender].babihutan >= count * 1) {
                            global.db.data.users[m.sender].money += Sbabihutan * count
                            global.db.data.users[m.sender].babihutan -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Babi Hutan Dengan Harga ${Sbabihutan * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Babi Hutan Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'ayam':
                        if (global.db.data.users[m.sender].ayam >= count * 1) {
                            global.db.data.users[m.sender].money += Sayam * count
                            global.db.data.users[m.sender].ayam -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Ayam Dengan Harga ${Sayam * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Ayam Kamu Tidak Cukup`.trim(), m)
                        break
                        //mancing
                    default:
                        return conn.reply(m.chat, Kchat, m)
                }
                break
            default:
                return conn.reply(m.chat, Kchat, m)
            }
        } else if (/sell|jual|/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
            switch (type) { 
                       case 'banteng':
                        if (global.db.data.users[m.sender].banteng >= count * 1) {
                            global.db.data.users[m.sender].money += Spaus * count
                            global.db.data.users[m.sender].banteng -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Banteng Dengan Harga ${Sbanteng * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Banteng Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'harimau':
                        if (global.db.data.users[m.sender].harimau >= count * 1) {
                            global.db.data.users[m.sender].money += Sharimau * count
                            global.db.data.users[m.sender].harimau -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Harimau Dengan Harga ${Sharimau * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Harimau Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'gajah':
                        if (global.db.data.users[m.sender].gajah >= count * 1) {
                            global.db.data.users[m.sender].money += Sgajah * count
                            global.db.data.users[m.sender].gajah -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Gajah Dengan Harga ${Sgajah * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Gajah Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'kambing':
                        if (global.db.data.users[m.sender].kambing >= count * 1) {
                            global.db.data.users[m.sender].money += Skambing * count
                            global.db.data.users[m.sender].kambing -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Kambing Dengan Harga ${Skambing * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Kambing Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'panda':
                        if (global.db.data.users[m.sender].panda >= count * 1) {
                            global.db.data.users[m.sender].money += Spanda * count
                            global.db.data.users[m.sender].panda -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Panda Dengan Harga ${Sbuaya * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Panda Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'buaya':
                        if (global.db.data.users[m.sender].buaya >= count * 1) {
                            global.db.data.users[m.sender].money += Sbuaya * count
                            global.db.data.users[m.sender].buaya -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Buaya Dengan Harga ${Sbuaya * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Buaya Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'kerbau':
                        if (global.db.data.users[m.sender].kerbau >= count * 1) {
                            global.db.data.users[m.sender].money += Skerbau * count
                            global.db.data.users[m.sender].kerbau -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Kerbau Dengan Harga ${Skerbau * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Kerbau Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'sapi':
                        if (global.db.data.users[m.sender].sapi >= count * 1) {
                            global.db.data.users[m.sender].money += Ssapi * count
                            global.db.data.users[m.sender].sapi -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Sapi Dengan Harga ${Ssapi * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Sapi Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'monyet':
                        if (global.db.data.users[m.sender].monyet >= count * 1) {
                            global.db.data.users[m.sender].money += Smonyet * count
                            global.db.data.users[m.sender].monyet -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Monyet Dengan Harga ${Smonyet * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Monyet Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'babi':
                        if (global.db.data.users[m.sender].babi >= count * 1) {
                            global.db.data.users[m.sender].money += Sbabi * count
                            global.db.data.users[m.sender].babi -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Babi Dengan Harga ${Sbabi * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Babi Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'babihutan':
                        if (global.db.data.users[m.sender].babihutan >= count * 1) {
                            global.db.data.users[m.sender].money += Sbabihutan * count
                            global.db.data.users[m.sender].babihutan -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Babi Hutan Dengan Harga ${Sbabihutan * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Babi Hutan Kamu Tidak Cukup`.trim(), m)
                        break
                        case 'ayam':
                        if (global.db.data.users[m.sender].ayam >= count * 1) {
                            global.db.data.users[m.sender].money += Sayam * count
                            global.db.data.users[m.sender].ayam -= count * 1
                            conn.reply(m.chat, `Sukses Menjual ${count} Ayam Dengan Harga ${Sayam * count} Money `.trim(), m)
                        } else conn.reply(m.chat, `Ayam Kamu Tidak Cukup`.trim(), m)
                        break
                        //mancing
                        
                default:
                    return conn.reply(m.chat, Kchat, m)
            }
        }
    } catch (e) {
        conn.reply(m.chat, Kchat, m)
        console.log(e)
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.reply(jid, 'shop.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m)
            }
        }
    }
}

handler.help = ['pasar']
handler.tags = ['rpg']
handler.command = /^(pasar|jual)$/i
handler.group = true
handler.register = true
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