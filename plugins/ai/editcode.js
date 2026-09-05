import axios from "axios";
import js_beautify from "js-beautify";
import { AIRich, ButtonV2 } from "../../lib/messagebutton.js";

async function geminiProxy(input, model = "gemini-2.0-flash") {
    if (!input) throw new Error("Input message is required.");

    const {
        data
    } = await axios.post(
        "https://us-central1-infinite-chain-295909.cloudfunctions.net/gemini-proxy-staging-v1", {
            model,
            contents: [{
                role: "user",
                parts: [{
                    text: input
                }]
            }],
        }, {
            headers: {
                accept: "*/*",
                "content-type": "application/json",
                "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
            },
        }
    );

    if (!data.candidates || !data.candidates[0]) throw new Error("AI failed to provide a response.");

    const text = data.candidates[0].content.parts[0].text?.trim();
    if (!text) throw new Error("Respon kosong dari AI.");

    return text;
}

function buildEditPrompt(sourceCode, instruction) {
    return `
You are an expert WhatsApp bot developer and senior JavaScript engineer.
Your task is to EDIT the provided source code based on the user's instruction.

RULES:
1. Modify ONLY the necessary code based on the instruction.
2. Do NOT change existing logic unless required.
3. Maintain variable names, imports, structure, and flow.
4. Return ONLY valid raw code — NO markdown, NO backticks, NO explanation.
5. If the request cannot be executed, return JSON:
   { "success": false, "message": "Explanation." }

User Edit Instruction:
${instruction}

Original Code:
${sourceCode}

Return the fully edited code.
`;
}

const handler = async (m, {
    conn,
    args
}) => {
    const instruction = args.join(" ");
    if (!instruction)
        return m.reply(`⚠️ Contoh penggunaan:\n.editcode tambahkan anti spam\nLalu reply kode yang ingin diedit.`);

    const sourceCode = m.quoted?.text;
    if (!sourceCode)
        return m.reply("⚠️ Reply kode yang ingin diedit.");

    await m.reply(`🔄 Mengedit kode sesuai instruksi...\n📝 *${instruction}*`);

    try {
        const prompt = buildEditPrompt(sourceCode, instruction);
        let codeResult = await geminiProxy(prompt);

        if (codeResult.startsWith("{")) {
            try {
                const errJson = JSON.parse(codeResult);
                if (errJson.success === false)
                    return m.reply(`❌ Gagal mengedit: ${errJson.message}`);
            } catch {}
        }

        codeResult = codeResult.replace(/```[\w]*\n?/g, "").replace(/```/g, "").trim();

        codeResult = js_beautify(codeResult, {
            indent_size: 2,
            space_in_empty_paren: true,
        });

        try {
            return await new AIRich(conn)
                .setTitle("Edited Code")
                .addText(`Instruksi: ${instruction}`)
                .addCode("javascript", codeResult)
                .addSuggest(["Jelaskan perubahan", "Optimalkan kode", "Cari bug"])
                .send(m.chat, { quoted: m });
        } catch (e) {
            console.log("SEND EDITCODE AIRICH ERROR:", e);
            try {
                return await new ButtonV2(conn)
                    .setBody(`乂 *Edited Code*\n\n\`\`\`javascript\n${codeResult}\n\`\`\``)
                    .setFooter(global.namebot || "AI Code Editor")
                    .addButton("🔍 Jelaskan", ".gpt jelaskan kode ini")
                    .addButton("🛠️ Edit Lagi", ".editcode ")
                    .send(m.chat, { quoted: m });
            } catch (err) {
                console.log("SEND EDITCODE BUTTON ERROR:", err);
                await conn.sendMessage(m.chat, {
                    text: codeResult
                }, {
                    quoted: m
                });
            }
        }
    } catch (err) {
        console.error("Edit Code AI Error:", err);
        await conn.sendMessage(
            m.chat, {
                text: `❌ Gagal mengedit kode: ${err.message}`
            }, {
                quoted: m
            }
        );
    }
};

handler.help = ["editcode <instruksi> (reply kode)"];
handler.tags = ["ai"];
handler.command = /^editcode$/i;
handler.owner = true;
handler.description = "Edit kode WhatsApp bot menggunakan AI.";
handler.register = true;
handler.limit = true;

export default handler;