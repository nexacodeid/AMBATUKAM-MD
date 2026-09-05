import { createHash } from 'crypto';

let Reg = /\|?(.*)[.|] *?([0-9]*)$/i;
let handler = async function (m, { conn, text, usedPrefix }) {
	let user = global.db.data.users[m.sender];
	let pp;
	try {
		pp = await conn.profilePictureUrl(m.sender, 'image', 'buffer');
	} catch {
		pp = null;
	}
	if (user.registered === true) throw `You Have Already Registered In The Database, Do You Want To Re-Register? *${usedPrefix}unreg*`;
	if (!Reg.test(text)) throw `Masukan Nama.Umur kamu\nContoh: .daftar Vlyyyn.17`;
	let [_, name, age] = text.match(Reg);
	if (!name || !name.trim()) throw 'Nama Tidak Boleh Kosong';
	if (!age) throw 'Umur Tidak Boleh Kosong';
	let ageNum = parseInt(age);
	if (isNaN(ageNum)) throw 'Umur harus berupa angka';
	if (ageNum > 50) throw 'Tua Banget amjir';
	if (ageNum < 12) throw 'Esempe Dilarang masuk';
	user.name = name.trim();
	user.age = ageNum;
	user.regTime = Date.now();
	user.registered = true;
	user.axe = 1;
	user.axedurability = 30;
	user.pickaxe = 1;
	user.pickaxedurability = 40;
	let sn = createHash('md5').update(m.sender).digest('hex');
	let cap = `
─── USER INFO ───
• Name: ${name.trim()}
• Age: ${ageNum} Years
• Status: Success
• Serial: ${sn}

── STARTER PACK ──
• Axe: 1 ( 30 Durability )
• Pickaxe: 1 ( 40 Durability )
`;
	let totalRegistered = Object.values(global.db.data.users).filter((v) => v.registered == true).length;
	conn.adReply(m.chat, cap, pp, m, {
		title: 'Berhasil Registrasi',
		body: 'Kamu Adalah User Ke ' + totalRegistered,
	});
};
handler.help = ['daftar <nama>.<umur>'];
handler.tags = ['xp'];
handler.command = /^(daftar|verify|reg(ister)?)$/i;

export default handler;
