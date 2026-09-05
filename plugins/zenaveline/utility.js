import {
  collectUrlEntries,
  errorMessage,
  extractUrl,
  formatNumber,
  scraper,
  truncate
} from '../../lib/zenaveline-adapter.js'

async function bypass(m, text, usedPrefix, command) {
  const url = extractUrl(text)
  if (!url) throw new Error(`Masukkan shortlink.\nContoh: ${usedPrefix}${command} https://example.com/...`)
  const result = await scraper.bypasstools(url)
  const links = collectUrlEntries(result)
  if (links.length) {
    await m.reply(`✅ *Bypass selesai*\n\n${links.map((entry, index) => `${index + 1}. ${entry.url}`).join('\n')}`)
  } else {
    await m.reply(`✅ *Bypass selesai*\n\n${truncate(result)}`)
  }
}

async function instagramStalk(conn, m, text) {
  const username = text.trim().replace(/^@/, '').replace(/[^a-zA-Z0-9._]/g, '')
  if (!username) throw new Error('Masukkan username Instagram tanpa URL.')
  const result = await scraper.igstalk(username)
  if (!result?.status) throw new Error(result?.msg || 'Profil Instagram tidak ditemukan.')

  const caption = [
    '*Instagram Stalk*',
    `👤 ${result.full_name || result.fullName || '-'} (@${result.username || username})`,
    `✅ Terverifikasi: ${result.is_verified ? 'Ya' : 'Tidak'}`,
    `🔒 Privat: ${result.is_private ? 'Ya' : 'Tidak'}`,
    `👥 Pengikut: ${formatNumber(result.follower_count ?? result.followers)}`,
    `➡️ Mengikuti: ${formatNumber(result.following_count ?? result.following)}`,
    `🖼️ Postingan: ${formatNumber(result.media_count ?? result.posts?.length)}`,
    `📖 Story tersedia: ${Array.isArray(result.stories) ? result.stories.length : 0}`,
    result.biography ? `\n${result.biography}` : null
  ].filter(Boolean).join('\n')

  const avatar = result.profile_pic_url_hd || result.profile_pic_url || result.avatar
  if (avatar) await conn.sendFile(m.chat, avatar, 'instagram-profile.jpg', caption, m)
  else await m.reply(caption)
}

async function docs(m) {
  const result = await scraper.docs()
  if (!result?.success || !Array.isArray(result.scrapers)) throw new Error('Daftar scraper tidak tersedia.')
  await m.reply([
    `*@zenaveline/scraper v1.4.6*`,
    `${result.total} scraper tersedia:`,
    '',
    ...result.scrapers.map((name, index) => `${index + 1}. ${name}`),
    '',
    'Semua fungsi di atas sudah dihubungkan ke plugin bot.'
  ].join('\n'))
}

let handler = async (m, { conn, text = '', usedPrefix = '.', command = '' }) => {
  const cmd = command.toLowerCase()
  await m.react?.('⏳').catch(() => {})

  try {
    if (/^(bypass|bypasstools)$/.test(cmd)) await bypass(m, text, usedPrefix, command)
    else if (/^(igstalk|instagramstalk)$/.test(cmd)) await instagramStalk(conn, m, text)
    else await docs(m)
    await m.react?.('✅').catch(() => {})
  } catch (error) {
    console.error('[ZENAVELINE UTILITY]', error)
    await m.react?.('❌').catch(() => {})
    await m.reply(`❌ ${errorMessage(error)}`)
  }
}

handler.help = ['bypass <url>', 'igstalk <username>', 'scraperlist']
handler.tags = ['tools', 'internet']
handler.command = /^(bypass|bypasstools|igstalk|instagramstalk|scraperlist|zenadocs|zenascraper)$/i
handler.limit = true
handler.register = true

export default handler
