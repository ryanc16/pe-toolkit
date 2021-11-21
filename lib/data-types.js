const DATA_TYPES = {
    BYTE: 1,
    WORD: 2,
    DWORD: 4,
    QWORD: 8,
    WCHAR: 2
};

function SZ_WCHAR(text) {
    const buff = [];
    for (const char of text.split('')) {
        const code = char.charCodeAt(0);
        let value = code.toString(16);
        if (code < 16) {
            value = padHexLeft0(value);
        }
        if (code < 255) {
            value += '00';
        }
        buff.push(value);
    }
    return buff.join('');
}

function padHexLeft0(hex) {
    return hex.length < 2 ? '0' + hex : hex;
}

module.exports = DATA_TYPES;
module.exports.SZ_WCHAR = SZ_WCHAR;