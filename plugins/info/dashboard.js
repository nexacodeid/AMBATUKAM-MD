let handler = async (m) => {
	let stats = Object.entries(global.db.data.stats)
		.map(([key, val]) => {
			let name = Array.isArray(global.plugins[key]?.help) ? global.plugins[key]?.help.join(' , ') : global.plugins[key]?.help || key;
			if (/exec/.test(name)) return;
			return { name, ...val };
		})
		.filter(Boolean);
	stats = stats.sort((a, b) => b.total - a.total);

	if (!stats.length) return m.reply('Belum ada statistik command.');

	let handlers = stats
		.slice(0, 50)
		.map(({ name, total, last, success, lastSuccess }, i) => {
			return `*${i + 1}.* *${name}*\n - *Hits* : ${total}\n - *Success* : ${success}\n - *Last Used* : ${getTime(last)}\n - *Last Success* : ${formatTime(lastSuccess)}`;
		})
		.join('\n\n');
	m.reply(handlers);
};

handler.help = ['dashboard'];
handler.command = ['dashboard', 'dash'];
handler.tags = ['info'];
export default handler;

function formatTime(time) {
	if (!time) return 'Belum pernah';
	const date = new Date(time);
	const month = getMonthName(date.getMonth());
	const day = date.getDate();
	const year = date.getFullYear();
	return `${month} ${day}, ${year}`;
}

function getMonthName(month) {
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	return months[month] || '';
}

function getTime(ms) {
	if (!ms) return 'Belum pernah';
	var now = parseMs(+new Date() - ms);
	if (now.days) return `${now.days} days ago`;
	else if (now.hours) return `${now.hours} hours ago`;
	else if (now.minutes) return `${now.minutes} minutes ago`;
	else return `a few seconds ago`;
}

function parseMs(ms) {
	if (typeof ms !== 'number' || isNaN(ms)) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
	return {
		days: Math.trunc(ms / 86400000),
		hours: Math.trunc(ms / 3600000) % 24,
		minutes: Math.trunc(ms / 60000) % 60,
		seconds: Math.trunc(ms / 1000) % 60,
	};
}
