import axios from 'axios';

const subjects = [
  'bindo', 'tik', 'pkn', 'bing', 'penjas',
  'pai', 'matematika', 'jawa', 'ips', 'ipa'
];

const motivationalPhrases = {
  0: '😥 Waduh, kamu perlu belajar lebih giat lagi!',
  1: '📘 Masih perlu banyak belajar nih!',
  2: '📚 Lumayan, tapi bisa lebih baik!',
  3: '👍 Bagus, pertahankan!',
  4: '🔥 Hampir setengah benar, semangat!',
  5: '🟡 Sudah setengah jalan! Tingkatkan lagi!',
  6: '✨ Lumayan bagus!',
  7: '💪 Bagus sekali!',
  8: '👏 Hampir sempurna!',
  9: '🌟 Tinggal sedikit lagi!',
  10: '🏆 Sempurna! Kamu benar-benar menguasai materi ini!'
};

const handler = async (m, { conn, args, command }) => {
  if (!m.isGroup) return m.reply('❗ Fitur ini hanya bisa digunakan di grup.');

  conn.cerdasCermat = conn.cerdasCermat || {};

  if (conn.cerdasCermat[m.chat])
    return m.reply('❗ Masih ada sesi aktif di grup ini. Selesaikan dulu ya!');

  if (!args || args.length < 2) {
    return m.reply(
      `📚 Pilih Mata Pelajaran & Jumlah Soal\n\n*Mata Pelajaran Tersedia:*\n${subjects.map(s => `- ${s}`).join('\n')}\n\nContoh:\n.${command} ipa 5`
    );
  }

  const [mapelRaw, jumlahRaw] = args;
  const mapel = String(mapelRaw || '').toLowerCase();
  const jumlahStr = String(jumlahRaw || '').toLowerCase();

  if (!subjects.includes(mapel))
    return m.reply(
      `📚 Pilih Mata Pelajaran & Jumlah Soal\n\n*Mata Pelajaran Tersedia:*\n${subjects.map(s => `- ${s}`).join('\n')}\n\nContoh:\n.${command} ipa 5`
    );

  const total = parseInt(jumlahStr);
  if (isNaN(total) || total < 5 || total > 10)
    return m.reply('⚠️ Jumlah soal harus angka 5–10.');

  try {
    const url = `https://api.deline.web.id/game/cc-sd?matapelajaran=${encodeURIComponent(mapel)}&jumlahsoal=${total}`;
    const { data } = await axios.get(url, { timeout: 60_000 });

    const ok = data && data.status === true;
    const questions = ok && Array.isArray(data.soal) ? data.soal : null;

    if (!ok || !questions || questions.length === 0) {
      return m.reply('❌ Gagal mengambil soal (data kosong / format tak dikenali). Coba lagi nanti.');
    }

    conn.cerdasCermat[m.chat] = {
      questions,
      current: 0,
      correct: 0,
      answered: false,
      lastMsg: null
    };

    await sendSoal(conn, m);
  } catch (e) {
    console.error(e);
    m.reply('❌ Gagal mengambil soal. Coba lagi nanti.');
  }
};

handler.before = async (m, { conn }) => {
  const session = conn.cerdasCermat?.[m.chat];
  if (!session || !m.text || m.key.fromMe) return;

  const quotedId = m.quoted?.id || m.quoted?.key?.id;
  const lastId = session.lastMsg?.id || session.lastMsg?.key?.id;
  if (!quotedId || quotedId !== lastId) return;

  const jawabanUser = m.text.trim().toLowerCase();
  const soal = session.questions[session.current];
  if (!soal || session.answered) return;

  const valid = soal.semua_jawaban.map(j => Object.keys(j)[0].toLowerCase());
  if (!valid.includes(jawabanUser)) return;

  session.answered = true;
  const benar = String(soal.jawaban_benar || '').toLowerCase();

  if (jawabanUser === benar) {
    session.correct++;
    await m.reply('✅ *Jawaban benar!*');
  } else {
    await m.reply(`❌ *Jawaban salah!*\nJawaban benar adalah: *${benar.toUpperCase()}*`);
  }

  session.current++;
  if (session.current < session.questions.length) {
    session.answered = false;
    await sendSoal(conn, m);
  } else {
    const total = session.questions.length;
    const benarCount = session.correct;
    const nilai = Math.round((benarCount / total) * 100);
    const motivasi = motivationalPhrases[Math.min(benarCount, 10)];

    await m.reply(
      `🏁 *Cerdas Cermat Selesai*\n\n✅ Jawaban Benar: *${benarCount}/${total}*\n📊 Nilai: *${nilai}%*\n\n${motivasi}`
    );
    delete conn.cerdasCermat[m.chat];
  }
};

async function sendSoal(conn, m) {
  const s = conn.cerdasCermat[m.chat];
  const q = s.questions[s.current];

  let teks = `📝 *Soal ${s.current + 1}/${s.questions.length}*\n\n${q.pertanyaan}\n\n`;
  q.semua_jawaban.forEach(opt => {
    const [k, v] = Object.entries(opt)[0];
    teks += `➤ *${k.toUpperCase()}*. ${v}\n`;
  });

  teks += `\n✏️ Jawab dengan *REPLY* huruf (A, B, C, D) ke pesan ini.`;

  const sent = await conn.sendMessage(m.chat, { text: teks }, { quoted: m });
  s.lastMsg = sent;
}

handler.help = ['cerdascermat <mapel> <jumlah>', 'cermat <mapel> <jumlah>'];
handler.tags = ['game'];
handler.command = /^cerdascermat|cermat$/i;
handler.register = true;
handler.group = true
handler.limit = true;

export default handler