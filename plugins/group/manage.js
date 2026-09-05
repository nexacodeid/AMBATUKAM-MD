const handler = async (m, { conn, text, participants, groupMetadata, command }) => {
    // Pake conn.getJid bawaan simple.js buat resolve LID -> JID asli
    const getRealJid = (jid) => conn.getJid ? conn.getJid(jid) : jid

    let target = m.quoted ? m.quoted.sender : m.mentionedJid?.[0]

    if (!target && text) {
        let number = text.replace(/[^0-9]/g, '')
        if (number.startsWith('0')) number = '62' + number.slice(1)
        if (number.length >= 10) target = number + '@s.whatsapp.net'
    }

    const cmd = ['add', 'kick', 'promote', 'demote']
    if (cmd.includes(command) && !target) {
        throw 'Reply/tag/nomor siapa yang ingin diproses.'
    }

    if (target) target = getRealJid(target)

    const inGc = target ? participants.some(v => {
        const userJid = getRealJid(v.id || v.jid || v.lid)
        return userJid === target
    }) : false

    switch (command) {
        case 'add': {
            if (!target) throw 'Masukkan nomor yang valid.'
            if (inGc) throw `@${target.split('@')[0]} sudah ada di dalam grup!`

            const jpegThumbnail = await conn.profilePictureUrl(m.chat, 'image', 'buffer').catch(_ => null)

            async function inviteUser(jid, code = null, expiration = null) {
                try {
                    if (!code) {
                        code = await conn.groupInviteCode(m.chat)
                    }

                    await conn.sendGroupV4Invite(
                        m.chat,
                        jid,
                        code,
                        expiration || 0,
                        groupMetadata.subject,
                        'Undangan grup',
                        jpegThumbnail
                    )

                    await m.reply(
                        `Tidak bisa menambahkan @${jid.split('@')[0]} langsung.\nBot sudah mengirim undangan grup.`,
                        null,
                        { mentions: [jid] }
                    )
                } catch (e) {
                    await m.reply(
                        `Gagal menambahkan dan gagal mengundang @${jid.split('@')[0]}.\nPastikan bot admin dan link grup tersedia.`,
                        null,
                        { mentions: [jid] }
                    )
                }
            }

            try {
                const response = await conn.groupParticipantsUpdate(m.chat, [target], 'add')

                for (const res of response) {
                    const jid = getRealJid(res.jid || target)
                    const status = Number(res.status)

                    if (status === 200) {
                        await m.reply(
                            `Berhasil menambahkan @${jid.split('@')[0]}`,
                            null,
                            { mentions: [jid] }
                        )
                    } else {
                        const code = res.content?.content?.[0]?.attrs?.code
                        const expiration = res.content?.content?.[0]?.attrs?.expiration

                        await inviteUser(jid, code, expiration)
                    }
                }
            } catch (e) {
                await inviteUser(target)
            }

            break
        }

        case 'kick': {
            if (!inGc) throw 'User tidak ada dalam grup.'
            if (target === getRealJid(conn.user.jid)) throw 'Tidak bisa kick diri sendiri.'

            await conn.groupParticipantsUpdate(m.chat, [target], 'remove')

            await m.reply(
                `Berhasil kick @${target.split('@')[0]}`,
                null,
                { mentions: [target] }
            )

            break
        }

        case 'promote': {
            if (!inGc) throw 'User tidak berada dalam grup!'

            await conn.groupParticipantsUpdate(m.chat, [target], 'promote')

            await m.reply(
                `Berhasil promote @${target.split('@')[0]}`,
                null,
                { mentions: [target] }
            )

            break
        }

        case 'demote': {
            if (!inGc) throw 'User tidak berada dalam grup!'

            await conn.groupParticipantsUpdate(m.chat, [target], 'demote')

            await m.reply(
                `Berhasil demote @${target.split('@')[0]}`,
                null,
                { mentions: [target] }
            )

            break
        }

        case 'closegc':
        case 'mute': {
            await conn.groupSettingUpdate(m.chat, 'announcement')
            await m.reply('Grup berhasil ditutup. Hanya admin yang bisa chat.')
            break
        }

        case 'opengc':
        case 'unmute': {
            await conn.groupSettingUpdate(m.chat, 'not_announcement')
            await m.reply('Grup berhasil dibuka. Semua member bisa chat.')
            break
        }
    }
}

handler.help = [
    'add',
    'kick',
    'promote',
    'demote',
    'opengc',
    'closegc',
    'mute',
    'unmute'
]

handler.tags = ['group']
handler.command = /^(add|kick|promote|demote|mute|unmute|opengc|closegc)$/i

handler.admin = true
handler.group = true
handler.botAdmin = true
handler.register = true

export default handler