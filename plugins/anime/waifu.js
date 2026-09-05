import * as cheerio from 'cheerio'

function parseCount(text) {
    const m = text.match(/--([1-5])\b/)
    return m ? parseInt(m[1]) : 1
}

function pickUnique(list, count) {
    const unique = [...new Set(list)]
    return unique.sort(() => 0.5 - Math.random()).slice(0, count)
}

async function scrapeZerochan(query, depth = 20) {
    let url = `https://www.zerochan.net/${encodeURIComponent(query)}`
    let waifuList = []

    const res = await fetch(url)
    const html = await res.text()
    const $ = cheerio.load(html)

    if ($('p#fullMessage').text() === 'No such tag. Back to Index') return { mode: 'notfound' }

    if ($('#children').length) {
        let cat = []
        $('#children > *li').each((i, el) => {
            let a = $(el).find('h3 > a')
            cat.push({ title: a.text(), query: a.attr('href').replace('/', '') })
        })
        return { mode: 'list', list: cat }
    }

    const canonical = $('head > link[rel="canonical"]').attr('href')

    const extract = ($$) => {
        $$('#thumbs2 > *li').each((i, el) => {
            let href = $$(el).find('p > a').attr('href') || $$(el).find('p > a').next().attr('href')
            if (href?.startsWith('http')) waifuList.push(href)
        })
    }

    extract($)

    if (canonical) {
        for (let i = 1; i <= depth; i++) {
            try {
                const r = await fetch(`${canonical}?p=${i}`)
                extract(cheerio.load(await r.text()))
            } catch { break }
        }
    }

    return { mode: 'image', list: [...new Set(waifuList)] }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`🔍 *Zerochan*\n\nGunakan:\n${usedPrefix + command} <query> [--1 s/d --5]\n\nContoh:\n${usedPrefix}waifu Shiroko --3`)

    const count = parseCount(text)
    const query = text.replace(/--[1-5]\b/, '').trim()
    const first = await scrapeZerochan(query)

    if (first.mode === 'notfound') return m.reply(`❌ Tidak ditemukan: *${query}*`)

    if (first.mode === 'list') {
        let menu = `📁 *Pilih Kategori*\nQuery: *${query}*\nJumlah: *${count}*\n\n`
        menu += first.list.map((x, i) => `${i + 1}. ${x.title}`).join('\n')
        const base64 = Buffer.from(JSON.stringify({ type: 'zc', step: 'cat', base_query: query, count, options: first.list })).toString('base64')
        menu += `\n\nBalas dengan angka.\n\nencodeData:${base64}`
        return m.reply(menu)
    }

    if (!first.list.length) return m.reply(`❌ Tidak ditemukan gambar untuk *${query}*`)

    const images = pickUnique(first.list, count)
    await conn.sendAlbumMessage(m.chat, images.map((img, i) => ({ image: { url: img }, caption: `✨ *${query}* (${i + 1}/${images.length})` })), { quoted: m, delay: 1000 })

    const again = Buffer.from(JSON.stringify({ type: 'zc', step: 'again', base_query: query, count })).toString('base64')
    return m.reply(`Lagi?\n\n1. Kirim lagi.\n\nencodeData:${again}`)
}

handler.command = ['waifu', 'zc', 'zerochan', 'randomnekonime']
handler.tags = ['anime']
handler.help = ['waifu <query> [--1 s/d --5]']
handler.register = true
handler.limit = true

handler.before = async (m, { conn, metadata }) => {
    if (!metadata) return true

    if (metadata.type === 'zc' && metadata.step === 'cat') {
        const num = parseInt(m.text.trim())
        if (!num || num < 1 || num > metadata.options.length) return m.reply('❌ Angka tidak valid.')
        const selected = metadata.options[num - 1]
        const data = await scrapeZerochan(selected.query)
        if (!data.list.length) return m.reply(`❌ Tidak ada gambar di *${selected.title}*`)
        const images = pickUnique(data.list, metadata.count || 1)
        await conn.sendAlbumMessage(m.chat, images.map((img, i) => ({ image: { url: img }, caption: `✨ *${selected.title}* (${i + 1}/${images.length})` })), { quoted: m, delay: 1000 })
        const b64 = Buffer.from(JSON.stringify({ type: 'zc', step: 'again', base_query: selected.query, count: metadata.count })).toString('base64')
        await m.reply(`Lagi?\n\n1. Kirim lagi.\n\nencodeData:${b64}`)
        return true
    }

    if (metadata.type === 'zc' && metadata.step === 'again') {
        if (m.text.trim() !== '1') return true
        const data = await scrapeZerochan(metadata.base_query)
        if (!data.list.length) return m.reply(`❌ Tidak ada gambar: *${metadata.base_query}*`)
        const images = pickUnique(data.list, metadata.count || 1)
        await conn.sendAlbumMessage(m.chat, images.map((img, i) => ({ image: { url: img }, caption: `✨ *${metadata.base_query}* (${i + 1}/${images.length})` })), { quoted: m, delay: 1000 })
        const b64 = Buffer.from(JSON.stringify({ type: 'zc', step: 'again', base_query: metadata.base_query, count: metadata.count })).toString('base64')
        await m.reply(`Lagi?\n\n1. Kirim lagi.\n\nencodeData:${b64}`)
        return true
    }

    return true
}

export default handler
