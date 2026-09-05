let handler = async (m, { conn, text, usedPrefix, command }) => {
  const input = String(text || '').trim()
  const match = input.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+?)(?:\.git)?(?:[/?#].*)?$/i)

  if (!match) return m.reply(`Contoh:\n${usedPrefix + command} https://github.com/user/repo`)

  const owner = match[1]
  const repo = match[2].replace(/\.git$/i, '')
  const archive = `https://codeload.github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/zip/HEAD`

  await m.react?.('⏳').catch(() => {})

  try {
    await conn.sendMessage(
      m.chat,
      {
        document: { url: archive },
        mimetype: 'application/zip',
        fileName: `${repo}.zip`,
        caption: `📦 *GitHub Repository*\n${owner}/${repo}\n\nDiunduh langsung dari GitHub codeload tanpa API key.`
      },
      { quoted: m }
    )
    await m.react?.('✅').catch(() => {})
  } catch (error) {
    console.error('[GITCLONE]', error)
    await m.react?.('❌').catch(() => {})
    await m.reply(`❌ Gagal mengunduh repository. Pastikan repository bersifat publik dan URL benar.\n\n${error.message || error}`)
  }
}

handler.help = ['gitclone <url>']
handler.tags = ['downloader']
handler.command = /^gitclone$/i
handler.limit = true
handler.register = true

export default handler