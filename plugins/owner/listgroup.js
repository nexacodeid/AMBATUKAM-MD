const handler = async (m, {
    conn
}) => {
    try {
        const groups = Object.values(await conn.groupFetchAllParticipating());

        // Garis penutup pendek sampai bunga pertama
        const makeLine = () => "*╰─❁*";

        if (!groups || groups.length === 0) {
            return m.reply(`*╭─❁ LIST GRUP ❁*\nBot tidak berada di dalam grup manapun saat ini.\n${makeLine()}`);
        }

        let txt = `*╭─❁ LIST GRUP ❁*\nBot tergabung dalam *${groups.length}* grup.\n\n`;

        groups.forEach((group, i) => {
            const participants = group.participants || [];
            txt += `*${i + 1}.* ${group.subject}\n`;
            txt += `   - *ID:* ${group.id}\n`;
            txt += `   - *Anggota:* ${participants.length}\n\n`;
        });

        txt += makeLine();
        m.reply(txt.trim());
    } catch (e) {
        console.error(e);
        m.reply(`*╭─❁ LIST GRUP ❁*\nGagal mengambil daftar grup. Silakan coba lagi nanti.\n${makeLine()}`);
    }
};

handler.help = ['listgrup', 'grouplist'];
handler.tags = ['owner'];
handler.command = /^(list(gro?up|grup|gc)|gro?uplist|gclist)$/i;
handler.owner = true;
handler.register = true;
export default handler;