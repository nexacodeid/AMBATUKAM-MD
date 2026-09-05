export default function (m, conn) {
  try {
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.settings) global.db.data.settings = {}
    
    if (!global.db.data.jadibotNumbers)
      global.db.data.jadibotNumbers = {}

    if (!global.db.data.jadibotOrders)
      global.db.data.jadibotOrders = {}

    const defaultUser = {
      name: m.name || '',
      exp: 0,
      money: 0,
      bank: 0,
      cash: 0,
      health: 100,
      healt: 100,
      level: 1,
      limit: 20,
      age: -1,
      regTime: -1,
      afk: -1,
      afkReason: '',
      warn: 0,
      role: 'Newbie',
            // JADIBOT
      usedTrialJadibot: false,
      jadibotExpired: 0,
      jadibotNumber: "",
      premium: false,
      premiumTime: 0,
      registered: false,
      banned: false,
      autolevelup: false,

      // RPG
      bibitapel: 0,
      bibitjeruk: 0,
      bibitdurian: 0,
      bibitmangga: 0,
      bibitpisang: 0,
      bibitanggur: 0,

      apel: 0,
      jeruk: 0,
      durian: 0,
      mangga: 0,
      pisang: 0,
      anggur: 0,

      banteng: 0,
      harimau: 0,
      gajah: 0,
      kambing: 0,
      panda: 0,
      buaya: 0,
      kerbau: 0,
      sapi: 0,
      monyet: 0,
      babihutan: 0,
      babi: 0,
      ayam: 0,

      ikan: 0,
      lele: 0,
      nila: 0,
      bawal: 0,
      udang: 0,
      paus: 0,
      kepiting: 0,

      sword: 0,
      pickaxe: 0,
      axe: 0,
      fishingrod: 0,
      armor: 0,
      atm: 0,

      sworddurability: 0,
      pickaxedurability: 0,
      axedurability: 0,
      fishingroddurability: 0,
      armordurability: 0,
      fullatm: 0,

      potion: 0,
      string: 0,
      wood: 0,
      rock: 0,
      coal: 0,
      iron: 0,
      diamond: 0,
      emerald: 0,
      trash: 0,
      common: 0,
      uncommon: 0,
      mythic: 0,
      legendary: 0,

      ayambakar: 0,
      ayamgoreng: 0,
      oporayam: 0,
      gulaiayam: 0,
      steak: 0,
      rendang: 0,
      babipanggang: 0,
      ikanbakar: 0,
      lelebakar: 0,
      nilabakar: 0,
      bawalbakar: 0,
      udangbakar: 0,
      pausbakar: 0,
      kepitingbakar: 0,

      aerozine: 0,
      anakcentaur: 0,
      anakgriffin: 0,
      anakkucing: 0,
      anakkuda: 0,
      anakkyubi: 0,
      anaknaga: 0,
      anakpancingan: 0,
      anakphonix: 0,
      anakrubah: 0,
      anakserigala: 0,
      aqua: 0,
      ayamexp: 0,
      bandage: 0,
      bararmor: 0,
      barsword: 0,
      batu: 0,
      berlian: 0,
      botol: 0,
      boxs: 0,
      buntal: 0,
      centaur: 0,
      cumi: 0,
      cupon: 0,
      data: 0,
      dory: 0,
      emas: 0,
      emasbatang: 0,
      energi: 0,
      expg: 0,
      exphero: 0,
      fullstamina: 100,
      ganja: 0,
      gardenboxs: 0,
      gloves: 0,
      glovesuse: 0,
      griffin: 0,
      gulai: 0,
      gurita: 0,
      healtmonster: 0,
      hero: 0,
      hiu: 0,
      hp: 0,
      judilast: 0,
      jusanggur: 0,
      jusapel: 0,
      jusjeruk: 0,
      jusmangga: 0,
      juspisang: 0,
      kaleng: 0,
      kardus: 0,
      kayu: 0,
      kucing: 0,
      kuda: 0,
      kyubi: 0,
      leather: 0,
      lobster: 0,
      lumba: 0,
      magichats: 0,
      magichatsuse: 0,
      makanancentaur: 0,
      makanangriffin: 0,
      makanankyubi: 0,
      makanannaga: 0,
      makananpet: 0,
      makananphonix: 0,
      masinis: 0,
      nabung: 0,
      naga: 0,
      nagaexp: 0,
      ojekk: 0,
      orca: 0,
      pancingan: 0,
      pancingandurability: 0,
      pedagang: 0,
      pedang: 0,
      pelastik: 0,
      peluru: 0,
      peran: 0,
      pet: 0,
      phonix: 0,
      ramuan: 0,
      rendang: 0,
      resultdamage: 0,
      roket: 0,
      roti: 0,
      rubah: 0,
      sampah: 0,
      sepatu: 0,
      sepatuuse: 0,
      serigala: 0,
      sniper: 0,
      soda: 0,
      stamina: 100,
      subscriber: 0,
      sushi: 0,
      sworddamage: 0,
      tiketcoin: 0,
      tomat: 0,
      topijerami: 0,
      topjeramiuse: 0,
      totalb: 0,
      umpan: 0,
      vodka: 0,
      weapon: 0,

      // Last action
      lastadventure: 0,
      lastbansos: 0,
      lastberbru: 0,
      lastberburu: 0,
      lastberkebon: 0,
      lastclaim: 0,
      lastcode: 0,
      lastdagang: 0,
      lastduel: 0,
      lastdungeon: 0,
      lastharian: 0,
      lasthunt: 0,
      lastkerja: 0,
      lastlink: 0,
      lastlumber: 0,
      lastmining: 0,
      lastmisi: 0,
      lastmonthly: 0,
      lastmulung: 0,
      lastnambang: 0,
      lastnebang: 0,
      lastngepet: 0,
      lastngojek: 0,
      lastnguli: 0,
      lastopen: 0,
      lastpotionclaim: 0,
      lastramuanclaim: 0,
      lastrampok: 0,
      lastrob: 0,
      lastroket: 0,
      lastsda: 0,
      lastsironclaim: 0,
      lastsmancingclaim: 0,
      laststringclaim: 0,
      lastswordclaim: 0,
      lastweaponclaim: 0,
      lastweekly: 0,

      // RPG extra defaults / fixes
      lastmaling: 0,
      lastlive: 0,
      lastbunuhi: 0,
      lastfishing: 0,

      // YouTube RPG
      nameyt: '',
      like: 0,
      liketotal: 0,
      silverplaybutton: 0,
      goldplaybutton: 0,
      diamondplaybutton: 0,

      // Referral RPG
      ref_code: '',
      ref_count: 0,

      // Gambling RPG
      judi: 0,

      // Pet aliases / exp / cooldown
      dog: 0,
      dogexp: 0,
      doglastfeed: 0,
      fox: 0,
      foxexp: 0,
      foxlastclaim: 0,
      foxlastfeed: 0,
      horse: 0,
      horseexp: 0,
      horselastclaim: 0,
      horselastfeed: 0,
      wolf: 0,
      wolfexp: 0,
      wolflastclaim: 0,
      lion: 0,
      lionexp: 0,
      lionlastclaim: 0,
      rhinoceros: 0,
      rhinocerosexp: 0,
      rhinoceroslastclaim: 0,
      kucingexp: 0,
      kucinglastclaim: 0,
      kyubiexp: 0,
      kyubilastclaim: 0,
      centaurexp: 0,
      centaurlastclaim: 0,
      phonixexp: 0,
      phonixlastclaim: 0,
      griffinexp: 0,
      griffinlastclaim: 0,
      petFood: 0,

      // Ramuan pet cooldown
      ramuankucinglast: 0,
      ramuankudalast: 0,
      ramuanrubahlast: 0,
      ramuanserigalalast: 0,
      ramuankyubilast: 0,
      ramuannagalast: 0,
      ramuanphonixlast: 0,
      ramuangriffinlast: 0,
      ramuancentaurlast: 0,
      ramuanherolast: 0,
    }

    const defaultChat = {
      prefix: '',
      sewa: false,
      sewaTime: 0,
      sewaAddedBy: '',
      sewaExpiredNotified: false,
      premium: false,
      premiumTime: 0,
      premiumAddedBy: '',
      premiumExpiredNotified: false,
      sWelcome: '',
      sBye: '',
      sPromote: '',
      sDemote: '',
      isBanned: false,
      welcome: false,
      detect: false,
      delete: false,
      security: {
        antilink: false,
        antiinvite: false,
        antiwame: false,
        antitoxic: false,
        antispam: false,
        antimedia: false,
        antisticker: false,
        antivirtex: false,
        antiforward: false,
        antiviewonce: false,
        action: 'warn',
        maxWarn: 3,
        warn: {},
        spam: {},
        whitelist: [],
      },
    }

    const defaultSettings = {
      prefix: '',
      public: true,
      autoread: true,
      anticall: true,
      gconly: false,
    }

    function mergeDefault(defaultData, oldData = {}) {
      const result = { ...defaultData, ...oldData }

      for (const key in defaultData) {
        const def = defaultData[key]
        const val = result[key]

        if (typeof def === 'number') {
          result[key] = Number.isFinite(Number(val)) ? Number(val) : def
        } else if (typeof def === 'boolean') {
  result[key] =
    typeof val === 'boolean'
      ? val
      : def
        } else if (typeof def === 'string') {
          // Prefix boleh bernilai null untuk mode tanpa prefix.
          // Jangan dikembalikan ke default string kosong saat database dinormalisasi.
          result[key] = key === 'prefix' && val === null ? null : (val == null ? def : String(val))
        } else {
          result[key] = val ?? def
        }
      }

      return result
    }

    // === USER ===
    if (m.sender && !m.sender.endsWith('@broadcast') && !m.sender.endsWith('@newsletter')) {
      global.db.data.users[m.sender] = mergeDefault(
        defaultUser,
        global.db.data.users[m.sender]
      )

      if (!global.db.data.users[m.sender].name) {
        global.db.data.users[m.sender].name = m.name || ''
      }
    }

    // === GROUP ===
    if (m.isGroup) {
      global.db.data.chats[m.chat] = mergeDefault(
        defaultChat,
        global.db.data.chats[m.chat]
      )
    }

    // === SETTINGS ===
    const decodeJid = (jid = '') =>
      typeof conn.decodeJid === 'function'
        ? conn.decodeJid(jid)
        : String(jid).replace(/:\d+@/g, '@')

    const botJid = decodeJid(conn.user?.id || conn.user?.jid || '')
    if (botJid) {
      global.db.data.settings[botJid] = mergeDefault(
        defaultSettings,
        global.db.data.settings[botJid]
      )
    }
  } catch (e) {
    console.error(e)
  }
}
