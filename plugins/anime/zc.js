import axios from "axios";
import * as cheerio from "cheerio";

function parseCount(text) {
    const m = text.match(/--([1-5])\b/);
    return m ? parseInt(m[1]) : 1;
}

function pickUnique(list, count) {
    const unique = [...new Set(list)];
    return unique.sort(() => 0.5 - Math.random()).slice(0, count);
}

async function scrapeZerochan(query, depth = 20) {
    let url = `https://www.zerochan.net/${encodeURIComponent(query)}`;
    let waifuList = [];

    const res = await axios.get(url, {
        validateStatus: () => true
    });
    const $ = cheerio.load(res.data);

    if ($("p#fullMessage").text() === "No such tag. Back to Index")
        return {
            mode: "notfound"
        };

    if ($("#children").length) {
        let cat = [];
        $("#children > *li").each((i, el) => {
            let a = $(el).find("h3 > a");
            cat.push({
                title: a.text(),
                query: a.attr("href").replace("/", "")
            });
        });
        return {
            mode: "list",
            list: cat
        };
    }

    const canonical = $("head > link[rel='canonical']").attr("href");

    const extract = ($$) => {
        $$("#thumbs2 > *li").each((i, el) => {
            let href =
                $$(el).find("p > a").attr("href") ||
                $$(el).find("p > a").next().attr("href");
            if (href?.startsWith("http")) waifuList.push(href);
        });
    };

    extract($);

    if (canonical) {
        for (let i = 1; i <= depth; i++) {
            let r = await axios.get(`${canonical}?p=${i}`, {
                validateStatus: () => true
            });
            extract(cheerio.load(r.data));
        }
    }

    return {
        mode: "image",
        list: [...new Set(waifuList)]
    };
}

let handler = async (m, {
    conn,
    text,
    prefix,
    command
}) => {
    if (!text)
        return m.reply(
            `🔍 *Zerochan*\n\nGunakan:\n${prefix + command} <query> [--1 s/d --5]\n\nContoh:\n${prefix}waifu Shiroko --3`
        );

    const count = parseCount(text);
    const query = text.replace(/--[1-5]\b/, "").trim();

    const first = await scrapeZerochan(query);

    if (first.mode === "notfound")
        return m.reply(`❌ Tidak ditemukan: *${query}*`);

    if (first.mode === "list") {
        const meta = {
            type: "search/zerochan",
            step: "choose_category",
            base_query: query,
            count,
            options: first.list
        };

        const base64 = Buffer.from(JSON.stringify(meta)).toString("base64");

        let menu = `📁 *Pilih Kategori*\nQuery: *${query}*\nJumlah: *${count}*\n\n`;
        menu += first.list.map((x, i) => `${i + 1}. ${x.title}`).join("\n");
        menu += `\n\nBalas dengan angka.\n\nencodeData:${base64}`;

        return m.reply(menu);
    }

    if (!first.list.length)
        return m.reply(`❌ Tidak ditemukan gambar untuk *${query}*`);

    const images = pickUnique(first.list, count);

    const albumItems = images.map((img, i) => ({
        image: {
            url: img
        },
        caption: `✨ *${query}*\n(${i + 1}/${images.length})`
    }));

    await conn.sendAlbumMessage(m.chat, albumItems, {
        quoted: m,
        delay: 1000
    });

    const meta = {
        type: "search/zerochan",
        step: "again",
        base_query: query,
        count
    };

    const again = Buffer.from(JSON.stringify(meta)).toString("base64");
    return m.reply(`Lagi?\n\n1. Kirim lagi.\n\nencodeData:${again}`);
};

handler.command = ["waifu", "randomnekonime", "zc", "zerochan"];
handler.tags = ["anime"];
handler.help = ["waifu <query> [--1 s/d --5]"];
handler.register = true;
handler.limit = true;

handler.before = async (m, {
    conn,
    metadata
}) => {
    if (!metadata) return true;

    if (metadata.type === "search/zerochan" && metadata.step === "choose_category") {
        const num = parseInt(m.text.trim());
        if (!num || num < 1 || num > metadata.options.length)
            return m.reply("❌ Angka tidak valid.");

        const selected = metadata.options[num - 1];
        const count = metadata.count || 1;

        const data = await scrapeZerochan(selected.query);
        if (!data.list.length)
            return m.reply(`❌ Tidak ada gambar di *${selected.title}*`);

        const images = pickUnique(data.list, count);

        const albumItems = images.map((img, i) => ({
            image: {
                url: img
            },
            caption: `✨ *${selected.title}*\n(${i + 1}/${images.length})`
        }));

        await conn.sendAlbumMessage(m.chat, albumItems, {
            quoted: m,
            delay: 1000
        });

        const meta = {
            type: "search/zerochan",
            step: "again",
            base_query: selected.query,
            count
        };

        const b64 = Buffer.from(JSON.stringify(meta)).toString("base64");
        await m.reply(`Lagi?\n\n1. Kirim lagi.\n\nencodeData:${b64}`);
        return true;
    }

    if (metadata.type === "search/zerochan" && metadata.step === "again") {
        if (m.text.trim() !== "1") return true;

        const query = metadata.base_query;
        const count = metadata.count || 1;

        const data = await scrapeZerochan(query);
        if (!data.list.length)
            return m.reply(`❌ Tidak ada gambar: *${query}*`);

        const images = pickUnique(data.list, count);

        const albumItems = images.map((img, i) => ({
            image: {
                url: img
            },
            caption: `✨ *${query}*\n(${i + 1}/${images.length})`
        }));

        await conn.sendAlbumMessage(m.chat, albumItems, {
            quoted: m,
            delay: 1000
        });

        const meta = {
            type: "search/zerochan",
            step: "again",
            base_query: query,
            count
        };

        const b64 = Buffer.from(JSON.stringify(meta)).toString("base64");
        await m.reply(`Lagi?\n\n1. Kirim lagi.\n\nencodeData:${b64}`);
        return true;
    }

    return true;
};

export default handler;