import cp, { exec as _exec } from 'child_process'
import { promisify } from 'util'
let exec = promisify(_exec).bind(cp)
import fs from 'fs'

let handler = async (m, { text, conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime) throw 'No media found'
    if (!/audio|video/.test(mime)) throw 'Reply audio/video'

    if (!text) throw 'Masukan volume\nContoh: .volume 2'

    let vol = Number(text)
    if (isNaN(vol) || vol <= 0) throw 'Volume tidak valid'

    m.reply('Processing...')

    let input = await conn.downloadAndSaveMediaMessage(q, "./tmp/in")
    let output = "./tmp/out.mp3"

    try {
        await exec(`ffmpeg -i "${input}" -filter:a "volume=${vol}" -vn -ac 2 -ar 44100 -b:a 128k "${output}"`)

        let audio = fs.readFileSync(output)

        await conn.sendMessage(m.chat, {
            audio,
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply('Gagal memproses audio')
    } finally {
        if (fs.existsSync(input)) fs.unlinkSync(input)
        if (fs.existsSync(output)) fs.unlinkSync(output)
    }
}

handler.help = ['volume <angka>']
handler.command = ['volume']
handler.tags = ['tools']
handler.register = true

export default handler