const REGISTRY_URL = 'https://registry.npmjs.org'
const REQUEST_TIMEOUT_MS = 20_000
const TYPING_REFRESH_MS = 8_000
const MAX_TARBALL_SIZE = 100 * 1024 * 1024
const MAX_METADATA_SIZE = 10 * 1024 * 1024

function truncate(value, max = 300) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

function formatBytes(bytes) {
  const value = Number(bytes)
  if (!Number.isFinite(value) || value < 0) return '-'
  if (value < 1024) return `${value} B`

  const units = ['KB', 'MB', 'GB']
  let size = value / 1024
  let unit = units[0]

  for (let index = 1; index < units.length && size >= 1024; index += 1) {
    size /= 1024
    unit = units[index]
  }

  return `${size.toFixed(size >= 10 ? 1 : 2)} ${unit}`
}

function packageLicense(value) {
  if (typeof value === 'string') return value
  if (value && typeof value.type === 'string') return value.type
  return '-'
}

function parsePackageSpec(input) {
  const spec = String(input || '').trim().split(/\s+/)[0]
  if (!spec) return null

  let name = spec
  let selector = 'latest'

  if (spec.startsWith('@')) {
    const slashIndex = spec.indexOf('/')
    const versionIndex = spec.lastIndexOf('@')

    if (slashIndex < 2) throw new Error('Scoped package tidak valid. Contoh: @scope/package')
    if (versionIndex > slashIndex) {
      name = spec.slice(0, versionIndex)
      selector = spec.slice(versionIndex + 1)
    }
  } else {
    const versionIndex = spec.lastIndexOf('@')
    if (versionIndex > 0) {
      name = spec.slice(0, versionIndex)
      selector = spec.slice(versionIndex + 1)
    }
  }

  if (!selector) throw new Error('Versi atau tag NPM tidak boleh kosong.')
  if (name.length > 214) throw new Error('Nama package terlalu panjang.')

  const validName = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/i
  const validSelector = /^[a-z0-9][a-z0-9._+~-]*$/i

  if (!validName.test(name)) throw new Error('Nama package NPM tidak valid.')
  if (!validSelector.test(selector)) {
    throw new Error('Gunakan versi pasti atau dist-tag, misalnya 1.4.6, latest, beta, atau next.')
  }

  return { name, selector }
}

function registryPackageUrl(name, selector) {
  return `${REGISTRY_URL}/${encodeURIComponent(name)}/${encodeURIComponent(selector)}`
}

function assertOfficialTarball(value) {
  let url

  try {
    url = new URL(value)
  } catch {
    throw new Error('Registry mengembalikan URL tarball yang tidak valid.')
  }

  const officialHost = url.hostname === 'registry.npmjs.org' || url.hostname.endsWith('.npmjs.org')
  if (url.protocol !== 'https:' || !officialHost) {
    throw new Error('URL tarball bukan berasal dari registry NPM resmi.')
  }

  return url.toString()
}

async function fetchPackage(name, selector) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  timeout.unref?.()

  try {
    const response = await fetch(registryPackageUrl(name, selector), {
      headers: {
        accept: 'application/json',
        'user-agent': 'Shinomiya-MD/npm-downloader'
      },
      signal: controller.signal
    })

    if (response.status === 404) {
      throw new Error(`Package atau versi “${name}@${selector}” tidak ditemukan.`)
    }
    if (!response.ok) throw new Error(`Registry NPM merespons HTTP ${response.status}.`)

    const contentLength = Number(response.headers.get('content-length'))
    if (Number.isFinite(contentLength) && contentLength > MAX_METADATA_SIZE) {
      throw new Error('Metadata package terlalu besar untuk diproses.')
    }

    const data = await response.json()
    if (!data?.name || !data?.version || !data?.dist?.tarball) {
      throw new Error('Metadata package dari registry tidak lengkap.')
    }

    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Registry NPM terlalu lama merespons. Coba lagi nanti.')
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

async function getTarballSize(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  timeout.unref?.()

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal
    })
    if (!response.ok) return null
    const size = Number(response.headers.get('content-length'))
    return Number.isFinite(size) && size >= 0 ? size : null
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

function safeFileName(name, version) {
  const packageName = name
    .replace(/^@/, '')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9._-]/gi, '-')
  const packageVersion = String(version).replace(/[^a-z0-9._-]/gi, '-')
  return `${packageName}-${packageVersion}.tgz`
}

async function startTyping(conn, chatId) {
  if (typeof conn.sendPresenceUpdate !== 'function') return async () => {}

  const composing = () => Promise.resolve(
    conn.sendPresenceUpdate('composing', chatId)
  ).catch(() => {})

  await composing()
  const timer = setInterval(composing, TYPING_REFRESH_MS)
  timer.unref?.()

  return async () => {
    clearInterval(timer)
    await Promise.resolve(conn.sendPresenceUpdate('paused', chatId)).catch(() => {})
  }
}

function errorMessage(error) {
  return error.message || String(error)
}

let handler = async (m, { conn, text = '', usedPrefix = '.', command = 'npmdl' }) => {
  if (!text.trim()) {
    return m.reply([
      '*NPM Package Downloader*',
      '',
      `Pemakaian: ${usedPrefix}${command} <package>[@versi/tag]`,
      `Contoh: ${usedPrefix}${command} axios`,
      `Contoh: ${usedPrefix}${command} @zenaveline/scraper@1.4.6`
    ].join('\n'))
  }

  await m.react?.('⏳').catch(() => {})
  const stopTyping = await startTyping(conn, m.chat)

  try {
    const { name, selector } = parsePackageSpec(text)
    const metadata = await fetchPackage(name, selector)
    const tarball = assertOfficialTarball(metadata.dist.tarball)
    const compressedSize = await getTarballSize(tarball)

    if (compressedSize !== null && compressedSize > MAX_TARBALL_SIZE) {
      throw new Error(`Ukuran arsip ${formatBytes(compressedSize)}, melebihi batas 100 MB.`)
    }

    const dependencyCount = Object.keys(metadata.dependencies || {}).length
    const unpackedSize = metadata.dist.unpackedSize
    const caption = [
      '*NPM Package Downloader*',
      '',
      `📦 *Package:* ${metadata.name}`,
      `🏷️ *Version:* ${metadata.version}`,
      `📄 *Lisensi:* ${packageLicense(metadata.license)}`,
      `🧩 *Dependencies:* ${dependencyCount}`,
      `🗂️ *Files:* ${metadata.dist.fileCount ?? '-'}`,
      `📥 *Ukuran arsip:* ${compressedSize === null ? '-' : formatBytes(compressedSize)}`,
      `📤 *Ukuran ekstrak:* ${unpackedSize == null ? '-' : formatBytes(unpackedSize)}`,
      metadata.deprecated ? `⚠️ *Deprecated:* ${truncate(metadata.deprecated, 250)}` : null,
      metadata.description ? `\n📝 ${truncate(metadata.description)}` : null,
      '',
      `Instal: npm install ${metadata.name}@${metadata.version}`
    ].filter(Boolean).join('\n')

    await conn.sendMessage(m.chat, {
      document: { url: tarball },
      mimetype: 'application/gzip',
      fileName: safeFileName(metadata.name, metadata.version),
      caption
    }, { quoted: m })

    await m.react?.('✅').catch(() => {})
  } catch (error) {
    console.error('[NPMDL]', error)
    await m.react?.('❌').catch(() => {})
    await m.reply(`❌ ${errorMessage(error)}`)
  } finally {
    await stopTyping()
  }
}

handler.help = ['npmdl <package>[@versi/tag]']
handler.tags = ['downloader']
handler.command = /^(npmdl|npmdownload|npmpkg)$/i
handler.limit = true
handler.register = true

export default handler