/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

/*
  Tolong Jangan Pernah Hapus Watermark Ini
  Script By : JazxCode
  Name Script : Interindah - Assistant MD 
  Version : V1.0
  Follow Saluran : https://whatsapp.com/channel/0029VaylUlU77qVT3vDPjv11
*/

const handler = async (m, { text }) => {
    if (!text) return m.reply("❌ Harap masukkan link channel WhatsApp!");
    if (!text.includes("https://whatsapp.com/channel/")) return m.reply("⚠️ Link tautan tidak valid!");

    let result = text.split("https://whatsapp.com/channel/")[1];
    let res = await conn.newsletterMetadata("invite", result);

    let teks = `
*📌 ID:* ${res.id}
*📢 Nama:* ${res.name}
*👥 Total Pengikut:* ${res.subscribers}
*📌 Status:* ${res.state}
*✅ Verified:* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}
`;

    return m.reply(teks);
};

handler.help = ["cekidch"]
handler.tags = ["tools"]
handler.command = ["cekidch", "idch"];
handler.register = true;
export default handler;

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */