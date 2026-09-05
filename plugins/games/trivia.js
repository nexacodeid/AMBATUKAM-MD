const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    const trivia = [
      {
        question: "What is the capital of France?",
        answers: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
      },
      {
        question: "Which planet is known as the Red Planet?",
        answers: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
      },
      {
        question: "What is the largest mammal in the world?",
        answers: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct: 1
      },
      {
        question: "Who painted the Mona Lisa?",
        answers: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
        correct: 2
      },
      {
        question: "What is the chemical symbol for gold?",
        answers: ["Go", "Gd", "Au", "Ag"],
        correct: 2
      },
      {
        question: "In which year did World War II end?",
        answers: ["1943", "1944", "1945", "1946"],
        correct: 2
      },
      {
        question: "What is the smallest country in the world?",
        answers: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        correct: 1
      },
      {
        question: "How many continents are there?",
        answers: ["5", "6", "7", "8"],
        correct: 2
      },
      {
        question: "What is the hardest natural substance?",
        answers: ["Gold", "Iron", "Diamond", "Platinum"],
        correct: 2
      },
      {
        question: "Which ocean is the largest?",
        answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: 3
      }
    ];

    const randomTrivia = trivia[Math.floor(Math.random() * trivia.length)];

    const options = randomTrivia.answers.map((a, i) => `${i + 1}. ${a}`).join('\n');

    const message = `╭───「 *TRIVIA QUIZ* 」───⬣
│
│ ❓ *Question:*
│ ${randomTrivia.question}
│
│ 📝 *Options:*
│ ${options}
│
│ ⏱️ Answer with 1, 2, 3, or 4
│
╰─────────────────────⬣`;

    const sentMsg = await conn.sendMessage(m.chat, {
      text: message,
      contextInfo: {
        externalAdReply: {
          title: 'Trivia Quiz',
          body: 'Test Your Knowledge!',
          thumbnailUrl: 'https://api.deline.web.id/2qOH0fJyNH.jpg',
          sourceUrl: global.website
        }
      }
    }, { quoted: m });

    const sessionKey = `${m.chat}:${m.sender}`;
    global.interactiveSessions.set(sessionKey, {
      messageId: sentMsg.key.id,
      callback: async (response) => {
        const answer = parseInt(response.text.trim());
        
        if (isNaN(answer) || answer < 1 || answer > 4) {
          return response.reply('❌ Please answer with 1, 2, 3, or 4');
        }

        const isCorrect = (answer - 1) === randomTrivia.correct;
        
        if (isCorrect) {
          await response.reply(`✅ *CORRECT!* 🎉\n\nThe answer is: ${randomTrivia.answers[randomTrivia.correct]}\n\n+10 EXP!`);
        } else {
          await response.reply(`❌ *WRONG!* 😅\n\nThe correct answer was: ${randomTrivia.answers[randomTrivia.correct]}\n\nBetter luck next time!`);
        }
      }
    });

    setTimeout(() => {
      global.interactiveSessions.delete(sessionKey);
    }, 60000);

  } catch (e) {
    console.error(e);
    m.reply('❌ Error starting trivia!');
  }
};

handler.command = ['trivia', 'quiz', 'triviaquiz'];
handler.help = ['trivia'];
handler.tags = ['game'];
handler.exp = 5;
handler.group = true
handler.register = true;
handler.limit = true;

export default handler