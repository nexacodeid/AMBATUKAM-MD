import { canLevelUp, xpRange } from '../../lib/levelling.js';
import { createLevelCard } from '../../lib/level-card.js';

let handler = async (m, { conn }) => {
	if (m._shinomiyaLevelCardSent) return;

	const user = global.db.data.users[m.sender];
	if (!user) return m.reply('❌ Data pengguna tidak ditemukan.');

	let before = user.level * 1;

	while (canLevelUp(user.level, user.exp, global.multiplier)) {
		user.level++;
	}

	const after = Number(user.level) || 0;
	const { min, xp, max } = xpRange(after, global.multiplier || 1);
	const expNow = Math.max(0, (Number(user.exp) || 0) - min);
	const expNeed = Math.max(1, xp);
	const name = m.pushName || await conn.getName(m.sender) || 'User';
	let avatarSource = './media/avatar_contact.png';

	try {
		avatarSource = await conn.profilePictureUrl(m.sender, 'image');
	} catch {}

	const image = await createLevelCard({
		avatarSource,
		name,
		number: String(m.sender || '').split('@')[0],
		role: user.role || 'Newbie',
		beforeLevel: before,
		afterLevel: after,
		expNow,
		expNeed,
		reward: 0,
		mode: before !== after ? 'levelup' : 'progress'
	});

	const caption = before !== after
		? `✦ *LEVEL ASCENSION*\n${name}: Level ${before} → ${after}`
		: `✦ *LEVEL PROGRESS*\nLevel ${after} • Kurang ${Math.max(0, max - Number(user.exp || 0))} EXP lagi.`;

	await conn.sendMessage(m.chat, { image, caption }, { quoted: m });
};

handler.help = ['levelup'];
handler.tags = ['xp'];
handler.command = /^levelup$/i;
handler.register = true;

export default handler;
