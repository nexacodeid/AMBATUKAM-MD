let handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    if (!text) {
        return m.reply(`Penggunaan: ${usedPrefix}${command} <username>`);
    }

    const username = text.trim();
    const limit = 10;

    try {
        m.react('⏳')
        const profileReq = await fetch("https://tokviewer.net/api/check-profile", {
            method: "POST",
            headers: {
                "origin": "https://tokviewer.net",
                "referer": "https://tokviewer.net/",
                "user-agent": "Mozilla/5.0",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                username: username
            }),
        });

        const profileData = (await profileReq.json())?.data;
        if (!profileData) {
            m.react('✅')
            return m.reply("Gagal mengambil profil. Pastikan username benar.");
        }

        const videoReq = await fetch("https://tokviewer.net/api/video", {
            method: "POST",
            headers: {
                "origin": "https://tokviewer.net",
                "referer": "https://tokviewer.net/",
                "user-agent": "Mozilla/5.0",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                offset: 0,
                limit
            }),
        });

        const videoData = (await videoReq.json())?.data || [];

        const repostReq = await fetch("https://tokviewer.net/api/repost", {
            method: "POST",
            headers: {
                "origin": "https://tokviewer.net",
                "referer": "https://tokviewer.net/tiktok-repost-viewer",
                "user-agent": "Mozilla/5.0",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                sec_uid: profileData.sec_uid,
                offset: 0,
                limit
            }),
        });

        const repostData = (await repostReq.json())?.data || [];

        let message = `*TikTok Stalk*\n\n`;
        message += `*Username:* ${username}\n`;
        message += `*Followers:* ${profileData.followers}\n`;
        message += `*Following:* ${profileData.following}\n`;
        message += `*Likes:* ${profileData.likes}\n\n`;

        if (videoData.length > 0) {
            message += `*Postingan Terbaru:*\n`;
            for (let i = 0; i < Math.min(5, videoData.length); i++) {
                message += `- ${videoData[i].cover || videoData[i].video?.cover || 'Tidak ada cover'}\n`;
                message += `- ${videoData[i].downloadUrl || videoData[i].play || 'Tidak ada URL'}\n\n`;
            }
        } else {
            message += `Tidak ada postingan terbaru.\n\n`;
        }

        if (repostData.length > 0) {
            message += `*Repost Terbaru:*\n`;
            for (let i = 0; i < Math.min(5, repostData.length); i++) {
                message += `- ${repostData[i].desc || 'Tidak ada deskripsi'}\n`;
                message += `- ${repostData[i].video?.downloadAddr || repostData[i].video?.playAddr || 'Tidak ada URL'}\n\n`;
            }
        } else {
            message += `Tidak ada repost terbaru.\n`;
        }

        await conn.sendMessage(m.chat, {
            image: {
                url: profileData.avatar
            },
            caption: message
        }, {
            quoted: m
        });
    } catch (error) {
        console.error(error);
        m.reply(`Terjadi kesalahan: ${error.message || error}`);
    }
};

handler.help = ["tiktokstalk <username>"];
handler.tags = ["stalk"];
handler.command = /^tiktokstalk$/i;
handler.description = "Stalk profil TikTok berdasarkan username.";
handler.register = true;

export default handler;