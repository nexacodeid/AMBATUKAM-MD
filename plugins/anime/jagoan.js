import fs from 'fs'
import PDFDocument from 'pdfkit'
import { finished } from 'stream/promises'
import sharp from 'sharp'

const TMP_DIR = './tmp'
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR)

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    const subcommand = (args[0] || '').toLowerCase()

    switch (subcommand) {
        case 'search': {
            const keyword = args.slice(1).join(' ')
            if (!keyword) return m.reply(`Masukkan judul manga\nContoh: ${usedPrefix}${command} search circles`)
            await m.reply('⏳ Mencari...')
            try {
                const url = global.API('theresav', '/manga/jagoanmanga/search', { q: encodeURIComponent(keyword) }, 'apikey')
                const res = await fetch(url)
                const data = await res.json()
                if (!data.status || !data.result.length) return m.reply('Tidak ditemukan.')
                const rows = data.result.slice(0, 20).map(manga => ({
                    header: manga.chapter || 'Latest Chapter',
                    title: manga.title,
                    description: manga.link,
                    id: `${usedPrefix}${command} detail ${manga.link}`
                }))
                await conn.sendMessage(m.chat, {
                    text: `Hasil pencarian *${keyword}*`,
                    footer: `Total: ${data.result.length}`,
                    buttons: [{ buttonId: 'action', buttonText: { displayText: 'Pilih Manga' }, type: 4, nativeFlowInfo: { name: 'single_select', paramsJson: JSON.stringify({ title: 'Hasil Pencarian', sections: [{ title: 'Daftar Manga', rows }] }) } }],
                    viewOnce: true
                }, { quoted: m })
            } catch (e) {
                m.reply('Gagal mengambil data dari API 😢')
            }
            break
        }

        case 'detail': {
            const url = args[1]
            if (!url) return m.reply('Link komik tidak valid!')
            await m.reply('⏳ Mengambil detail dan daftar chapter...')
            try {
                const apiUrl = global.API('theresav', '/manga/jagoanmanga/detail', { url: encodeURIComponent(url) }, 'apikey')
                const res = await fetch(apiUrl)
                const data = await res.json()
                if (!data.status) return m.reply('Gagal mendapatkan detail komik.')
                const r = data.result
                let teks = `*${r.title}*\n\n*Sinopsis:*\n${r.synopsis}\n\n*Total Chapter:* ${r.totalChapter}`
                const chapterRows = r.chapters.map(ch => ({
                    id: `${usedPrefix}${command} download ${ch.url}`,
                    title: ch.chapter,
                    description: ch.title
                }))
                await conn.sendMessage(m.chat, {
                    image: { url: r.cover },
                    caption: teks,
                    footer: `Menampilkan ${r.chapters.length} chapter`,
                    buttons: [{ buttonId: 'action', buttonText: { displayText: 'Pilih Chapter' }, type: 4, nativeFlowInfo: { name: 'single_select', paramsJson: JSON.stringify({ title: 'Daftar Chapter', sections: [{ title: 'Chapter Tersedia', rows: chapterRows }] }) } }]
                }, { quoted: m })
            } catch (e) {
                m.reply('Terjadi kesalahan saat mengambil detail.')
            }
            break
        }

        case 'download': {
            const url = args[1]
            if (!url || !url.startsWith('http')) return m.reply('Link chapter tidak valid!')
            await m.reply('⏳ Tunggu ya, lagi bikin PDF...')
            try {
                const apiUrl = global.API('theresav', '/manga/jagoanmanga/download', { url: encodeURIComponent(url) }, 'apikey')
                const res = await fetch(apiUrl)
                const data = await res.json()
                if (!data.status) return m.reply('Gagal mengambil data chapter!')
                const { images, manga, chapter, totalPages } = data.result
                if (!images.length) return m.reply('Gambar tidak ditemukan.')

                const cleanName = `${manga}-${chapter}`.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
                const pdfPath = `${TMP_DIR}/${Date.now()}.pdf`
                const imgPaths = []

                for (let i = 0; i < images.length; i++) {
                    const imgPath = `${TMP_DIR}/page-${Date.now()}-${i}.jpg`
                    try {
                        const response = await fetch(images[i])
                        const buf = Buffer.from(await response.arrayBuffer())
                        fs.writeFileSync(imgPath, buf)
                        imgPaths.push(imgPath)
                    } catch { continue }
                }

                const doc = new PDFDocument({ autoFirstPage: false, margin: 0 })
                const stream = fs.createWriteStream(pdfPath)
                doc.pipe(stream)

                for (const imgPath of imgPaths) {
                    try {
                        const { width, height } = await sharp(imgPath).metadata()
                        doc.addPage({ size: [width, height], margin: 0 })
                        doc.image(imgPath, 0, 0, { width, height })
                    } catch {}
                    try { fs.unlinkSync(imgPath) } catch {}
                }

                doc.end()
                await finished(stream)

                await conn.sendMessage(m.chat, {
                    document: fs.readFileSync(pdfPath),
                    mimetype: 'application/pdf',
                    fileName: cleanName + '.pdf',
                    caption: `📖 ${manga}\n${chapter}\nTotal: ${totalPages} halaman`
                }, { quoted: m })

                try { fs.unlinkSync(pdfPath) } catch {}
            } catch (e) {
                m.reply('Gagal download chapter! 😢')
            }
            break
        }

        default:
            m.reply(`Gunakan:\n${usedPrefix}${command} search <keyword>\n${usedPrefix}${command} detail <url>\n${usedPrefix}${command} download <url chapter>`)
    }
}

handler.command = /^jagoan$/i
handler.help = ['jagoan search <keyword>', 'jagoan detail <url>', 'jagoan download <url>']
handler.tags = ['anime']
handler.limit = true
handler.register = true
handler.description = 'Search, detail, dan download manga dari Jagoan Manga.'
export default handler
