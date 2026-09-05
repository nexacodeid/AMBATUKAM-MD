const PN_SUFFIX = '@s.whatsapp.net'
const LID_SUFFIX = '@lid'
const routingCache = new WeakMap()

function normalizeUserJid(jid) {
  if (typeof jid !== 'string' || !jid.includes('@')) return jid
  const [left, server] = jid.split('@')
  return `${left.split(':')[0]}@${server}`
}

function isPn(jid) {
  return typeof jid === 'string' && jid.endsWith(PN_SUFFIX)
}

function isLid(jid) {
  return typeof jid === 'string' && jid.endsWith(LID_SUFFIX)
}

function cacheFor(conn) {
  let cache = routingCache.get(conn)
  if (!cache) {
    cache = new Map()
    routingCache.set(conn, cache)
  }
  return cache
}

function pairFrom(primary, alternate) {
  const first = normalizeUserJid(primary)
  const second = normalizeUserJid(alternate)

  if (isPn(first) && isLid(second)) return { pn: first, lid: second }
  if (isLid(first) && isPn(second)) return { pn: second, lid: first }
  return null
}

export function jidPairsFromKey(key = {}) {
  const pairs = [
    pairFrom(key.remoteJid, key.remoteJidAlt),
    pairFrom(key.participant, key.participantAlt)
  ].filter(Boolean)

  return [...new Map(pairs.map(pair => [`${pair.pn}|${pair.lid}`, pair])).values()]
}

/**
 * Simpan pasangan PN/LID dari pesan masuk ke cache dan auth store Baileys.
 * Cache diisi sebelum operasi async supaya reaction/reply pertama tidak balapan.
 */
export async function rememberJidMappings(conn, key) {
  if (!conn || !key) return []
  const pairs = jidPairsFromKey(key)
  if (!pairs.length) return pairs

  const cache = cacheFor(conn)
  for (const { pn, lid } of pairs) cache.set(pn, lid)

  const storeMappings = conn.signalRepository?.lidMapping?.storeLIDPNMappings
  if (typeof storeMappings === 'function') {
    await storeMappings.call(conn.signalRepository.lidMapping, pairs)
  }

  return pairs
}

/**
 * WhatsApp dapat menolak kiriman 1:1 ke PN dengan error 463 ketika kontak
 * sudah mempunyai LID. Grup, newsletter, broadcast, dan JID lain tidak diubah.
 */
export async function resolvePrivateSendJid(conn, jid, quotedKey) {
  if (!conn || !isPn(jid)) return jid

  try {
    if (quotedKey) await rememberJidMappings(conn, quotedKey)

    const pn = normalizeUserJid(jid)
    const cache = cacheFor(conn)
    const cached = cache.get(pn)
    if (isLid(cached)) return cached

    const getLIDForPN = conn.signalRepository?.lidMapping?.getLIDForPN
    if (typeof getLIDForPN !== 'function') return jid

    const lid = normalizeUserJid(
      await getLIDForPN.call(conn.signalRepository.lidMapping, pn)
    )

    if (!isLid(lid)) return jid
    cache.set(pn, lid)
    return lid
  } catch (error) {
    conn.logger?.warn?.(`Gagal menyelesaikan LID tujuan: ${error.message || error}`)
    return jid
  }
}
