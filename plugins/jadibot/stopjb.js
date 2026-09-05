import fs from "fs";
import path from "path";

let handler = async (m, { conn, args, usedPrefix, command }) => {
  global.conns = global.conns || [];

  if (!args[0]) {
    return m.reply(
      `Masukkan nomor jadibot.\n\nContoh:\n${usedPrefix + command} 628xxxx\n\nCek daftar:\n${usedPrefix}listjadibot`
    );
  }

  const number = args[0].replace(/[^0-9]/g, "");
  const jid = `${number}@s.whatsapp.net`;

  const index = global.conns.findIndex((bot) => (bot?.user?.jid || bot?.user?.id) === jid);

  if (index === -1) {
    return m.reply(`Jadibot dengan nomor ${number} tidak sedang aktif.`);
  }

  const bot = global.conns[index];

  try {
    try {
      bot.ev?.removeAllListeners();
    } catch {}

    try {
      bot.ws?.close();
    } catch {}

    global.conns.splice(index, 1);

    const sessionPath = path.resolve(`./sessions/jadibot/${number}`);

    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, {
        recursive: true,
        force: true,
      });
    }

    return m.reply(`Berhasil menghapus jadibot ${number}.`);
  } catch (e) {
    console.error(e);
    return m.reply("Gagal menghapus jadibot.");
  }
};

handler.help = ["deljadibot <nomor>"];
handler.tags = ["jadibot"];
handler.command = /^(deljadibot|deletejadibot|hapusjadibot)$/i;
handler.owner = true;

export default handler;