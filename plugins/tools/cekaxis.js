let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Masukkan nomor.\nContoh: ${usedPrefix + command} 628XXXXXXXX`)
    if (!/^\d+$/.test(args[0])) return m.reply('Nomor tidak valid. Gunakan angka saja.')
    try {
        global.loading(m, conn)
        const url = global.API('theresav', '/info/cekaxis', { number: args[0] }, 'apikey')
        const res = await fetch(url)
        const data = await res.json()
        global.loading(m, conn, true)

        if (!data.status) return m.reply(`Error: ${data.message || 'Gagal mengambil data.'}`)

        const sub = data.raw?.data?.subs_info || {}
        const pkgs = data.raw?.data?.package_info?.packages || []

        let teks = `📱 *CEK AXIS*\n\n*Nomor:* ${sub.msisdn || '-'}\n*Operator:* ${sub.operator || '-'}\n*Status:* ${sub.id_verified || '-'}\n*Jaringan:* ${sub.net_type || '-'}\n*Masa Aktif:* ${sub.exp_date || '-'}\n*Masa Tenggang:* ${sub.grace_until || '-'}\n`

        if (!pkgs.length) {
            teks += `\n📦 *PAKET*\nTidak ada paket aktif`
        } else {
            teks += `\n📦 *PAKET AKTIF*\n`
            pkgs.forEach((p, i) => {
                teks += `\n${i + 1}. *${p.name || '-'}*\n   Exp: ${p.expiry || '-'}\n`
                if (p.quotas?.length) {
                    p.quotas.forEach(q => {
                        let status = q.percent === 0 ? '❌ Habis' : q.percent < 50 ? '⚠️ Hampir habis' : '✅ Aman'
                        teks += `   - ${q.name}\n     ${q.remaining} / ${q.total} (${q.percent}%) ${status}\n`
                    })
                }
            })
        }
        m.reply(teks.trim())
    } catch (e) {
        global.loading(m, conn, true)
        m.reply(`Error: ${e.message}`)
    }
}
handler.help = ['cekaxis <nomor>']
handler.tags = ['tools']
handler.command = /^cekaxis$/i
handler.description = 'Cek paket Axis dari nomor.'
handler.register = true
export default handler
