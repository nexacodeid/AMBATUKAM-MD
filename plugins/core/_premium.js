let handler = (m) => m;

handler.before = async function (m) {
	let user = global.db.data.users[m.sender];
	if (!user) return;
	// Hanya cek jika premiumTime adalah angka valid & bukan null (null = permanen)
	if (typeof user.premiumTime === 'number' && user.premiumTime > 0 && Date.now() > user.premiumTime) {
		user.premiumTime = 0;
		user.premium = false;
	}
};

export default handler;
