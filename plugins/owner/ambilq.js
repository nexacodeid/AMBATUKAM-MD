import fs from "fs";
import util from "util";

const handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return m.reply("❌ Fitur ini hanya untuk *Owner Bot*!");

    const q = m.quoted;
    if (!q) return m.reply("⚠️ Balas (reply) pesan yang ingin kamu ambil JSON-nya!");

    try {
        const info = [];

        const rawType = q.mtype || (q.message ? Object.keys(q.message)[0] : "unknown");

        const typeMap = {
            conversation: "Text",
            extendedTextMessage: "Text (Extended)",
            imageMessage: "Gambar",
            videoMessage: "Video",
            audioMessage: "Audio",
            stickerMessage: "Stiker",
            documentMessage: "Dokumen",
            viewOnceMessageV2: "View Once",
            ephemeralMessage: "Ephemeral"
        };

        const jenisPesan = typeMap[rawType] || rawType;

        info.push(`📩 *INFORMASI PESAN*`);
        info.push(`🆔 ID: ${q.id || "Tidak diketahui"}`);
        info.push(`👤 Pengirim: ${q.sender || "Tidak diketahui"}`);
        info.push(`💬 Jenis: ${jenisPesan}`);
        info.push(`📜 Teks: ${q.text || q.caption || "(tidak ada teks)"}`);

        const msgContent = q.msg || q.message?.[rawType] || q;

        if (msgContent?.mimetype)
            info.push(`🖼️ MimeType: ${msgContent.mimetype}`);

        if (msgContent?.fileLength)
            info.push(`📦 Ukuran: ${(msgContent.fileLength / 1024).toFixed(2)} KB`);

        if (msgContent?.contextInfo?.isForwarded)
            info.push(`🔁 Pesan ini hasil forward (${msgContent.contextInfo.forwardingScore || 1}x)`);

        if (msgContent?.contextInfo?.mentionedJid?.length)
            info.push(`🏷️ Mention: ${msgContent.contextInfo.mentionedJid.join(", ")}`);

        if (m.isGroup)
            info.push(`👥 Grup: ${m.chat}`);

        await m.reply(info.join("\n"));

        const targetJson = q.message || q.fakeObj?.message || q;
        const jsonString = JSON.stringify(targetJson, null, 2);


        await m.reply(`📦 *QUOTED MESSAGE JSON*\n\`\`\`${jsonString}\`\`\``);

    } catch (error) {
        console.error(error);
        m.reply(`❌ Terjadi kesalahan: ${error.message}`);
    }
};

handler.help = ["getjson"];
handler.tags = ["owner"];
handler.command = /^(getjson|jsonq|q)$/i;
handler.owner = true;

export default handler;