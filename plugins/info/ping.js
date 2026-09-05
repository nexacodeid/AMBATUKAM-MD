import { performance } from "perf_hooks";
import { exec } from "child_process";
import os from "os";

let handler = async (m, { conn }) => {
  let _muptime;

  if (process.send) {
    process.send("uptime");

    _muptime =
      (await new Promise((resolve) => {
        process.once("message", resolve);
        setTimeout(() => resolve(process.uptime()), 1000);
      })) * 1000;
  } else {
    _muptime = process.uptime() * 1000;
  }

  const muptime = clockString(_muptime);

  const start = performance.now();
  const latency = performance.now() - start;

  exec("neofetch --stdout", (error, stdout) => {
    let systemInfo;

    if (!error && stdout) {
      systemInfo = stdout.toString("utf-8").replace(/Memory:/i, "Ram:");
    } else {
      systemInfo = getFallbackSystemInfo();
    }

    conn.reply(
      m.chat,
      `
${systemInfo}

*[⚡] Kecepatan* : ${latency.toFixed(4)} ms
*[🌏] Bot aktif selama* :
${muptime}
`.trim(),
      m
    );
  });
};

handler.help = ["ping"];
handler.tags = ["main"];
handler.command = ["ping", "speed"];

export default handler;

// ===== SYSTEM INFO FALLBACK =====
function getFallbackSystemInfo() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  return `
*System Info*

*OS* : ${os.platform()} ${os.arch()}
*CPU* : ${os.cpus()?.[0]?.model || "-"}
*Ram* : ${formatSize(usedMem)} / ${formatSize(totalMem)}
*NodeJS* : ${process.version}
`.trim();
}

function formatSize(bytes = 0) {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

function clockString(ms) {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor(ms / 3600000) % 24;
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;

  return `${d} Hari ${h} Jam ${m} Menit ${s} Detik`;
}