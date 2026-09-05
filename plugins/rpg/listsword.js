/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */


let handler = async(m, { conn, text }) => {

let user = global.db.data.users[m.sender];

let swordList = `
      *[🗡️ Level Sword ]*

1. ⚔️ Rusty Sword ${user.sword == 1 ? '✓' : ''}
2. ⚔️ Iron Sword ${user.sword == 2 ? '✓' : ''}
3. ⚔️ Steel Sword ${user.sword == 3 ? '✓' : ''}
4. ⚔️ Bronze Sword ${user.sword == 4 ? '✓' : ''}
5. ⚔️ Silver Sword ${user.sword == 5 ? '✓' : ''}
6. ⚔️ Golden Sword ${user.sword == 6 ? '✓' : ''}
7. ⚔️ Elven Sword ${user.sword == 7 ? '✓' : ''}
8. ⚔️ Dwarven Sword ${user.sword == 8 ? '✓' : ''}
9. ⚔️ Katana ${user.sword == 9 ? '✓' : ''}
10. ⚔️ Longsword ${user.sword == 10 ? '✓' : ''}
11. ⚔️ Claymore ${user.sword == 11 ? '✓' : ''}
12. ⚔️ Rapier ${user.sword == 12 ? '✓' : ''}
13. ⚔️ Flame Sword ${user.sword == 13 ? '✓' : ''}
14. ⚔️ Frost Sword ${user.sword == 14 ? '✓' : ''}
15. ⚔️ Thunderblade ${user.sword == 15 ? '✓' : ''}
16. ⚔️ Shadow Sword ${user.sword == 16 ? '✓' : ''}
17. ⚔️ Lightbringer ${user.sword == 17 ? '✓' : ''}
18. ⚔️ Bloodthirster ${user.sword == 18 ? '✓' : ''}
19. ⚔️ Dragonfang ${user.sword == 19 ? '✓' : ''}
20. ⚔️ Soulreaper ${user.sword == 20 ? '✓' : ''}
21. ⚔️ Ethereal Blade ${user.sword == 21 ? '✓' : ''}
22. ⚔️ Mystic Blade ${user.sword == 22 ? '✓' : ''}
23. ⚔️ Holy Sword ${user.sword == 23 ? '✓' : ''}
24. ⚔️ Demonic Blade ${user.sword == 24 ? '✓' : ''}
25. ⚔️ Legendary Sword ${user.sword == 25 ? '✓' : ''}
26. ⚔️ Excalibur ${user.sword == 26 ? '✓' : ''}
27. ⚔️ Godslayer ${user.sword == 27 ? '✓' : ''}
28. ⚔️ Celestial Sword ${user.sword == 28 ? '✓' : ''}
29. ⚔️ Phantom Blade ${user.sword == 29 ? '✓' : ''}
30. ⚔️ Ancient Blade ${user.sword == 30 ? '✓' : ''}
`;

conn.reply(m.chat, swordList, m);
}
handler.tags = ['rpg']
handler.help = ['listsword']
handler.command = /^(listsword)/i
handler.register = true

export default handler;

/*
 *╭━━━[ 🤖 WhatsApp Bot ]━━━╮
 *┃ 🔹 Creator : mengikuti config.js
 *┃ 🔹 Platform: WhatsApp Bot Automation
 *┃ 🔹 Features : AI • RPG • Utility • Media
 *┃ 🔹 Contact  : wa.me/6289520616967
 *┃ 🔹 Website     : https://lynk.id/ellz
 *╰━━━━━━━━━━━━━━━━━━━━━━━╯
 */