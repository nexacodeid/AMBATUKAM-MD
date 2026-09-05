/*
 * Fitur : Anti Tag Status WhatsApp (SW)
 * Type  : Plugins ESM
 */

let handler = async (m, { args, usedPrefix, command }) => {
  const chat = getChatData(m.chat);
  const type = (args[0] || "").toLowerCase();

  switch (type) {
    case "on":
      if (chat.antitagsw.status) return m.reply("Anti tag status sudah aktif.");
      chat.antitagsw.status = true;
      chat.antitagsw.count = {};
      return m.reply("✅ Anti tag status telah *diaktifkan*.");

    case "off":
      if (!chat.antitagsw.status) return m.reply("Anti tag status sudah nonaktif.");
      chat.antitagsw.status = false;
      chat.antitagsw.count = {};
      return m.reply("✅ Anti tag status telah *dinonaktifkan*.");

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
    if (!chat.antitagsw?.status) return;

    const msgString = JSON.stringify(m.message || {});
    const isStatusMention =
      !!m.message?.groupStatusMentionMessage ||
      msgString.includes("groupStatusMentionMessage");

    if (!isStatusMention) return;

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
      const ids = [
        p.id,
        p.jid,
        p.lid,
        p.phoneNumber,
      ]
        .filter(Boolean)
        .map(normalizeJid);

      return ids.some((id) => botIds.includes(id));
    });

    const sender = participants.find((p) => {
      const ids = [
        p.id,
        p.jid,
        p.lid,
        p.phoneNumber,
      ]
        .filter(Boolean)
        .map(normalizeJid);

      const userIds = [
        user,
        normalizeJid(user),
      ].map(normalizeJid);

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
      console.log("ANTITAGSW BOT IDS:", botIds);
      console.log("ANTITAGSW PARTICIPANTS SAMPLE:", participants.slice(0, 5));

      return conn.sendMessage(m.chat, {
        text: "Bot harus menjadi admin untuk menindak pengguna yang mention status.",
      });
    }

    chat.antitagsw.count = chat.antitagsw.count || {};
    const key = normalizeJid(user);
    chat.antitagsw.count[key] = (chat.antitagsw.count[key] || 0) + 1;

    const count = chat.antitagsw.count[key];
    const maxWarn = 3;

    if (count >= maxWarn) {
      await conn.sendMessage(m.chat, {
        text: `@${user.split("@")[0]} telah dikeluarkan karena mention status sebanyak ${maxWarn} kali.`,
        mentions: [user],
      });

      await conn.groupParticipantsUpdate(m.chat, [user], "remove");
      delete chat.antitagsw.count[key];
      return;
    }

    return conn.sendMessage(m.chat, {
      text: `@${user.split("@")[0]} jangan mention status di grup ini.\n\nPeringatan: ${count}/${maxWarn}\nJika mencapai ${maxWarn}, kamu akan dikeluarkan.`,
      mentions: [user],
    });
  } catch (e) {
    console.error("ANTITAGSW ERROR:", e);
  }
};

handler.command = /^antitagsw$/i;
handler.help = ["antitagsw on/off"];
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

  chat.antitagsw = chat.antitagsw || {
    status: false,
    count: {},
  };

  chat.antitagsw.count = chat.antitagsw.count || {};

  return chat;
}

function normalizeJid(jid = "") {
  return String(jid)
    .replace(/:\d+@/g, "@")
    .trim();
}