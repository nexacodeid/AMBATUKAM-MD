const commonWords = [
    'apple', 'banana', 'cat', 'dog', 'elephant', 'fish', 'goat', 'house',
    'ice', 'juice', 'kite', 'lion', 'mouse', 'nest', 'owl', 'pig',
    'queen', 'rabbit', 'snake', 'tiger', 'umbrella', 'van', 'whale', 'fox',
    'yak', 'zebra', 'ant', 'bear', 'cow', 'deer', 'eagle', 'frog',
    'grape', 'horse', 'igloo', 'jellyfish', 'koala', 'lemon', 'monkey', 'noodle',
    'octopus', 'penguin', 'quilt', 'rat', 'sun', 'tree', 'unicorn', 'vulture',
    'wolf', 'xray', 'yacht', 'zero', 'air', 'ball', 'car', 'door',
    'egg', 'fan', 'gun', 'hat', 'ink', 'jar', 'key', 'lamp',
    'moon', 'nose', 'ocean', 'pen', 'rain', 'star', 'train', 'boat',
    'cloud', 'duck', 'ear', 'fire', 'girl', 'hand', 'island', 'jump',
    'king', 'leaf', 'milk', 'night', 'orange', 'park', 'question', 'river',
    'sand', 'table', 'under', 'voice', 'water', 'box', 'yellow', 'zipper'
];

const handler = async (m, { conn, args, usedPrefix, command }) => {
    conn.wordChain = conn.wordChain || {};

    if (!args[0] || args[0] === 'help') {
        const message = `*❏ WORD CHAIN GAME 🔤*

• ${usedPrefix}wordchain start - Start a new word chain game
• ${usedPrefix}wordchain join - Join an existing game
• ${usedPrefix}wordchain <word> - Submit your word
• ${usedPrefix}wordchain stop - Stop the current game
• ${usedPrefix}wordchain help - Show this help

*Rules:*
1. Each word must start with the last letter of the previous word
2. Words must be at least 3 letters long
3. No repeating words in the same game
4. Only alphabetic characters allowed

*Example:*
.wordchain start
.wordchain join
.wordchain apple (next player: elephant, tiger, etc.)`;

        await conn.sendMessage(m.chat, {
            text: message,
            contextInfo: {
                externalAdReply: {
                    title: "Word Chain Game",
                    body: 'WORD CHAIN 🔤',
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
                if (conn.wordChain[m.chat]) {
                    return m.reply('⚠️ There is already an active word chain game. Use `.wordchain stop` to end it.');
                }

                conn.wordChain[m.chat] = {
                    players: [],
                    usedWords: [],
                    currentTurn: 0,
                    lastWord: null,
                    gameStarted: false,
                    creator: m.sender
                };

                m.reply(`✅ Word Chain room created!\n\nOther players can join with: *.wordchain join*\nMinimum 2 players to start. Use *.wordchain start* again to begin.`);
                break;

            case 'join':
                if (!conn.wordChain[m.chat]) {
                    return m.reply('❌ No active word chain room. Use `.wordchain start` to create one.');
                }

                const room = conn.wordChain[m.chat];
                if (room.players.find(p => p.id === m.sender)) {
                    return m.reply('⚠️ You have already joined this game.');
                }

                const playerName = m.pushName || conn.getName(m.sender);
                room.players.push({
                    id: m.sender,
                    name: playerName,
                    score: 0
                });

                m.reply(`✅ You joined the game! Total players: ${room.players.length}`);

                if (room.players.length >= 2 && !room.gameStarted) {
                    room.gameStarted = true;
                    room.currentTurn = 0;

                    const starterWord = commonWords[Math.floor(Math.random() * commonWords.length)];
                    room.lastWord = starterWord;
                    room.usedWords.push(starterWord);

                    setTimeout(() => {
                        m.reply(`🎮 *Game Started!*\n\nStarting word: *${starterWord.toUpperCase()}*\n\nIt's ${room.players[0].name}'s turn! Submit a word starting with "${starterWord.charAt(starterWord.length - 1).toUpperCase()}"`);
                    }, 1000);
                }
                break;

            case 'stop':
                if (!conn.wordChain[m.chat]) {
                    return m.reply('❌ No active word chain game.');
                }

                const game = conn.wordChain[m.chat];
                if (game.creator !== m.sender && !m.isAdmin) {
                    return m.reply('⚠️ Only the room creator or admin can stop the game.');
                }

                if (game.players.length > 0) {
                    const leaderboard = game.players
                        .sort((a, b) => b.score - a.score)
                        .map((p, i) => `${i + 1}. ${p.name} - ${p.score} points`)
                        .join('\n');

                    m.reply(`🏁 *Game Ended!*\n\n🏆 *Leaderboard:*\n${leaderboard}`);
                } else {
                    m.reply('🛑 Game stopped.');
                }

                delete conn.wordChain[m.chat];
                break;

            default:
                if (!conn.wordChain[m.chat]) {
                    return m.reply('❌ No active word chain game. Use `.wordchain start` to create one.');
                }

                const gameSession = conn.wordChain[m.chat];
                if (!gameSession.gameStarted) {
                    return m.reply('⚠️ Game hasn\'t started yet. Wait for more players or use `.wordchain start` again to begin.');
                }

                const submittedWord = args[0].toLowerCase().trim();

                if (!/^[a-zA-Z]+$/.test(submittedWord)) {
                    return m.reply('❌ Words can only contain alphabetic characters.');
                }

                if (submittedWord.length < 3) {
                    return m.reply('❌ Words must be at least 3 letters long.');
                }

                if (gameSession.usedWords.includes(submittedWord)) {
                    return m.reply('❌ This word has already been used.');
                }

                const currentPlayer = gameSession.players[gameSession.currentTurn];
                if (currentPlayer.id !== m.sender) {
                    return m.reply(`⚠️ It's ${currentPlayer.name}'s turn, not yours.`);
                }

                const lastLetter = gameSession.lastWord.charAt(gameSession.lastWord.length - 1).toLowerCase();
                if (submittedWord.charAt(0).toLowerCase() !== lastLetter) {
                    return m.reply(`❌ Word must start with "${lastLetter.toUpperCase()}" (last letter of "${gameSession.lastWord}")`);
                }

                gameSession.usedWords.push(submittedWord);
                currentPlayer.score += 10;
                gameSession.lastWord = submittedWord;

                m.reply(`✅ *${submittedWord.toUpperCase()}* is valid! +10 points\n\n${currentPlayer.name}: ${currentPlayer.score} points`);

                gameSession.currentTurn = (gameSession.currentTurn + 1) % gameSession.players.length;
                const nextPlayer = gameSession.players[gameSession.currentTurn];
                const nextLetter = submittedWord.charAt(submittedWord.length - 1).toUpperCase();

                setTimeout(() => {
                    m.reply(`🎯 ${nextPlayer.name}'s turn! Submit a word starting with "${nextLetter}"`);
                }, 1000);
                break;
        }
    } catch (error) {
        console.error(error);
        m.reply('❌ An error occurred. Please try again later.');
    }
};

handler.help = ['wordchain <start|join|stop|help>', 'wordchain <word>'];
handler.tags = ['game'];
handler.command = /^wordchain$/i;
handler.register = true;
handler.group = true;
handler.limit = true;

export default handler;
