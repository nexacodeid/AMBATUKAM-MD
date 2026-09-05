/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonDir = path.join(process.cwd(), 'json');
const dataFilePath = path.join(jsonDir, 'listnote.json');

if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });

const loadAllGroupData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
};

const saveAllGroupData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

const zell = async (m, { conn, command, usedPrefix, text }) => {
  if (!m.isGroup) return;

  let allGroupData = loadAllGroupData();
  const groupId = m.chat;

  if (!allGroupData[groupId]) allGroupData[groupId] = { note: [] };
  const groupNotes = allGroupData[groupId].note;

  const args = text.split("|");
  const key = args[0]?.trim();
  const isi = m.quoted && m.quoted.text ? m.quoted.text : args.slice(1).join("|")?.trim();

  switch (true) {
    case /^(list|notelist)$/i.test(command): {
      if (key && key.length > 0) {
        const note = groupNotes.find(n => n.title.toLowerCase() === key.toLowerCase());
        if (!note) return m.reply(`Catatan dengan key "${key}" tidak ditemukan!`);
        if (note.media) {
          await conn.sendFile(m.chat, note.media.url, '', `📄 *${note.title}*\n\n${note.isi}`, m);
        } else {
          await conn.reply(m.chat, `📄 *Isi:*\n${note.isi}`, m);
        }
      } else {
        if (groupNotes.length === 0)
          return m.reply("Grup ini belum punya catatan. Tambahkan satu dengan `.addlist <key> <isi>`.");

        let txt = "•─── 〘 *📝 Daftar List Grup* 〙───•\n" + readMore;
        groupNotes.forEach((note, i) => (txt += `\n> ${i + 1}. *\`${note.title}\`*`));
        txt += `\n\nUntuk melihat catatan, ketik: \`${usedPrefix}list <key>\``;
        await conn.reply(m.chat, txt, m);
      }
      break;
    }

    case /^(addlist|addnote|buatnote|buatcatatan)$/i.test(command): {
      if (!key || !isi)
        return m.reply(
          `*Format salah!* ❌\nContoh: \`${usedPrefix + command} key|catatan Isi dari catatan kamu\`\n\nAtau balas pesan dengan \`${usedPrefix + command} key|catatan\``
        );

      if (groupNotes.some(n => n.title.toLowerCase() === key.toLowerCase()))
        return m.reply("Judul (key) ini sudah digunakan! Silakan gunakan judul lain.");
      let mediaInfo = null;
      if (m.quoted && /image|video/.test(m.quoted.mtype)) {
        const mediaPath = await conn.downloadAndSaveMediaMessage(m.quoted, `./media/${key}`);
        mediaInfo = {
          type: m.quoted.mtype,
          url: mediaPath,
        };
      }

      groupNotes.push({ title: key, isi, media: mediaInfo });
      saveAllGroupData(allGroupData);

      await conn.sendFile(
        m.chat,
        "https://telegra.ph/file/7989b4e60a9dedfcdbbec.jpg",
        "",
        `🎉 *Catatan berhasil dibuat!* 🎉\n\n*Key:* \`${key}\`\n${mediaInfo ? "\n📎 Media ikut disimpan." : ""}\n\nUntuk melihatnya, ketik: \`${usedPrefix}list ${key}\``,
        m
      );
      break;
    }

    case /^(updatelist|updatenote|updatecatatan)$/i.test(command): {
      if (groupNotes.length === 0) return m.reply("Grup ini belum punya catatan untuk diperbarui.");

      if (!key) {
        let txt = "Silakan tentukan *key* catatan yang ingin kamu perbarui.\n\nDaftar catatan grup ini:\n\n";
        groupNotes.forEach((note, i) => (txt += `${i + 1}. *${note.title}*\n`));
        txt += `\n*Format:* \`${usedPrefix}updatelist <key> <isi baru>\``;
        return m.reply(txt);
      }

      const note = groupNotes.find(n => n.title.toLowerCase() === key.toLowerCase());
      if (!note) return m.reply(`Catatan dengan key "${key}" tidak ditemukan!`);
      if (!isi && !m.quoted) return m.reply("Tidak ada isi baru yang terdeteksi.");
      if (m.quoted && /image|video/.test(m.quoted.mtype)) {
        const mediaPath = await conn.downloadAndSaveMediaMessage(m.quoted, `./media/${key}_update`);
        note.media = { type: m.quoted.mtype, url: mediaPath };
      }

      if (isi) note.isi = isi;
      saveAllGroupData(allGroupData);

      await conn.reply(m.chat, `✅ Catatan diperbarui!\n\n*Judul:* ${note.title}\n\n*Isi:*\n${note.isi}`, m);
      break;
    }

    case /^(dellist|deletelist|delnote|hapusnote|hapuscatatan)$/i.test(command): {
      if (groupNotes.length === 0) return m.reply("Grup ini belum punya catatan!");
      if (!text) {
        let txt = "Daftar catatan grup ini:\n\n";
        groupNotes.forEach((note, i) => (txt += `${i + 1}. *${note.title}*\n`));
        txt += "\nKetik `.dellist <nomor>` atau `.dellist <key>` untuk menghapus catatan.";
        return m.reply(txt);
      }

      let noteIndex;
      if (!isNaN(text)) noteIndex = parseInt(text) - 1;
      else noteIndex = groupNotes.findIndex(n => n.title.toLowerCase() === text.trim().toLowerCase());

      if (noteIndex < 0 || noteIndex >= groupNotes.length) return m.reply("Catatan tidak ditemukan!");
      const note = groupNotes.splice(noteIndex, 1)[0];

      saveAllGroupData(allGroupData);
      await conn.reply(m.chat, `✅ Sukses menghapus catatan:\n*Judul:* ${note.title}`, m);
      break;
    }
  }
};

// === Auto Trigger ===
zell.before = async (m, { conn }) => {
  if (!m.isGroup || !m.text) return;
  const allGroupData = loadAllGroupData();
  const groupId = m.chat;
  const groupNotes = allGroupData[groupId]?.note || [];
  if (!groupNotes.length) return;

  const match = groupNotes.find(note => note.title.toLowerCase() === m.text.toLowerCase());
  if (match) {
    if (match.media) {
      await conn.sendFile(m.chat, match.media.url, '', `📓 *${match.title}*\n\n${match.isi}`, m);
    } else {
      await conn.reply(m.chat, `📓 *${match.title}*\n\n${match.isi}`, m);
    }
  }
};

zell.help = ["list", "dellist", "addlist", "updatelist"];
zell.tags = ["group"];
zell.command = /^(list|notelist|dellist|deletelist|delnote|hapusnote|hapuscatatan|addlist|addnote|buatnote|buatcatatan|updatelist|updatenote|updatecatatan)$/i;
zell.group = true;
export default zell;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */