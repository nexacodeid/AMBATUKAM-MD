let handler = async (m, { conn }) => {
  global.conns = global.conns || [];

  const bots = global.conns.filter((bot) => bot?.user?.jid || bot?.user?.id);

  if (!bots.length) {
    return m.reply("Belum ada jadibot yang aktif.");
  }

  const text = bots
    .map((bot, i) => {
      const jid = bot.user?.jid || bot.user?.id;
      const number = String(jid || "").split("@")[0];
      const name = bot.user?.name || "Tanpa Nama";

      return `${i + 1}. @${number}\n   Nama: ${name}\n   JID: ${jid}`;
    })
    .join("\n\n");

  return conn.reply(
    m.chat,
    `*LIST JADIBOT AKTIF*\n\n${text}`,
    m,
    {
      contextInfo: {
        mentionedJid: bots.map((bot) => bot.user?.jid || bot.user?.id).filter(Boolean),
      },
    }
  );
};

handler.help = ["listjadibot"];
handler.tags = ["jadibot"];
handler.command = /^(listjadibot|listbot|bots)$/i;
handler.owner = true;

export default handler;