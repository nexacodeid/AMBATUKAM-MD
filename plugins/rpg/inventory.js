/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let handler = async (m, { conn, usedPrefix }) => {

let user = global.db.data.users[m.sender]
let health = user.health
let healt = user.healt
let bararmor = user.bararmor
let barsword = user.barsword
let leather = user.leather
let roket = user.roket
let totalb = user.totalb
let aerozine = user.aerozine
let armor = user.armor
let armordura = user.armordurability
let pancing = user.pancingan
let pancidura = user.pancingandurability
let pet = user.pet
let sarung = user.glovesuse
let sepatu = user.sepatuuse
let topi = user.magichatsuse
let kucing = user.kucing
let stamina = user.stamina
let rubah = user.rubah
let serigala = user.serigala
let naga = user.naga
let coal = user.coal
let kuda = user.kuda
let phonix = user.phonix
let griffin = user.griffin
let kyubi = user.kyubi
let centaur = user.centaur
let diamond = user.diamond
let sniper = user.sniper
let redam = user.resultdamage
let peluru = user.peluru
let potion = user.potion
let ramuan = user.ramuan
let common = user.common
let uncommon = user.uncommon
let mythic = user.mythic
let legendary = user.legendary
let level = user.level
let money = user.money
let exp = user.exp
let role = user.role
let sampah = user.sampah
let anggur = user.anggur
let jeruk = user.jeruk
let apel = user.apel
let mangga = user.mangga
let pisang = user.pisang
let bibitanggur = user.bibitanggur
let bibitjeruk = user.bibitjeruk
let bibitapel = user.bibitapel
let bibitmangga = user.bibitmangga
let bibitpisang = user.bibitpisang
let gardenboxs = user.gardenboxs
let bank = user.bank
let limit = user.limit
let tiketcoin = user.tiketcoin
let tiketm = user.healtmonster
let aqua = user.aqua
let boxs = user.boxs
let botol = user.botol
let kayu = user.kayu
let plastik = user.pelastik
let batu = user.batu
let iron = user.iron
let sword = user.sword
let sworddura = user.sworddurability
let sworddamage = user.sworddamage
let string = user.string
let kaleng = user.kaleng
let kardus = user.kardus
let berlian = user.berlian
let emas = user.emas
let fulls = user.fullstamina
let cash = user.cash

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const armorName = [
  'Tidak punya','Leather Armor','Padded Armor','Studded Leather Armor',
  'Chainmail Armor','Scale Armor','Breastplate','Half Plate Armor',
  'Full Plate Armor','Mithril Armor','Adamantine Armor','Dragonhide Armor',
  'Celestial Armor','Demonic Armor','Divine Armor','Ethereal Armor',
  'Elemental Armor','Phantom Armor','Ancient Armor','Legendary Armor','Godslayer Armor'
]

const swordName = [
  'Tidak punya','Rusty Sword','Iron Sword','Steel Sword','Bronze Sword',
  'Silver Sword','Golden Sword','Elven Sword','Dwarven Sword','Katana',
  'Longsword','Claymore','Rapier','Flame Sword','Frost Sword','Thunderblade',
  'Shadow Sword','Lightbringer','Bloodthirster','Dragonfang','Soulreaper',
  'Ethereal Blade','Mystic Blade','Holy Sword','Demonic Blade','Legendary Sword',
  'Excalibur','Godslayer','Celestial Sword','Phantom Blade','Ancient Blade'
]

const petLevel = (val, max) => val === 0 ? 'Tidak Punya' : val >= max ? 'Level MAX' : `Level ${val} / Max Level ${max}`

let mentionedJid = [m.sender]
let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/8915442b3e2e1a82a8100.jpg')

let str = `
[ 𝙄 𝙣 𝙫 𝙚 𝙣 𝙩 𝙤 𝙧 𝙮 ]

*〔 Condition 〕*
👤 *User :* @${m.sender.replace(/@.+/, '')}
❤️ *Health :* ${healt.toLocaleString()} | ${health.toLocaleString()}
🛡️ *Stamina :* ${stamina.toLocaleString()} | ${fulls.toLocaleString()}
💉 *Potion :* ${potion.toLocaleString()}
🔮 *Ramuan :* ${ramuan}
🎣 *Pancingan :* ${pancing === 1 ? 'Equip ✓' : 'Tidak Punya'}
🎣 *Pancingan Durability :* ${pancidura}
${readMore}
*〔 Equipment 〕*
🧥 *Armor :* ${armorName[armor] ?? 'Tidak punya'}
🦺 *Armor Durability :* ${armordura.toLocaleString()} / ${bararmor.toLocaleString()}
👒 *Topi Sihir :* ${topi === 1 ? 'Equip ✓' : 'Unequip'}
🧤 *Sarung Tangan :* ${sarung === 1 ? 'Equip ✓' : 'Unequip'}
👞 *Sepatu Sihir :* ${sepatu === 1 ? 'Equip ✓' : 'Unequip'}

*〔 Senjata 〕*
⚔️ *Sword :* ${swordName[sword] ?? 'Tidak punya'}
🗡️ *Sword Durability :* ${sworddura.toLocaleString()} / ${barsword.toLocaleString()}
💥 *Damage Sword :* ${sworddamage.toLocaleString()}
💥 *Damage Result :* ${redam.toLocaleString()}
🦯 *Sniper :* ${sniper === 1 ? 'Equip ✓' : 'Tidak Punya'}
🖍️ *Peluru :* ${peluru.toLocaleString()}

*〔 Astronot 〕*
🚀 *Roket :* ${roket === 1 ? 'Equip ✓' : 'Tidak Punya'}
🛢️ *Aerozine :* ${aerozine.toLocaleString()}
👨🏻‍🚀 *Total Berangkat :* ${totalb.toLocaleString()}

*〔 Your Ranking 〕*
🎖️ *Role :* ${role}
📊 *Level :* ${level.toLocaleString()}
🧪 *Exp :* ${exp.toLocaleString()}

*〔 Rekening 〕*
💵 *Money :* Rp.${money.toLocaleString()}
💳 *Limit :* ${limit.toLocaleString()}
🏦 *Bank :* Rp.${bank.toLocaleString()}
💰 *Cash :* Rp.${cash.toLocaleString()}

*〔 Item 〕*
⚙️ *Iron :* ${iron.toLocaleString()}
🧶 *String :* ${string.toLocaleString()}
🪣 *Sampah :* ${sampah.toLocaleString()}
🪵 *Kayu :* ${kayu.toLocaleString()}
🪨 *Batu :* ${batu.toLocaleString()}
🍾 *Aqua :* ${aqua.toLocaleString()}
🪨 *Coal :* ${coal.toLocaleString()}
🧣 *Leather :* ${leather.toLocaleString()}

*〔 Kotak Harta 〕*
📦 *Boxs :* ${boxs.toLocaleString()}
📦 *Common :* ${common.toLocaleString()}
📦 *Uncommon :* ${uncommon.toLocaleString()}
👑 *Mythic :* ${mythic.toLocaleString()}
💎 *Legendary :* ${legendary.toLocaleString()}
🐶 *Pet Boxs :* ${pet.toLocaleString()}
💍 *Gardenboxs :* ${gardenboxs.toLocaleString()}
💸 *Tiketm :* ${tiketm.toLocaleString()}
💰 *Tiketcoin :* ${tiketcoin.toLocaleString()}

*〔 Buah-Buahan 〕*
🥭 *Mangga :* ${mangga.toLocaleString()}
🍇 *Anggur :* ${anggur.toLocaleString()}
🍌 *Pisang :* ${pisang.toLocaleString()}
🍊 *Jeruk :* ${jeruk.toLocaleString()}
🍎 *Apel :* ${apel.toLocaleString()}

*〔 Bibit Buah 〕*
🥭 *Bibit Mangga :* ${bibitmangga.toLocaleString()}
🍇 *Bibit Anggur :* ${bibitanggur.toLocaleString()}
🍌 *Bibit Pisang :* ${bibitpisang.toLocaleString()}
🍊 *Bibit Jeruk :* ${bibitjeruk.toLocaleString()}
🍎 *Bibit Apel :* ${bibitapel.toLocaleString()}

*〔 Sampah 〕*
📦 *Kardus :* ${kardus.toLocaleString()}
🗑️ *Kaleng :* ${kaleng.toLocaleString()}
🍾 *Botol :* ${botol.toLocaleString()}
🥡 *Plastik :* ${plastik.toLocaleString()}

*〔 Mining Result 〕*
💍 *Berlian :* ${berlian.toLocaleString()}
🪙 *Emas :* ${emas.toLocaleString()}
💎 *Diamond :* ${diamond.toLocaleString()}

*〔 Pet 〕*
🐈 *Kucing :* ${petLevel(kucing, 5)}
🐎 *Kuda :* ${petLevel(kuda, 5)}
🦊 *Rubah :* ${petLevel(rubah, 5)}
🐉 *Naga :* ${petLevel(naga, 20)}
🦊 *Kyubi :* ${petLevel(kyubi, 20)}
🦖 *Centaur :* ${petLevel(centaur, 20)}
🕊️ *Phonix :* ${petLevel(phonix, 15)}
🦅 *Griffin :* ${petLevel(griffin, 15)}
🐺 *Serigala :* ${petLevel(serigala, 15)}
`.trim()

await conn.sendMessage(m.chat, {
  image: { url: pp },
  caption: str,
  mentions: mentionedJid
}, { quoted: m })

}

handler.help = ['inv']
handler.tags = ['rpg']
handler.command = /^(inv|inventory)$/i
handler.register = true
handler.limit = false
handler.group = false

export default handler

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */