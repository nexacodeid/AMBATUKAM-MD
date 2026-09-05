import * as baileys from "baileys";
import crypto from "node:crypto";

async function groupStatus(conn, jid, content) {
    const { backgroundColor } = content;
    delete content.backgroundColor;

    const inside = await baileys.generateWAMessageContent(content, {
        upload: conn.waUploadToServer,
        backgroundColor
    });

    const messageSecret = crypto.randomBytes(32);

    const m = baileys.generateWAMessageFromContent(
        jid,
        {
            messageContextInfo: { messageSecret },
            groupStatusMessageV2: {
                message: {
                    ...inside,
                    messageContextInfo: { messageSecret }
                }
            }
        },
        {}
    );

    await conn.relayMessage(jid, m.message, { messageId: m.key.id });
    return m;
}

const handler = async (m, { conn, prefix = ".", command, args }) => {

    if (m.message?.interactiveResponseMessage) {
        const ir = m.message.interactiveResponseMessage;
        const params = ir.nativeFlowResponseMessage?.paramsJson;

        if (params) {
            const data = JSON.parse(params);
            const selectedId = data?.id;

            if (selectedId?.startsWith("sw_select")) {
                const [, msgId, groupJid] = selectedId.split(" ");
                m.text = `${prefix}sw_select ${msgId} ${groupJid}`;
                command = "sw_select";
                args = [msgId, groupJid];
            }
        }
    }

    if (/^sw_select$/i.test(command)) {
        const [msgId, groupJid] = args;

        const payload = global.swPayloads?.[msgId];
        if (!payload) return m.reply("❌ Payload tidak ditemukan");

        try {
            await groupStatus(conn, groupJid, payload);
            delete global.swPayloads[msgId];

            const meta = await conn.groupMetadata(groupJid);
            await m.reply(`✅ Status berhasil diupload ke *${meta.subject}*`);
        } catch (e) {
            console.error(e);
            m.reply("❌ Gagal upload status");
        }
        return;
    }

    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const textToParse = m.text || m.body || "";
    const caption = textToParse.replace(
        new RegExp(`^\\${prefix}${command}\\s*`, "i"),
        ""
    ).trim();

    if (!mime && !caption) return;

    let payload;
    if (/image/.test(mime)) {
        payload = { image: await quoted.download(), caption };
    } else if (/video/.test(mime)) {
        payload = { video: await quoted.download(), caption };
    } else if (/audio/.test(mime)) {
        payload = { audio: await quoted.download(), mimetype: "audio/mp4" };
    } else {
        payload = { text: caption };
    }

    if (!global.swPayloads) global.swPayloads = {};
    global.swPayloads[m.key.id] = payload;

    const groups = Object.values(await conn.groupFetchAllParticipating());
    if (!groups.length) return;

    const rows = groups.map(g => ({
        title: g.subject || "Group",
        description: `${g.participants?.length || 0} anggota`,
        id: `sw_select ${m.key.id} ${g.id}`
    }));

    await conn.sendMessage(m.chat, {
        text: "📋 *Pilih grup tujuan status*",
        footer: "Klik salah satu grup",
        buttons: [
            {
                buttonId: "swgc_select",
                buttonText: { displayText: "📥 Pilih Grup" },
                type: 4,
                nativeFlowInfo: {
                    name: "single_select",
                    paramsJson: JSON.stringify({
                        title: "Daftar Grup",
                        sections: [{ title: "Grup Tersedia", rows }]
                    })
                }
            }
        ],
        viewOnce: true
    });
};

handler.command = /^(setswgc|swtswgrup|sw_select)$/i;
handler.owner = true;
handler.register = true;

export default handler;