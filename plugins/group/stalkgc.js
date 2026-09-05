const regex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('📌 Contoh: .stalkgrup https://chat.whatsapp.com/xxxxx\n')

  const match = text.match(regex)
  if (!match) return m.reply('❌ Link tidak valid. Format harus seperti:\nhttps://chat.whatsapp.com/xxxxx')

  const code = match[1]

  try {
    if (!conn.groupGetInviteInfo) {
      return m.reply('❌ Bot tidak mendukung method groupGetInviteInfo. Pastikan menggunakan versi terbaru Baileys.')
    }

    const res = await conn.groupGetInviteInfo(code)

    const {
      subject = 'Tidak diketahui',
      owner,
      size = 0,
      creation,
      desc
    } = res

    let teks = `📍 *Info Grup WhatsApp Stalk Grup:*\n`
    teks += `\n📛 *Nama:* ${subject}`
    teks += `\n🧑‍💼 *Owner:* wa.me/${(owner || '').split('@')[0] || 'Tidak diketahui'}`
    teks += `\n👥 *Jumlah Member:* ${size}`
    teks += `\n⏱️ *Dibuat:* ${creation ? new Date(creation * 1000).toLocaleString() : 'Tidak diketahui'}`
    if (desc) teks += `\n📝 *Deskripsi:*\n${desc}`
    teks += `\n\n🔗 *Link Undangan:*\nhttps://chat.whatsapp.com/${code}`

    m.reply(teks)
  } catch (e) {
    m.reply('❌ Gagal mengambil info grup.\nPastikan bot sudah join grup dan tidak diblokir oleh WhatsApp.')
  }
}

handler.command = ['stalkgc']
handler.tags = ['group']
handler.help = ['stalkgrup <linkgrup>']
handler.register = true;
handler.group = true;

export default handler