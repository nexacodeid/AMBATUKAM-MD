/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Feature : Manage / Cek API Key Termai
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

const API_BASE = 'https://api.termai.cc/api/tools/key-checker'

function formatNumber(num) {
  return Number(num || 0).toLocaleString('id-ID')
}

function formatFeatureName(name) {
  return String(name || '-').replace(/^\//, '')
}

function formatMs(ms) {
  ms = Number(ms || 0)

  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60

  let out = []

  if (d) out.push(`${d} hari`)
  if (h) out.push(`${h} jam`)
  if (m) out.push(`${m} menit`)
  if (s || out.length === 0) out.push(`${s} detik`)

  return out.join(' ')
}

async function checkApikey(key) {
  let url = `${API_BASE}?key=${encodeURIComponent(key)}`

  let res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  })

  let raw = await res.text()
  let json

  try {
    json = JSON.parse(raw)
  } catch {
    throw new Error(`Response API bukan JSON:\n${raw.slice(0, 500)}`)
  }

  if (!res.ok) {
    throw new Error(json?.message || json?.error || `HTTP ${res.status}`)
  }

  return json
}

function renderResult(json, key) {
  if (!json?.status) {
    return `❌ *API KEY TIDAK VALID*

*Key:* ${key}
*Pesan:* ${json?.message || json?.error || 'Tidak diketahui'}`
  }

  let data = json.data || {}
  let features = data.features || {}
  let featureList = Object.entries(features)

  let text = `*🔐 API KEY CHECKER*

*• Key:* ${key}
*• Status:* ${data.isExpired ? '❌ Expired' : '✅ Aktif'}
*• Plan:* ${data.plan || '-'}
*• Limit:* ${formatNumber(data.limit)}
*• Usage:* ${formatNumber(data.usage)}
*• Total Hit:* ${formatNumber(data.totalHit)}
*• Remaining:* ${formatNumber(data.remaining)}
*• Reset:* ${data.reset || '-'}
*• Expired:* ${data.expired || '-'}
*• Reset Every:* ${formatMs(data.resetEvery?.ms)}

*📦 FEATURE LIMIT*`

  if (featureList.length < 1) {
    text += `\nTidak ada data fitur.`
  } else {
    for (let [name, item] of featureList) {
      text += `

*• ${formatFeatureName(name)}*
- Hit: ${formatNumber(item.hit)}
- Use: ${formatNumber(item.use)}
- Max: ${formatNumber(item.max)}
- Reset: ${formatMs(item.ms)}`
    }
  }

  return text.trim()
}

let handler = async (m, { text, usedPrefix, command }) => {
  let key = text?.trim()

  if (!key) {
    return m.reply(`*🔐 MANAGE APIKEY*

Gunakan:
*${usedPrefix + command} <apikey>*

Contoh:
*${usedPrefix + command} raizell*`)
  }

  try {
    await m.reply('⏳ Sedang mengecek API key...')

    let json = await checkApikey(key)

    return m.reply(renderResult(json, key))
  } catch (e) {
    console.error(e)

    return m.reply(`❌ *Gagal cek API key*

${e.message || e}`)
  }
}

handler.help = [
  'apikey <key>',
  'cekapikey <key>',
  'cekapi <key>',
  'manageapikey <key>'
]

handler.tags = ['tools']

handler.command = /^(apikey|cekapikey|cekapi|manageapikey)$/i

handler.register = true
handler.owner = true
export default handler