let handler = async (m, { conn }) => {
  let total = Object.values(global.plugins)
    .filter(v => v.help && v.tags && v.command)
    .map(v => {
      if (Array.isArray(v.command)) return v.command.length
      if (v.command instanceof RegExp) {
        let source = v.command.source
          .replace(/^\^/, '')
          .replace(/\$$/, '')
          .replace(/\(\?:/g, '(')

        let match = source.match(/\(([^()]+)\)/)

        if (match) {
          return match[1]
            .split('|')
            .filter(Boolean)
            .length
        }

        return 1
      }

      if (typeof v.command === 'string') return 1

      return 0
    })
    .reduce((a, b) => a + b, 0)

  await conn.adReply(
    m.chat,
    `Total Command Bot Saat ini: ${total}`,
    './media/thumbnail.jpg',
    m,
    { title: 'Total Command Bot' }
  )
}

handler.help = ['totalfitur']
handler.tags = ['info']
handler.command = ['totalfitur', 'totalcmd', 'totalcommand']

export default handler