import {
  errorMessage,
  scraper,
  withQuotedImage
} from '../../lib/zenaveline-adapter.js'

function currentTime() {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date()).replace('.', ':')
}

function hasQuotedImage(m) {
  const quoted = m.quoted || m
  const mime = (quoted.msg || quoted).mimetype || quoted.mediaType || ''
  return /^image\//i.test(mime)
}

async function brat(conn, m, text, usedPrefix, command) {
  const [content, themeInput = 'white', blurInput = '0'] = text.split('|').map(value => value.trim())
  if (!content) throw new Error(`Format: ${usedPrefix}${command} teks|white/black/green|0-3`)
  const theme = ['white', 'black', 'green'].includes(themeInput.toLowerCase()) ? themeInput.toLowerCase() : 'white'
  const blur = Math.min(3, Math.max(0, Number.parseInt(blurInput, 10) || 0))
  const image = await scraper.brat({ text: content, theme, blur })
  await conn.sendMessage(m.chat, { image, caption: `✅ Brat ${theme}, blur ${blur}.` }, { quoted: m })
}

async function iqcDark(conn, m, text) {
  const [content = '', time = currentTime()] = text.split('|').map(value => value.trim())
  if (!content && !hasQuotedImage(m)) throw new Error('Masukkan teks IQC atau balas sebuah gambar.')

  if (hasQuotedImage(m)) {
    await withQuotedImage(m, async ({ filePath }) => {
      const image = await scraper['iqc-darkmode']({ txt: content, timeStr: time || currentTime(), imgUrl: filePath })
      await conn.sendMessage(m.chat, { image, caption: '✅ IQC dark mode selesai.' }, { quoted: m })
    })
    return
  }

  const image = await scraper['iqc-darkmode']({ txt: content, timeStr: time || currentTime() })
  await conn.sendMessage(m.chat, { image, caption: '✅ IQC dark mode selesai.' }, { quoted: m })
}

async function iqcPink(conn, m, text, usedPrefix, command) {
  const [content, time = currentTime()] = text.split('|').map(value => value.trim())
  if (!content) throw new Error(`Format: ${usedPrefix}${command} teks|jam (opsional)`)
  const image = await scraper['iqc-pinkmode'](content, time || currentTime())
  await conn.sendMessage(m.chat, { image, caption: '✅ IQC pink mode selesai.' }, { quoted: m })
}

async function tiktokDm(conn, m, text, usedPrefix, command) {
  const [username, chatText, avatarUrl] = text.split('|').map(value => value.trim())
  if (!username || !chatText) {
    throw new Error(`Format: ${usedPrefix}${command} username|isi chat|url avatar (opsional)\nAvatar juga bisa memakai gambar yang dibalas.`)
  }

  const render = async avatar => {
    // Langsung ambil gambar dari scraper tanpa menambahkan watermark
    const image = await scraper['tiktokdm-qc'](username, chatText, avatar || undefined)
    await conn.sendMessage(
      m.chat,
      { image, caption: '⚠️ Konten simulasi/parodi, bukan tangkapan layar asli.' },
      { quoted: m }
    )
  }

  if (hasQuotedImage(m)) {
    await withQuotedImage(m, ({ filePath }) => render(filePath))
  } else {
    await render(avatarUrl)
  }
}

async function fakeOvo(conn, m, text, usedPrefix, command) {
  const amount = text.replace(/\D/g, '')
  if (!amount) throw new Error(`Format: ${usedPrefix}${command} 500000`)
  // Langsung ambil gambar dari scraper tanpa menambahkan watermark
  const image = await scraper['fake-ovo'](amount)
  await conn.sendMessage(
    m.chat,
    { image, caption: '⚠️ SIMULASI untuk hiburan/desain. Bukan bukti saldo atau transaksi asli.' },
    { quoted: m }
  )
}

async function spotifyCard(conn, m, text, usedPrefix, command) {
  const [title, artist, cover, bg] = text.split('|').map(value => value.trim())
  if (!title || !artist || !cover) {
    throw new Error(`Format: ${usedPrefix}${command} judul|artis|url cover|url background (opsional)`)
  }
  const image = await scraper.spotifycard({ title, artist, cover, bg: bg || undefined })
  await conn.sendMessage(m.chat, { image, caption: `🎵 ${title}\n👤 ${artist}` }, { quoted: m })
}

let handler = async (m, { conn, text = '', usedPrefix = '.', command = '' }) => {
  const cmd = command.toLowerCase()
  await m.react?.('⏳').catch(() => {})

  try {
    if (cmd === 'brat') await brat(conn, m, text, usedPrefix, command)
    else if (/^(iqc|qc|quotechat|iqcdark)$/.test(cmd)) await iqcDark(conn, m, text)
    else if (/^(iqcpink|pinkqc)$/.test(cmd)) await iqcPink(conn, m, text, usedPrefix, command)
    else if (/^(tiktokdmqc|ttdmqc)$/.test(cmd)) await tiktokDm(conn, m, text, usedPrefix, command)
    else if (/^(fakeovo|ovofake)$/.test(cmd)) await fakeOvo(conn, m, text, usedPrefix, command)
    else if (cmd === 'spotifycard') await spotifyCard(conn, m, text, usedPrefix, command)
    await m.react?.('✅').catch(() => {})
  } catch (error) {
    console.error('[ZENAVELINE MAKER]', error)
    await m.react?.('❌').catch(() => {})
    await m.reply(`❌ ${errorMessage(error)}`)
  }
}

handler.help = [
  'brat <teks>|<tema>|<blur>', 'iqc <teks>|[jam]', 'iqcpink <teks>|[jam]',
  'tiktokdmqc <username>|<chat>|[avatar]', 'fakeovo <nominal>',
  'spotifycard <judul>|<artis>|<cover>|[background]'
]
handler.tags = ['maker']
handler.command = /^(brat|iqc|qc|quotechat|iqcdark|iqcpink|pinkqc|tiktokdmqc|ttdmqc|fakeovo|ovofake|spotifycard)$/i
handler.limit = true
handler.register = true

export default handler