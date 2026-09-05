/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */

let isBroadcasting = false;
let lastBroadcastTime = 0;

const handler = async (m, { conn, text, command }) => {
  if (command === 'stopjpm') {
    if (!isBroadcasting) {
      return m.reply('ℹ️ Tidak ada proses broadcast yang sedang berlangsung.');
    }
    isBroadcasting = false;
    return m.reply('✅ Proses broadcast telah dihentikan. Pesan tidak akan dikirim ke grup berikutnya.');
  }

  if (command === 'zell-jpm') {
    if (isBroadcasting) {
      return m.reply('⚠️ Proses broadcast lain masih berlangsung. Silakan tunggu atau gunakan *.stopjpm* untuk menghentikan.');
    }

    const oneHour = 3600000;
    const timeSinceLast = Date.now() - lastBroadcastTime;
    if (timeSinceLast < oneHour) {
      const timeLeft = Math.ceil((oneHour - timeSinceLast) / 60000);
      return m.reply(`❌ Harap tunggu sekitar *${timeLeft} menit* lagi sebelum memulai broadcast baru.`);
    }

    const [delayInput, ...messageParts] = text.split('|');
    const messageText = messageParts.join('|').trim();
    const delay = parseDelay(delayInput);

    if (!delay) {
      return m.reply('Format tidak valid.\nContoh: *.zell-jpm 5s|Ini pesannya*');
    }
    const quotedMessage = m.quoted;
    const isMedia = quotedMessage && typeof quotedMessage.download === 'function' && /image|video|audio/.test(quotedMessage.mtype);

    if (!messageText && !isMedia && !quotedMessage?.text) {
      return m.reply('Teks broadcast tidak boleh kosong. Balas pesan (teks/media) atau tulis teks setelah delay.\nContoh: *.zell-jpm 5s|Halo semua*');
    }

    const groups = Object.entries(conn.chats)
      .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.read_only && !chat.announce)
      .map(([jid]) => jid);

    if (groups.length === 0) {
      return m.reply('❌ Bot tidak berada di grup manapun.');
    }

    isBroadcasting = true;
    lastBroadcastTime = Date.now();
    
    const estimatedTime = (groups.length * delay) / 1000;
    await m.reply(
      `✅ Memulai broadcast ${isMedia ? 'media' : 'teks'} ke *${groups.length}* grup.\n` +
      `🕒 Delay per pesan: *${delayInput}*\n` +
      `⏳ Estimasi waktu selesai: *~${Math.ceil(estimatedTime / 60)} menit*\n\n` +
      `Gunakan *.stopjpm* untuk membatalkan.`
    );

    let successCount = 0;
    let failedCount = 0;

    if (isMedia) {
      if (!quotedMessage) {
        isBroadcasting = false;
        return m.reply('❌ Gagal memproses: Pesan yang dikutip tidak valid atau telah hilang. Broadcast dibatalkan.');
      }
      
      const media = await quotedMessage.download();
      const caption = `–––『 *BROADCAST* 』–––\n\n${messageText || quotedMessage.text || ''}\n${global.readMore}⚡ *Join/Follow*

Group Official Raid:
https://chat.whatsapp.com/H62McETpyZQ2CNLq4wVsCf?mode=ems_copy_t

Channel ${global.getBotName?.() || global.namebot || 'Bot'}:
https://whatsapp.com/channel/0029Vb63NZk6GcG9E276Lu14`;
      
      for (let i = 0; i < groups.length; i++) {
        if (!isBroadcasting) {
          m.reply(`Broadcast media dihentikan. Terkirim ke *${successCount}* grup.`);
          break;
        }
        const groupId = groups[i];
        try {
          // --- Perubahan utama untuk tag semua member ---
          const metadata = await conn.groupMetadata(groupId);
          const members = metadata.participants.map(v => v.id);
          const taggedCaption = caption.replace(/@everyone/g, members.map(v => `@${v.split('@')[0]}`).join(' '));
          
          let mediaMessage = {};
          if (quotedMessage.mtype === 'imageMessage') {
            mediaMessage = { image: media, caption: taggedCaption, mentions: members };
          } else if (quotedMessage.mtype === 'videoMessage') {
            mediaMessage = { video: media, caption: taggedCaption, mentions: members };
          } else if (quotedMessage.mtype === 'audioMessage') {
            await conn.sendMessage(groupId, { audio: media, mimetype: 'audio/mp4' });
            await conn.sendMessage(groupId, { text: taggedCaption, mentions: members });
          }
          
          if (quotedMessage.mtype !== 'audioMessage') {
              await conn.sendMessage(groupId, mediaMessage);
          }
          successCount++;
        } catch (e) {
          failedCount++;
          console.error(`Gagal mengirim media ke grup ${groupId}:`, e);
        }

        if ((i + 1) % 20 === 0 && i < groups.length - 1) {
          await m.reply(`...sedang mengirim: *${i + 1}/${groups.length}* grup terkirim...`);
        }
        await sleep(delay);
      }
    } else {
      // --- PENANGANAN BROADCAST TEKS ---
      const messageToSend = quotedMessage || m;
      const broadcastContent = messageText || messageToSend.text;

      for (let i = 0; i < groups.length; i++) {
        if (!isBroadcasting) {
          m.reply(`Broadcast teks dihentikan. Terkirim ke *${successCount}* grup.`);
          break;
        }
        const groupId = groups[i];
        try {
          const metadata = await conn.groupMetadata(groupId);
          const members = metadata.participants.map(v => v.id);
          const taggedContent = `–––『 *BROADCAST* 』–––\n\n${broadcastContent}\n\n\n⚡ *Join/Follow*

Group Official Raid:
https://chat.whatsapp.com/H62McETpyZQ2CNLq4wVsCf?mode=ems_copy_t

Channel ${global.getBotName?.() || global.namebot || 'Bot'}:
https://whatsapp.com/channel/0029Vb63NZk6GcG9E276Lu14`;
          
          await conn.sendMessage(groupId, {
            text: taggedContent,
            mentions: members
          });
          successCount++;
        } catch (e) {
          failedCount++;
          console.error(`Gagal mengirim teks ke grup ${groupId}:`, e);
        }
        
        if ((i + 1) % 20 === 0 && i < groups.length - 1) {
          await m.reply(`...sedang mengirim: *${i + 1}/${groups.length}* grup terkirim...`);
        }
        await sleep(delay);
      }
    }

    isBroadcasting = false;

    await m.reply(
      `✅ *Broadcast Selesai!*\n\n` +
      `📰 Ringkasan:\n` +
      `- Sukses Terkirim: *${successCount}* grup\n` +
      `- Gagal Terkirim: *${failedCount}* grup`
    );
  }
};

handler.help = ['zell-jpm <delay>|<text>', 'stopjpm'];
handler.tags = ['owner'];
handler.command = /^(zell-jpm|stopjpm)$/i;
handler.owner = true;

export default handler;

function parseDelay(delayStr) {
  if (!delayStr) return 0;
  const timeMatch = delayStr.trim().match(/^(\d+)([smh])$/);
  if (!timeMatch) return 0;
  const time = parseInt(timeMatch[1]);
  const unit = timeMatch[2];
  switch (unit) {
    case 's': return time * 1000;
    case 'm': return time * 60 * 1000;
    case 'h': return time * 60 * 60 * 1000;
    default: return 0;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */