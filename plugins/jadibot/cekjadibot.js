// cekjadibot.js

let handler = async (m) => {

  const db = global.db.data

  if (!db.jadibotNumbers)
    db.jadibotNumbers = {}

  const result = []

  for (const number in db.jadibotNumbers) {

    const data = db.jadibotNumbers[number]

    if (data.owner !== m.sender)
      continue

    if (Date.now() >= data.expired) {
      delete db.jadibotNumbers[number]
      continue
    }

    result.push({
      number,
      expired: data.expired,
      trial: data.trial
    })
  }

  if (!result.length) {
    return m.reply(
      "❌ Kamu belum memiliki akses Jadibot."
    )
  }

  let txt = "✅ *AKSES JADIBOT*\n"

  for (let i = 0; i < result.length; i++) {

    const item = result[i]

    txt += `\n${i + 1}. ${item.number}\n`
    txt += `• Status: ${item.trial ? "Trial" : "Premium"}\n`
    txt += `• Expired: ${formatDate(item.expired)}\n`
  }

  m.reply(txt)
}

handler.help = ["cekjadibot"]
handler.tags = ["jadibot"]
handler.command = /^(cekjadibot|cekjb)$/i

export default handler

function formatDate(ms) {
  return new Date(ms).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}