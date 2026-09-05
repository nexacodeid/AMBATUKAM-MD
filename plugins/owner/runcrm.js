import { generateWAMessageFromContent } from 'baileys'

function cleanCode(text = '') {
  text = String(text || '').trim()

  text = text
    .replace(/^export\s+default\s+/i, '')
    .replace(/^module\.exports\s*=\s*/i, '')
    .trim()

  if (text.endsWith(';')) {
    text = text.slice(0, -1).trim()
  }

  return text
}

function parseRelayFile(text = '') {
  const clean = cleanCode(text)
  const json = JSON.parse(clean)

  const payload =
    json.payload ||
    json.message ||
    json.msg ||
    null

  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload relay tidak ditemukan.')
  }

  return payload
}

async function downloadQuotedFile(m, conn) {
  const q = m.quoted

  if (!q) return null

  if (typeof q.download === 'function') {
    return await q.download()
  }

  if (typeof conn.downloadMediaMessage === 'function') {
    return await conn.downloadMediaMessage(q)
  }

  return null
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function fixInteractiveMessage(payload = {}) {
  if (!payload.interactiveMessage) return payload

  const msg = deepClone(payload)
  const interactive = msg.interactiveMessage

  if (interactive.body?.footer && !interactive.footer) {
    interactive.footer = interactive.body.footer
    delete interactive.body.footer
  }

  if (interactive.body?.nativeFlowMessage && !interactive.nativeFlowMessage) {
    interactive.nativeFlowMessage = interactive.body.nativeFlowMessage
    delete interactive.body.nativeFlowMessage
  }

  if (interactive.body?.header && !interactive.header) {
    interactive.header = interactive.body.header
    delete interactive.body.header
  }

  if (!interactive.body || typeof interactive.body !== 'object') {
    interactive.body = {
      text: String(interactive.body || '')
    }
  }

  if (!interactive.nativeFlowMessage?.messageParamsJson) {
    interactive.nativeFlowMessage = {
      ...(interactive.nativeFlowMessage || {}),
      messageParamsJson: '{}'
    }
  }

  if (Array.isArray(interactive.nativeFlowMessage?.buttons)) {
    interactive.nativeFlowMessage.buttons = interactive.nativeFlowMessage.buttons.map(button => {
      if (button.buttonParamsJson && typeof button.buttonParamsJson !== 'string') {
        button.buttonParamsJson = JSON.stringify(button.buttonParamsJson)
      }

      return button
    })
  }

  return msg
}

function wrapInteractive(payload = {}) {
  if (!payload.interactiveMessage) return payload

  return {
    viewOnceMessage: {
      message: {
        interactiveMessage: payload.interactiveMessage
      }
    }
  }
}

async function relayCrmMessage(conn, jid, payload) {
  const fixed = fixInteractiveMessage(payload)
  const wrapped = wrapInteractive(fixed)

  if (wrapped.viewOnceMessage) {
    const waMsg = generateWAMessageFromContent(
      jid,
      wrapped,
      {
        userJid: conn.user?.id
      }
    )

    await conn.relayMessage(
      jid,
      waMsg.message,
      {
        messageId: waMsg.key.id
      }
    )

    return
  }

  await conn.relayMessage(jid, fixed, {})
}

let handler = async (m, { conn, text }) => {
  try {
    let raw = String(text || '').trim()

    if (!raw) {
      const buffer = await downloadQuotedFile(m, conn)

      if (!buffer) {
        return conn.sendMessage(
          m.chat,
          {
            text:
              `Reply file relay.js hasil dari .crm, lalu kirim:\n` +
              `.runcrm`
          },
          {
            quoted: m
          }
        )
      }

      raw = buffer.toString('utf8')
    }

    const payload = parseRelayFile(raw)

    await relayCrmMessage(conn, m.chat, payload)

    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    })
  } catch (e) {
    console.error('RUNCRM ERROR:', e)

    await conn.sendMessage(
      m.chat,
      {
        text: `❌ Gagal menjalankan CRM.\n\n${e.message || e}`
      },
      {
        quoted: m
      }
    )
  }
}

handler.help = ['runcrm']
handler.tags = ['owner']
handler.command = /^runcrm$/i
handler.owner = true

export default handler