import fs from "fs";
import path from "path";
import syntaxError from "syntax-error";

let handler = async (m, { args, usedPrefix, command, isOwner }) => {
  if (!isOwner) return m.reply("Fitur ini khusus owner.");

  const target = args[0];

  if (!target) {
    return m.reply(
      `Masukkan nama file plugin atau gunakan all.\n\nContoh:\n${usedPrefix + command} rpg/judi.js\n${usedPrefix + command} tools/menu.js\n${usedPrefix + command} all`
    );
  }

  const pluginRoot = path.resolve("./plugins");

  if (/^all$/i.test(target)) {
    const files = getAllJsFiles(pluginRoot);

    if (!files.length) {
      return m.reply("Tidak ada file .js di folder plugins.");
    }

    const results = [];

    for (const filePath of files) {
      const relativePath = path.relative(pluginRoot, filePath).replace(/\\/g, "/");

      try {
        const code = fs.readFileSync(filePath, "utf8");

        const error = syntaxError(code, filePath, {
          sourceType: "module",
          allowAwaitOutsideFunction: true,
        });

        if (error) {
          results.push({
            file: relativePath,
            status: "error",
            error: formatError(error),
          });
        } else {
          results.push({
            file: relativePath,
            status: "ok",
          });
        }
      } catch (e) {
        results.push({
          file: relativePath,
          status: "error",
          error: e.message,
        });
      }
    }

    const errors = results.filter((v) => v.status === "error");
    const ok = results.filter((v) => v.status === "ok");

    let text = `
🔎 *CEK ERROR ALL PLUGINS*

✅ Aman: *${ok.length}*
❌ Error: *${errors.length}*
📦 Total: *${results.length}*
`.trim();

    if (errors.length) {
      text += `\n\n❌ *Daftar Error:*`;

      for (const item of errors.slice(0, 15)) {
        text += `\n\n📁 *${item.file}*\n${item.error}`;
      }

      if (errors.length > 15) {
        text += `\n\nDan ${errors.length - 15} error lainnya...`;
      }
    } else {
      text += `\n\nSemua plugin aman secara syntax.`;
    }

    return m.reply(text.slice(0, 4000));
  }

  const filePath = path.resolve(pluginRoot, target);

  if (!filePath.startsWith(pluginRoot)) {
    return m.reply("Path tidak valid.");
  }

  if (!fs.existsSync(filePath)) {
    return m.reply(`File tidak ditemukan:\n${target}`);
  }

  if (!filePath.endsWith(".js")) {
    return m.reply("Hanya bisa cek file .js");
  }

  try {
    const code = fs.readFileSync(filePath, "utf8");

    const error = syntaxError(code, filePath, {
      sourceType: "module",
      allowAwaitOutsideFunction: true,
    });

    if (error) {
      return m.reply(
        `
❌ *Syntax Error Ditemukan*

📁 File:
${target}

📌 Detail:
${formatError(error)}
`.trim()
      );
    }

    return m.reply(
      `
✅ *Tidak ada syntax error*

📁 File:
${target}

Kode aman secara syntax.
`.trim()
    );
  } catch (e) {
    console.error(e);
    return m.reply(
      `
❌ *Gagal cek error*

📁 File:
${target}

📌 Error:
${e.message}
`.trim()
    );
  }
};

handler.help = ["cekerror <path/all>"];
handler.tags = ["tools"];
handler.command = /^(cekerror|ceksyntax|checkerror)$/i;
handler.owner = true;

export default handler;

function getAllJsFiles(dir) {
  let results = [];

  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(getAllJsFiles(fullPath));
    } else if (entry.isFile() && fullPath.endsWith(".js")) {
      results.push(fullPath);
    }
  }

  return results;
}

function formatError(error) {
  return String(error)
    .replace(process.cwd(), ".")
    .slice(0, 1000);
}