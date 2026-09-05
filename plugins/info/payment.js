let handler = async (m, { conn }) => {
  const caption = `
▧「 *P E M B A Y A R A N* 」

*🎗️ E-Walet*
* Dana = 085813708397
* Gopay = 085813708397
* AN = NAUFAL 

[❗] _Mohon sertakan bukti transfer ya kak, kirim ke owner melalui chat, ketik *!owner*_

Terimakasih ❤️
`.trim();

  await conn.sendMessage(
    m.chat,
    {
      image: {
        url: "https://i.ibb.co/sd1341DZ/file-jpg.jpg",
      },
      caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,

        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363186130999681@newsletter", // ganti dengan ID channel kamu
          serverMessageId: 143,
          newsletterName: "Saluran Official ⭐",
        },

        externalAdReply: {
          title: "Saluran Official ⭐",
          body: "Klik untuk lihat channel testimoni",
          thumbnailUrl: "https://i.ibb.co/sd1341DZ/file-jpg.jpg",
          sourceUrl: "https://whatsapp.com/channel/0029VaBOlsv002TEjlntTE2D", // ganti link channel kamu
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    },
    { quoted: m }
  );
};

handler.help = ["payment"];
handler.tags = ["main"];
handler.command = /^(pay|payment|qris)$/i;
handler.group = false;
handler.register = false;

export default handler;