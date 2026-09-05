/**
 * Fitur: fakedana
 * Plugins: ESM
 * Author: Kanoo
 * Api: https://api.skylow.web.id
 */

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`*Contoh:*\n.fakedana 172788`)
  }

  if (!/^\d+$/.test(text)) {
    return m.reply(`Nominal hanya boleh angka!\n\n*Contoh:*\n.fakedana 10000`)
  }

  const nominal = parseInt(text)
  if (nominal <= 0) {
    return m.reply("Nominal harus lebih dari 0.")
  }

  await conn.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key }
  })

  try {
    const url = `https://api.skylow.web.id/api/maker/fakedana?text=${encodeURIComponent(text)}`
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const contentType = res.headers.get("content-type") || ""
    if (!contentType.includes("image")) {
      throw new Error("Response bukan gambar")
    }

    const buffer = Buffer.from(await res.arrayBuffer())

    await conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: `✅ Berhasil membuat Fake Dana\n💰 Nominal: Rp${nominal.toLocaleString("id-ID")}`
      },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    })
  } catch (e) {
    console.error("Error fakedana:", e)

    await conn.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    })

    m.reply("Gagal membuat gambar Fake Dana.")
  }
}

handler.help = ["fakedana <nominal>"]
handler.tags = ["maker"]
handler.command = /^(fakedana)$/i
handler.limit = true
handler.register = true

export default handler