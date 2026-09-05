/*
 * Fitur : Anti Link
 * Type  : Plugins ESM
 */

let handler = async (m, { args, usedPrefix, command }) => {
  const chat = getChatData(m.chat);
  const type = (args[0] || "").toLowerCase();

  switch (type) {
    case "on":
      if (chat.antilink.status) return m.reply("Anti link sudah aktif.");
      chat.antilink.status = true;
      chat.antilink.count = {};
      return m.reply("✅ Anti link telah *diaktifkan*.");

    case "off":
      if (!chat.antilink.status) return m.reply("Anti link sudah nonaktif.");
      chat.antilink.status = false;
      chat.antilink.count = {};
      return m.reply("✅ Anti link telah *dinonaktifkan*.");

    default:
      return m.reply(`
*Contoh penggunaan:*

${usedPrefix + command} on
${usedPrefix + command} off
`.trim());
  }
};

handler.all = async function (m) {
  try {
    const conn = this;

    if (!m.isGroup) return;

    const chat = getChatData(m.chat);
    if (!chat.antilink?.status) return;

    const text =
      m.text ||
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      m.message?.imageMessage?.caption ||
      m.message?.videoMessage?.caption ||
      "";

    if (!text) return;

    const linkRegex =
      /(https?:\/\/|www\.|chat\.whatsapp\.com\/|whatsapp\.com\/channel\/|wa\.me\/|t\.me\/|telegram\.me\/|discord\.gg\/|discord\.com\/invite\/|bit\.ly\/|tinyurl\.com\/|youtu\.be\/|youtube\.com\/|instagram\.com\/|facebook\.com\/|fb\.watch\/|x\.com\/|twitter\.com\/|tiktok\.com\/)/i;

    if (!linkRegex.test(text)) return;

    const user =
      m.key?.participant ||
      m.participant ||
      m.sender;

    if (!user) return;

    const metadata = await conn.groupMetadata(m.chat).catch(() => null);
    const participants = metadata?.participants || [];

    const botIds = [
      conn.user?.id,
      conn.user?.jid,
      conn.decodeJid ? conn.decodeJid(conn.user?.id || "") : "",
      conn.decodeJid ? conn.decodeJid(conn.user?.jid || "") : "",
      conn.user?.lid,
    ]
      .filter(Boolean)
      .map(normalizeJid);

    const bot = participants.find((p) => {
      const ids = [p.id, p.jid, p.lid, p.phoneNumber]
        .filter(Boolean)
        .map(normalizeJid);

      return ids.some((id) => botIds.includes(id));
    });

    const sender = participants.find((p) => {
      const ids = [p.id, p.jid, p.lid, p.phoneNumber]
        .filter(Boolean)
        .map(normalizeJid);

      const userIds = [user, normalizeJid(user)].map(normalizeJid);

      return ids.some((id) => userIds.includes(id));
    });

    const isBotAdmin =
      bot?.admin === "admin" ||
      bot?.admin === "superadmin" ||
      bot?.isAdmin === true;

    const isSenderAdmin =
      sender?.admin === "admin" ||
      sender?.admin === "superadmin" ||
      sender?.isAdmin === true;

    if (isSenderAdmin) return;

    if (!isBotAdmin) {
      console.log("ANTILINK BOT IDS:", botIds);
      console.log("ANTILINK PARTICIPANTS SAMPLE:", participants.slice(0, 5));

      return conn.sendMessage(m.chat, {
        text: "Bot harus menjadi admin untuk menindak pengguna yang mengirim link.",
      });
    }

    try {
      await conn.sendMessage(m.chat, {
        delete: m.key,
      });
    } catch {}

    chat.antilink.count = chat.antilink.count || {};
    const key = normalizeJid(user);
    chat.antilink.count[key] = (chat.antilink.count[key] || 0) + 1;

    const count = chat.antilink.count[key];
    const maxWarn = 3;

    if (count >= maxWarn) {
      await conn.sendMessage(m.chat, {
        text: `@${user.split("@")[0]} telah dikeluarkan karena mengirim link sebanyak ${maxWarn} kali.`,
        mentions: [user],
      });

      await conn.groupParticipantsUpdate(m.chat, [user], "remove");
      delete chat.antilink.count[key];
      return;
    }

    return conn.sendMessage(m.chat, {
      text: `@${user.split("@")[0]} jangan kirim link di grup ini.\n\nPeringatan: ${count}/${maxWarn}\nJika mencapai ${maxWarn}, kamu akan dikeluarkan.`,
      mentions: [user],
    });
  } catch (e) {
    console.error("ANTILINK ERROR:", e);
  }
};

handler.command = /^antilink$/i;
handler.help = ["antilink on/off"];
handler.tags = ["group"];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.register = true;

export default handler;

function getChatData(chatId) {
  global.db = global.db || {};
  global.db.data = global.db.data || {};
  global.db.data.chats = global.db.data.chats || {};

  const chat = global.db.data.chats[chatId] || {};
  global.db.data.chats[chatId] = chat;

  chat.antilink = chat.antilink || {
    status: false,
    count: {},
  };

  chat.antilink.count = chat.antilink.count || {};

  return chat;
}

function normalizeJid(jid = "") {
  return String(jid)
    .replace(/:\d+@/g, "@")
    .trim();
}