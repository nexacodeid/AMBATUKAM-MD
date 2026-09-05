const handler = async (m, { conn, text, participants, groupMetadata, command }) => {
    const getRealJid = (jid) => conn.getJid?.(jid) || jid

    // --- 1. Ambil target dari quoted, mention, atau teks ---
    let target = m.quoted ? m.quoted.sender : m.mentionedJid?.[0]
    if (!target && text) {
        let number = text.replace(/[^0-9]/g, '')
        if (number.startsWith('0')) number = '62' + number.slice(1)
        if (number.length >= 10) target = number + '@s.whatsapp.net'
    }

    // --- 2. Normalisasi command: hapus prefix 'o' untuk matching ---
    // addo -> add, okick -> kick, opromote -> promote, odemote -> demote
    // omute -> mute, ounmute -> unmute, oopengc -> opengc, oclosegc -> closegc
    const baseCmd = command.replace(/^o/, '')

    // --- 3. Validasi target untuk command yang membutuhkan user ---
    const needTarget = ['add', 'kick', 'promote', 'demote']
    if (needTarget.includes(baseCmd) && !target) {
        throw 'Reply/tag/nomor siapa yang ingin di proses.'
    }

    if (target) target = getRealJid(target)

    // --- 4. Cek apakah target sudah ada di grup ---
    const inGc = target ? participants.some(v => {
        const userJid = getRealJid(v.id || v.jid || v.lid)
        return userJid === target
    }) : false

    switch (baseCmd) {
        case 'add': {
            if (!target) throw 'Masukkan nomor yang valid'
            if (inGc) throw `@${target.split('@')[0]} sudah ada di dalam grup!`

            const response = await conn.groupParticipantsUpdate(m.chat, [target], 'add')
            const jpegThumbnail = await conn.profilePictureUrl(m.chat, 'image', 'buffer').catch(_ => null)

            for (const res of response) {
                const jid = getRealJid(res.jid)
                const status = res.status

                if (status == 408) {
                    await m.reply(`Tidak dapat menambahkan @${jid.split('@')[0]}!\nKemungkinan baru keluar/dikick atau private add`, null, { mentions: [jid] })
                } else if (status == 403) {
                    const code = res.content?.content?.[0]?.attrs?.code
                    const expiration = res.content?.content?.[0]?.attrs?.expiration
                    if (code) {
                        await m.reply(`Mengundang @${jid.split('@')[0]} via link invite...`, null, { mentions: [jid] })
                        await conn.sendGroupV4Invite(m.chat, jid, code, expiration, groupMetadata.subject, 'Undangan grup', jpegThumbnail)
                    } else {
                        await m.reply(`Gagal add @${jid.split('@')[0]}. Suruh join manual.`, null, { mentions: [jid] })
                    }
                } else if (status == 200) {
                    await m.reply(`Berhasil menambahkan @${jid.split('@')[0]}`, null, { mentions: [jid] })
                } else {
                    await m.reply(`Gagal menambahkan @${jid.split('@')[0]}. Status: ${status}`, null, { mentions: [jid] })
                }
            }
            break
        }

        case 'kick': {
            if (!inGc) throw 'User tidak ada dalam grup.'
            if (target === getRealJid(conn.user.jid)) throw 'Tidak bisa kick diri sendiri'
            await conn.groupParticipantsUpdate(m.chat, [target], 'remove')
            await m.reply(`Berhasil kick @${target.split('@')[0]}`, null, { mentions: [target] })
            break
        }

        case 'promote': {
            if (!inGc) throw 'User tidak berada dalam grup!'
            await conn.groupParticipantsUpdate(m.chat, [target], 'promote')
            await m.reply(`Berhasil promote @${target.split('@')[0]}`, null, { mentions: [target] })
            break
        }

        case 'demote': {
            if (!inGc) throw 'User tidak berada dalam grup!'
            await conn.groupParticipantsUpdate(m.chat, [target], 'demote')
            await m.reply(`Berhasil demote @${target.split('@')[0]}`, null, { mentions: [target] })
            break
        }

        case 'closegc':
        case 'mute':
            await conn.groupSettingUpdate(m.chat, 'announcement')
            await m.reply('Grup berhasil ditutup. Hanya admin yang bisa chat.')
            break

        case 'opengc':
        case 'unmute':
            await conn.groupSettingUpdate(m.chat, 'not_announcement')
            await m.reply('Grup berhasil dibuka. Semua member bisa chat.')
            break

        default:
            throw `Perintah *${command}* tidak dikenali.`
    }
}

handler.help = ['addo', 'okick', 'opromote', 'odemote', 'oopengc', 'oclosegc', 'omute', 'ounmute']
handler.tags = ['owner']
handler.command = /^(addo|okick|opromote|odemote|omute|ounmute|oopengc|oclosegc)$/i
handler.owner = true
handler.group = true
handler.botAdmin = true

export default handler