import { setBotName, setOwnerName } from '../../lib/config-editor.js'

let handler = async (m, { text, command, usedPrefix }) => {
  const cmd = String(command || '').toLowerCase()

  if (!text?.trim()) {
    const label = cmd === 'setnameowner' ? 'nama owner' : 'nama bot'
    return m.reply(
      `Format: *${usedPrefix}${command} ${label}*\n\n` +
      `Contoh: *${usedPrefix}${command} Nama Baru*`
    )
  }

  try {
    if (cmd === 'setnameowner') {
      const name = await setOwnerName(text)
      return m.reply(
        `✅ Nama owner berhasil diubah.\n\n` +
        `Nama baru: *${name}*\n` +
        `Tersimpan di *config.js*.`
      )
    }

    const name = await setBotName(text)
    return m.reply(
      `✅ Nama bot berhasil diubah.\n\n` +
      `Nama baru: *${name}*\n` +
      `Tersimpan di *config.js*.`
    )
  } catch (error) {
    console.error('[SET NAME CONFIG]', error)
    return m.reply(`❌ Gagal mengubah nama: ${error.message || error}`)
  }
}

handler.help = ['setnamebot <nama>', 'setnameowner <nama>']
handler.tags = ['owner']
handler.command = /^(setnamebot|setnameowner)$/i
handler.owner = true
handler.rowner = true

export default handler
