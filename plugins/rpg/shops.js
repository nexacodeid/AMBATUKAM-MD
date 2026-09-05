const SHOP_ITEMS = {
  potion: { buy: 15000, sell: 2000, emoji: '🥤', category: 'basic' },
  diamond: { buy: 100000, sell: 10000, emoji: '💎', category: 'basic' },
  coal: { buy: 25000, sell: 12000, emoji: '🪵', category: 'basic' },
  sampah: { buy: 12200, sell: 592, emoji: '🗑️', category: 'basic' },
  string: { buy: 40000, sell: 5000, emoji: '🕸️', category: 'basic' },
  iron: { buy: 60000, sell: 5000, emoji: '⚙️', category: 'basic' },
  batu: { buy: 5000, sell: 500, emoji: '🪨', category: 'basic' },
  botol: { buy: 10000, sell: 5000, emoji: '🍶', category: 'basic' },
  kaleng: { buy: 40000, sell: 8000, emoji: '🥫', category: 'basic' },
  kardus: { buy: 40000, sell: 5000, emoji: '📦', category: 'basic' },
  pelastik: { buy: 60000, sell: 7000, emoji: '🥡', category: 'basic' },
  kayu: { buy: 50000, sell: 4300, emoji: '🪵', category: 'basic' },
  berlian: { buy: 1500000, sell: 10000, emoji: '💍', category: 'basic' },
  emas: { buy: 1000000, sell: 15000, emoji: '🪙', category: 'basic' },
  leather: { buy: 68000, sell: 2000, emoji: '🧣', category: 'basic' },
  topijerami: { buy: 500000, sell: 25000, emoji: '👒', category: 'basic' },

  pisang: { buy: 55000, sell: 1000, emoji: '🍌', category: 'fruits' },
  anggur: { buy: 55000, sell: 1500, emoji: '🍇', category: 'fruits' },
  mangga: { buy: 46000, sell: 1500, emoji: '🥭', category: 'fruits' },
  jeruk: { buy: 60000, sell: 3000, emoji: '🍊', category: 'fruits' },
  apel: { buy: 55000, sell: 4000, emoji: '🍎', category: 'fruits' },

  bibitpisang: { buy: 5500, sell: 500, emoji: '🍌', category: 'seeds' },
  bibitanggur: { buy: 5500, sell: 500, emoji: '🍇', category: 'seeds' },
  bibitmangga: { buy: 5500, sell: 500, emoji: '🥭', category: 'seeds' },
  bibitjeruk: { buy: 5500, sell: 500, emoji: '🍊', category: 'seeds' },
  bibitapel: { buy: 5500, sell: 500, emoji: '🍎', category: 'seeds' },
  gardenboxs: { buy: 950000, sell: 350000, emoji: '📦', category: 'seeds' },

  common: { buy: 600000, sell: 8000, emoji: '📦', category: 'crates' },
  uncommon: { buy: 800000, sell: 3200, emoji: '📦', category: 'crates' },
  mythic: { buy: 4000000, sell: 4000, emoji: '👑', category: 'crates' },
  legendary: { buy: 8000000, sell: 50000, emoji: '💎', category: 'crates' },
  pet: { buy: 1500000, sell: 1000, emoji: '📦', category: 'crates' },
  petbox: { buy: 1500000, sell: 1000, emoji: '🎁', category: 'crates' },

  aqua: { buy: 5000, sell: 1000, emoji: '🥤', category: 'drinks' },

  peluru: { buy: 30000, sell: 2599, emoji: '🖍️', category: 'equipment' },
  aerozine: { buy: 100000, sell: 30000, emoji: '🛢️', category: 'equipment' },
  umpan: { buy: 12000, sell: 1000, emoji: '🍚', category: 'equipment' },

  limit: { buy: 60000, sell: 10000, emoji: '💳', category: 'special' },
  tiketm: { buy: 20000, sell: 10000, emoji: '🎟️', category: 'special' },
  cupon: { buy: 500, sell: 200, emoji: '🎫', category: 'special', currency: 'tiketcoin' },

  makananpet: { buy: 50000, sell: 500, emoji: '🍬', category: 'petfood' },
  makanannaga: { buy: 150000, sell: 10000, emoji: '🐉', category: 'petfood' },
  makanankyubi: { buy: 150000, sell: 10000, emoji: '🦊', category: 'petfood' },
  makanangriffin: { buy: 80000, sell: 5000, emoji: '🦅', category: 'petfood' },
  makananphonix: { buy: 80000, sell: 5000, emoji: '🕊️', category: 'petfood' },
  makanancentaur: { buy: 150000, sell: 10000, emoji: '🦖', category: 'petfood' }
}

const PET_ITEMS = {
  kucing: { price: 2, currency: 'emas', emoji: '🐈', name: 'Kucing', key: 'kucing', health: 100, max: 5 },
  anjing: { price: 2, currency: 'emas', emoji: '🐕', name: 'Anjing', key: 'anjing', health: 100, max: 5 },
  dog: { price: 2, currency: 'emas', emoji: '🐕', name: 'Anjing', key: 'anjing', health: 100, max: 5 },
  kuda: { price: 4, currency: 'emas', emoji: '🐎', name: 'Kuda', key: 'kuda', health: 150, max: 10 },
  rubah: { price: 6, currency: 'emas', emoji: '🦊', name: 'Rubah', key: 'rubah', health: 200, max: 10 },
  wolf: { price: 10, currency: 'emas', emoji: '🐺', name: 'Serigala', key: 'wolf', health: 300, max: 15 },
  serigala: { price: 10, currency: 'emas', emoji: '🐺', name: 'Serigala', key: 'wolf', health: 300, max: 15 },
  robo: { price: 10, currency: 'emas', emoji: '🤖', name: 'Robo', key: 'robo', health: 350, max: 15 },
  lion: { price: 10, currency: 'emas', emoji: '🦁', name: 'Lion', key: 'lion', health: 350, max: 15 },
  rhinoceros: { price: 10, currency: 'emas', emoji: '🦏', name: 'Rhinoceros', key: 'rhinoceros', health: 350, max: 15 },
  badak: { price: 10, currency: 'emas', emoji: '🦏', name: 'Rhinoceros', key: 'rhinoceros', health: 350, max: 15 },
  naga: { price: 15, currency: 'emas', emoji: '🐉', name: 'Naga', key: 'naga', health: 500, max: 20 },
  kyubi: { price: 15, currency: 'emas', emoji: '🦊', name: 'Kyubi', key: 'kyubi', health: 500, max: 20 },
  centaur: { price: 15, currency: 'emas', emoji: '🦖', name: 'Centaur', key: 'centaur', health: 500, max: 20 },
  griffin: { price: 12, currency: 'emas', emoji: '🦅', name: 'Griffin', key: 'griffin', health: 400, max: 15 },
  phonix: { price: 12, currency: 'emas', emoji: '🕊️', name: 'Phonix', key: 'phonix', health: 400, max: 15 },
  phoenix: { price: 12, currency: 'emas', emoji: '🕊️', name: 'Phonix', key: 'phonix', health: 400, max: 15 }
}

const EQUIPMENT_LEVELS = {
  armor: {
    levels: [500000, 1500000, 3000000, 6500000, 8500000, 17000000, 24000000, 40000000, 70000000, 160000000, 320000000, 600000000, 800000000, 1000000000, 1500000000, 3000000000, 5000000000, 7000000000, 9000000000, 14000000000],
    maxLevel: 20,
    emoji: '🧥'
  },
  sword: {
    levels: [300000, 550000, 850000, 1200000, 2400000, 999999, 1499999, 4000000, 6500000, 2999999, 3999999, 8000000, 13000000, 16000000, 19000000, 21000000, 25000000, 28000000, 33000000, 38000000, 45000000, 57000000, 70000000, 100000000, 230000000, 430000000, 650000000, 800000000, 1500000000, 3500000000],
    maxLevel: 30,
    emoji: '⚔️'
  }
}

const SPECIAL_ITEMS = {
  pancingan: { price: 500000, emoji: '🎣', unique: true },
  sniper: { price: 500000, emoji: '🦯', unique: true },
  roket: { price: 780000, emoji: '🚀', unique: true }
}

const formatNumber = (num) => Number(num || 0).toLocaleString()

const formatCurrency = (currency) => {
  const map = {
    money: '💰',
    emas: '🪙',
    tiketcoin: '🎫'
  }

  return map[currency] || currency
}

const generateShopDisplay = (userId) => {
  const user = global.db.data.users[userId]
  const money = user.money || 0
  const emas = user.emas || 0
  const tiketcoin = user.tiketcoin || 0

  const categories = {
    special: 'Kebutuhan',
    seeds: 'Bibit Buah',
    basic: 'Barang',
    crates: 'Chest',
    fruits: 'Buah',
    drinks: 'Minuman',
    equipment: 'Equipment',
    petfood: 'Makanan Pet'
  }

  let display = `*🏪 R P G  S H O P*

Penggunaan:
*shop buy <item> <jumlah>*
*shop sell <item> <jumlah>*

Contoh:
*shop buy potion 1*
*shop sell diamond 1*
*shop buy kucing 1*

💰 Money Anda: ${formatNumber(money)}
🪙 Emas Anda: ${formatNumber(emas)}
🎫 Tiketcoin Anda: ${formatNumber(tiketcoin)}

`

  const itemsByCategory = {}
  Object.entries(SHOP_ITEMS).forEach(([key, item]) => {
    if (!itemsByCategory[item.category]) itemsByCategory[item.category] = []
    itemsByCategory[item.category].push({ key, ...item })
  })

  Object.entries(categories).forEach(([categoryKey, categoryName]) => {
    if (!itemsByCategory[categoryKey]) return

    display += `▬▭▬▭▬▭▬▭▬▭▬▭\n`
    display += `*${categoryName} | Harga Beli*\n`

    itemsByCategory[categoryKey].forEach(item => {
      const currency = item.currency || 'money'
      display += `${item.emoji} ${item.key}: ${formatNumber(item.buy)} ${formatCurrency(currency)}\n`
    })

    const sellItems = itemsByCategory[categoryKey].filter(item => item.sell)
    if (sellItems.length > 0) {
      display += `\n*${categoryName} | Harga Jual*\n`
      sellItems.forEach(item => {
        const currency = item.currency || 'money'
        display += `${item.emoji} ${item.key}: ${formatNumber(item.sell)} ${formatCurrency(currency)}\n`
      })
    }

    display += '\n'
  })

  const uniquePets = Object.values(PET_ITEMS)
    .filter((pet, i, arr) => arr.findIndex(x => x.key === pet.key) === i)

  display += `▬▭▬▭▬▭▬▭▬▭▬▭\n`
  display += `*Pet / Hewan | Harga Beli*\n`

  uniquePets.forEach(pet => {
    display += `${pet.emoji} ${pet.key}: ${formatNumber(pet.price)} ${formatCurrency(pet.currency)}\n`
  })

  const armorLevel = user.armor || 0
  const swordLevel = user.sword || 0

  display += `\n▬▭▬▭▬▭▬▭▬▭▬▭\n`
  display += `*Equipment Upgrade*\n`

  if (armorLevel < EQUIPMENT_LEVELS.armor.maxLevel) {
    display += `🧥 armor Lv.${armorLevel}: ${formatNumber(EQUIPMENT_LEVELS.armor.levels[armorLevel])} 💰\n`
  } else {
    display += `🧥 armor: Level MAX\n`
  }

  if (swordLevel < EQUIPMENT_LEVELS.sword.maxLevel) {
    display += `⚔️ sword Lv.${swordLevel}: ${formatNumber(EQUIPMENT_LEVELS.sword.levels[swordLevel])} 💰\n`
  } else {
    display += `⚔️ sword: Level MAX\n`
  }

  display += `\n▬▭▬▭▬▭▬▭▬▭▬▭\n`
  display += `*Item Khusus*\n`

  Object.entries(SPECIAL_ITEMS).forEach(([key, item]) => {
    const currency = item.currency || 'money'
    display += `${item.emoji} ${key}: ${formatNumber(item.price)} ${formatCurrency(currency)}\n`
  })

  return display.trim()
}

const handler = async (m, { conn, args }) => {
  const userId = m.sender
  const user = global.db.data.users[userId]

  if (!user) return conn.reply(m.chat, '❌ Data user tidak ditemukan!', m)

  if (typeof user.money !== 'number') user.money = 0
  if (typeof user.emas !== 'number') user.emas = 0
  if (typeof user.tiketcoin !== 'number') user.tiketcoin = 0

  const action = (args[0] || '').toLowerCase()
  const itemName = (args[1] || '').toLowerCase()
  const count = Math.max(1, parseInt(args[2]) || 1)

  if (!action || !itemName) {
    return conn.reply(m.chat, generateShopDisplay(userId), m)
  }

  if (action === 'buy' || action === 'beli') {
    return handleBuy(conn, m, user, itemName, count)
  }

  if (action === 'sell' || action === 'jual') {
    return handleSell(conn, m, user, itemName, count)
  }

  return conn.reply(m.chat, generateShopDisplay(userId), m)
}

const handleBuy = async (conn, m, user, itemName, count) => {
  if (PET_ITEMS[itemName]) {
    return handleBuyPet(conn, m, user, itemName)
  }

  if (SHOP_ITEMS[itemName]) {
    const item = SHOP_ITEMS[itemName]
    const totalPrice = item.buy * count
    const currency = item.currency || 'money'

    if ((user[currency] || 0) < totalPrice) {
      return conn.reply(m.chat, `❌ ${formatCurrency(currency)} tidak cukup!\nButuh: ${formatNumber(totalPrice)} ${formatCurrency(currency)}`, m)
    }

    user[currency] -= totalPrice
    user[itemName] = (user[itemName] || 0) + count

    return conn.reply(m.chat, `✅ Berhasil membeli ${count}x ${item.emoji} ${itemName}\nHarga: ${formatNumber(totalPrice)} ${formatCurrency(currency)}`, m)
  }

  if (itemName === 'armor') return handleArmorUpgrade(conn, m, user)
  if (itemName === 'sword') return handleSwordUpgrade(conn, m, user)

  if (SPECIAL_ITEMS[itemName]) {
    return handleSpecialItem(conn, m, user, itemName)
  }

  return conn.reply(m.chat, `❌ Item "${itemName}" tidak ditemukan!`, m)
}

const handleBuyPet = (conn, m, user, itemName) => {
  const pet = PET_ITEMS[itemName]
  const currency = pet.currency || 'emas'

  if ((user[pet.key] || 0) > 0) {
    return conn.reply(m.chat, `❌ Kamu sudah punya pet ${pet.emoji} ${pet.name}!`, m)
  }

  if ((user[currency] || 0) < pet.price) {
    return conn.reply(m.chat, `❌ ${formatCurrency(currency)} kamu kurang!\nButuh: ${formatNumber(pet.price)} ${formatCurrency(currency)}`, m)
  }

  user[currency] -= pet.price
  user[pet.key] = 1

  const healtKey = `healt${pet.key}`
  const healthKey = `health${pet.key}`

  user[healtKey] = pet.health
  user[healthKey] = pet.health

  return conn.reply(m.chat, `✅ Berhasil membeli ${pet.emoji} *${pet.name}*!

📈 Level: 1 / Max ${pet.max}
❤️ Health: ${pet.health}/${pet.health}
${formatCurrency(currency)} Sisa: ${formatNumber(user[currency])}`, m)
}

const handleSell = async (conn, m, user, itemName, count) => {
  if (!SHOP_ITEMS[itemName] || !SHOP_ITEMS[itemName].sell) {
    return conn.reply(m.chat, `❌ Item "${itemName}" tidak dapat dijual!`, m)
  }

  const userItemCount = user[itemName] || 0
  if (userItemCount < count) {
    return conn.reply(m.chat, `❌ ${itemName} tidak cukup!\nKamu punya: ${userItemCount}`, m)
  }

  const item = SHOP_ITEMS[itemName]
  const totalPrice = item.sell * count
  const currency = item.currency || 'money'

  user[itemName] -= count
  user[currency] = (user[currency] || 0) + totalPrice

  return conn.reply(m.chat, `✅ Berhasil menjual ${count}x ${item.emoji} ${itemName}\nDapat: ${formatNumber(totalPrice)} ${formatCurrency(currency)}`, m)
}

const handleArmorUpgrade = (conn, m, user) => {
  const currentLevel = user.armor || 0

  if (currentLevel >= EQUIPMENT_LEVELS.armor.maxLevel) {
    return conn.reply(m.chat, '🧥 Armor sudah Level MAX!', m)
  }

  const upgradePrice = EQUIPMENT_LEVELS.armor.levels[currentLevel]

  if ((user.money || 0) < upgradePrice) {
    return conn.reply(m.chat, `❌ 💰 tidak cukup!\nButuh: ${formatNumber(upgradePrice)} 💰`, m)
  }

  user.money -= upgradePrice
  user.armor = currentLevel + 1
  user.health = (user.health || 100) + 100
  user.armordurability = (user.armordurability || 0) + 100

  return conn.reply(m.chat, `✅ Armor berhasil naik ke Level ${user.armor}\nHarga: ${formatNumber(upgradePrice)} 💰`, m)
}

const handleSwordUpgrade = (conn, m, user) => {
  const currentLevel = user.sword || 0

  if (currentLevel >= EQUIPMENT_LEVELS.sword.maxLevel) {
    return conn.reply(m.chat, '⚔️ Sword sudah Level MAX!', m)
  }

  const upgradePrice = EQUIPMENT_LEVELS.sword.levels[currentLevel]

  if ((user.money || 0) < upgradePrice) {
    return conn.reply(m.chat, `❌ 💰 tidak cukup!\nButuh: ${formatNumber(upgradePrice)} 💰`, m)
  }

  user.money -= upgradePrice
  user.sword = currentLevel + 1
  user.sworddamage = (user.sworddamage || 0) + 200
  user.sworddurability = (user.sworddurability || 0) + 100

  return conn.reply(m.chat, `✅ Sword berhasil naik ke Level ${user.sword}\nHarga: ${formatNumber(upgradePrice)} 💰`, m)
}

const handleSpecialItem = (conn, m, user, itemName) => {
  const item = SPECIAL_ITEMS[itemName]
  const currency = item.currency || 'money'

  if (item.unique && user[itemName]) {
    return conn.reply(m.chat, `❌ Kamu sudah punya ${item.emoji} ${itemName}!`, m)
  }

  if ((user[currency] || 0) < item.price) {
    return conn.reply(m.chat, `❌ ${formatCurrency(currency)} tidak cukup!\nButuh: ${formatNumber(item.price)} ${formatCurrency(currency)}`, m)
  }

  user[currency] -= item.price
  user[itemName] = (user[itemName] || 0) + 1

  if (itemName === 'pancingan') user.pancingandurability = 100
  if (itemName === 'sniper') user.peluru = 30

  return conn.reply(m.chat, `✅ Berhasil membeli ${item.emoji} ${itemName}\nHarga: ${formatNumber(item.price)} ${formatCurrency(currency)}`, m)
}

handler.help = ['shop <buy|sell> <item> <jumlah>']
handler.tags = ['rpg']
handler.command = /^(shop|toko)$/i
handler.limit = false
handler.group = true
handler.register = true

export default handler