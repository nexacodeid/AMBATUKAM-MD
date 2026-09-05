const BRANDING_SOURCE = Symbol.for('bot.branding.source')

function brandingValues() {
  return {
    namebot: global.getBotName?.() || global.namebot || global.namabot || 'WhatsApp Bot',
    ownerName: global.getOwnerName?.() || global.ownerName || global.author || global.owner?.[0]?.[1] || 'Owner',
    ownerNumber: String(global.owner?.[0]?.[0] || '').replace(/[^0-9]/g, '')
  }
}

export function resolveBrandingString(value = '') {
  const branding = brandingValues()
  return String(value)
    .replace(/\{\{\s*namebot\s*\}\}/gi, branding.namebot)
    .replace(/\{\{\s*ownerName\s*\}\}/gi, branding.ownerName)
    .replace(/\{\{\s*ownerNumber\s*\}\}/gi, branding.ownerNumber)
}

function attachSource(target, source) {
  Object.defineProperty(target, BRANDING_SOURCE, {
    value: source,
    enumerable: false,
    configurable: false,
    writable: false
  })
  return target
}

export function resolveBranding(value) {
  if (typeof value === 'string') return resolveBrandingString(value)

  if (Array.isArray(value)) {
    return attachSource(value.map(resolveBranding), value)
  }

  if (value && typeof value === 'object') {
    const resolved = Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveBranding(item)])
    )
    return attachSource(resolved, value)
  }

  return value
}

export function encodeBranding(value, sourceValue) {
  const source = sourceValue ?? value?.[BRANDING_SOURCE]

  if (typeof value === 'string') {
    if (typeof source === 'string' && value === resolveBrandingString(source)) {
      return source
    }
    return value
  }

  if (Array.isArray(value)) {
    const sourceArray = Array.isArray(source) ? source : []
    return value.map((item, index) => encodeBranding(item, sourceArray[index]))
  }

  if (value && typeof value === 'object') {
    const sourceObject = source && typeof source === 'object' && !Array.isArray(source) ? source : {}
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, encodeBranding(item, sourceObject[key])])
    )
  }

  return value
}
