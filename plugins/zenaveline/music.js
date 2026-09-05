import {
  errorMessage,
  formatNumber,
  scraper,
  spotifyId,
  truncate
} from '../../lib/zenaveline-adapter.js'

const spotifyClient = new scraper.spotify()

function splitMessage(text, size = 3500) {
  const chunks = []
  let rest = String(text)

  while (rest.length > size) {
    let index = rest.lastIndexOf('\n', size)
    if (index < size * 0.6) index = size
    chunks.push(rest.slice(0, index))
    rest = rest.slice(index).replace(/^\n+/, '')
  }

  if (rest) chunks.push(rest)
  return chunks
}

async function replyLong(m, text) {
  for (const chunk of splitMessage(text)) await m.reply(chunk)
}

async function sendInfo(conn, m, image, caption) {
  if (image) return conn.sendFile(m.chat, image, 'spotify.jpg', caption, m)
  return m.reply(caption)
}

async function lyrics(m, query) {
  if (!query.trim()) throw new Error('Masukkan judul lagu yang ingin dicari.')
  const results = await scraper.geniussearch(query.trim())
  if (!Array.isArray(results) || !results.length) throw new Error('Lagu tidak ditemukan di Genius.')
  const detail = await scraper.geniusdetail(results[0].id)
  if (!detail?.lyrics) throw new Error('Lirik tidak tersedia.')
  await replyLong(m, `*${detail.title || results[0].title}*\n_${detail.artist || results[0].artist}_\n\n${detail.lyrics}`)
}

async function geniusSearch(m, query) {
  if (!query.trim()) throw new Error('Masukkan judul lagu atau nama artis.')
  const results = await scraper.geniussearch(query.trim())
  if (!Array.isArray(results) || !results.length) throw new Error('Hasil Genius tidak ditemukan.')
  const list = results.slice(0, 10).map((song, index) => [
    `${index + 1}. *${song.title || '-'}*`,
    `   Artis: ${song.artist || '-'}`,
    `   ID: ${song.id}`,
    song.url ? `   ${song.url}` : null
  ].filter(Boolean).join('\n'))
  await m.reply(`*Genius Search*\n\n${list.join('\n\n')}\n\nGunakan *.geniusdetail <id>* untuk detail.`)
}

async function geniusDetail(m, input) {
  const id = String(input).match(/\d+/)?.[0]
  if (!id) throw new Error('Masukkan ID lagu Genius.')
  const detail = await scraper.geniusdetail(id)
  if (!detail?.id) throw new Error('Detail lagu tidak ditemukan.')
  await replyLong(m, [
    `*${detail.title || '-'}*`,
    `Artis: ${detail.artist || '-'}`,
    `Rilis: ${detail.release_date || '-'}`,
    `Explicit: ${detail.explicit ? 'Ya' : 'Tidak'}`,
    detail.url || null,
    '',
    detail.lyrics || 'Lirik tidak tersedia.'
  ].filter(value => value !== null).join('\n'))
}

async function spotifySearch(m, query) {
  if (!query.trim()) throw new Error('Masukkan judul lagu, artis, album, atau playlist.')
  const result = await spotifyClient.search(query.trim())
  const tracks = result?.tracks || []
  if (!tracks.length) throw new Error('Hasil Spotify tidak ditemukan.')
  const list = tracks.slice(0, 10).map((track, index) => [
    `${index + 1}. *${track.name || '-'}*`,
    `   ${track.artists?.map(artist => artist.name).filter(Boolean).join(', ') || '-'}`,
    `   ID: ${track.id}`,
    `   ${track.url || '-'}`
  ].join('\n'))
  await m.reply(`*Spotify Search*\n\n${list.join('\n\n')}`)
}

async function spotifyTrack(conn, m, input) {
  const id = spotifyId(input, 'track')
  if (!id) throw new Error('Masukkan ID atau URL track Spotify.')
  const track = await spotifyClient.track(id)
  if (!track) throw new Error('Track Spotify tidak ditemukan.')
  const image = track.album?.images?.[0]?.url
  const caption = [
    '*Spotify Track*',
    `🎵 ${track.name || '-'}`,
    `👤 ${track.artists?.map(artist => artist.name).filter(Boolean).join(', ') || '-'}`,
    `💿 ${track.album?.name || '-'}`,
    `▶️ ${formatNumber(track.playcount)}`,
    `⏱️ ${Math.round((track.duration_ms || 0) / 1000)} detik`,
    track.url || null
  ].filter(Boolean).join('\n')
  await sendInfo(conn, m, image, caption)
}

async function spotifyArtist(conn, m, input) {
  const id = spotifyId(input, 'artist')
  if (!id) throw new Error('Masukkan ID atau URL artis Spotify.')
  const artist = await spotifyClient.artist(id)
  if (!artist) throw new Error('Artis Spotify tidak ditemukan.')
  const topTracks = (artist.top_tracks || []).slice(0, 10).map((track, index) => `${index + 1}. ${track.name || '-'} — ${formatNumber(track.playcount)} play`)
  const caption = [
    '*Spotify Artist*',
    `👤 ${artist.name || '-'}`,
    `✅ Terverifikasi: ${artist.verified ? 'Ya' : 'Tidak'}`,
    `👥 Pengikut: ${formatNumber(artist.statistics?.followers)}`,
    `🎧 Pendengar bulanan: ${formatNumber(artist.statistics?.monthly_listeners)}`,
    artist.url || null,
    topTracks.length ? `\n*Top Tracks*\n${topTracks.join('\n')}` : null
  ].filter(Boolean).join('\n')
  await sendInfo(conn, m, artist.images?.[0]?.url || artist.header_images?.[0]?.url, caption)
}

async function spotifyAlbum(conn, m, input) {
  const id = spotifyId(input, 'album')
  if (!id) throw new Error('Masukkan ID atau URL album Spotify.')
  const album = await spotifyClient.album(id)
  if (!album) throw new Error('Album Spotify tidak ditemukan.')
  const tracks = (album.tracks || []).slice(0, 25).map((track, index) => `${index + 1}. ${track.name || '-'}`)
  const caption = [
    '*Spotify Album*',
    `💿 ${album.name || '-'}`,
    `👤 ${album.artists?.map(artist => artist.name).filter(Boolean).join(', ') || '-'}`,
    `📅 ${album.release_date || '-'}`,
    `🏷️ ${album.label || '-'}`,
    album.url || null,
    tracks.length ? `\n*Tracklist*\n${tracks.join('\n')}` : null
  ].filter(Boolean).join('\n')
  await sendInfo(conn, m, album.images?.[0]?.url, truncate(caption))
}

async function spotifyPlaylist(conn, m, input) {
  const id = spotifyId(input, 'playlist')
  if (!id) throw new Error('Masukkan ID atau URL playlist Spotify.')
  const playlist = await spotifyClient.playlist(id)
  if (!playlist) throw new Error('Playlist Spotify tidak ditemukan.')
  const tracks = (playlist.tracks || []).slice(0, 25).map((track, index) => `${index + 1}. ${track.name || '-'} — ${track.artists?.map(artist => artist.name).filter(Boolean).join(', ') || '-'}`)
  const caption = [
    '*Spotify Playlist*',
    `🎶 ${playlist.name || '-'}`,
    `👤 ${playlist.owner?.display_name || playlist.owner?.username || '-'}`,
    `👥 ${formatNumber(playlist.followers)} pengikut`,
    playlist.description || null,
    playlist.url || null,
    tracks.length ? `\n*Daftar Lagu*\n${tracks.join('\n')}` : null
  ].filter(Boolean).join('\n')
  await sendInfo(conn, m, playlist.images?.[0]?.url, truncate(caption))
}

let handler = async (m, { conn, text = '', command = '' }) => {
  const cmd = command.toLowerCase()
  await m.react?.('⏳').catch(() => {})

  try {
    if (/^(lirik|lyrics)$/.test(cmd)) await lyrics(m, text)
    else if (/^(genius|geniussearch)$/.test(cmd)) await geniusSearch(m, text)
    else if (cmd === 'geniusdetail') await geniusDetail(m, text)
    else if (/^(spotifysearch|spsearch)$/.test(cmd)) await spotifySearch(m, text)
    else if (/^(spotifytrack|sptrack)$/.test(cmd)) await spotifyTrack(conn, m, text)
    else if (/^(spotifyartist|spartist)$/.test(cmd)) await spotifyArtist(conn, m, text)
    else if (/^(spotifyalbum|spalbum)$/.test(cmd)) await spotifyAlbum(conn, m, text)
    else if (/^(spotifyplaylist|spplaylist)$/.test(cmd)) await spotifyPlaylist(conn, m, text)
    await m.react?.('✅').catch(() => {})
  } catch (error) {
    console.error('[ZENAVELINE MUSIC]', error)
    await m.react?.('❌').catch(() => {})
    await m.reply(`❌ ${errorMessage(error)}`)
  }
}

handler.help = [
  'lirik <judul>', 'geniussearch <query>', 'geniusdetail <id>',
  'spotifysearch <query>', 'spotifytrack <id/url>', 'spotifyartist <id/url>',
  'spotifyalbum <id/url>', 'spotifyplaylist <id/url>'
]
handler.tags = ['search', 'tools']
handler.command = /^(lirik|lyrics|genius|geniussearch|geniusdetail|spotifysearch|spsearch|spotifytrack|sptrack|spotifyartist|spartist|spotifyalbum|spalbum|spotifyplaylist|spplaylist)$/i
handler.limit = true
handler.register = true

export default handler
