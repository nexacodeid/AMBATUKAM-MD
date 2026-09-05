let handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    if (!text) {
        return m.reply(`Use example: ${usedPrefix}${command} Hello`);
    }

    try {
        await m.reply("⏳ Generating response...");
        const query = encodeURIComponent(text);
        const url = global.API('theresav', '/ai/googleai', {
            query: query
        }, 'apikey');
        const res = await fetch(url);
        const data = await res.json();

        if (data.status && data.result) {
            await m.reply(data.result);
        } else {
            console.error(data);
            await m.reply("Failed to generate response. Please try again later.");
        }
    } catch (error) {
        console.error(error);
        await m.reply("An error occurred while processing your request.");
    }
};

handler.help = ["googleai <text>"];
handler.tags = ["ai"];
handler.command = /^googleai$/i;
handler.description = "Generates a response using Google AI.";
handler.register = true;
handler.limit = true;

export default handler;