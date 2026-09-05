const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    const wyrQuestions = [
      "Would you rather have the ability to fly or be invisible?",
      "Would you rather explore the ocean or outer space?",
      "Would you rather have unlimited money or unlimited time?",
      "Would you rather be able to talk to animals or speak all languages?",
      "Would you rather live in the past or the future?",
      "Would you rather have super strength or super speed?",
      "Would you rather be famous for your talent or your wealth?",
      "Would you rather travel to every country or master every skill?",
      "Would you rather never use social media again or never watch movies again?",
      "Would you rather have a pause button or a rewind button in life?",
      "Would you rather know how you die or when you die?",
      "Would you rather lose all your memories or never make new ones?",
      "Would you rather be the funniest person in the room or the smartest?",
      "Would you rather have free WiFi everywhere or free coffee everywhere?",
      "Would you rather fight one horse-sized duck or 100 duck-sized horses?",
      "Would you rather always be 10 minutes late or always be 20 minutes early?",
      "Would you rather have the power to read minds or predict the future?",
      "Would you rather live without music or live without movies?",
      "Would you rather be able to teleport or be able to fly?",
      "Would you rather have a dragon or a unicorn as a pet?"
    ];

    const randomQuestion = wyrQuestions[Math.floor(Math.random() * wyrQuestions.length)];

    const message = `╭───「 *WOULD YOU RATHER* 」───⬣
│
│ 🤔 ${randomQuestion}
│
│ 💬 Reply with your choice!
│
╰─────────────────────⬣`;

    await conn.sendMessage(m.chat, {
      text: message,
      contextInfo: {
        externalAdReply: {
          title: 'Would You Rather',
          body: 'Fun Choices',
          thumbnailUrl: 'https://api.deline.web.id/2qOH0fJyNH.jpg',
          sourceUrl: global.website
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('❌ Error generating question!');
  }
};

handler.command = ['wouldyourather', 'wyr', 'wouldyou'];
handler.help = ['wouldyourather'];
handler.tags = ['game'];
handler.exp = 5;
handler.group = true
handler.register = true;
handler.limit = true;

export default handler