import {
  collectUrlEntries,
  errorMessage,
  scraper,
  sendMediaEntries
} from '../../lib/zenaveline-adapter.js'

function getChatData(chat) {
  if (!global.db) global.db = {}
  if (!global.db.data) global.db.data = {}
  if (!global.db.data.chats) global.db.data.chats = {}
  if (!global.db.data.chats[chat]) global.db.data.chats[chat] = {}

  const data = global.db.data.chats[chat]
  if (typeof data.autodl !== 'boolean' && typeof data.theresavAutodl === 'boolean') {
    data.autodl = data.theresavAutodl
    delete data.theresavAutodl
  }

  return data
}

function supportedUrl(url = '') {
  return /(tiktok\.com|douyin\.com|instagram\.com|threads\.(?:net|com)|x\.com|twitter\.com|youtube\.com|youtu\.be|facebook\.com|fb\.watch|mediafire\.com|pinterest\.|pin\.it|soundcloud\.com|open\.spotify\.com)/i.test(url)
}

async function scrape(url) {
  if (/tiktok\.com/i.test(url)) return scraper.tiktokdownload(url)
  if (/douyin\.com/i.test(url)) return scraper.douyindl(url)
  if (/instagram\.com/i.test(url)) return scraper.igdl(url)
  if (/threads\.(?:net|com)/i.test(url)) return scraper.threadsdownload(url)
  if (/(?:twitter|x)\.com/i.test(url)) return scraper.twetterdownload(url)
  if (/mediafire\.com/i.test(url)) return scraper.mediafiredl(url)
  if (/pinterest\.|pin\.it/i.test(url)) return scraper.pinterestdownload(url)
  if (/open\.spotify\.com/i.test(url)) return scraper.spotifydl(url)

  if (/youtu\.be|youtube\.com/i.test(url)) {
    const client = new scraper.savetube()
    return client.download(url, '720')
  }

  const tool = /soundcloud\.com/i.test(url)
    ? 'soundcloud-downloader'
    : /facebook\.com|fb\.watch/i.test(url)
      ? 'facebook-video-downloader'
      : null

  if (!tool) throw new Error('Platform belum didukung Auto Download.')
  return scraper.allinonedownloader(url, tool)
}

async function downloadAio(conn, m, url) {
  const result = await scrape(url)
  if (!collectUrlEntries(result).length) {
    throw new Error(result?.message || result?.error || 'Scraper tidak menemukan media.')
  }

  await sendMediaEntries(conn, m, result, {
    caption: '✅ *Auto Downloader*\nDiproses tanpa API key berbayar.',
    max: 10,
    fallbackName: 'autodl.bin'
  })
}

let handler = async (m, { text, usedPrefix, command }) => {
  const chat = getChatData(m.chat)
  const input = String(text || '').trim().toLowerCase()

  if (!input) {
    return m.reply(
      `Status Auto Download: *${chat.autodl ? 'ON' : 'OFF'}*\n\n` +
      `${usedPrefix + command} on\n` +
      `${usedPrefix + command} off\n`
    )
  }

  if (/^(on|enable|1)$/i.test(input)) {
    chat.autodl = true
    return m.reply('✅ Auto Download aktif.')
  }

  if (/^(off|disable|0)$/i.test(input)) {
    chat.autodl = false
    return m.reply('✅ Auto Download nonaktif.')
  }

  return m.reply(`Pilih on/off.\nContoh: ${usedPrefix + command} on`)
}

handler.before = async function (m) {
  try {
    if (!m?.text || !m.isGroup) return
    if (m.fromMe || m.key?.fromMe || m.isBaileys) return

    const chat = getChatData(m.chat)
    if (!chat.autodl) return

    const text = String(m.text || '')
    if (/^[./#!]/.test(text)) return

    const url = text.match(/https?:\/\/[^\s]+/i)?.[0]?.replace(/[),.]+$/, '')
    if (!url || !supportedUrl(url)) return

    await m.react?.('⏳').catch(() => {})
    await downloadAio(this, m, url)
    await m.react?.('✅').catch(() => {})
  } catch (error) {
    console.error('[AUTODL SCRAPER]', errorMessage(error))
    await m.react?.('❌').catch(() => {})
  }
}

handler.help = ['autodl on/off']
handler.tags = ['group']
handler.command = /^(autodl|autodownload)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.register = true

export default handler