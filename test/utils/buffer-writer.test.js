require('jasmine');
const { BufferWriter } = require('../../lib/utils/buffer-writer');

describe('BufferWriter', () => {

    /** @type BufferWriter */
    let dataBuffer = null;

    beforeEach(() => {
        dataBuffer = new BufferWriter(new ArrayBuffer(16));
    });

    it('can write a byte', () => {
        dataBuffer.writeByte(0x2a);
        expect(new Uint8Array(dataBuffer.data.buffer)).toEqual(new Uint8Array([0x2a, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    });

    it('can write bytes', () => {
        dataBuffer.writeBytes([0xde, 0xad, 0xbe, 0xef]);
        expect(new Uint8Array(dataBuffer.data.buffer)).toEqual(new Uint8Array([0xde, 0xad, 0xbe, 0xef, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    });

    it('can write a word', () => {
        dataBuffer.writeWord(0xcafe);
        expect(new Uint8Array(dataBuffer.data.buffer)).toEqual(new Uint8Array([0xfe, 0xca, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    });

    it('can write words', () => {
        dataBuffer.writeWords([0xdead, 0xbeef]);
        expect(new Uint8Array(dataBuffer.data.buffer)).toEqual(new Uint8Array([0xad, 0xde, 0xef, 0xbe, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    });

    it('can write double word', () => {
        dataBuffer.writeDWord(0xdeadbeef);
        expect(new Uint8Array(dataBuffer.data.buffer)).toEqual(new Uint8Array([0xef, 0xbe, 0xad, 0xde, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    });

    it('can write double words', () => {
        dataBuffer.writeDWords([0xdeadbeef, 0xcafef00d]);
        expect(new Uint8Array(dataBuffer.data.buffer)).toEqual(new Uint8Array([0xef, 0xbe, 0xad, 0xde, 0x0d, 0xf0, 0xfe, 0xca, 0, 0, 0, 0, 0, 0, 0, 0]));
    });

    it('can write quad word', () => {
        dataBuffer.writeQWord(0xdeadbeefcafef00dn);
        expect(new Uint8Array(dataBuffer.data.buffer)).toEqual(new Uint8Array([0x0d, 0xf0, 0xfe, 0xca, 0xef, 0xbe, 0xad, 0xde, 0, 0, 0, 0, 0, 0, 0, 0]));
    });

    it('can write a zero terminated string', () => {
        dataBuffer.writeStringZ('abc');
        dataBuffer.writeStringZ('def');
        expect(new Uint8Array(dataBuffer.data.buffer)).toEqual(new Uint8Array([97, 98, 99, 0, 0, 100, 101, 102, 0, 0, 0, 0, 0, 0, 0, 0]));
    });

    it('can write a string as bytes', () => {
        dataBuffer.writeStringAsBytes('abc');
        dataBuffer.writeStringAsBytes('def');
        expect(new Uint8Array(dataBuffer.data.buffer)).toEqual(new Uint8Array([97, 98, 99, 100, 101, 102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    });

    it('can write a string as words', () => {
        dataBuffer.writeStringAsWords('abc');
        dataBuffer.writeStringAsWords('def');
        expect(new Uint8Array(dataBuffer.data.buffer)).toEqual(new Uint8Array([97, 0, 98, 0, 99, 0, 100, 0, 101, 0, 102, 0, 0, 0, 0, 0]));
    });

});
