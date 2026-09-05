import {
    exec
} from 'child_process';
import util from 'util';

const promiseExec = util.promisify(exec);

const handler = async (m, {
    conn
}) => {
    await conn.sendMessage(m.chat, {
        text: '🔄 Sedang memperbarui package.json, mohon tunggu sebentar...'
    }, {
        quoted: m
    });

    try {
        const {
            stdout,
            stderr
        } = await promiseExec('npm update');

        let output = '';
        if (stdout) {
            output += `📦 *[ STDOUT ]*\n\`\`\`\n${stdout.trim()}\n\`\`\``;
        }
        if (stderr) {
            output += `\n\n⚠️ *[ STDERR ]*\n\`\`\`\n${stderr.trim()}\n\`\`\``;
        }

        if (output.trim() === '') {
            output = '✅ Semua package sudah dalam versi terbaru.';
        } else {
            output = '✨ *Update Selesai!*\n\n' + output;
        }

        await conn.sendMessage(m.chat, {
            text: output.trim()
        }, {
            quoted: m
        });

    } catch (e) {
        let errorOutput = `❌ *Terjadi Kesalahan Saat Update:*\n\n`;
        if (e.stdout) {
            errorOutput += `📦 *[ STDOUT ]*\n\`\`\`\n${e.stdout.trim()}\n\`\`\``;
        }
        if (e.stderr) {
            errorOutput += `\n\n⚠️ *[ STDERR ]*\n\`\`\`\n${e.stderr.trim()}\n\`\`\``;
        }
        if (!e.stdout && !e.stderr) {
            errorOutput += `\`\`\`\n${e.message}\n\`\`\``;
        }

        await conn.sendMessage(m.chat, {
            text: errorOutput.trim()
        }, {
            quoted: m
        });
    }
};

handler.help = ['update'];
handler.command = /^(update|npmupdate)$/i;
handler.description = 'Memperbarui semua module dari package.json.';
handler.tags = ['owner'];
handler.owner = true;
handler.register = true;

export default handler;