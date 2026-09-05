import { downloadContentFromMessage } from 'baileys';

let handler = async (m, { conn }) => {
    if (!m.quoted) return m.reply('Reply gambar/video view-once yang ingin Anda lihat');

    let quotedObj = await m.getQuotedObj();
    let rawMsg = quotedObj?.message;
    if (!rawMsg) return m.reply('Gagal mengambil data pesan.');

    let viewOnceContent = rawMsg?.viewOnceMessageV2 || 
                           rawMsg?.viewOnceMessage || 
                           rawMsg?.viewOnceMessageV2Extension;

    let targetMessage = viewOnceContent ? (viewOnceContent.message || viewOnceContent) : rawMsg;

    let mediaType = Object.keys(targetMessage)[0];
    let isViewOnce = !!viewOnceContent || mediaType?.includes('viewOnce');

    if (!isViewOnce && !m.quoted.message?.[Object.keys(m.quoted.message)[0]]?.viewOnce) {
        return m.reply('Ini bukan pesan view-once.');
    }

    let finalMediaMessage = targetMessage[mediaType]?.message || targetMessage;
    let trueType = Object.keys(finalMediaMessage)[0];

    if (!['imageMessage', 'videoMessage'].includes(trueType)) {
        trueType = mediaType;
    }

    let mediaData = finalMediaMessage[trueType];
    if (!mediaData) return m.reply('Gagal memetakan tipe media.');

    let media = await m.quoted.download().catch(() => null);

    if (!media) {
        try {
            let downloadType = trueType === 'videoMessage' ? 'video' : 'image';
            let stream = await downloadContentFromMessage(mediaData, downloadType);
            let buffer = Buffer.alloc(0);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            media = buffer;
        } catch (e) {
            media = null;
        }
    }

    if (!media || media.length === 0) return m.reply('Media gagal diunduh/dieksekusi!');

    let filename = trueType === 'videoMessage' ? 'video.mp4' : 'image.jpg';
    let caption = mediaData?.caption || '';

    await conn.sendFile(m.chat, media, filename, caption, m);
};

handler.customPrefix = /^get$/i;
handler.command = new RegExp;
handler.owner = true;

export default handler;