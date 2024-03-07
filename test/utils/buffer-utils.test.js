const { BufferUtils } = require('../../lib/utils/buffer-utils');

describe('BufferUtils', () => {

    it('can read uint16', () => {
        const buff = Uint8Array.from([0x09, 0x04]);
        const dv = new DataView(buff.buffer);
        const actual = BufferUtils.readUint16(buff, 0, true);
        const expected = dv.getUint16(0, true);
        expect(actual).toEqual(expected);
    })
});
