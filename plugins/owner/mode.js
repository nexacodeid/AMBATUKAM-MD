/*
 * Mode Self / Public
 */

let handler = async (m, { conn, command }) => {
  const jid = conn.user?.jid || conn.user?.id;

  global.db.data.settings = global.db.data.settings || {};
  global.db.data.settings[jid] = global.db.data.settings[jid] || {
    public: true,
    autoread: true,
    anticall: true,
    gconly: true,
  };

  if (command === "self") {
    global.db.data.settings[jid].public = false;
    return m.reply("✅ Mode *SELF* aktif.\nBot hanya merespon owner.");
  }

  if (command === "public") {
    global.db.data.settings[jid].public = true;
    return m.reply("✅ Mode *PUBLIC* aktif.\nBot bisa digunakan semua user.");
  }
};

handler.help = ["self", "public"];
handler.tags = ["owner"];
handler.command = /^(self|public)$/i;
handler.owner = true;

export default handler;