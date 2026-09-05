if (!global.blacklist) global.blacklist = new Set();

const cleanNumber = (text) => String(text || "").replace(/[^0-9]/g, "");

const handler = async (m, {
    text,
    args,
    usedPrefix,
    command,
    db
}) => {
    if (!db.data) db.data = {};
    if (!db.data.settings) db.data.settings = {};
    if (!Array.isArray(db.data.settings.blacklist)) db.data.settings.blacklist = [];
    if (!Array.isArray(db.data.owner)) db.data.owner = [];

    const action = args[0]?.toLowerCase();

    if (!action || !["add", "del", "list", "remove", "delete"].includes(action)) {
        return m.reply(
            `╭─「 *BLACKLIST* 」\n` +
            `│\n` +
            `│ *Perintah:*\n` +
            `│  ➤ ${usedPrefix + command} add <nomor>\n` +
            `│  ➤ ${usedPrefix + command} del <nomor>\n` +
            `│  ➤ ${usedPrefix + command} list\n` +
            `│\n` +
            `╰─ Bot akan ignore semua pesan dari nomor blacklist.`
        );
    }

    const realAction = ["remove", "delete"].includes(action) ? "del" : action;

    if (realAction === "list") {
        const dbList = db.data.settings.blacklist;
        const allList = [...new Set([...global.blacklist, ...dbList])].filter(Boolean).sort();
        
        if (allList.length === 0) {
            return m.reply("📭 Belum ada nomor yang di-blacklist.");
        }

        const listText = allList.map((n, i) => `│ ${i + 1}. +${n}`).join("\n");
        const teks =
            `╭─「 *BLACKLIST* 」\n` +
            `│ Total: *${allList.length}* nomor\n│\n` +
            listText +
            `\n╰────────────────`;
        return m.reply(teks);
    }

    const nomor = cleanNumber(args[1]);
    if (!nomor || nomor.length < 8 || nomor.length > 15) {
        return m.reply("❌ Masukkan nomor yang valid.\nContoh: `628xxxxxxxxxx` atau `08xxxxxxxxxx`");
    }

    const globalOwners = (global.owner || []).map(j => cleanNumber(j));
    const dbOwners = (db.data.owner || []).map(j => cleanNumber(j));
    const ownerList = [...new Set([...globalOwners, ...dbOwners])];

    if (ownerList.includes(nomor)) {
        return m.reply("❌ Tidak bisa blacklist nomor owner.");
    }

    const settings = db.data.settings;

    if (realAction === "add") {
        if (global.blacklist.has(nomor)) {
            return m.reply(`⚠️ Nomor *+${nomor}* sudah ada di blacklist.`);
        }

        global.blacklist.add(nomor);
        if (!settings.blacklist.includes(nomor)) {
            settings.blacklist.push(nomor);
        }

        try {
            await db.save?.() || await db.write?.();
        } catch (e) {
            console.error("[BLACKLIST] Gagal save DB (add):", e);
        }

        return m.reply(
            `✅ *+${nomor}* berhasil ditambahkan ke blacklist.\n` +
            `🤖 Bot akan mengabaikan semua pesan dari nomor ini.`
        );
    }

    if (realAction === "del") {
        if (!global.blacklist.has(nomor)) {
            return m.reply(`⚠️ Nomor *+${nomor}* tidak ada di blacklist.`);
        }

        global.blacklist.delete(nomor);
        settings.blacklist = settings.blacklist.filter(n => n !== nomor);

        try {
            await db.save?.() || await db.write?.();
        } catch (e) {
            console.error("[BLACKLIST] Gagal save DB (del):", e);
        }

        return m.reply(`✅ *+${nomor}* berhasil dihapus dari blacklist.`);
    }
};

handler.before = (m, { db }) => {
    if (!m || !m.sender) return true;

    if (!global.blacklist) global.blacklist = new Set();

    if (!global.blacklistSynced && db?.data?.settings?.blacklist) {
        let savedList = db.data.settings.blacklist;
        
        if (!Array.isArray(savedList)) {
            try {
                savedList = Object.values(savedList || {});
            } catch {
                savedList = [];
            }
        }

        for (const n of savedList) {
            if (n) global.blacklist.add(String(n));
        }
        
        global.blacklistSynced = true;
    }

    const senderNomor = m.sender.split("@")[0];
    if (global.blacklist.has(senderNomor)) {
        return false;
    }
    
    return true;
};

handler.command = ["blacklist", "bl"];
handler.tags = "owner";
handler.description = "Blacklist nomor agar bot mengabaikan semua pesannya.";
handler.owner = true;
handler.register = true;

export default handler;
