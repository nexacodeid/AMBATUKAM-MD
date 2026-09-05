let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    await m.react('❓')
    return m.reply(`Teks updatenya mana?\n\nContoh pemakaian:\n*${usedPrefix + command} Bot baru saja update fitur .scplay, silakan dicoba!*`)
  }

  // Masukkan ID Channel WhatsApp kamu di sini!
  // Formatnya biasanya berakhiran @newsletter, contoh: '120363123456789@newsletter'
  const channelId = '120363424947493975@newsletter' 

  await m.react('⏳')
  
  // Mengambil data semua grup tempat bot bergabung
  let groups = Object.values(await conn.groupFetchAllParticipating())
  let groupJids = groups.map(v => v.id)

  // Desain template pesan update
  let updatePesan = `📢 *I N F O   U P D A T E   B O T*\n\n`
  updatePesan += `${text}\n\n`
  updatePesan += `────────────────\n`
  updatePesan += `_Pesan Siaran Otomatis oleh Sistem Bot_`

  m.reply(`Memulai pengiriman pesan Update ke *1 Channel* dan *${groupJids.length} Grup*...\n\n_Mohon tunggu, proses ini memakan waktu agar bot tidak terkena spam._`)

  let suksesGrup = 0
  let gagalGrup = 0

  // 1. Kirim ke Channel WhatsApp terlebih dahulu
  try {
    await conn.sendMessage(channelId, { text: updatePesan })
  } catch (e) {
    console.log('Gagal mengirim ke Channel. Pastikan Bot adalah Admin Channel dan ID Channel benar.', e)
  }

  // 2. Looping (Perulangan) untuk mengirim ke semua grup
  for (let jid of groupJids) {
    try {
      await conn.sendMessage(jid, { text: updatePesan })
      suksesGrup++
    } catch (e) {
      gagalGrup++
    }
    // Wajib diberi delay (jeda) 2-3 detik per grup agar anti-banned!
    await sleep(2500) 
  }

  await m.react('✅')
  m.reply(`✅ *Broadcast Update Selesai!*\n\nBerhasil terkirim ke:\n- Channel WhatsApp\n- ${suksesGrup} Grup\n\nGagal terkirim ke: ${gagalGrup} Grup`)
}

// Fungsi jeda waktu
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

handler.help = ['bcupdate']
handler.tags = ['owner']
handler.command = /^(bcupdate|updateinfo|infoupdate)$/i

handler.owner = true 

export default handler