let handler = async (m) => {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/BochilTeam/database/master/kata-kata/truth.json"
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const result = await res.json();
    const data = Array.isArray(result) ? result : result.data;

    if (!Array.isArray(data) || !data.length) {
      throw new Error("Data truth kosong atau format tidak valid.");
    }

    const truth = data[Math.floor(Math.random() * data.length)];

    await m.reply(`*Truth*\n\n${truth}`);
  } catch (e) {
    console.error("Error truth:", e);
    m.reply("Gagal mengambil pertanyaan truth. Coba lagi nanti.");
  }
};

handler.help = ["truth"];
handler.tags = ["fun"];
handler.command = /^(truth)$/i;
handler.register = true;

export default handler;