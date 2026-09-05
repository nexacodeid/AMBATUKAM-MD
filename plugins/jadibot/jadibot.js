/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website  : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

import fs from "fs";
import path from "path";
import pino from "pino";
import NodeCache from "@cacheable/node-cache";

import {
  Browsers,
  DisconnectReason,
  fetchLatestWaWebVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
} from "baileys";

import { makeWASocket } from "../../lib/simple.js";

if (!Array.isArray(global.conns)) global.conns = [];
if (!global.jadibotRetry) global.jadibotRetry = new Map();
if (!global.jadibotPairingFlag) global.jadibotPairingFlag = new Set();

const JADIBOT_SESSION_DIR = path.resolve("./sessions/jadibot");
fs.mkdirSync(JADIBOT_SESSION_DIR, { recursive: true });

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (conn.user.jid !== global.conn.user.jid) {

    const mainBot =
      global.conn.user.jid
        .split("@")[0];

    return conn.reply(
      m.chat,
      `Perintah ini hanya dapat digunakan di bot utama.\n\nwa.me/${mainBot}?text=${usedPrefix + command}`,
      m
    );
  }

  // ========================
  // PHONE NUMBER
  // ========================
  const phoneNumber =
    String(text || "")
      .replace(/[^0-9]/g, "");

  // ========================
  // ACCESS CHECKER
  // ========================
  if (
    !isOwnerNumber(m.sender) &&
    !hasJadibotAccess(
      m.sender,
      phoneNumber
    )
  ) {

    return m.reply(
      `❌ Fitur *Jadibot* khusus user yang sudah bayar.\n\n` +
      `Harga akses: *Rp15.000 / 30 hari*\n` +
      `Beli akses: ${usedPrefix}belijadibot\n` +
      `Cek akses: ${usedPrefix}cekjadibot`
    );
  }

  if (!phoneNumber) {
    return m.reply(
      `• *Example:* ${usedPrefix + command} 6288980870067`
    );
  }

  if (phoneNumber.length < 8) {
    return m.reply(
      "Nomor tidak valid. Gunakan format negara, contoh: 628xxxxxx"
    );
  }

  // ========================
  // CEGAH DUPLIKAT
  // ========================
  const existingConn =
    global.conns.find(
      (c) =>
        c?.jadibotNumber ===
        phoneNumber
    );

  if (existingConn) {
    return m.reply(
      "⚠️ Jadibot untuk nomor ini sedang aktif."
    );
  }

  await conn.reply(
    m.chat,
    "Tunggu, sedang menyiapkan kode jadibot...",
    m
  );

  try {

    await startJadiBot({
      mainConn: conn,
      phoneNumber,
      quoted: m
    });

  } catch (error) {

    console.error(error);

    return m.reply(
      `Gagal menyiapkan jadibot.\n\n${error.message || error}`
    );
  }
};

handler.help = ["jadibot <nomor>"];
handler.tags = ["jadibot"];
handler.command = /^jadibot$/i;
handler.owner = false;
handler.limit = true;
handler.private = false;

export default handler;

// ========================
// OWNER CHECK
// ========================
function isOwnerNumber(jid) {

  const number =
    String(jid || "")
      .split("@")[0];

  return (
    global.owner || []
  ).some(
    ([ownerNumber]) =>
      String(ownerNumber)
        .replace(/[^0-9]/g, "") ===
      number
  );
}

// ========================
// FIX ACCESS CHECKER
// ========================
function hasJadibotAccess(
  jid,
  phoneNumber = ""
) {

  const db =
    global.db?.data;

  if (!db)
    return false;

  if (!db.jadibotNumbers)
    db.jadibotNumbers = {};

  const data =
    db.jadibotNumbers[
      phoneNumber
    ];

  if (!data)
    return false;

  // owner harus sama
  if (data.owner !== jid)
    return false;

  // expired
  if (
    Date.now() > data.expired
  ) {

    delete db.jadibotNumbers[
      phoneNumber
    ];

    return false;
  }

  return true;
}

async function startJadiBot({
  mainConn,
  phoneNumber,
  quoted
}) {

  const authFolder =
    path.join(
      JADIBOT_SESSION_DIR,
      phoneNumber
    );

  fs.mkdirSync(
    authFolder,
    { recursive: true }
  );

  // ========================
  // FIX SESSION CORRUPT
  // ========================
  const credsPath =
    path.join(
      authFolder,
      "creds.json"
    );

  if (fs.existsSync(credsPath)) {

    try {

      const creds =
        JSON.parse(
          fs.readFileSync(
            credsPath,
            "utf-8"
          )
        );

      if (
        !creds ||
        typeof creds !== "object" ||
        !creds.noiseKey ||
        !creds.signedIdentityKey
      ) {

        fs.rmSync(
          authFolder,
          {
            recursive: true,
            force: true
          }
        );

        fs.mkdirSync(
          authFolder,
          { recursive: true }
        );
      }

    } catch {

      fs.rmSync(
        authFolder,
        {
          recursive: true,
          force: true
        }
      );

      fs.mkdirSync(
        authFolder,
        { recursive: true }
      );
    }
  }

  const {
    state,
    saveCreds
  } =
    await useMultiFileAuthState(
      authFolder
    );

  const {
    version
  } =
    await fetchLatestWaWebVersion();

  const msgRetryCounterCache =
    new NodeCache();

  const connectionOptions = {

    auth: {
      creds: state.creds,
      keys:
        makeCacheableSignalKeyStore(
          state.keys,
          pino({
            level: "fatal"
          }).child({
            level: "fatal"
          })
        ),
    },

    version,

    logger:
      pino({
        level: "fatal"
      }),

    browser:
      Browsers.ubuntu(
        "Chrome"
      ),

    printQRInTerminal: false,
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    shouldSyncHistoryMessage: () => false,
    msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
  };

  let subConn =
    makeWASocket(
      connectionOptions
    );

  let isInit = true;

  subConn.jadibotNumber =
    phoneNumber;

  subConn.jadibotAuthFolder =
    authFolder;

  // ========================
  // FIX SPAM PAIRING CODE
  // ========================
  if (
    !subConn.authState
      .creds.registered &&
    !global
      .jadibotPairingFlag
      .has(phoneNumber)
  ) {

    global
      .jadibotPairingFlag
      .add(phoneNumber);

    setTimeout(
      async () => {

        try {

          const code =
            await subConn
              .requestPairingCode(
                phoneNumber
              );

          const pairingCode =
            code?.match(/.{1,4}/g)
              ?.join("-") || code;

          const jid =
            `${phoneNumber}@s.whatsapp.net`;

          const instruction = [
            "Masukkan kode di bawah ini untuk jadi bot sementara.",
            "",
            "1. Klik titik tiga di pojok kanan atas WhatsApp",
            "2. Ketuk Perangkat tertaut",
            "3. Ketuk Tautkan perangkat",
            "4. Ketuk Tautkan dengan nomor telepon saja",
            "5. Masukkan kode di bawah ini",
            "",
            "Note: kode dapat expired kapan saja.",
          ].join("\n");

          const sent =
            await mainConn.reply(
              jid,
              instruction,
              quoted
            );

          await mainConn.reply(
            jid,
            pairingCode,
            sent
          );

        } catch (error) {

          console.error(
            "PAIRING ERROR:",
            error
          );

          global
            .jadibotPairingFlag
            .delete(phoneNumber);

          cleanupSession(
            authFolder
          );

          await mainConn.reply(
            quoted.chat,
            `❌ Gagal membuat pairing code untuk ${phoneNumber}.\n\nSession dihapus, silakan coba lagi.`,
            quoted
          );

          try {
            subConn.ws.close();
          } catch {}
        }

      },
      3000
    );
  }

  async function connectionUpdate(
    update
  ) {

    const {
      connection,
      lastDisconnect
    } = update;

    if (
      connection === "open"
    ) {

      global
        .jadibotRetry
        .delete(phoneNumber);

      global
        .jadibotPairingFlag
        .delete(phoneNumber);

      if (
        !global.conns.includes(
          subConn
        )
      ) {
        global.conns.push(
          subConn
        );
      }

      await mainConn.reply(
        `${phoneNumber}@s.whatsapp.net`,
        "✅ Jadibot tersambung.",
        quoted
      );
    }

    if (
      connection === "close"
    ) {

      const statusCode =
        lastDisconnect?.error
          ?.output?.statusCode;

      const errorMessage =
        lastDisconnect?.error
          ?.message || "";

      global.conns =
        global.conns.filter(
          (conn) =>
            conn !== subConn
        );

      console.log(
        "DISCONNECT:",
        phoneNumber,
        statusCode,
        errorMessage
      );

      // LOGOUT
      if (
        statusCode ===
        DisconnectReason.loggedOut
      ) {

        cleanupSession(
          authFolder
        );

        global
          .jadibotRetry
          .delete(phoneNumber);

        global
          .jadibotPairingFlag
          .delete(phoneNumber);

        await mainConn.reply(
          `${phoneNumber}@s.whatsapp.net`,
          "Jadibot logout. Session dihapus.",
          quoted
        );

        return;
      }

      // BAD SESSION
      const isBadSession =
        statusCode === 405 ||
        statusCode === 428 ||
        statusCode ===
          DisconnectReason.badSession ||
        errorMessage.includes(
          "405"
        ) ||
        errorMessage.includes(
          "428"
        ) ||
        errorMessage.includes(
          "bad session"
        );

      if (isBadSession) {

        cleanupSession(
          authFolder
        );

        global
          .jadibotRetry
          .delete(phoneNumber);

        global
          .jadibotPairingFlag
          .delete(phoneNumber);

        await mainConn.reply(
          `${phoneNumber}@s.whatsapp.net`,
          `❌ Session error (${statusCode || "405/428"}) untuk ${phoneNumber}. Session dihapus, silakan buat ulang.`,
          quoted
        );

        return;
      }

      // FIX LOOP RECONNECT
      const retryCount =
        (
          global
            .jadibotRetry
            .get(phoneNumber) || 0
        ) + 1;

      const MAX_RETRY = 3;

      if (
        retryCount > MAX_RETRY
      ) {

        global
          .jadibotRetry
          .delete(phoneNumber);

        global
          .jadibotPairingFlag
          .delete(phoneNumber);

        cleanupSession(
          authFolder
        );

        await mainConn.reply(
          `${phoneNumber}@s.whatsapp.net`,
          `❌ Jadibot ${phoneNumber} gagal reconnect setelah ${MAX_RETRY}x. Session dihapus.`,
          quoted
        );

        return;
      }

      global
        .jadibotRetry
        .set(
          phoneNumber,
          retryCount
        );

      const backoffMs =
        Math.min(
          5000 * retryCount,
          30000
        );

      console.log(
        `Reconnecting ${phoneNumber} in ${backoffMs}ms (attempt ${retryCount}/${MAX_RETRY})`
      );

      await new Promise(
        (r) =>
          setTimeout(
            r,
            backoffMs
          )
      );

      await reloadHandler(
        true
      );
    }
  }

  async function reloadHandler(
    restartConnection = false
  ) {

    const handlerModule =
      await import(
        `../../handler.js?update=${Date.now()}`
      );

    if (
      restartConnection
    ) {

      try {
        subConn.ws.close();
      } catch {}

      subConn.ev.removeAllListeners();

      subConn =
        makeWASocket(
          connectionOptions,
          {
            chats:
              subConn.chats || {}
          }
        );

      isInit = true;

      subConn.jadibotNumber =
        phoneNumber;

      subConn.jadibotAuthFolder =
        authFolder;
    }

    if (!isInit) {

      subConn.ev.off(
        "messages.upsert",
        subConn.handler
      );

      subConn.ev.off(
        "group-participants.update",
        subConn.participantsUpdate
      );

      subConn.ev.off(
        "groups.update",
        subConn.groupsUpdate
      );

      subConn.ev.off(
        "message.delete",
        subConn.onDelete
      );

      subConn.ev.off(
        "connection.update",
        subConn.connectionUpdate
      );

      subConn.ev.off(
        "creds.update",
        subConn.credsUpdate
      );
    }

    subConn.welcome =
      global.conn.welcome ||
      "Selamat datang @user";

    subConn.bye =
      global.conn.bye ||
      "Dadah @user";

    subConn.spromote =
      global.conn.spromote ||
      "@user sekarang admin!";

    subConn.sdemote =
      global.conn.sdemote ||
      "@user sekarang bukan admin!";

    subConn.sDesc =
      global.conn.sDesc ||
      "Deskripsi telah diubah ke \n@desc";

    subConn.sSubject =
      global.conn.sSubject ||
      "Judul grup telah diubah ke \n@subject";

    subConn.sIcon =
      global.conn.sIcon ||
      "Icon grup telah diubah!";

    subConn.sRevoke =
      global.conn.sRevoke ||
      "Link group telah diubah ke \n@revoke";

    subConn.handler =
      handlerModule.handler.bind(
        subConn
      );

    subConn.participantsUpdate =
      handlerModule
        .participantsUpdate
        .bind(subConn);

    subConn.groupsUpdate =
      handlerModule
        .groupsUpdate
        .bind(subConn);

    subConn.onDelete =
      handlerModule
        .deleteUpdate
        .bind(subConn);

    subConn.connectionUpdate =
      connectionUpdate.bind(
        subConn
      );

    subConn.credsUpdate =
      saveCreds.bind(subConn);

    subConn.ev.on(
      "messages.upsert",
      subConn.handler
    );

    subConn.ev.on(
      "group-participants.update",
      subConn.participantsUpdate
    );

    subConn.ev.on(
      "groups.update",
      subConn.groupsUpdate
    );

    subConn.ev.on(
      "message.delete",
      subConn.onDelete
    );

    subConn.ev.on(
      "connection.update",
      subConn.connectionUpdate
    );

    subConn.ev.on(
      "creds.update",
      subConn.credsUpdate
    );

    isInit = false;

    return true;
  }

  await reloadHandler(false);
}

// ========================
// CLEANUP HELPERS
// ========================
function cleanupSession(
  authFolder
) {

  try {

    fs.rmSync(
      authFolder,
      {
        recursive: true,
        force: true
      }
    );

  } catch {}
}