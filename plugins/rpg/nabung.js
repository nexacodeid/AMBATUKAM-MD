let handler = async (m, { conn, args }) => {
  let user = global.db.data.users[m.sender]

  user.money = Number(user.money) || 0
  user.bank = Number(user.bank) || 0
  user.atm = Number(user.atm) || 0
  user.fullatm = Number(user.fullatm) || 0

  if (user.atm == 0) {
    return m.reply("Kamu Belum Memiliki ATM, Silahkan Bikin Dulu\nCaranya Ketik .craft atm")
  }

  if (!user.fullatm || user.fullatm < 1) {
    user.fullatm = 100000000
  }

  if (user.bank > user.fullatm) {
    user.fullatm = user.bank + 100000000
  }

  let sisaKapasitas = user.fullatm - user.bank

  if (sisaKapasitas <= 0) {
    return m.reply("Uang Dibank Kamu Sudah Penuh!")
  }

  if (!args[0]) {
    return m.reply("Masukkan jumlah uang.\n\nContoh:\n.nabung 200\n.nabung all")
  }

  let count = /all/i.test(args[0])
    ? Math.min(user.money, sisaKapasitas)
    : parseInt(args[0])

  if (!Number.isFinite(count) || count < 1) {
    return m.reply("Jumlah tabungan tidak valid.")
  }

  if (count > user.money) {
    return m.reply("Uang kamu tidak cukup.")
  }

  if (count > sisaKapasitas) {
    return m.reply(`Bank kamu tidak cukup.\nSisa kapasitas: Rp.${sisaKapasitas.toLocaleString("id-ID")}`)
  }

  user.money -= count
  user.bank += count

  return conn.reply(
    m.chat,
    `✅ Berhasil menabung

🏧 Jumlah: Rp.${count.toLocaleString("id-ID")}
🏦 Bank: Rp.${user.bank.toLocaleString("id-ID")}
💸 Saku: Rp.${user.money.toLocaleString("id-ID")}
📦 Kapasitas Bank: Rp.${user.fullatm.toLocaleString("id-ID")}`,
    m
  )
}

handler.help = ["nabung <jumlah/all>"]
handler.tags = ["rpg"]
handler.command = /^nabung$/i
handler.register = true

export default handler