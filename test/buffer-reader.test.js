const BufferReader = require('../lib/buffer-reader');

describe('BufferReader', function() {

    let data = [0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01];
    let buffer = null;

    beforeEach(function() {
        buffer = new BufferReader(data);
    })

    it('can create', function() {
        expect(buffer).not.toBeNull();
        expect(buffer.data).toBeInstanceOf(DataView);
        expect(buffer.data.byteLength).toEqual(data.length);
        expect(buffer.offset).toEqual(0);
        expect(buffer.alignment).toEqual(0);
    });

    it('can read a bytes', function() {
        expect(buffer.offset).toEqual(0);
        expect(buffer.readByte(true)).toEqual(0x08);
        expect(buffer.offset).toEqual(1);
        expect(buffer.readByte(true)).toEqual(0x07);
        expect(buffer.offset).toEqual(2);
    });

    it('can read words', function() {
        expect(buffer.offset).toEqual(0);
        expect(buffer.readWord(true)).toEqual(0x0708);
        expect(buffer.offset).toEqual(2);
        expect(buffer.readWord(true)).toEqual(0x0506);
        expect(buffer.offset).toEqual(4);
    });

    it('can read dwords', function() {
        expect(buffer.offset).toEqual(0);
        expect(buffer.readDWord(true)).toEqual(0x05060708);
        expect(buffer.offset).toEqual(4);
    });

    it('can read qwords', function() {
        expect(buffer.offset).toEqual(0);
        expect(buffer.readQWord(true).toString(16)).toEqual('102030405060708');
        expect(buffer.offset).toEqual(8);
    });

});