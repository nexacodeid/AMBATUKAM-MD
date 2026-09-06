/*
 *╭━━━[ 🤖 Ambatukam Multi-Device ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: Ambatukam Multi-Device Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  :
 *┃ 🔹 Website  :
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

/*
 * Isi data pribadi dan kredensial hanya pada salinan lokal.
 * Jangan commit nilai aslinya ke repositori publik.
 */
global.pairingNumber = '6281221523195';

global.namebot = 'Ambatukam Multi-Device';
global.namabot = global.namebot;
global.ownerName = 'Owner';
global.author = global.ownerName;

const primaryOwnerNumber = '';
global.owner = primaryOwnerNumber
  ? [[primaryOwnerNumber, global.ownerName, true]]
  : [];

global.getBotName = () =>
  global.namebot || global.namabot || 'Ambatukam Multi-Device';
global.getOwnerName = () =>
  global.ownerName || global.author || global.owner?.[0]?.[1] || 'Owner';

global.source = 'https://share-script-mocha.vercel.app';
global.myweb = 'https://fallxd-store-alpha.vercel.app/';

global.wait = 'Loading...';
global.eror = 'Terjadi Kesalahan...';

global.pakasir = {
  slug: '',
  apikey: '',
  expired: 30, // 1 = 1 menit, 30 = 30 menit
};

global.jadibotPayment = {
  dana: '085813708397',
  namaDana: 'N****l M****d F****z',
  seabank: '',
  namaSeabank: 'N****l M****d F****z',
};

global.Orkut = {
  // Provider QRIS/Mutasi yang dipakai plugin beli.js
  baseUrl: 'https://api.theresav.biz.id',
  apocalypseApikey: '',
  id: '',
  username: '',
  token: '',
  pin: '',
  password: '',
  apikey: '',
  qr: '',
};

global.OrderKuota = {
  // Dipakai plugins/topup/beli.js untuk QRIS langsung via app.orderkuota.com
  username: global.Orkut?.username || '',
  token: global.Orkut?.token || '',
  // Isi dengan payload QRIS EMV milik pengguna.
  qrisRaw: global.Orkut?.qr || '',
  // Opsional: URL gambar QRIS statis.
  qrisUrl: '',
};

global.paymentWebhook = {
  baseUrl: 'https://restapi.amgeekz.my.id',
  token: '',
  qrisPayload: global.Orkut?.qr || '',
  limit: 20,
};

global.smm = global.smm || {};

global.smm.litensi = {
  id: '',
  api_key: '',
};

global.binderbyte = {
  apikey: '',
};

global.githubUpload = {
  token: '',
  owner: '',
  branch: 'main',
  repos: [],
};

global.stickpack = 'Created By';
global.stickauth = global.namebot;

global.multiplier = 38; // Semakin tinggi, semakin sulit naik level

global.APIs = {
  theresav: 'https://api.theresav.biz.id',
  xterm: 'https://api.termai.cc',
  neoxr: 'https://api.neoxr.eu',
};

global.APIKeys = {
  'https://api.theresav.biz.id': '',
  'https://api.termai.cc': '',
  'https://api.neoxr.eu': '',
};

global.thumbmenu = '';

/*============== EMOJI ==============*/
global.rpg = {
  emoticon(string) {
    string = string.toLowerCase();
    const emot = {
      level: '📊',
      limit: '🎫',
      health: '❤️',
      stamina: '🔋',
      exp: '✨',
      money: '💹',
      bank: '🏦',
      potion: '🥤',
      diamond: '💎',
      common: '📦',
      uncommon: '🛍️',
      mythic: '🎁',
      legendary: '🗃️',
      superior: '💼',
      pet: '🔖',
      trash: '🗑',
      armor: '🥼',
      sword: '⚔️',
      pickaxe: '⛏️',
      fishingrod: '🎣',
      wood: '🪵',
      rock: '🪨',
      string: '🕸️',
      horse: '🐴',
      cat: '🐱',
      dog: '🐶',
      fox: '🦊',
      petFood: '🍖',
      iron: '⛓️',
      gold: '🪙',
      emerald: '❇️',
      upgrader: '🧰',
    };

    const results = Object.keys(emot)
      .map((key) => [key, new RegExp(key, 'gi')])
      .filter(([, regex]) => regex.test(string));

    return results.length ? emot[results[0][0]] : '';
  },
};

const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'config.public.js'"));
  import(`${file}?update=${Date.now()}`);
});

/*
 *╭━━━[ 🤖 Ambatukam Multi-Device ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: Ambatukam Multi-Device Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  :
 *┃ 🔹 Website  :
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */
