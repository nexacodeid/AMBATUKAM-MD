let handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    if (!text) {
        return m.reply(`Use example: ${usedPrefix}${command} What is the meaning of life?`);
    }

    try {
        await m.reply("⏳ Please wait...");
        const apiUrl = global.API('theresav', '/ai/gemini', {
            q: text
        }, 'apikey');
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.status) {
            m.reply(data.result);
        } else {
            m.reply(`Error: ${data.message || 'Failed to fetch Gemini response.'}`);
        }
    } catch (error) {
        console.error(error);
        m.reply(`An error occurred: ${error.message || 'Failed to process the request.'}`);
    }
};

handler.help = ["gemini <text>"];
handler.tags = ["ai"];
handler.command = /^gemini$/i;
handler.description = "Generates text using the Gemini AI model.";
handler.register = true;
handler.limit = true;

export default handler;