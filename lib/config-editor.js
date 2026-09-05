import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CONFIG_FILE = path.join(ROOT_DIR, 'config.js')
const ALLOWED_KEYS = new Set(['namebot', 'ownerName'])

function normalizeName(value, label) {
  const name = String(value || '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim()
  if (!name) throw new Error(`${label} tidak boleh kosong.`)
  if (name.length > 60) throw new Error(`${label} maksimal 60 karakter.`)
  return name
}

async function updateConfigString(key, value) {
  if (!ALLOWED_KEYS.has(key)) throw new Error('Key config tidak diizinkan.')

  const source = await fs.readFile(CONFIG_FILE, 'utf8')
  const lineRegex = new RegExp(`^\\s*global\\.${key}\\s*=.*?;?\\s*$`, 'm')
  if (!lineRegex.test(source)) {
    throw new Error(`global.${key} tidak ditemukan di config.js.`)
  }

  const replacement = `global.${key} = ${JSON.stringify(value)};`
  const updated = source.replace(lineRegex, replacement)
  const tempFile = `${CONFIG_FILE}.tmp-${process.pid}-${Date.now()}`

  await fs.writeFile(tempFile, updated, 'utf8')
  await fs.rename(tempFile, CONFIG_FILE)
}

export async function setBotName(value) {
  const name = normalizeName(value, 'Nama bot')
  await updateConfigString('namebot', name)

  global.namebot = name
  global.namabot = name
  global.stickauth = name
  return name
}

export async function setOwnerName(value) {
  const name = normalizeName(value, 'Nama owner')
  const previousName = global.ownerName || global.author

  await updateConfigString('ownerName', name)

  global.ownerName = name
  global.author = name

  if (Array.isArray(global.owner)) {
    global.owner = global.owner.map((entry, index) => {
      if (!Array.isArray(entry)) return entry
      const shouldUpdate = index === 0 || String(entry[1] || '') === String(previousName || '')
      return shouldUpdate ? [entry[0], name, entry[2]] : entry
    })
  }

  return name
}

export function getConfigPath() {
  return CONFIG_FILE
}
