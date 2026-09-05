let handler = async (m) => {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/BochilTeam/database/master/kata-kata/dare.json"
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const result = await res.json();
    const data = Array.isArray(result) ? result : result.data;

    if (!Array.isArray(data) || !data.length) {
      throw new Error("Data dare kosong atau format tidak valid.");
    }

    const dare = data[Math.floor(Math.random() * data.length)];

    await m.reply(`*Dare*\n\n${dare}`);
  } catch (e) {
    console.error("Error dare:", e);
    m.reply("Gagal mengambil tantangan dare. Coba lagi nanti.");
  }
};

handler.help = ["dare"];
handler.tags = ["fun"];
handler.command = /^(dare)$/i;
handler.register = true;

export default handler;