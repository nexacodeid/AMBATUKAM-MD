const handler = async (m, { conn, args, usedPrefix, command }) => {
    conn.ticTacToe = conn.ticTacToe || {};

    if (!args[0] || args[0] === 'help') {
        const message = `*❏ TIC TAC TOE ⭕❌*

• ${usedPrefix}ttt start - Start a new Tic Tac Toe game
• ${usedPrefix}ttt join - Join an existing game
• ${usedPrefix}ttt <1-9> - Make your move
• ${usedPrefix}ttt stop - Stop the current game
• ${usedPrefix}ttt help - Show this help

*Board Positions:*
\`\`\`
 1 | 2 | 3 
---+---+---
 4 | 5 | 6 
---+---+---
 7 | 8 | 9 
\`\`\`

*Example:*
.ttt start
.ttt join
.ttt 5 (place your mark in position 5)`;

        await conn.sendMessage(m.chat, {
            text: message,
            contextInfo: {
                externalAdReply: {
                    title: "Tic Tac Toe Game",
                    body: 'TIC TAC TOE ⭕❌',
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
            case 'ttt':
                if (conn.ticTacToe[m.chat]) {
                    return m.reply('⚠️ There is already an active Tic Tac Toe game. Use `.ttt stop` to end it.');
                }

                conn.ticTacToe[m.chat] = {
                    board: Array(9).fill(null),
                    playerX: m.sender,
                    playerO: null,
                    currentTurn: 'X',
                    gameStarted: false,
                    creator: m.sender
                };

                m.reply(`✅ Tic Tac Toe room created!\n\nWaiting for opponent to join with: *.ttt join*\n\nYou will be ⭕ (X)`);
                break;

            case 'join':
                if (!conn.ticTacToe[m.chat]) {
                    return m.reply('❌ No active Tic Tac Toe room. Use `.ttt start` to create one.');
                }

                const room = conn.ticTacToe[m.chat];
                if (room.gameStarted) {
                    return m.reply('⚠️ Game has already started.');
                }

                if (room.playerO === m.sender || room.playerX === m.sender) {
                    return m.reply('⚠️ You have already joined this game.');
                }

                const playerName = m.pushName || conn.getName(m.sender);
                room.playerO = m.sender;
                room.gameStarted = true;

                const playerXName = conn.getName(room.playerX);
                m.reply(`✅ You joined the game! You are ❌ (O)\n\n⭕ ${playerXName} vs ❌ ${playerName}\n\n${playerXName}'s turn first!`);

                setTimeout(() => {
                    sendBoard(conn, m, room);
                }, 500);
                break;

            case 'stop':
                if (!conn.ticTacToe[m.chat]) {
                    return m.reply('❌ No active Tic Tac Toe game.');
                }

                const game = conn.ticTacToe[m.chat];
                if (game.creator !== m.sender && !m.isAdmin) {
                    return m.reply('⚠️ Only the room creator or admin can stop the game.');
                }

                const playerXName2 = conn.getName(game.playerX);
                const playerOName = game.playerO ? conn.getName(game.playerO) : 'None';

                m.reply(`🛑 Game stopped.\n\n⭕ ${playerXName2} vs ❌ ${playerOName}`);
                delete conn.ticTacToe[m.chat];
                break;

            case 'restart':
                if (!conn.ticTacToe[m.chat]) {
                    return m.reply('❌ No active Tic Tac Toe game.');
                }

                const restartGame = conn.ticTacToe[m.chat];
                if (restartGame.creator !== m.sender && !m.isAdmin) {
                    return m.reply('⚠️ Only the room creator or admin can restart the game.');
                }

                restartGame.board = Array(9).fill(null);
                restartGame.currentTurn = 'X';
                restartGame.gameStarted = !!(restartGame.playerX && restartGame.playerO);

                m.reply('🔄 Game board has been reset!');
                if (restartGame.gameStarted) {
                    setTimeout(() => sendBoard(conn, m, restartGame), 500);
                }
                break;

            default:
                if (!conn.ticTacToe[m.chat]) {
                    return m.reply('❌ No active Tic Tac Toe game. Use `.ttt start` to create one.');
                }

                const gameSession = conn.ticTacToe[m.chat];
                if (!gameSession.gameStarted) {
                    return m.reply('⚠️ Game hasn\'t started yet. Wait for an opponent to join with `.ttt join`.');
                }

                const position = parseInt(args[0]);
                if (isNaN(position) || position < 1 || position > 9) {
                    return m.reply('❌ Invalid position! Please enter a number from 1-9.');
                }

                const currentPlayer = gameSession.currentTurn === 'X' ? gameSession.playerX : gameSession.playerO;
                if (currentPlayer !== m.sender) {
                    const currentName = gameSession.currentTurn === 'X' 
                        ? conn.getName(gameSession.playerX) 
                        : conn.getName(gameSession.playerO);
                    return m.reply(`⚠️ It's ${currentName}'s turn, not yours.`);
                }

                if (gameSession.board[position - 1] !== null) {
                    return m.reply('❌ That position is already taken!');
                }

                gameSession.board[position - 1] = gameSession.currentTurn;

                if (checkWin(gameSession.board, gameSession.currentTurn)) {
                    const winnerName = gameSession.currentTurn === 'X' 
                        ? conn.getName(gameSession.playerX) 
                        : conn.getName(gameSession.playerO);
                    const winnerSymbol = gameSession.currentTurn === 'X' ? '⭕' : '❌';

                    sendBoard(conn, m, gameSession);
                    setTimeout(() => {
                        m.reply(`🎉 *${winnerName} (${winnerSymbol}) WINS!* 🎉`);
                        delete conn.ticTacToe[m.chat];
                    }, 100);
                    return;
                }

                if (gameSession.board.every(cell => cell !== null)) {
                    sendBoard(conn, m, gameSession);
                    setTimeout(() => {
                        m.reply('🤝 *It\'s a DRAW!*');
                        delete conn.ticTacToe[m.chat];
                    }, 100);
                    return;
                }

                gameSession.currentTurn = gameSession.currentTurn === 'X' ? 'O' : 'X';
                const nextPlayerName = gameSession.currentTurn === 'X' 
                    ? conn.getName(gameSession.playerX) 
                    : conn.getName(gameSession.playerO);
                const nextSymbol = gameSession.currentTurn === 'X' ? '⭕' : '❌';

                sendBoard(conn, m, gameSession);
                setTimeout(() => {
                    m.reply(`${nextSymbol} ${nextPlayerName}'s turn!`);
                }, 100);
                break;
        }
    } catch (error) {
        console.error(error);
        m.reply('❌ An error occurred. Please try again later.');
    }
};

function sendBoard(conn, m, game) {
    const symbols = { X: '⭕', O: '❌', null: '  ' };
    let board = '```\n';
    board += '  1   2   3  \n';
    board += ` ${getSymbol(game.board[0])} │ ${getSymbol(game.board[1])} │ ${getSymbol(game.board[2])} \n`;
    board += '───┼───┼───\n';
    board += ` ${getSymbol(game.board[3])} │ ${getSymbol(game.board[4])} │ ${getSymbol(game.board[5])} \n`;
    board += '───┼───┼───\n';
    board += ` ${getSymbol(game.board[6])} │ ${getSymbol(game.board[7])} │ ${getSymbol(game.board[8])} \n`;
    board += '```\n';

    const playerXName = conn.getName(game.playerX);
    const playerOName = game.playerO ? conn.getName(game.playerO) : 'Waiting...';
    const currentPlayer = game.currentTurn === 'X' ? playerXName : playerOName;
    const currentSymbol = game.currentTurn === 'X' ? '⭕' : '❌';

    board += `\n⭕ ${playerXName} vs ❌ ${playerOName}\n\n${currentSymbol} ${currentPlayer}'s turn!`;

    return conn.sendMessage(m.chat, { text: board }, { quoted: m });
}

function getSymbol(cell) {
    if (cell === null) return ' 1 ';
    return cell === 'X' ? ' X ' : ' O ';
}

function checkWin(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
}

handler.help = ['tictactoe', 'ttt'];
handler.tags = ['game'];
handler.command = /^(ttt|tictactoe)$/i;
handler.register = true;
handler.group = true;
handler.limit = true;

export default handler;
