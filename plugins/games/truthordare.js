const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    const truths = [
      "What's your biggest fear?",
      "What's the most embarrassing thing you've ever done?",
      "What's your biggest regret?",
      "What's the last lie you told?",
      "What's your guilty pleasure?",
      "What's the worst date you've ever been on?",
      "What's something you've never told anyone?",
      "Who was your first crush?",
      "What's the most childish thing you still do?",
      "What's your worst habit?",
      "What's the meanest thing you've ever said to someone?",
      "What's something you're glad your parents don't know about you?",
      "Have you ever cheated on a test?",
      "What's the most trouble you've ever been in?",
      "What's your biggest insecurity?",
      "What's the longest you've gone without showering?",
      "What's the worst gift you've ever received?",
      "Have you ever pretended to like a gift you actually hated?",
      "What's the most expensive thing you've broken?",
      "What's something you do when you're alone that you'd never do in front of others?"
    ];

    const dares = [
      "Do 10 push-ups right now!",
      "Sing a song out loud!",
      "Dance for 30 seconds without music!",
      "Talk in an accent for the next 3 messages!",
      "Let someone text anything they want from your phone!",
      "Post an embarrassing photo on your status!",
      "Do your best impression of someone in this group!",
      "Speak in rhymes for the next 3 messages!",
      "Hold an ice cube in your hand until it melts!",
      "Do 20 squats!",
      "Try to lick your elbow!",
      "Spin around 10 times and try to walk straight!",
      "Talk without closing your mouth for 1 minute!",
      "Let the group choose your profile picture for 1 hour!",
      "Send a voice message singing happy birthday!",
      "Do your best animal impression!",
      "Try to juggle 3 things near you!",
      "Plank for 30 seconds!",
      "Make up a rap about the person to your right!",
      "Don't blink for 1 minute!"
    ];

    const type = text.toLowerCase().trim();

    if (type === 'truth') {
      const randomTruth = truths[Math.floor(Math.random() * truths.length)];
      
      const message = `╭───「 *TRUTH OR DARE* 」───⬣
│
│ 🎯 *TRUTH*
│
│ ❓ ${randomTruth}
│
│ 💬 Answer honestly!
│
╰─────────────────────⬣`;

      await conn.sendMessage(m.chat, {
        text: message,
        contextInfo: {
          externalAdReply: {
            title: 'Truth or Dare',
            body: 'Truth',
            thumbnailUrl: 'https://api.deline.web.id/2qOH0fJyNH.jpg',
            sourceUrl: global.website
          }
        }
      }, { quoted: m });
      
    } else if (type === 'dare') {
      const randomDare = dares[Math.floor(Math.random() * dares.length)];
      
      const message = `╭───「 *TRUTH OR DARE* 」───⬣
│
│ 🎯 *DARE*
│
│ 💪 ${randomDare}
│
│ ✅ Complete the challenge!
│
╰─────────────────────⬣`;

      await conn.sendMessage(m.chat, {
        text: message,
        contextInfo: {
          externalAdReply: {
            title: 'Truth or Dare',
            body: 'Dare',
            thumbnailUrl: 'https://api.deline.web.id/2qOH0fJyNH.jpg',
            sourceUrl: global.website
          }
        }
      }, { quoted: m });
      
    } else {
      const randomType = Math.random() > 0.5 ? 'truth' : 'dare';
      const randomItem = randomType === 'truth' 
        ? truths[Math.floor(Math.random() * truths.length)]
        : dares[Math.floor(Math.random() * dares.length)];
      
      const emoji = randomType === 'truth' ? '🎯' : '💪';
      const title = randomType === 'truth' ? 'TRUTH' : 'DARE';
      
      const message = `╭───「 *TRUTH OR DARE* 」───⬣
│
│ ${emoji} *${title}*
│
│ ${randomItem}
│
╰─────────────────────⬣`;

      await conn.sendMessage(m.chat, {
        text: message,
        contextInfo: {
          externalAdReply: {
            title: 'Truth or Dare',
            body: 'Fun Game',
            thumbnailUrl: 'https://api.deline.web.id/2qOH0fJyNH.jpg',
            sourceUrl: global.website
          }
        }
      }, { quoted: m });
    }

  } catch (e) {
    console.error(e);
    m.reply('❌ Error generating question!');
  }
};

handler.command = ['truthordare', 'tod', 'truth', 'dare'];
handler.help = ['truthordare [truth|dare]'];
handler.tags = ['game'];
handler.exp = 5;
handler.group = true
handler.register = true;
handler.limit = true;

export default handler