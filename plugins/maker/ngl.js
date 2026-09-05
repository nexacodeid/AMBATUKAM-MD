/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Feature : NGL Maker
 *┃ 🔹 Command : .ngl
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const api = {
  xterm: {
    url: 'https://api.termai.cc',
    key: 'raizell'
  }
}

async function ngl(text, backgroundColor = 'dark') {
  let url =
    `${api.xterm.url}/api/maker/ngl` +
    `?text=${encodeURIComponent(text)}` +
    `&backgroundColor=${encodeURIComponent(backgroundColor)}` +
    `&key=${api.xterm.key}`

  let res = await fetch(url)

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  return Buffer.from(await res.arrayBuffer())
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return m.reply(`Contoh:

*${usedPrefix + command} halo dunia*

Custom warna:
*${usedPrefix + command} halo dunia|dark*

Warna tersedia:
• dark
• light
• purple
• blue
• red
• green`)
    }

    let [msg, bg] = text.split('|')

    msg = msg?.trim()
    bg = bg?.trim() || 'dark'

    if (!msg) {
      return m.reply('Teks tidak boleh kosong.')
    }

    await m.reply('⏳ Sedang membuat NGL...')

    let image = await ngl(msg, bg)

    await conn.sendMessage(
      m.chat,
      {
        image,
        caption:
`✅ NGL berhasil dibuat

🎨 Background: ${bg}`
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)

    m.reply(`❌ Error

${e.message || e}`)
  }
}

handler.help = ['ngl <text>']
handler.tags = ['maker']
handler.command = /^(ngl)$/i
handler.limit = true
handler.register = true

export default handler