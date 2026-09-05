/*
 * Fake KTP Generator
 * Creator: Zaell × Raizell AI
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return m.reply(`
🪪 *FORMAT FAKE KTP*

${usedPrefix + command} provinsi|kota|nik|nama|ttl|jk|goldar|alamat|rt/rw|kel/desa|kecamatan|agama|status|pekerjaan|kewarganegaraan|masa_berlaku|terbuat|foto

Contoh:
${usedPrefix + command} JAWA BARAT|BANDUNG|327826282828888|Ambal Nigga|Bandung,09-09-9999|Laki-laki|O|Jl.Sukma No.49|001/009|Sukalaki|Sukalaki|Nonis|Sudah Kawin|Suka Nyoli|WNA|Sampe Mati|09-09-9999|https://raw.githubusercontent.com/raizell526/dat3/main/uploads/b6bbe3-1778505473882.jpg
`.trim())
    }

    let input = text.split("|")

    if (input.length < 18) {
      return m.reply(`
❌ Data kurang lengkap.

Jumlah sekarang: ${input.length}
Jumlah wajib: 18

Urutan:
provinsi|kota|nik|nama|ttl|jk|goldar|alamat|rt/rw|kel/desa|kecamatan|agama|status|pekerjaan|kewarganegaraan|masa_berlaku|terbuat|foto
`.trim())
    }

    let [
      provinsi,
      kota,
      nik,
      nama,
      ttl,
      jenis_kelamin,
      golongan_darah,
      alamat,
      rtrw,
      keldesa,
      kecamatan,
      agama,
      status,
      pekerjaan,
      kewarganegaraan,
      masa_berlaku,
      terbuat,
      pas_photo
    ] = input

    await m.react("⏳")

    let url = `https://api.siputzx.my.id/api/canvas/ektp?provinsi=${encodeURIComponent(provinsi)}&kota=${encodeURIComponent(kota)}&nik=${encodeURIComponent(nik)}&nama=${encodeURIComponent(nama)}&ttl=${encodeURIComponent(ttl)}&jenis_kelamin=${encodeURIComponent(jenis_kelamin)}&golongan_darah=${encodeURIComponent(golongan_darah)}&alamat=${encodeURIComponent(alamat)}&rt%2Frw=${encodeURIComponent(rtrw)}&kel%2Fdesa=${encodeURIComponent(keldesa)}&kecamatan=${encodeURIComponent(kecamatan)}&agama=${encodeURIComponent(agama)}&status=${encodeURIComponent(status)}&pekerjaan=${encodeURIComponent(pekerjaan)}&kewarganegaraan=${encodeURIComponent(kewarganegaraan)}&masa_berlaku=${encodeURIComponent(masa_berlaku)}&terbuat=${encodeURIComponent(terbuat)}&pas_photo=${encodeURIComponent(pas_photo)}`

    await conn.sendMessage(
      m.chat,
      {
        image: { url },
        caption: `
🪪 *FAKE KTP BERHASIL DIBUAT*

👤 Nama: ${nama}
🆔 NIK: ${nik}
🏙️ Kota: ${kota}
`.trim()
      },
      { quoted: m }
    )

    await m.react("✅")

  } catch (e) {
    console.log(e)
    await m.react("❌")
    m.reply("Gagal membuat fake KTP.")
  }
}

handler.help = ["fakektp"]
handler.tags = ["maker"]
handler.command = /^(fakektp|ektp)$/i
handler.register = true

export default handler