import axios from 'axios'

const API = 'https://konachan.com/post.json'

async function randomKona() {
  const { data } = await axios.get(API, {
    params: {
      tags: 'order:random',
      limit: 1
    }
  })
  return data[0]
}

async function searchKona(tags) {
  const { data } = await axios.get(API, {
    params: { tags, limit: 1 }
  })
  return data[0]
}

let handler = async (m, { conn, args }) => {
  try {

    let img

    if (!args[0] || args[0] === 'random') {
      img = await randomKona()
    } else {
      const query = args.join('_')
      img = await searchKona(query)
      if (!img) return m.reply('Tidak ditemukan')
    }

    await conn.sendMessage(m.chat, {
      image: { url: img.file_url },
      caption:
`🖼️ ${img.width}x${img.height}
⭐ ${img.rating}
🆔 ${img.id}`,
      footer: global.getBotName?.() || global.namebot || 'WhatsApp Bot',
      buttons: [
        {
          buttonId: '.kona random',
          buttonText: { displayText: '🔁 Lagi' },
          type: 1
        }
      ],
      headerType: 4
    }, { quoted: m })

  } catch (e) {
    console.log(e)
    m.reply('❌ Gagal mengambil wallpaper')
  }
}

handler.command = /^kona$/i
handler.help = ['kona', 'kona random', 'kona <tag>']
handler.tags = ['anime']
handler.limit = true
handler.premium = true
handler.register = true

export default handler