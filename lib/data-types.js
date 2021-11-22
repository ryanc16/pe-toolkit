const DATA_TYPES = {
    BYTE: 1,
    WORD: 2,
    DWORD: 4,
    QWORD: 8,
    WCHAR: 2
};

/**
 * Creates a zero terminated string in hex bytes
 * 
 * @param {string} text The text to encode
 * @returns {string} A string representation of hex bytes including a terminating zero byte
 */
function SZ_WCHAR(text) {
    const buff = [];
    for (const char of text.split('')) {
        const code = char.charCodeAt(0);
        let value = code.toString(16);
        if (code < 16) {
            value = padHexByteLeft(value);
        }
        if (code < 255) {
            value += '00';
        }
        buff.push(value);
    }
    buff.push('0000');
    return buff.join('');
}

/**
 * Pads a string representation of a hex byte with a 0 on the left if its less than 2 characters
 * @param {string} hex 
 * @returns {string} A padded string hex byte
 */
function padHexByteLeft(hex) {
    return hex.length < 2 ? '0' + hex : hex;
}

module.exports = DATA_TYPES;
module.exports.SZ_WCHAR = SZ_WCHAR;