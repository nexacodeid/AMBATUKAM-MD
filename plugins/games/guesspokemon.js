import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    conn.guessPokemon = conn.guessPokemon || {};

    if (!args[0] || args[0] === 'help') {
        const message = `*❏ GUESS THE POKEMON 🎮*

• ${usedPrefix}guesspokemon start - Start a new Pokemon guessing game
• ${usedPrefix}guesspokemon guess <name> - Guess the Pokemon
• ${usedPrefix}guesspokemon hint - Get a hint (costs points)
• ${usedPrefix}guesspokemon stop - Stop the current game
• ${usedPrefix}guesspokemon help - Show this help

*Rules:*
1. Bot shows a blurred/shadowed Pokemon image
2. Players guess the Pokemon name
3. First correct answer wins!
4. Hints available but reduce points

*Example:*
.guesspokemon start
.guesspokemon guess pikachu
.guesspokemon hint`;

        await conn.sendMessage(m.chat, {
            text: message,
            contextInfo: {
                externalAdReply: {
                    title: "Guess The Pokemon",
                    body: 'GUESS POKEMON 🎮',
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
                if (conn.guessPokemon[m.chat]) {
                    return m.reply('⚠️ There is already an active Pokemon guessing game. Use `.guesspokemon stop` to end it.');
                }

                const randomId = Math.floor(Math.random() * 898) + 1;
                const apiUrl = `https://pokeapi.co/api/v2/pokemon/${randomId}`;

                let pokemonData;
                try {
                    const response = await axios.get(apiUrl, { timeout: 10000 });
                    pokemonData = response.data;
                } catch (e) {
                    return m.reply('❌ Failed to fetch Pokemon data. Please try again later.');
                }

                const imageUrl = pokemonData.sprites.other['official-artwork'].front_default 
                    || pokemonData.sprites.front_default;

                if (!imageUrl) {
                    return m.reply('❌ Failed to get Pokemon image. Try again!');
                }

                const types = pokemonData.types.map(t => t.type.name).join(', ');
                const generation = Math.ceil(pokemonData.id / 151);

                conn.guessPokemon[m.chat] = {
                    name: pokemonData.name,
                    id: pokemonData.id,
                    types: types,
                    generation: generation,
                    imageUrl: imageUrl,
                    hintsUsed: 0,
                    answered: false,
                    startTime: Date.now()
                };

                const silhouetteText = `🎮 *GUESS THE POKEMON!* 🎮

A Pokemon silhouette/image has been sent!
Can you guess who it is?

*Generation:* ${getGenerationRoman(generation)}
*Types:* ${types.split(', ').map(t => capitalize(t)).join(' / ')}

Use *.guesspokemon guess <name>* to submit your answer!`;

                await conn.sendMessage(m.chat, { 
                    image: { url: imageUrl },
                    caption: silhouetteText
                }, { quoted: m });

                m.reply('💡 Tip: The first letter of the name is **' + pokemonData.name.charAt(0).toUpperCase() + '**');
                break;

            case 'guess':
                if (!conn.guessPokemon[m.chat]) {
                    return m.reply('❌ No active Pokemon guessing game. Use `.guesspokemon start` to begin.');
                }

                const game = conn.guessPokemon[m.chat];
                if (game.answered) {
                    return m.reply('⚠️ This game has already been answered!');
                }

                if (!args[1]) {
                    return m.reply('❌ Please provide your guess! Example: `.guesspokemon guess pikachu`');
                }

                const userGuess = args.slice(1).join(' ').toLowerCase().trim();
                const correctName = game.name.toLowerCase();

                if (userGuess === correctName || userGuess === correctName.replace('-', ' ')) {
                    game.answered = true;
                    const timeTaken = Math.round((Date.now() - game.startTime) / 1000);
                    
                    let basePoints = 100;
                    const hintPenalty = game.hintsUsed * 20;
                    const timeBonus = Math.max(0, 30 - timeTaken) * 2;
                    const finalPoints = Math.max(10, basePoints - hintPenalty + timeBonus);

                    const playerName = m.pushName || conn.getName(m.sender);

                    let message = `🎉 *CORRECT!* 🎉\n\n`;
                    message += `The Pokemon is: *${capitalize(game.name)}*\n\n`;
                    message += `🏆 *${playerName}* wins!\n`;
                    message += `⏱️ Time: ${timeTaken} seconds\n`;
                    message += `💡 Hints used: ${game.hintsUsed}\n`;
                    message += `✨ Points earned: *${finalPoints}*`;

                    await conn.sendMessage(m.chat, {
                        image: { url: game.imageUrl },
                        caption: message
                    }, { quoted: m });
                    delete conn.guessPokemon[m.chat];
                } else {
                    m.reply(`❌ *${capitalize(userGuess)}* is not correct. Try again!`);
                }
                break;

            case 'hint':
                if (!conn.guessPokemon[m.chat]) {
                    return m.reply('❌ No active Pokemon guessing game.');
                }

                const hintGame = conn.guessPokemon[m.chat];
                if (hintGame.answered) {
                    return m.reply('⚠️ This game has already been answered!');
                }

                if (hintGame.hintsUsed >= 3) {
                    return m.reply('⚠️ Maximum hints (3) already used!');
                }

                hintGame.hintsUsed++;
                const hintNum = hintGame.hintsUsed;
                const pokemonName = hintGame.name;

                let hint = '';
                if (hintNum === 1) {
                    const firstTwo = pokemonName.substring(0, 2);
                    hint = `💡 *Hint #1:* The name starts with "**${firstTwo}**"`;
                } else if (hintNum === 2) {
                    const nameLength = pokemonName.length;
                    hint = `💡 *Hint #2:* The name has *${nameLength}* letters`;
                } else if (hintNum === 3) {
                    const withoutFirst = pokemonName.replace(new RegExp(pokemonName.charAt(0), 'g'), '_');
                    hint = `💡 *Hint #3:* Pattern: ${pokemonName.split('').map((c, i) => i === 0 ? c.toUpperCase() : '_').join('')}`;
                }

                m.reply(hint);
                break;

            case 'stop':
                if (!conn.guessPokemon[m.chat]) {
                    return m.reply('❌ No active Pokemon guessing game.');
                }

                const stopGame = conn.guessPokemon[m.chat];
                await conn.sendMessage(m.chat, {
                    image: { url: stopGame.imageUrl },
                    caption: `🛑 Game stopped.\n\nThe Pokemon was: *${capitalize(stopGame.name)}*`
                }, { quoted: m });
                delete conn.guessPokemon[m.chat];
                break;

            default:
                m.reply('❌ Unknown command. Use `.guesspokemon help` to see available commands.');
        }
    } catch (error) {
        console.error(error);
        m.reply('❌ An error occurred. Please try again later.');
    }
};

function capitalize(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function getGenerationRoman(num) {
    const roman = {
        1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
        6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX'
    };
    return roman[num] || num;
}

handler.help = ['guesspokemon <start|guess|hint|stop|help>'];
handler.tags = ['game'];
handler.command = /^guesspokemon$/i;
handler.register = true;
handler.limit = true;
handler.group = true

export default handler