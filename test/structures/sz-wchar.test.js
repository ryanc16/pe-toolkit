const { SZ_WCHAR } = require('../../lib/structures/sz-wchar');

describe('SZ_WCHAR', () => {
    it('can create hex string from bytes', () => {
        const str = SZ_WCHAR('abcd');
        expect(str).toEqual('61006200630064000000');
    });

    it('pads a hex value with leading zeros', () => {
        const str = SZ_WCHAR(String.fromCharCode(15)).toUpperCase();
        expect(str).toEqual('0F000000');
    });
});
