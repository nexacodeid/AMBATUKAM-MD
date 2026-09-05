/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */


import { canLevelUp, xpRange } from '../../lib/levelling.js'
import { createLevelCard } from '../../lib/level-card.js'

async function makeLevelUpCard(conn, m, user, beforeLevel) {
	const afterLevel = Number(user.level) || 0
	const range = xpRange(afterLevel, global.multiplier || 1)
	const expNow = Math.max(0, (Number(user.exp) || 0) - range.min)
	const name = m.pushName || await conn.getName?.(m.sender) || 'User'
	let avatarSource = './media/avatar_contact.png'

	try {
		avatarSource = await conn.profilePictureUrl(m.sender, 'image')
	} catch {}

	return createLevelCard({
		avatarSource,
		name,
		number: String(m.sender || '').split('@')[0],
		role: user.role || 'Newbie',
		beforeLevel,
		afterLevel,
		expNow,
		expNeed: Math.max(1, range.xp),
		reward: 10000,
		mode: 'levelup'
	})
}

export async function before(m) {
	let user = global.db.data.users[m.sender]
    if (!user.autolevelup)
        return !0
    let before = user.level * 1
    while (canLevelUp(user.level, user.exp, global.multiplier))
        user.level++

	if (user.level <= 2) {
		user.role = 'Newbie ㋡'
	} else if (user.level <= 4) {
		user.role = 'Beginner Grade 1 ⚊¹'
	} else if (user.level <= 6) {
		user.role = 'Beginner Grade 2 ⚊²'
	} else if (user.level <= 8) {
		user.role = 'Beginner Grade 3 ⚊³'
	} else if (user.level <= 10) {
		user.role = 'Beginner Grade 4 ⚊⁴'
	} else if (user.level <= 12) {
		user.role = 'Private Grade 1 ⚌¹'
	} else if (user.level <= 14) {
		user.role = 'Private Grade 2 ⚌²'
	} else if (user.level <= 16) {
		user.role = 'Private Grade 3 ⚌³'
	} else if (user.level <= 18) {
		user.role = 'Private Grade 4 ⚌⁴'
	} else if (user.level <= 20) {
		user.role = 'Private Grade 5 ⚌⁵'
	} else if (user.level <= 22) {
		user.role = 'Corporal Grade 1 ☰¹'
	} else if (user.level <= 24) {
		user.role = 'Corporal Grade 2 ☰²'
	} else if (user.level <= 26) {
		user.role = 'Corporal Grade 3 ☰³'
	} else if (user.level <= 28) {
		user.role = 'Corporal Grade 4 ☰⁴'
	} else if (user.level <= 30) {
		user.role = 'Corporal Grade 5 ☰⁵'
	} else if (user.level <= 32) {
		user.role = 'Sergeant Grade 1 ≣¹'
	} else if (user.level <= 34) {
		user.role = 'Sergeant Grade 2 ≣²'
	} else if (user.level <= 36) {
		user.role = 'Sergeant Grade 3 ≣³'
	} else if (user.level <= 38) {
		user.role = 'Sergeant Grade 4 ≣⁴'
	} else if (user.level <= 40) {
		user.role = 'Sergeant Grade 5 ≣⁵'
	} else if (user.level <= 42) {
		user.role = 'Staff Grade 1 ﹀¹'
	} else if (user.level <= 44) {
		user.role = 'Staff Grade 2 ﹀²'
	} else if (user.level <= 46) {
		user.role = 'Staff Grade 3 ﹀³'
	} else if (user.level <= 48) {
		user.role = 'Staff Grade 4 ﹀⁴'
	} else if (user.level <= 50) {
		user.role = 'Staff Grade 5 ﹀⁵'
	} else if (user.level <= 52) {
		user.role = 'Sergeant Grade 1 ︾¹'
	} else if (user.level <= 54) {
		user.role = 'Sergeant Grade 2 ︾²'
	} else if (user.level <= 56) {
		user.role = 'Sergeant Grade 3 ︾³'
	} else if (user.level <= 58) {
		user.role = 'Sergeant Grade 4 ︾⁴'
	} else if (user.level <= 60) {
		user.role = 'Sergeant Grade 5 ︾⁵'
	} else if (user.level <= 62) {
		user.role = '2nd Lt. Grade 1 ♢¹ '
	} else if (user.level <= 64) {
		user.role = '2nd Lt. Grade 2 ♢²'
	} else if (user.level <= 66) {
		user.role = '2nd Lt. Grade 3 ♢³'
	} else if (user.level <= 68) {
		user.role = '2nd Lt. Grade 4 ♢⁴'
	} else if (user.level <= 70) {
		user.role = '2nd Lt. Grade 5 ♢⁵'
	} else if (user.level <= 72) {
		user.role = '1st Lt. Grade 1 ♢♢¹'
	} else if (user.level <= 74) {
		user.role = '1st Lt. Grade 2 ♢♢²'
	} else if (user.level <= 76) {
		user.role = '1st Lt. Grade 3 ♢♢³'
	} else if (user.level <= 78) {
		user.role = '1st Lt. Grade 4 ♢♢⁴'
	} else if (user.level <= 80) {
		user.role = '1st Lt. Grade 5 ♢♢⁵'
	} else if (user.level <= 82) {
		user.role = 'Major Grade 1 ✷¹'
	} else if (user.level <= 84) {
		user.role = 'Major Grade 2 ✷²'
	} else if (user.level <= 86) {
		user.role = 'Major Grade 3 ✷³'
	} else if (user.level <= 88) {
		user.role = 'Major Grade 4 ✷⁴'
	} else if (user.level <= 90) {
		user.role = 'Major Grade 5 ✷⁵'
	} else if (user.level <= 92) {
		user.role = 'Colonel Grade 1 ✷✷¹'
	} else if (user.level <= 94) {
		user.role = 'Colonel Grade 2 ✷✷²'
	} else if (user.level <= 96) {
		user.role = 'Colonel Grade 3 ✷✷³'
	} else if (user.level <= 98) {
		user.role = 'Colonel Grade 4 ✷✷⁴'
	} else if (user.level <= 100) {
		user.role = 'Colonel Grade 5 ✷✷⁵'
	} else if (user.level <= 102) {
		user.role = 'Brigadier Early ✰'
	} else if (user.level <= 104) {
		user.role = 'Brigadier Silver ✩'
	} else if (user.level <= 106) {
		user.role = 'Brigadier gold ✯'
	} else if (user.level <= 108) {
		user.role = 'Brigadier Platinum ✬'
	} else if (user.level <= 110) {
		user.role = 'Brigadier Diamond ✪'
	} else if (user.level <= 112) {
		user.role = 'Major General Early ✰'
	} else if (user.level <= 114) {
		user.role = 'Major General Silver ✩'
	} else if (user.level <= 116) {
		user.role = 'Major General gold ✯'
	} else if (user.level <= 118) {
		user.role = 'Major General Platinum ✬'
	} else if (user.level <= 120) {
		user.role = 'Major General Diamond ✪'
	} else if (user.level <= 122) {
		user.role = 'Lt. General Early ✰'
	} else if (user.level <= 124) {
		user.role = 'Lt. General Silver ✩'
	} else if (user.level <= 126) {
		user.role = 'Lt. General gold ✯'
	} else if (user.level <= 128) {
		user.role = 'Lt. General Platinum ✬'
	} else if (user.level <= 130) {
		user.role = 'Lt. General Diamond ✪'
	} else if (user.level <= 132) {
		user.role = 'General Early ✰'
	} else if (user.level <= 134) {
		user.role = 'General Silver ✩'
	} else if (user.level <= 136) {
		user.role = 'General gold ✯'
	} else if (user.level <= 138) {
		user.role = 'General Platinum ✬'
	} else if (user.level <= 140) {
		user.role = 'General Diamond ✪'
	} else if (user.level <= 142) {
		user.role = 'Commander Early ★'
	} else if (user.level <= 144) {
		user.role = 'Commander Intermediate ⍣¹'
	} else if (user.level <= 146) {
		user.role = 'Commander Intermediate ⍣²'
	} else if (user.level <= 148) {
		user.role = 'Commander Intermediate ⍣³'
	} else if (user.level <= 152) {
		user.role = 'Commander Intermediate ⍣⁴'
	} else if (user.level <= 154) {
		user.role = 'Commander Intermediate ⍣⁵'
	} else if (user.level <= 156) {
		user.role = 'Commander Elite ≛'
	} else if (user.level <= 158) {
		user.role = 'Commander Master ≛'
	} else if (user.level <= 160) {
		user.role = 'Commander Elite Sronger ≛'
	} else if (user.level <= 162) {
		user.role = 'Commander Elite Forge ☫'
	} else if (user.level <= 164) {
		user.role = 'Commander Master Elite ✰'
	} else if (user.level <= 166) {
		user.role = 'The Steel King ㋰‵'
	} else if (user.level <= 168) {
		user.role = 'The Steel King ㋰‵‵'
	} else if (user.level <= 170) {
		user.role = 'The Steel King ㋰‵‵‵'
	} else if (user.level <= 172) {
		user.role = 'Elite Legends ♚'
	} else if (user.level <= 174) {
		user.role = 'Elite Legends Silver ⚊¹'
	} else if (user.level <= 176) {
		user.role = 'Elite Legends Silver ⚌¹'
	} else if (user.level <= 178) {
		user.role = 'Elite Legends Silver ☰¹'
	} else if (user.level <= 180) {
		user.role = 'Elite Legends Silver ≣¹'
	} else if (user.level <= 182) {
		user.role = 'Elite Legends Silver ﹀¹'
	} else if (user.level <= 184) {
		user.role = 'Elite Legends Golden ⚊²'
	} else if (user.level <= 186) {
		user.role = 'Elite Legends Golden ⚌²'
	} else if (user.level <= 188) {
		user.role = 'Elite Legends Golden ☰²'
	} else if (user.level <= 190) {
		user.role = 'Elite Legends Golden ≣²'
	} else if (user.level <= 192) {
		user.role = 'Elite Legends Golden ﹀²'
	} else if (user.level <= 194) {
		user.role = 'Legends Mythic ♚'
	} else if (user.level <= 196) {
		user.role = 'Legends Immortal I'
	} else if (user.level <= 198) {
		user.role = 'Legends Immortal II'
	} else if (user.level <= 200) {
		user.role = 'Legends Immortal III'
	} else if (user.level <= 210) {
		user.role = 'Legends Immortal V'
	} else if (user.level <= 220) {
		user.role = 'Legends Immortal VI'
	} else if (user.level <= 230) {
		user.role = 'Legends Of Assassin 𖣘'
	} else if (user.level <= 270) {
		user.role = 'Legends Of Guardian ㉺'
	} else if (user.level <= 320) {
		user.role = 'The Legends ༊'
	} else if (user.level <= 330) {
		user.role = 'The Legends ༊'
	} else if (user.level <= 340) {
		user.role = 'The Legends ༊'
	} else if (user.level <= 350) {
		user.role = 'The Legends ༊'
	} else if (user.level <= 360) {
		user.role = 'The Legends ༊'
	} else if (user.level <= 370) {
		user.role = 'The Legends ༊'
	} else if (user.level <= 380) {
		user.role = 'The Legends ༊'
	} else if (user.level <= 390) {
		user.role = 'The Legends ༊'
	} else if (user.level <= 400) {
		user.role = 'The Legends ༊'
	} else if (user.level <= 410) {
		user.role = 'The Legends ༊'
	} else if (user.level <= 420) {
		user.role = 'The Legends Of Immortal ༆'
	} else if (user.level <= 430) {
		user.role = 'The Legends Of Immortal ༆'
	} else if (user.level <= 440) {
		user.role = 'The Legends Of Immortal ༆'
	} else if (user.level <= 450) {
		user.role = 'The Legends Of Immortal ༆'
	} else if (user.level <= 460) {
		user.role = 'The Legends Of Immortal ༆'
	} else if (user.level <= 470) {
		user.role = 'The Legends Of Immortal ༆'
	} else if (user.level <= 480) {
		user.role = 'The Legends Of Immortal ༆'
	} else if (user.level <= 490) {
		user.role = 'The Legends Of Immortal ༆'
	} else if (user.level <= 500) {
		user.role = 'The Legends Of Immortal ༆'
	} else if (user.level <= 600) {
		user.role = 'The Legends Of Immortal ༆'
	} else if (user.level <= 700) {
		user.role = 'The Legends Of Immortal ༆'
	} else if (user.level <= 800) {
		user.role = 'The Legends Of Immortal ༆'
	} else if (user.level <= 900) {
		user.role = 'The King Of Role ♛'
	} else if (user.level <= 1000) {
		user.role = 'The King Of Role ♛'
	} else if (user.level <= 2000) {
		user.role = 'The King Of Role ♛'
	} else if (user.level <= 3000) {
		user.role = 'The King Of Role ♛'
	} else if (user.level <= 4000) {
		user.role = 'The King Of Role ♛'
	} else if (user.level <= 5000) {
		user.role = 'The King Of Role ♛'
	} else if (user.level <= 6000) {
		user.role = 'The King Of Role ♛'
	} else if (user.level <= 7000) {
		user.role = 'The King Of Role ♛'
	} else if (user.level <= 8000) {
		user.role = 'The King Of Role ♛'
	} else if (user.level <= 9000) {
		user.role = 'The King Of Role ♛'
	} else if (user.level <= 10000) {
		user.role = 'The King Of Role ♛'
	}
	//user.role = role

	if (before !== user.level) {
		const iyaa = user.role
		user.money = Number(user.money || 0) + 10000
		const userNumber = String(m.sender || '').split('@')[0]
		const ini_txt = `
✦ *LEVEL ASCENSION*

@${userNumber} berhasil membuka level baru.

• Level: *${before} → ${user.level}*
• Role: *${iyaa}*
• Reward: *10.000 Money*

_Terus berinteraksi untuk membuka rank berikutnya._`.trim()
		try {
			const levelCard = await makeLevelUpCard(this, m, user, before)
			await this.sendMessage(m.chat, {
				image: levelCard,
				caption: ini_txt,
				mentions: [m.sender]
			}, { quoted: m })
		} catch (e) {
			console.error('[AUTOLEVELUP CARD ERROR]', e)
			await this.sendFile(m.chat, 'https://files.catbox.moe/kvzk50.jpg', '', ini_txt, m)
		}
		m._shinomiyaLevelCardSent = true
	}
}
export const disabled = false

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */
