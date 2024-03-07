/**
 * Creates a zero terminated string in hex bytes
 * 
 * @param text The text to encode
 * @returns {string} A string representation of hex bytes including a terminating zero byte
 */
export function SZ_WCHAR(text: string): string {
    const buff = [];
    for (const char of text.split('')) {
        const code = char.charCodeAt(0);
        let value = code.toString(16).padStart(2, "0");
        if (code < 255) {
            value += '00';
        }
        buff.push(value);
    }
    buff.push('0000');
    return buff.join('');
}
