/**
@credit Zaell
@Raizell AI MD
@Whatsapp Bot
@Support dengan Donasi ✨
wa.me/6289520616967
**/

import fs from 'fs';
import jsobfus from 'javascript-obfuscator';
import * as JsConfuser from 'js-confuser';

let Zaell = async (m, { text }) => {
    let inputText;
    let resultFileName;

    if (m.quoted && m.quoted.text) {
        inputText = m.quoted.text;
        resultFileName = `result-enc${Math.floor(Math.random() * 10000)}.js`;
    } else if (text) {
        inputText = text;
        resultFileName = `result-enc${Math.floor(Math.random() * 10000)}.js`;
    } else if (m.quoted && m.quoted.mimetype) {
        let fileBuffer = await m.quoted.download();
        if (!fileBuffer) throw 'Gagal mengunduh file, coba lagi!';
        
        inputText = fileBuffer.toString();
        const originalFileName = m.quoted.fileName || 'document';
        resultFileName = originalFileName.replace(/\.js$/i, '_enc.js');
    } else {
        throw 'Balas dengan teks, kirim teks langsung, atau reply file!';
    }

    try {
        const obfuscatedResult = await doubleEncrypt(inputText);
        const resultFilePath = `./tmp/${resultFileName}`;

        await fs.writeFileSync(resultFilePath, obfuscatedResult);

        await conn.sendMessage(
            m.chat, {
                document: await fs.readFileSync(resultFilePath),
                caption: "RESULT ENCRYPT",
                mimetype: 'application/javascript',
                fileName: resultFileName,
            }, {
                quoted: m
            }
        );

        fs.unlinkSync(resultFilePath);
    } catch (e) {
        throw `Error saat memproses obfuscasi: ${e.message}`;
    }
};

Zaell.help = ['encrypt'];
Zaell.tags = ['tools'];
Zaell.command = /^(enc(rypt)?)$/i;
Zaell.register = true;
Zaell.limit = true;

export default Zaell;

/**
 * Fungsi untuk mengenkripsi kode secara bertahap
 * Menggunakan javascript-obfuscator lalu JsConfuser
 * @param {string} code - Kode JavaScript yang akan dienkripsi
 * @returns {Promise<string>} - Kode yang telah dienkripsi secara bertahap
 */
async function doubleEncrypt(code) {
    try {
        const obfuscationResult = await jsobfus.obfuscate(code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            numbersToExpressions: true,
            simplify: true,
            stringArray: true,
            stringArrayEncoding: ['rc4', 'base64'],
            stringArrayIndexShift: true,
            stringArrayShuffle: true,
            stringArrayThreshold: 1,
            splitStrings: true,
            splitStringsChunkLength: 5,
            transformObjectKeys: true,
            unicodeEscapeSequence: true,
        });

        const firstObfuscation = await obfuscationResult.getObfuscatedCode();

        const result = await JsConfuser.default.obfuscate(firstObfuscation, {
            target: 'node',
            preset: 'low',
            calculator: true,
            compact: true,
            hexadecimalNumbers: true,
            deadCode: 0.05,
            dispatcher: 0.25,
            duplicateLiteralsRemoval: 0.5,
            identifierGenerator: 'randomized',
            minify: true,
            movedDeclarations: true,
            objectExtraction: true,
            renameVariables: true,
            renameGlobals: true,
            stringConcealing: true,
            astScrambler: true
        });

        return result.code;
    } catch (error) {
        throw error;
    }
}