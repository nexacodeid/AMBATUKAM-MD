class BeautifyCodeScraper {
    constructor() {
        this.jsBeautifyAPI = 'https://beautifier.io/api/beautify';
        this.supportedLanguages = [
            'javascript', 'html', 'css', 'json', 'xml', 'sql', 'php',
            'python', 'java', 'c', 'cpp', 'csharp', 'typescript',
            'scss', 'less', 'vue', 'angular', 'react'
        ];
    }

    beautifyJavaScript(code) {
        try {
            let beautified = code
                .replace(/([=+\-*/%<>!&|^])\s*([=+\-*/%<>!&|^])/g, '$1 $2')
                .replace(/([=+\-*/%<>!&|^])\s*([^=+\-*/%<>!&|^])/g, '$1 $2')
                .replace(/,(?!\s)/g, ', ')
                .replace(/;(?!\s|\n)/g, '; ')
                .replace(/function\s*\(/g, 'function (')
                .replace(/\)\s*{/g, ') {')
                .replace(/(if|for|while|switch)\s*\(/g, '$1 (')
                .replace(/:\s*(?!\s)/g, ': ')
                .replace(/\[\s+/g, '[')
                .replace(/\s+\]/g, ']')
                .replace(/{\s*([^}]+)\s*}/g, (match, content) => {
                    if (content.includes(';') || content.includes('{')) {
                        return '{\n    ' + content.trim().replace(/;\s*/g, ';\n    ').replace(/\n\s*$/, '\n') + '}';
                    }
                    return match;
                })
                .replace(/;\s*}/g, ';\n}')
                .replace(/}\s*else\s*{/g, '} else {')
                .replace(/}\s*catch\s*\(/g, '} catch (')
                .replace(/}\s*finally\s*{/g, '} finally {');

            return beautified;
        } catch (error) {
            return code;
        }
    }

    beautifyCSS(code) {
        try {
            let beautified = code
                .replace(/([^{\s])\s*{/g, '$1 {')
                .replace(/:\s*([^;]+)/g, ': $1')
                .replace(/,(?!\s)/g, ', ')
                .replace(/{([^}]+)}/g, (match, content) => {
                    const properties = content.split(';').filter(prop => prop.trim());
                    if (properties.length > 1) {
                        return '{\n    ' + properties.map(prop => prop.trim()).join(';\n    ') + ';\n}';
                    }
                    return match;
                })
                .replace(/@media\s*\(/g, '@media (')
                .replace(/\)\s*{/g, ') {');

            return beautified;
        } catch (error) {
            return code;
        }
    }

    beautifyHTML(code) {
        try {
            let beautified = code
                .replace(/>\s*</g, '>\n<')
                .replace(/(<[^\/][^>]*>)([^<]*<)/g, '$1\n    $2')
                .replace(/([^\/])>/g, '$1 >')
                .replace(/\s+>/g, '>')
                .replace(/\s+/g, ' ')
                .replace(/>\s+</g, '><')
                .replace(/(<\/?(html|head|body|div|section|article|nav|header|footer|main)[^>]*>)/gi, '\n$1\n')
                .replace(/\n\s*\n/g, '\n')
                .trim();

            return beautified;
        } catch (error) {
            return code;
        }
    }

    beautifyJSON(code) {
        try {
            const parsed = JSON.parse(code);
            return JSON.stringify(parsed, null, 2);
        } catch (error) {
            return code;
        }
    }

    async beautifyWithAPI(code, language) {
        try {
            const response = await fetch('https://api.beautifier.io/api/beautify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; CodeBeautifier/1.0)'
                },
                body: JSON.stringify({
                    source: code,
                    type: language,
                    options: {
                        indent_size: 2,
                        indent_char: ' ',
                        max_preserve_newlines: 2,
                        preserve_newlines: true,
                        keep_array_indentation: false,
                        break_chained_methods: false,
                        brace_style: 'collapse',
                        space_before_conditional: true,
                        unescape_strings: false,
                        wrap_line_length: 0,
                        end_with_newline: false
                    }
                }),
                timeout: 10000
            });

            if (response.ok) {
                const result = await response.json();
                return result.data || result.beautified || result.result || code;
            }
            throw new Error('API response not ok');
        } catch (error) {
            console.log('API beautify failed, using local methods');
            return this.beautifyLocal(code, language);
        }
    }

    beautifyLocal(code, language) {
        switch (language.toLowerCase()) {
            case 'javascript':
            case 'js':
            case 'typescript':
            case 'ts':
                return this.beautifyJavaScript(code);
            case 'css':
            case 'scss':
            case 'less':
                return this.beautifyCSS(code);
            case 'html':
            case 'xml':
                return this.beautifyHTML(code);
            case 'json':
                return this.beautifyJSON(code);
            default:
                return this.beautifyJavaScript(code);
        }
    }

    async beautifyCode(code, language = 'javascript') {
        try {
            let beautified = await this.beautifyWithAPI(code, language);

            if (beautified === code || !beautified) {
                beautified = this.beautifyLocal(code, language);
            }

            return {
                success: true,
                originalCode: code,
                beautifiedCode: beautified,
                language: language,
                method: beautified !== code ? (beautified === this.beautifyLocal(code, language) ? 'local' : 'api') : 'unchanged',
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            const beautified = this.beautifyLocal(code, language);

            return {
                success: true,
                originalCode: code,
                beautifiedCode: beautified,
                language: language,
                method: 'local_fallback',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    detectLanguage(code) {
        const indicators = {
            'json': [/^\s*[\{\[]/, /^\s*{[\s\S]*}\s*$/, /^\s*\[[\s\S]*\]\s*$/, /"[\w-]+"\s*:\s*/],
            'html': [/<html/i, /<div/i, /<body/i, /<head/i, /<script/i, /<style/i, /<!DOCTYPE/i, /<\w+[^>]*>/],
            'css': [/\{\s*[\w-]+\s*:\s*[^}]+\}/, /@media/, /\.[\w-]+\s*\{/, /#[\w-]+\s*\{/, /@import/, /[\w-]+\s*:\s*[^;]+;/],
            'javascript': [/function\s+\w+\s*\(/, /const\s+\w+\s*=/, /let\s+\w+\s*=/, /var\s+\w+\s*=/, /=>\s*[\{\(]/, /console\.log/, /require\s*\(/, /import\s+.*from/],
            'python': [/def\s+\w+\s*\(/, /import\s+\w+/, /from\s+\w+\s+import/, /if\s+__name__\s*==\s*['"]__main__['"]:/],
            'java': [/public\s+class\s+\w+/, /public\s+static\s+void\s+main/, /System\.out\.println/, /import\s+java\./],
            'php': [/<\?php/, /\$\w+\s*=/, /echo\s+/, /function\s+\w+\s*\(/, /namespace\s+/],
            'xml': [/<\?xml/, /xmlns:/, /<\w+[^>]*>[\s\S]*<\/\w+>/],
            'sql': [/SELECT\s+.*FROM/i, /INSERT\s+INTO/i, /UPDATE\s+.*SET/i, /DELETE\s+FROM/i, /CREATE\s+TABLE/i],
            'c': [/#include\s*</, /int\s+main\s*\(/, /printf\s*\(/, /scanf\s*\(/],
            'cpp': [/#include\s*<iostream>/, /using\s+namespace\s+std/, /cout\s*<</, /cin\s*>>/]
        };

        for (const [lang, patterns] of Object.entries(indicators)) {
            if (patterns.some(pattern => pattern.test(code))) {
                return lang;
            }
        }

        return 'javascript';
    }

    analyzeImprovements(original, beautified) {
        const improvements = [];

        if (beautified.trim() !== original.trim()) {
            improvements.push('✨ Format dan indentasi diperbaiki');
        }

        const originalLines = original.split('\n').length;
        const beautifiedLines = beautified.split('\n').length;

        if (beautifiedLines !== originalLines) {
            improvements.push('📝 Struktur baris dioptimalkan');
        }

        if (original.includes('}{') && !beautified.includes('}{')) {
            improvements.push('🔧 Bracket spacing diperbaiki');
        }

        if (original.match(/\w\(/g) && beautified.match(/\w \(/g)) {
            improvements.push('🎯 Function call spacing ditambahkan');
        }

        if (original.includes(',') && beautified.includes(', ')) {
            improvements.push('📍 Comma spacing diperbaiki');
        }

        return improvements.length > 0 ? improvements : ['✅ Kode sudah dalam format yang baik'];
    }

    async handleBotRequest(code, language = 'auto') {
        try {
            if (language === 'auto') {
                language = this.detectLanguage(code);
            }

            if (!this.supportedLanguages.includes(language.toLowerCase())) {
                language = 'javascript';
            }

            const result = await this.beautifyCode(code, language);

            return {
                success: result.success,
                message: result.success ? 'Kode berhasil dirapikan!' : 'Gagal merapikan kode',
                data: {
                    language: language,
                    originalLength: code.length,
                    beautifiedLength: result.beautifiedCode.length,
                    beautifiedCode: result.beautifiedCode,
                    improvements: this.analyzeImprovements(code, result.beautifiedCode),
                    method: result.method || 'unknown'
                },
                error: result.error || null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Terjadi kesalahan saat memproses kode',
                data: null,
                error: error.message
            };
        }
    }
}

const handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    const loadingMsg = await conn.reply(m.chat, '🔄 *Sedang memproses kode Anda...*\n_Mohon tunggu sebentar_', m);

    try {
        if (!text) {
            await conn.reply(m.chat, `❌ *Penggunaan salah!*\n\n*Contoh:*\n${usedPrefix + command} function test(){console.log("hello");}`, m);
            return;
        }

        if (text.length > 8000) {
            await conn.reply(m.chat, '❌ *Kode terlalu panjang!*\nMaximal 8000 karakter.', m);
            return;
        }

        const scraper = new BeautifyCodeScraper();

        const result = await scraper.handleBotRequest(text, 'auto');

        if (result.success && result.data) {
            const {
                language,
                beautifiedCode,
                improvements,
                originalLength,
                beautifiedLength,
                method
            } = result.data;

            let response = `🎨 *CODE BEAUTIFIER*\n\n`;
            response += `📋 *Language:* ${language.toUpperCase()}\n`;
            response += `📏 *Size:* ${originalLength} → ${beautifiedLength} chars\n`;
            response += `⚙️ *Method:* ${method}\n`;
            response += `⚡ *Improvements:*\n${improvements.map(imp => `  • ${imp}`).join('\n')}\n\n`;
            response += `✨ *Beautified Code:*\n`;
            response += `\`\`\`${language}\n${beautifiedCode}\n\`\`\``;

            if (response.length > 4000) {
                await conn.reply(m.chat, `🎨 *CODE BEAUTIFIER*\n\n📋 *Language:* ${language.toUpperCase()}\n📏 *Size:* ${originalLength} → ${beautifiedLength} chars\n⚙️ *Method:* ${method}\n⚡ *Improvements:*\n${improvements.map(imp => `  • ${imp}`).join('\n')}`, m);
                await conn.reply(m.chat, `✨ *Beautified Code:*\n\`\`\`${language}\n${beautifiedCode}\n\`\`\``, m);
            } else {
                await conn.reply(m.chat, response, m);
            }
        } else {
            await conn.reply(m.chat, `❌ *${result.message}*\n\n🔧 *Error:* ${result.error || 'Unknown error'}\n\n💡 *Tips:*\n• Pastikan kode valid\n• Coba lagi dalam beberapa saat\n• Gunakan kode yang lebih pendek`, m);
        }

    } catch (error) {
        console.error('Handler error:', error);
        await conn.reply(m.chat, `❌ *Terjadi kesalahan sistem!*\n\n🔧 *Error:* ${error.message}\n\n💡 Silakan coba lagi nanti.`, m);
    }
};

handler.help = ['beautify <kode>'];
handler.tags = ['tools'];
handler.command = /^(beautify|rapiin|format)$/i;
handler.limit = true;
handler.register = true;

export default handler;