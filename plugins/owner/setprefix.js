let handler = async (m, { conn, text, usedPrefix, command, isAdmin, isOwner }) => {
  const input = (text || '').trim();
  const isReset = /^(reset|default|clear|off)$/i.test(input);
  const isNoPrefix = /^null$/i.test(input);

  if (m.isGroup && !isAdmin && !isOwner) {
    throw 'Fitur ini hanya bisa dipakai admin grup.';
  }

  if (!m.isGroup && !isOwner) {
    throw 'Fitur ini hanya bisa dipakai owner di private chat.';
  }

  if (!input) {
    throw `Penggunaan:\n${usedPrefix + command} <prefix>\n${usedPrefix + command} null\n${usedPrefix + command} reset\n\nContoh:\n${usedPrefix + command} !`;
  }

  const decodeJid = (jid = '') => typeof conn.decodeJid === 'function'
    ? conn.decodeJid(jid)
    : String(jid).replace(/:\d+@/g, '@');
  const botJid = decodeJid(conn.user?.id || conn.user?.jid || '');

  const target = m.isGroup
    ? (global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {})
    : (global.db.data.settings[botJid] = global.db.data.settings[botJid] || {});

  if (isReset) {
    target.prefix = '';
    return m.reply('Prefix berhasil direset ke default.');
  }

  if (isNoPrefix) {
    target.prefix = null;
    return m.reply('Prefix berhasil dimatikan. Sekarang bot bisa digunakan tanpa prefix atau tetap pakai prefix default.\n\nContoh pakai:\nmenu\n.menu');
  }

  if (/\s/.test(input)) throw 'Prefix tidak boleh mengandung spasi.';
  if (input.length > 5) throw 'Prefix maksimal 5 karakter. Jangan bikin prefix sepanjang skripsi 😭';

  target.prefix = input;
  m.reply(`Prefix berhasil diubah menjadi *${input}*\n\nContoh pakai:\n${input}menu`);
};

handler.help = ['setprefix <prefix>', 'setprefix null', 'setprefix reset'];
handler.tags = ['owner'];
handler.command = /^(setprefix|setpref|prefix)$/i;
handler.owner = true;

export default handler;
