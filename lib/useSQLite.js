import Database from 'better-sqlite3'
import { Mutex } from 'async-mutex'
import { BufferJSON, initAuthCreds, proto } from 'baileys'
import path from 'node:path'
import fs from 'node:fs'

/**
 * Auth state SQLite untuk Baileys.
 *
 * Penting: jangan memakai allowlist kategori key. Baileys dapat menambahkan
 * kategori baru (misalnya tctoken dan lid-mapping). Mengabaikan kategori itu
 * membuat bot tetap menerima pesan, tetapi balasan personal akhirnya ditolak
 * WhatsApp dengan error 463 setelah cache atau koneksi berganti.
 */
export default async function useSQLite(folder = './sessions') {
  const mutex = new Mutex()
  const dbFile = path.resolve(folder, 'auth.db')

  fs.mkdirSync(path.dirname(dbFile), { recursive: true })
  const db = new Database(dbFile)

  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')
  db.pragma('temp_store = MEMORY')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS creds (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS keys (
      category TEXT NOT NULL,
      id TEXT NOT NULL,
      data TEXT,
      updated_at INTEGER,
      PRIMARY KEY (category, id)
    );
  `)

  const stmtGetCreds = db.prepare('SELECT data FROM creds WHERE id = 1')
  const stmtSetCreds = db.prepare(`
    INSERT OR REPLACE INTO creds (id, data, updated_at)
    VALUES (1, ?, ?)
  `)
  const stmtGetKey = db.prepare(`
    SELECT data FROM keys
    WHERE category = ? AND id = ?
  `)
  const stmtSetKey = db.prepare(`
    INSERT OR REPLACE INTO keys (category, id, data, updated_at)
    VALUES (?, ?, ?, ?)
  `)
  const stmtDelKey = db.prepare(`
    DELETE FROM keys
    WHERE category = ? AND id = ?
  `)
  const stmtClearKeys = db.prepare('DELETE FROM keys')

  const applyKeyChanges = db.transaction((data, updatedAt) => {
    for (const [category, entries] of Object.entries(data || {})) {
      if (!entries || typeof entries !== 'object') continue

      for (const [id, value] of Object.entries(entries)) {
        if (value == null) {
          stmtDelKey.run(category, id)
          continue
        }

        stmtSetKey.run(
          category,
          id,
          JSON.stringify(value, BufferJSON.replacer),
          updatedAt
        )
      }
    }
  })

  const readCreds = () => mutex.runExclusive(() => {
    const row = stmtGetCreds.get()
    return row ? JSON.parse(row.data, BufferJSON.reviver) : null
  })

  const writeCreds = creds => mutex.runExclusive(() => {
    stmtSetCreds.run(JSON.stringify(creds, BufferJSON.replacer), Date.now())
  })

  const readKeys = (category, ids) => mutex.runExclusive(() => {
    const result = {}

    for (const id of ids) {
      const row = stmtGetKey.get(category, id)
      let value = row ? JSON.parse(row.data, BufferJSON.reviver) : null

      if (category === 'app-state-sync-key' && value) {
        value = proto.Message.AppStateSyncKeyData.fromObject(value)
      }

      result[id] = value
    }

    return result
  })

  const writeKeys = data => mutex.runExclusive(() => {
    applyKeyChanges(data, Date.now())
  })

  const clearKeys = () => mutex.runExclusive(() => {
    stmtClearKeys.run()
  })

  const creds = (await readCreds()) || initAuthCreds()

  return {
    state: {
      creds,
      keys: {
        get: readKeys,
        set: writeKeys,
        clear: clearKeys
      }
    },
    saveCreds: () => writeCreds(creds)
  }
}
