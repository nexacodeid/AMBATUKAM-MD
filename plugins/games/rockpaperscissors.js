const handler = async (m, { conn, args, usedPrefix, command }) => {
    conn.rockPaperScissor = conn.rockPaperScissor || {};

    if (!args[0] || args[0] === 'help') {
        const message = `*❏ ROCK PAPER SCISSOR ✂️📄🪨*

• ${usedPrefix}rps start - Start a new game
• ${usedPrefix}rps join - Join an existing game
• ${usedPrefix}rps <choice> - Make your choice
• ${usedPrefix}rps stop - Stop the current game
• ${usedPrefix}rps help - Show this help

*Choices:*
• rock (🪨)
• paper (📄)
• scissors (✂️)

*Rules:*
• Rock beats Scissors
• Scissors beats Paper
• Paper beats Rock

*Example:*
.rps start
.rps join
.rps rock`;

        await conn.sendMessage(m.chat, {
            text: message,
            contextInfo: {
                externalAdReply: {
                    title: "Rock Paper Scissors",
                    body: 'RPS ✂️📄🪨',
                    thumbnailUrl: global.thumb,
                    sourceUrl: global.website,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
        return;
    }

    try {
        switch (args[0].toLowerCase()) {
            case 'start':
            case 'rps':
                if (conn.rockPaperScissor[m.chat]) {
                    return m.reply('⚠️ There is already an active Rock Paper Scissors game. Use `.rps stop` to end it.');
                }

                conn.rockPaperScissor[m.chat] = {
                    player1: m.sender,
                    player2: null,
                    player1Choice: null,
                    player2Choice: null,
                    gameStarted: false,
                    creator: m.sender
                };

                m.reply(`✅ Rock Paper Scissors room created!\n\nWaiting for opponent to join with: *.rps join*\n\nYou are Player 1 (🪨/📄/✂️)`);
                break;

            case 'join':
                if (!conn.rockPaperScissor[m.chat]) {
                    return m.reply('❌ No active Rock Paper Scissors room. Use `.rps start` to create one.');
                }

                const room = conn.rockPaperScissor[m.chat];
                if (room.gameStarted) {
                    return m.reply('⚠️ Game has already started.');
                }

                if (room.player2 === m.sender) {
                    return m.reply('⚠️ You have already joined this game.');
                }

                const playerName = m.pushName || conn.getName(m.sender);
                room.player2 = m.sender;
                room.gameStarted = true;

                const player1Name = conn.getName(room.player1);
                m.reply(`✅ You joined the game! You are Player 2.\n\n🎮 ${player1Name} vs ${playerName}\n\nBoth players, submit your choice with: *.rps rock|paper|scissors*`);
                break;

            case 'stop':
                if (!conn.rockPaperScissor[m.chat]) {
                    return m.reply('❌ No active Rock Paper Scissors game.');
                }

                const game = conn.rockPaperScissor[m.chat];
                if (game.creator !== m.sender && !m.isAdmin) {
                    return m.reply('⚠️ Only the room creator or admin can stop the game.');
                }

                const p1Name = conn.getName(game.player1);
                const p2Name = game.player2 ? conn.getName(game.player2) : 'None';

                m.reply(`🛑 Game stopped.\n\n👤 Player 1: ${p1Name}\n👤 Player 2: ${p2Name}`);
                delete conn.rockPaperScissor[m.chat];
                break;

            case 'rock':
            case 'paper':
            case 'scissors':
            case 'scissor':
                if (!conn.rockPaperScissor[m.chat]) {
                    return m.reply('❌ No active Rock Paper Scissors game. Use `.rps start` to create one.');
                }

                const gameSession = conn.rockPaperScissor[m.chat];
                if (!gameSession.gameStarted) {
                    return m.reply('⚠️ Game hasn\'t started yet. Wait for an opponent to join with `.rps join`.');
                }

                const choice = args[0].toLowerCase().replace('scissor', 'scissors');
                const validChoices = ['rock', 'paper', 'scissors'];
                const choiceEmoji = { rock: '🪨', paper: '📄', scissors: '✂️' };

                if (!validChoices.includes(choice)) {
                    return m.reply('❌ Invalid choice! Choose: rock, paper, or scissors');
                }

                if (gameSession.player1 === m.sender) {
                    if (gameSession.player1Choice) {
                        return m.reply('⚠️ You have already made your choice. Wait for Player 2.');
                    }
                    gameSession.player1Choice = choice;
                    m.reply(`✅ Player 1 chose ${choiceEmoji[choice]}. Waiting for Player 2...`);
                } else if (gameSession.player2 === m.sender) {
                    if (gameSession.player2Choice) {
                        return m.reply('⚠️ You have already made your choice. Wait for Player 1.');
                    }
                    gameSession.player2Choice = choice;
                    m.reply(`✅ Player 2 chose ${choiceEmoji[choice]}. Waiting for Player 1...`);
                } else {
                    return m.reply('⚠️ You are not part of this game.');
                }

                if (gameSession.player1Choice && gameSession.player2Choice) {
                    const p1Name = conn.getName(gameSession.player1);
                    const p2Name = conn.getName(gameSession.player2);
                    const c1 = gameSession.player1Choice;
                    const c2 = gameSession.player2Choice;

                    let result = `🎮 *RESULTS* 🎮\n\n`;
                    result += `👤 ${p1Name}: ${choiceEmoji[c1]} ${capitalize(c1)}\n`;
                    result += `👤 ${p2Name}: ${choiceEmoji[c2]} ${capitalize(c2)}\n\n`;

                    const winner = determineWinner(c1, c2);

                    if (winner === 'draw') {
                        result += `🤝 *It's a DRAW!*`;
                    } else if (winner === 'player1') {
                        result += `🏆 *${p1Name} WINS!*`;
                    } else {
                        result += `🏆 *${p2Name} WINS!*`;
                    }

                    m.reply(result);
                    setTimeout(() => {
                        delete conn.rockPaperScissor[m.chat];
                    }, 1000);
                }
                break;

            default:
                m.reply('❌ Unknown command. Use `.rps help` to see available commands.');
        }
    } catch (error) {
        console.error(error);
        m.reply('❌ An error occurred. Please try again later.');
    }
};

function determineWinner(choice1, choice2) {
    if (choice1 === choice2) return 'draw';
    
    if (
        (choice1 === 'rock' && choice2 === 'scissors') ||
        (choice1 === 'paper' && choice2 === 'rock') ||
        (choice1 === 'scissors' && choice2 === 'paper')
    ) {
        return 'player1';
    }
    
    return 'player2';
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

handler.help = ['rockpaperscissors', 'rps'];
handler.tags = ['game'];
handler.command = /^(rps|rockpaperscissors)$/i;
handler.register = true;
handler.group = true;
handler.limit = true;

export default handler;
