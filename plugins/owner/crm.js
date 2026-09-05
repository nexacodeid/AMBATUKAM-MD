function getQuotedPayload(m) {
  const payload =
    m?.msg?.contextInfo?.quotedMessage ||
    m?.quoted?.message ||
    m?.quoted?.fakeObj?.message ||
    null

  if (payload) return payload

  const q = m.quoted

  if (q?.mtype && q?.msg) {
    return {
      [q.mtype]: q.msg
    }
  }

  return null
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function hasViewOnce(obj) {
  if (!obj || typeof obj !== 'object') return false

  if (
    obj.viewOnceMessage ||
    obj.viewOnceMessageV2 ||
    obj.viewOnceMessageV2Extension
  ) {
    return true
  }

  for (const value of Object.values(obj)) {
    if (hasViewOnce(value)) return true
  }

  return false
}

let handler = async (m, { conn }) => {
  const payload = getQuotedPayload(m)

  if (!payload) {
    return conn.sendMessage(
      m.chat,
      {
        text: 'Reply pesan target dulu, lalu kirim .crm'
      },
      {
        quoted: m
      }
    )
  }

  if (hasViewOnce(payload)) {
    return conn.sendMessage(
      m.chat,
      {
        text: '❌ Pesan view-once tidak bisa disimpan.'
      },
      {
        quoted: m
      }
    )
  }

  try {
    const msg = deepClone(payload)

    const data = {
      type: 'bot-crm-relay',
      version: 1,
      createdAt: new Date().toISOString(),
      creator: global.getBotName?.() || global.namebot || 'WhatsApp Bot',
      payload: msg
    }

    const code =
      `export default ${JSON.stringify(data, null, 2)}\n`

    await conn.sendMessage(
      m.chat,
      {
        document: Buffer.from(code),
        mimetype: 'application/javascript',
        fileName: 'relay.js',
        caption:
          `✅ *CRM berhasil dibuat*\n\n` +
          `Reply file ini lalu kirim:\n` +
          `.runcrm`
      },
      {
        quoted: m
      }
    )

    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    })
  } catch (e) {
    console.error('CRM ERROR:', e)

    await conn.sendMessage(
      m.chat,
      {
        text: `❌ Gagal membuat CRM.\n\n${e.message || e}`
      },
      {
        quoted: m
      }
    )
  }
}

handler.help = ['crm']
handler.tags = ['owner']
handler.command = /^crm$/i
handler.owner = true

export default handler