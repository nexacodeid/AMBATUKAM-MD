/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let type = (args[0] || '').toLowerCase()
    let user = global.db.data.users[m.sender]
    let now = Date.now()
    let cooldown = 600000 // 10 menit

    const daftarPet = {
        fox: { last: 'foxlastclaim', exp: 'foxexp', level: 'fox', food: 'makananpet', namaMakanan: 'Makanan Pet', expPerFeed: 20, expLevelUp: 1000, maxLevel: 100 },
        rubah: { last: 'foxlastclaim', exp: 'foxexp', level: 'rubah', food: 'makananpet', namaMakanan: 'Makanan Pet', expPerFeed: 20, expLevelUp: 1000, maxLevel: 100 },
        horse: { last: 'horselastclaim', exp: 'horseexp', level: 'horse', food: 'makananpet', namaMakanan: 'Makanan Pet', expPerFeed: 20, expLevelUp: 1000, maxLevel: 100 },
        kuda: { last: 'horselastclaim', exp: 'horseexp', level: 'kuda', food: 'makananpet', namaMakanan: 'Makanan Pet', expPerFeed: 20, expLevelUp: 1000, maxLevel: 100 },
        wolf: { last: 'wolflastclaim', exp: 'wolfexp', level: 'wolf', food: 'makananpet', namaMakanan: 'Makanan Pet', expPerFeed: 100, expLevelUp: 1000, maxLevel: 100 },
        serigala: { last: 'wolflastclaim', exp: 'wolfexp', level: 'serigala', food: 'makananpet', namaMakanan: 'Makanan Pet', expPerFeed: 100, expLevelUp: 1000, maxLevel: 100 },
        naga: { last: 'nagalastclaim', exp: 'nagaexp', level: 'naga', food: 'makanannaga', namaMakanan: 'Makanan Naga', expPerFeed: 1000, expLevelUp: 10000, maxLevel: 100 },
        kyubi: { last: 'kyubilastclaim', exp: 'kyubiexp', level: 'kyubi', food: 'makanankyubi', namaMakanan: 'Makanan Kyubi', expPerFeed: 100, expLevelUp: 10000, maxLevel: 100 },
        centaur: { last: 'centaurlastclaim', exp: 'centaurexp', level: 'centaur', food: 'makanancentaur', namaMakanan: 'Makanan Centaur', expPerFeed: 100, expLevelUp: 10000, maxLevel: 100 },
        phonix: { last: 'phonixlastclaim', exp: 'phonixexp', level: 'phonix', food: 'makananphonix', namaMakanan: 'Makanan Phonix', expPerFeed: 100, expLevelUp: 10000, maxLevel: 100 },
        griffin: { last: 'griffinlastclaim', exp: 'griffinexp', level: 'griffin', food: 'makanangriffin', namaMakanan: 'Makanan Griffin', expPerFeed: 10, expLevelUp: 10000, maxLevel: 100 },
        lion: { last: 'lionlastclaim', exp: 'lionexp', level: 'lion', food: 'makananpet', namaMakanan: 'Makanan Pet', expPerFeed: 15, expLevelUp: 100, maxLevel: 100 },
        kucing: { last: 'kucinglastclaim', exp: 'kucingexp', level: 'kucing', food: 'makananpet', namaMakanan: 'Makanan Pet', expPerFeed: 200, expLevelUp: 1000, maxLevel: 100 },
        anjing: { last: 'doglastfeed', exp: 'dogexp', level: 'dog', food: 'petFood', namaMakanan: 'Pet Food', expPerFeed: 20, expLevelUp: 100, maxLevel: 100 },
        rhinoceros: { last: 'rhinoceroslastclaim', exp: 'rhinocerosexp', level: 'rhinoceros', food: 'makananpet', namaMakanan: 'Makanan Pet', expPerFeed: 150, expLevelUp: 100, maxLevel: 100 }
    }

    if (!type || !(type in daftarPet)) {
        let petList = Object.keys(daftarPet).map(p => `› ${p.charAt(0).toUpperCase() + p.slice(1)}`).join('\n')
        return conn.reply(m.chat, `Contoh penggunaan: *${usedPrefix + command} kucing*\n*LIST PET:*\n\n${petList}\n\nContoh: *.feed kucing*`, m)
    }

    let pet = daftarPet[type]
    if ((user[pet.level] || 0) == 0) return m.reply(`*Kamu Tidak Punya Pet ${type}*`)
    if (user[pet.level] >= pet.maxLevel) return m.reply(`*Pet Kamu Sudah Level Max*`)

    let timeSinceFeed = now - (user[pet.last] || 0)
    if (timeSinceFeed < cooldown) {
        let sisa = cooldown - timeSinceFeed
        return m.reply(`Pet Kamu Sudah Kenyang, beri makan lagi dalam ${clockString(sisa)}`)
    }

    if ((user[pet.food] || 0) <= 0) return m.reply(`Makanan (${pet.namaMakanan}) Kamu Tidak Cukup`)

    user[pet.food] -= 1
    user[pet.exp] = (user[pet.exp] || 0) + pet.expPerFeed
    user[pet.last] = now

    conn.reply(m.chat, `Berhasil memberi makan ${type}`, m)

    let expNeeded = (user[pet.level] * pet.expLevelUp)
    if (user[pet.exp] >= expNeeded) {
        user[pet.level] += 1
        user[pet.exp] -= expNeeded
        conn.reply(m.chat, `*Selamat! ${type} Kamu Naik Level!*`, m)
    }
}

handler.help = ['feed']
handler.tags = ['rpg']
handler.command = /^(feed(ing)?)$/i
handler.group = true
handler.register = true
export default handler

function clockString(ms) {
  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `${d} *Hari*\n${h} *Jam*\n${m} *Menit*\n${s} *Detik*`
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