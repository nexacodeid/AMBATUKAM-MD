import { tmpdir } from "os";
import { join } from "path";
import { writeFileSync, existsSync, unlinkSync } from "fs";
import { spawn } from "child_process";

let handler = async (m, { conn, usedPrefix, command }) => {
  let input, output;

  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mimetype || "";

    if (!/audio|video/.test(mime)) {
      return m.reply(`
Kirim atau reply audio/video dengan caption:
${usedPrefix + command}
`.trim());
    }

    await m.react("⏳");

    const media = await q.download();
    if (!media) throw new Error("Media gagal diunduh.");

    input = join(tmpdir(), `tovn-input-${Date.now()}`);
    output = join(tmpdir(), `tovn-output-${Date.now()}.opus`);

    writeFileSync(input, media);

    await convertToOpus(input, output);

    if (!existsSync(output)) throw new Error("File output tidak dibuat.");

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: output },
        mimetype: "audio/ogg; codecs=opus",
        ptt: true,
      },
      { quoted: m }
    );

    await m.react("✅");
  } catch (e) {
    console.error("TOVN ERROR:", e);
    await m.react("❌");
    m.reply(e?.message || "Gagal mengubah media menjadi voice note.");
  } finally {
    for (const file of [input, output]) {
      try {
        if (file && existsSync(file)) unlinkSync(file);
      } catch {}
    }
  }
};

handler.help = ["tovn"];
handler.tags = ["tools"];
handler.command = /^(tovn|tovoicenote|vn)$/i;
handler.register = true;

export default handler;

function convertToOpus(input, output) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-i",
      input,
      "-vn",
      "-acodec",
      "libopus",
      "-b:a",
      "64k",
      "-vbr",
      "on",
      "-compression_level",
      "10",
      "-application",
      "voip",
      "-ar",
      "48000",
      "-ac",
      "1",
      output,
    ]);

    let err = "";

    ffmpeg.stderr.on("data", (data) => {
      err += data.toString();
    });

    ffmpeg.on("error", reject);

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(err || `FFmpeg exited with code ${code}`));
    });
  });
}