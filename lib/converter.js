import { promises as fs } from 'fs'
import { join, dirname } from 'path'
import { spawn } from 'child_process'

function cleanExt(ext = '') {
	return String(ext || 'bin').replace(/^\./, '').replace(/[^a-zA-Z0-9]/g, '') || 'bin'
}

async function exists(path) {
	try {
		await fs.access(path)
		return true
	} catch {
		return false
	}
}

async function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
	let tmp
	let out

	try {
		const dir = join(global.__dirname(import.meta.url), '../tmp')
		await fs.mkdir(dir, { recursive: true })

		const inputExt = cleanExt(ext)
		const outputExt = cleanExt(ext2)
		const name = `${Date.now()}-${Math.random().toString(16).slice(2)}`

		// Input dan output wajib memiliki path berbeda. Jika keduanya MP3,
		// nama berbasis ekstensi saja akan membuat FFmpeg mencoba edit in-place.
		tmp = join(dir, `${name}-input.${inputExt}`)
		out = join(dir, `${name}-output.${outputExt}`)

		await fs.writeFile(tmp, buffer)

		let stderr = ''

		await new Promise((resolve, reject) => {
			const process = spawn('ffmpeg', ['-y', '-i', tmp, ...args, out])

			process.stderr.on('data', chunk => {
				stderr += chunk.toString()
			})

			process.on('error', reject)
			process.on('close', code => {
				if (code !== 0) {
					return reject(new Error(`FFmpeg exited with code ${code}${stderr ? `\n${stderr.split('\n').slice(-8).join('\n')}` : ''}`))
				}
				resolve()
			})
		})

		if (!(await exists(out))) {
			throw new Error(`FFmpeg selesai tapi file output tidak dibuat: ${out}${stderr ? `\n${stderr.split('\n').slice(-8).join('\n')}` : ''}`)
		}

		const data = await fs.readFile(out)

		return {
			data,
			filename: out,
			delete() {
				return fs.unlink(out).catch(() => {})
			},
		}
	} finally {
		if (tmp) await fs.unlink(tmp).catch(() => {})
	}
}

/**
 * Convert Audio to Playable WhatsApp PTT/VN
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 * @returns {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toPTT(buffer, ext) {
	return ffmpeg(buffer, ['-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on'], ext, 'ogg')
}

/**
 * Convert Audio to Playable WhatsApp Audio
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 * @returns {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toAudio(buffer, ext) {
	// Dulu output-nya .opus tetapi format dipaksa mp3, jadi bisa bikin file /tmp/*.mp4.opus tidak kebentuk.
	// Untuk audio biasa WhatsApp, pakai output mp3 agar sesuai dengan mimetype audio/mpeg.
	return ffmpeg(buffer, ['-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k', '-f', 'mp3'], ext, 'mp3')
}

/**
 * Convert Video to Playable WhatsApp Video
 * @param {Buffer} buffer Video Buffer
 * @param {String} ext File Extension
 * @returns {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toVideo(buffer, ext) {
	return ffmpeg(buffer, ['-c:v', 'libx264', '-c:a', 'aac', '-ab', '128k', '-ar', '44100', '-crf', '32', '-preset', 'slow'], ext, 'mp4')
}

export { toAudio, toPTT, toVideo, ffmpeg }
