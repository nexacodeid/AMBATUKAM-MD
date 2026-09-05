import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import syntaxError from 'syntax-error';

const handler = async (m, { args, usedPrefix, command }) => {
  const pluginRoot = path.resolve('./plugins');

  if (!fs.existsSync(pluginRoot)) {
    return m.reply('Folder plugins tidak ditemukan.');
  }

  const mode = (args[0] || 'static').toLowerCase();
  const withImport = /^(import|deep|full)$/i.test(mode);
  const files = getAllJsFiles(pluginRoot);

  if (!files.length) {
    return m.reply('Tidak ada file .js di folder plugins.');
  }

  const results = [];

  for (const filePath of files) {
    const rel = path.relative(pluginRoot, filePath).replace(/\\/g, '/');

    try {
      const code = fs.readFileSync(filePath, 'utf8');
      const syn = syntaxError(code, filePath, {
        sourceType: 'module',
        allowAwaitOutsideFunction: true,
      });

      if (syn) {
        results.push({ file: rel, status: 'error', type: 'syntax', message: formatError(syn) });
        continue;
      }

      const hasDefaultExport = /export\s+default\s+/m.test(code);
      const hasCommand = /\.command\s*=/.test(code) || /customPrefix\s*=/.test(code) || /\.all\s*=/.test(code) || /\.before\s*=/.test(code);
      const hasMeta = /\.help\s*=/.test(code) && /\.tags\s*=/.test(code);

      if (!hasDefaultExport) {
        results.push({ file: rel, status: 'warn', type: 'export', message: 'Tidak ada export default.' });
        continue;
      }

      if (!hasCommand) {
        results.push({ file: rel, status: 'warn', type: 'command', message: 'Tidak ada handler.command / customPrefix / before / all.' });
        continue;
      }

      if (withImport) {
        try {
          const url = pathToFileURL(filePath).href + `?health=${Date.now()}-${Math.random()}`;
          const mod = await import(url);
          const plug = mod.default;

          if (!plug) {
            results.push({ file: rel, status: 'warn', type: 'default', message: 'Default export kosong.' });
            continue;
          }

          if (typeof plug !== 'function') {
            results.push({ file: rel, status: 'warn', type: 'handler', message: 'Default export bukan function handler.' });
            continue;
          }
        } catch (e) {
          results.push({ file: rel, status: 'error', type: 'import', message: e?.stack || e?.message || String(e) });
          continue;
        }
      }

      results.push({
        file: rel,
        status: hasMeta ? 'ok' : 'warn',
        type: hasMeta ? 'ok' : 'meta',
        message: hasMeta ? 'OK' : 'Tidak ada handler.help atau handler.tags.',
      });
    } catch (e) {
      results.push({ file: rel, status: 'error', type: 'read', message: e?.stack || e?.message || String(e) });
    }
  }

  const ok = results.filter((v) => v.status === 'ok');
  const warn = results.filter((v) => v.status === 'warn');
  const err = results.filter((v) => v.status === 'error');

  let text = `
🩺 *PLUGIN HEALTH CHECK*

📦 Total plugin: *${results.length}*
✅ Normal: *${ok.length}*
⚠️ Warning: *${warn.length}*
❌ Error: *${err.length}*
🔍 Mode: *${withImport ? 'import/deep' : 'static'}*
`.trim();

  if (err.length) {
    text += `\n\n❌ *ERROR:*`;
    for (const item of err.slice(0, 10)) {
      text += `\n\n📁 *${item.file}*\n${cut(item.message, 450)}`;
    }
    if (err.length > 10) text += `\n\n...dan ${err.length - 10} error lainnya.`;
  }

  if (warn.length) {
    text += `\n\n⚠️ *WARNING:*`;
    for (const item of warn.slice(0, 15)) {
      text += `\n• ${item.file} — ${item.message}`;
    }
    if (warn.length > 15) text += `\n...dan ${warn.length - 15} warning lainnya.`;
  }

  if (!err.length && !warn.length) {
    text += `\n\nSemua plugin terlihat sehat.`;
  }

  text += `\n\nTips:\n${usedPrefix + command} import\nUntuk cek error saat plugin di-import.`;

  return m.reply(text.slice(0, 4096));
};

handler.help = ['cekplug', 'healthplugin', 'pluginhealth'];
handler.tags = ['owner'];
handler.command = /^(cekplug|healthplugin|pluginhealth)$/i;
handler.owner = true;

export default handler;

function getAllJsFiles(dir) {
  const out = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...getAllJsFiles(full));
    else if (item.isFile() && item.name.endsWith('.js')) out.push(full);
  }
  return out.sort();
}

function formatError(error) {
  const line = error.line || error.loc?.line || '-';
  const column = error.column || error.loc?.column || '-';
  return `${error.message || String(error)}\nLine: ${line}\nColumn: ${column}`;
}

function cut(text, max) {
  text = String(text || '');
  return text.length > max ? text.slice(0, max) + '...' : text;
}