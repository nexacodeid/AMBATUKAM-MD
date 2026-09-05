let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Masukkan kode JavaScript.')

  text = text.replace(/^>\s*/, '')

  try {
    let AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
    let fn = new AsyncFunction(
      'm',
      'conn',
      'args',
      'text',
      'usedPrefix',
      'command',
      text
    )

    let result = await fn(m, conn, [], text, '.', 'exec')

    if (typeof result !== 'undefined') {
      await m.reply(String(result))
    }
  } catch (e) {
    await m.reply(String(e.stack || e))
  }
}

handler.command = /^(exec|eval)$/i
handler.owner = true

export default handler