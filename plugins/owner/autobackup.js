import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import archiver from 'archiver'

const ROOT_DIR = process.cwd()
const BACKUP_DIR = path.join(ROOT_DIR, 'backup')
const CONFIG_FILE = path.join(ROOT_DIR, 'data', 'autobackup.json')
const DEFAULT_INTERVAL_MS = 6 * 60 * 60 * 1000
const MIN_INTERVAL_MS = 15 * 60 * 1000
const MAX_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000
const MAX_BACKUP_SIZE = 100 * 1024 * 1024
const MAX_TIMER_DELAY = 2_147_000_000
const STATE_KEY = Symbol.for('shinomiya.autobackup.runtime.v2')

const BACKUP_IGNORES = [
  'node_modules/**',
  'sessions/**',
  'session/**',
  'auth/**',
  'auth_info_baileys/**',
  'backup/**',
  'tmp/**',
  '.tmp/**',
  '.cache/**',
  '.npm/**',
  '.git/**',
  '.env',
  '.env.*',
  '**/.env',
  '**/.env.*',
  '**/creds.json',
  '**/credentials.json',
  '**/*.session.json',
  '**/*.zip',
  '**/*.tgz',
  'data/autobackup.json'
]

const runtime = globalThis[STATE_KEY] || (globalThis[STATE_KEY] = {
  config: null,
  initPromise: null,
  timer: null,
  running: false,
  conn: null
})

// Matikan timer milik versi plugin lama saat file di-hot-reload.
if (globalThis.autoBackup?.interval) {
  clearInterval(globalThis.autoBackup.interval)
  globalThis.autoBackup.interval = null
}

function defaultConfig() {
  return {
    enabled: false,
    intervalMs: DEFAULT_INTERVAL_MS,
    targetJid: '',
    lastBackupAt: 0,
    nextBackupAt: 0,
    lastFileSize: 0,
    lastError: ''
  }
}

function normalizeConfig(value = {}) {
  const interval = Number(value.intervalMs)
  return {
    enabled: Boolean(value.enabled),
    intervalMs: Number.isFinite(interval) && interval >= MIN_INTERVAL_MS && interval <= MAX_INTERVAL_MS
      ? interval
      : DEFAULT_INTERVAL_MS,
    targetJid: typeof value.targetJid === 'string' ? value.targetJid : '',
    lastBackupAt: Number(value.lastBackupAt) || 0,
    nextBackupAt: Number(value.nextBackupAt) || 0,
    lastFileSize: Number(value.lastFileSize) || 0,
    lastError: typeof value.lastError === 'string' ? value.lastError : ''
  }
}

async function loadConfig() {
  try {
    const raw = await fsp.readFile(CONFIG_FILE, 'utf8')
    return normalizeConfig(JSON.parse(raw))
  } catch (error) {
    if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) {
      console.error('[AUTO BACKUP] Gagal membaca konfigurasi:', error)
    }
    return defaultConfig()
  }
}

async function saveConfig() {
  await fsp.mkdir(path.dirname(CONFIG_FILE), { recursive: true })
  const temporary = `${CONFIG_FILE}.${process.pid}.${randomUUID()}.tmp`
  await fsp.writeFile(temporary, `${JSON.stringify(runtime.config, null, 2)}\n`, 'utf8')
  await fsp.rename(temporary, CONFIG_FILE)
}

function parseDuration(input) {
  if (!input) return null
  const match = String(input).trim().match(/^(\d+(?:\.\d+)?)(m|h|d)?$/i)
  if (!match) throw new Error('Format interval tidak valid. Gunakan contoh 30m, 6h, atau 1d.')

  const amount = Number(match[1])
  const unit = (match[2] || 'h').toLowerCase()
  const multiplier = unit === 'm' ? 60_000 : unit === 'd' ? 86_400_000 : 3_600_000
  const duration = Math.round(amount * multiplier)

  if (duration < MIN_INTERVAL_MS || duration > MAX_INTERVAL_MS) {
    throw new Error('Interval harus antara 15 menit sampai 7 hari.')
  }
  return duration
}

function formatDuration(milliseconds) {
  if (milliseconds % 86_400_000 === 0) return `${milliseconds / 86_400_000} hari`
  if (milliseconds % 3_600_000 === 0) return `${milliseconds / 3_600_000} jam`
  return `${Math.round(milliseconds / 60_000)} menit`
}

function formatBytes(bytes) {
  const value = Number(bytes)
  if (!Number.isFinite(value) || value <= 0) return '-'
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

function formatDate(timestamp) {
  if (!timestamp) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'medium',
    timeStyle: 'medium'
  }).format(new Date(timestamp))
}

function maskTarget(jid) {
  const number = String(jid || '').split('@')[0].replace(/\D/g, '')
  if (!number) return '-'
  if (number.length < 8) return number
  return `${number.slice(0, 4)}•••${number.slice(-3)}`
}

function safeBotName() {
  return String(globalThis.namebot || 'Shinomiya-MD')
    .replace(/[^a-z0-9_-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) || 'Shinomiya-MD'
}

function flushDatabase() {
  try {
    if (!globalThis.db?.sqlite || !globalThis.db?.data) return
    globalThis.db.sqlite
      .prepare('UPDATE database SET data = ? WHERE id = 1')
      .run(JSON.stringify(globalThis.db.data))
    globalThis.db.sqlite.pragma('wal_checkpoint(TRUNCATE)')
  } catch (error) {
    console.error('[AUTO BACKUP] Database checkpoint gagal:', error)
  }
}

async function createBackupZip() {
  await fsp.mkdir(BACKUP_DIR, { recursive: true })
  flushDatabase()

  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const file = path.join(BACKUP_DIR, `${safeBotName()}-backup-${stamp}.zip`)

  try {
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(file)
      const archive = archiver('zip', { zlib: { level: 9 } })

      output.once('close', resolve)
      output.once('error', reject)
      archive.once('error', reject)
      archive.on('warning', error => {
        if (error.code !== 'ENOENT') reject(error)
      })

      archive.pipe(output)
      archive.glob('**/*', {
        cwd: ROOT_DIR,
        dot: true,
        follow: false,
        ignore: BACKUP_IGNORES
      })

      Promise.resolve(archive.finalize()).catch(reject)
    })

    const info = await fsp.stat(file)
    if (!info.size) throw new Error('Arsip backup kosong.')
    return { file, size: info.size }
  } catch (error) {
    await fsp.rm(file, { force: true }).catch(() => {})
    throw error
  }
}

async function cleanupOldBackups(keep = 3) {
  try {
    const entries = await fsp.readdir(BACKUP_DIR, { withFileTypes: true })
    const files = await Promise.all(entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.zip'))
      .map(async entry => {
        const file = path.join(BACKUP_DIR, entry.name)
        const info = await fsp.stat(file)
        return { file, modified: info.mtimeMs }
      }))

    files.sort((a, b) => b.modified - a.modified)
    await Promise.all(files.slice(keep).map(item => fsp.rm(item.file, { force: true })))
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('[AUTO BACKUP] Cleanup gagal:', error)
  }
}

async function sendBackup(conn, targetJid, options = {}) {
  if (runtime.running) throw new Error('Proses backup lain masih berjalan.')
  if (!conn || typeof conn.sendMessage !== 'function') throw new Error('Koneksi WhatsApp belum siap.')
  if (!targetJid) throw new Error('Tujuan backup belum diatur.')

  runtime.running = true
  let generated = null

  try {
    generated = await createBackupZip()
    if (generated.size > MAX_BACKUP_SIZE) {
      throw new Error(`Ukuran backup ${formatBytes(generated.size)} melebihi batas 100 MB. File disimpan sementara di folder backup.`)
    }

    const caption = [
      options.manual ? '✅ *Backup manual selesai*' : '✅ *Auto backup selesai*',
      `📦 ${path.basename(generated.file)}`,
      `📏 ${formatBytes(generated.size)}`,
      `🕒 ${formatDate(Date.now())}`,
      '',
      '_Session WhatsApp, file .env, cache, node_modules, dan arsip lama tidak disertakan._'
    ].join('\n')

    const sendOptions = options.quoted && options.quoted.chat === targetJid
      ? { quoted: options.quoted }
      : {}

    await conn.sendMessage(targetJid, {
      document: { url: generated.file },
      fileName: path.basename(generated.file),
      mimetype: 'application/zip',
      caption
    }, sendOptions)

    runtime.config.lastBackupAt = Date.now()
    runtime.config.lastFileSize = generated.size
    runtime.config.lastError = ''
    await fsp.rm(generated.file, { force: true })
    generated = null
    await cleanupOldBackups(3)
    return true
  } catch (error) {
    runtime.config.lastError = String(error.message || error).slice(0, 500)
    if (generated?.file) await cleanupOldBackups(3)
    throw error
  } finally {
    runtime.running = false
    await saveConfig().catch(error => console.error('[AUTO BACKUP] Gagal menyimpan status:', error))
  }
}

function clearSchedule() {
  if (runtime.timer) clearTimeout(runtime.timer)
  runtime.timer = null
}

async function scheduleNext() {
  clearSchedule()
  const config = runtime.config

  globalThis.autoBackup = {
    active: Boolean(config?.enabled),
    interval: null
  }

  if (!config?.enabled || !config.targetJid) return

  if (!config.nextBackupAt) {
    config.nextBackupAt = Date.now() + config.intervalMs
    await saveConfig()
  }

  const remaining = config.nextBackupAt - Date.now()
  const delay = Math.min(MAX_TIMER_DELAY, Math.max(remaining, 10_000))

  runtime.timer = setTimeout(async () => {
    if (Date.now() + 1000 < runtime.config.nextBackupAt) {
      await scheduleNext()
      return
    }

    try {
      await sendBackup(runtime.conn || globalThis.conn, runtime.config.targetJid)
    } catch (error) {
      console.error('[AUTO BACKUP]', error)
      try {
        await (runtime.conn || globalThis.conn)?.sendMessage?.(runtime.config.targetJid, {
          text: `❌ Auto backup gagal:\n${error.message || error}`
        })
      } catch {}
    } finally {
      runtime.config.nextBackupAt = Date.now() + runtime.config.intervalMs
      await saveConfig().catch(console.error)
      await scheduleNext()
    }
  }, delay)

  runtime.timer.unref?.()
  globalThis.autoBackup.interval = runtime.timer
}

async function initialize(conn) {
  if (conn) runtime.conn = conn
  if (runtime.config) {
    await scheduleNext()
    return runtime.config
  }

  if (!runtime.initPromise) {
    runtime.initPromise = (async () => {
      runtime.config = await loadConfig()
      await scheduleNext()
      return runtime.config
    })().finally(() => {
      runtime.initPromise = null
    })
  }

  return runtime.initPromise
}

function helpText(usedPrefix, command) {
  return [
    '「 *AUTO BACKUP* 」',
    '',
    `${usedPrefix}${command} on [30m/6h/1d]`,
    `${usedPrefix}${command} off`,
    `${usedPrefix}${command} now`,
    `${usedPrefix}${command} status`,
    `${usedPrefix}${command} interval <30m/6h/1d>`,
    '',
    'Interval minimum 15 menit dan maksimum 7 hari.',
    'Backup otomatis dikirim ke private chat owner yang mengaktifkannya.'
  ].join('\n')
}

let handler = async (m, { conn, usedPrefix = '.', command = 'autobackup', args = [], isOwner }) => {
  if (!isOwner) return m.reply('Fitur ini khusus owner.')
  await initialize(conn)

  const action = String(args[0] || '').toLowerCase()
  if (!action) return m.reply(helpText(usedPrefix, command))

  try {
    if (['on', 'start', 'aktif'].includes(action)) {
      const interval = args[1] ? parseDuration(args[1]) : runtime.config.intervalMs
      runtime.config.enabled = true
      runtime.config.intervalMs = interval
      runtime.config.targetJid = m.sender
      runtime.config.nextBackupAt = Date.now() + interval
      runtime.config.lastError = ''
      await saveConfig()
      await scheduleNext()

      return m.reply([
        '✅ *Auto backup diaktifkan*',
        `⏱️ Interval: ${formatDuration(interval)}`,
        `📨 Tujuan: private chat owner (${maskTarget(m.sender)})`,
        `🗓️ Backup berikutnya: ${formatDate(runtime.config.nextBackupAt)}`
      ].join('\n'))
    }

    if (['off', 'stop', 'nonaktif'].includes(action)) {
      runtime.config.enabled = false
      runtime.config.nextBackupAt = 0
      clearSchedule()
      globalThis.autoBackup = { active: false, interval: null }
      await saveConfig()
      return m.reply('✅ Auto backup dinonaktifkan.')
    }

    if (['interval', 'set'].includes(action)) {
      const interval = parseDuration(args[1])
      if (!interval) throw new Error(`Masukkan interval. Contoh: ${usedPrefix}${command} interval 6h`)
      runtime.config.intervalMs = interval
      if (runtime.config.enabled) runtime.config.nextBackupAt = Date.now() + interval
      await saveConfig()
      await scheduleNext()
      return m.reply(`✅ Interval auto backup diubah menjadi ${formatDuration(interval)}.`)
    }

    if (['now', 'sekarang', 'test'].includes(action)) {
      await m.react?.('⏳').catch(() => {})
      await sendBackup(conn, m.sender, { manual: true, quoted: m })
      await m.react?.('✅').catch(() => {})
      if (m.chat !== m.sender) await m.reply('✅ Backup sudah dikirim ke private chat owner.')
      return
    }

    if (['status', 'cek'].includes(action)) {
      const config = runtime.config
      return m.reply([
        '「 *STATUS AUTO BACKUP* 」',
        '',
        `Status: ${config.enabled ? '✅ AKTIF' : '❌ NONAKTIF'}`,
        `Interval: ${formatDuration(config.intervalMs)}`,
        `Tujuan: ${maskTarget(config.targetJid)}`,
        `Backup terakhir: ${formatDate(config.lastBackupAt)}`,
        `Ukuran terakhir: ${formatBytes(config.lastFileSize)}`,
        `Backup berikutnya: ${config.enabled ? formatDate(config.nextBackupAt) : '-'}`,
        `Proses berjalan: ${runtime.running ? 'Ya' : 'Tidak'}`,
        config.lastError ? `Error terakhir: ${config.lastError}` : null
      ].filter(Boolean).join('\n'))
    }

    return m.reply(helpText(usedPrefix, command))
  } catch (error) {
    console.error('[AUTO BACKUP COMMAND]', error)
    await m.react?.('❌').catch(() => {})
    return m.reply(`❌ ${error.message || error}`)
  }
}

handler.help = ['autobackup on [interval]', 'autobackup off', 'autobackup now', 'autobackup status']
handler.tags = ['owner']
handler.command = /^(autobackup|backupauto)$/i
handler.owner = true

const startup = setTimeout(() => {
  initialize(globalThis.conn).catch(error => console.error('[AUTO BACKUP INIT]', error))
}, 5_000)
startup.unref?.()

export default handler