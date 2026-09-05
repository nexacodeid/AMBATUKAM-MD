import { proto, generateWAMessage, areJidsSameUser } from 'baileys';

export async function all(m, chatUpdate) {
	if (m.isBaileys) return;
	if (!m.message) return;
	if (!(
		m.message.buttonsResponseMessage ||
		m.message.templateButtonReplyMessage ||
		m.message.listResponseMessage ||
		m.message.interactiveResponseMessage ||
		m.message.pollUpdateMessage
	)) return;

	let id = '';

	try {
		if (m.mtype === 'buttonsResponseMessage') {
			id = m.message.buttonsResponseMessage?.selectedButtonId || '';
		} else if (m.mtype === 'listResponseMessage') {
			id = m.message.listResponseMessage?.singleSelectReply?.selectedRowId || '';
		} else if (m.mtype === 'templateButtonReplyMessage') {
			id = m.message.templateButtonReplyMessage?.selectedId || '';
		} else if (m.mtype === 'interactiveResponseMessage') {
			try {
				id = JSON.parse(m.msg?.nativeFlowResponseMessage?.paramsJson || '{}').id || '';
			} catch {
				id = m.text || '';
			}
		} else if (m.mtype === 'messageContextInfo') {
			id = m.message.buttonsResponseMessage?.selectedButtonId ||
				m.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
				m.text || '';
		} else if (m.mtype === 'conversation') {
			id = m.message.conversation || '';
		} else if (m.mtype === 'imageMessage') {
			id = m.message.imageMessage?.caption || '';
		} else if (m.mtype === 'videoMessage') {
			id = m.message.videoMessage?.caption || '';
		} else if (m.mtype === 'extendedTextMessage') {
			id = m.message.extendedTextMessage?.text || '';
		}
	} catch (e) {
		console.error('[templateResponse] parse id error:', e);
		id = m.text || '';
	}

	if (!id) return;

	let messages = await generateWAMessage(
		m.chat,
		{ text: id, mentions: m.mentionedJid },
		{
			userJid: this.user.jid,
			quoted: m.quoted && m.quoted.fakeObj,
		}
	);
	messages.key.remoteJid = m.chat;
	messages.key.fromMe = areJidsSameUser(m.sender, this.user.id);
	messages.key.id = m.key.id;
	messages.pushName = m.pushName;
	if (m.isGroup) messages.key.participant = messages.participant = m.sender;

	let msg = {
		...chatUpdate,
		messages: [proto.WebMessageInfo.create(messages)].map((v) => ((v.conn = this), v)),
		type: 'append',
	};
	this.ev.emit('messages.upsert', msg);
}
