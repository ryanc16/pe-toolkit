require('jasmine');
const { BufferReader } = require('../../lib/utils/buffer-reader');

describe('BufferReader', () => {

    it('can create', () => {
        const data = [0x01, 0x02];
        const buffer = new BufferReader(data)
        expect(buffer).not.toBeNull();
        expect(buffer.data).toBeInstanceOf(DataView);
        expect(buffer.data.byteLength).toEqual(data.length);
        expect(buffer.offset).toEqual(0);
        expect(buffer.alignment).toEqual(0);
    });

    describe('with byte data', () => {
        let byteData = [0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01];
        /** @type BufferReader */
        let dataBuffer = null;

        beforeEach(() => {
            dataBuffer = new BufferReader(byteData);
        });

        it('can goto offset', () => {
            expect(dataBuffer.offset).toEqual(0);
            dataBuffer.goto(4);
            expect(dataBuffer.offset).toEqual(4);
        });

        it('can read a byte', () => {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.readByte()).toEqual(0x08);
            expect(dataBuffer.offset).toEqual(1);
            expect(dataBuffer.readByte()).toEqual(0x07);
            expect(dataBuffer.offset).toEqual(2);
        });

        it('can read bytes', () => {
            const bytes1 = dataBuffer.readBytes(1);
            expect(bytes1).toBeInstanceOf(Uint8Array);
            expect(bytes1).toHaveSize(1);
            expect(bytes1[0]).toEqual(0x08);

            dataBuffer.goto(0);
            const bytes2 = dataBuffer.readBytes(2);
            expect(bytes2).toBeInstanceOf(Uint8Array);
            expect(bytes2).toHaveSize(2);
            expect(bytes2[0]).toEqual(0x08);
            expect(bytes2[1]).toEqual(0x07);
        });

        it('can read word', () => {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.readWord(true)).toEqual(0x0708);
            expect(dataBuffer.offset).toEqual(2);
            expect(dataBuffer.readWord(true)).toEqual(0x0506);
            expect(dataBuffer.offset).toEqual(4);
        });

        it('can read words', () => {
            expect(dataBuffer.offset).toEqual(0);
            const words1 = dataBuffer.readWords(1);
            expect(dataBuffer.offset).toEqual(2);
            expect(words1).toBeInstanceOf(Uint16Array);
            expect(words1).toHaveSize(1);
            expect(words1[0]).toEqual(0x0708);

            dataBuffer.goto(0);

            expect(dataBuffer.offset).toEqual(0);
            const words2 = dataBuffer.readWords(2);
            expect(dataBuffer.offset).toEqual(4);
            expect(words2).toBeInstanceOf(Uint16Array);
            expect(words2).toHaveSize(2);
            expect(words2[0]).toEqual(0x0708);
            expect(words2[1]).toEqual(0x0506);
        });

        it('can read dword', () => {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.readDWord()).toEqual(0x05060708);
            expect(dataBuffer.offset).toEqual(4);
        });

        it('can read dwords', () => {
            expect(dataBuffer.offset).toEqual(0);
            const dwords1 = dataBuffer.readDWords(1);
            expect(dataBuffer.offset).toEqual(4);
            expect(dwords1).toBeInstanceOf(Uint32Array);
            expect(dwords1).toHaveSize(1);
            expect(dwords1[0]).toEqual(0x05060708);

            dataBuffer.goto(0);

            expect(dataBuffer.offset).toEqual(0);
            const dwords2 = dataBuffer.readDWords(2);
            expect(dataBuffer.offset).toEqual(8);
            expect(dwords2).toBeInstanceOf(Uint32Array);
            expect(dwords2).toHaveSize(2);
            expect(dwords2[0]).toEqual(0x05060708);
            expect(dwords2[1]).toEqual(0x01020304);
        });

        it('can read qword', () => {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.readQWord(true).toString(16)).toEqual('102030405060708');
            expect(dataBuffer.offset).toEqual(8);
        });

        it('can read qwords', () => {
            expect(dataBuffer.offset).toEqual(0);
            const qwords1 = dataBuffer.readQWords(1);
            expect(dataBuffer.offset).toEqual(8);
            expect(qwords1).toBeInstanceOf(BigUint64Array);
            expect(qwords1).toHaveSize(1);
            expect(qwords1[0]).toEqual(0x0102030405060708n);
        });

        it('can peek byte', () => {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.peekByte()).toEqual(0x08);
            expect(dataBuffer.offset).toEqual(0);
        });

        it('can check prev byte', () => {
            expect(dataBuffer.offset).toEqual(0);
            dataBuffer.readByte();
            expect(dataBuffer.offset).toEqual(1);
            expect(dataBuffer.prevByte()).toEqual(0x08);
            expect(dataBuffer.offset).toEqual(1);
        });

        it('can peek word', () => {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.peekWord()).toEqual(0x0708);
            expect(dataBuffer.offset).toEqual(0);
        });

        it('can check prev word', () => {
            expect(dataBuffer.offset).toEqual(0);
            dataBuffer.readWord(true);
            expect(dataBuffer.offset).toEqual(2);
            expect(dataBuffer.prevWord()).toEqual(0x0708);
            expect(dataBuffer.offset).toEqual(2);
        });

        it('can find next word when it exists', () => {
            expect(dataBuffer.offset).toEqual(0);
            const loc = dataBuffer.findNextWord('0403');
            expect(dataBuffer.offset).toEqual(0);
            expect(loc).not.toBeNull();
            expect(loc.start.dec).toEqual(4);
            expect(loc.end.dec).toEqual(5);
        });

        it('can safely attempt to find next word, even when it doesn\'t exist', () => {
            expect(dataBuffer.offset).toEqual(0);
            const loc = dataBuffer.findNextWord('0102');
            expect(dataBuffer.offset).toEqual(0);
            expect(loc).toBeNull();
        });
    });

    describe('with string data', () => {
        let stringData = [0x61, 0x00, 0x62, 0x00, 0x20, 0x00, 0x63, 0x00, 0x64, 0x00, 0x00, 0x00]; // ab cd
        let stringBuffer = null;

        beforeEach(() => {
            stringBuffer = new BufferReader(stringData);
        });

        it('can read words as string', () => {
            expect(stringBuffer.offset).toEqual(0);
            expect(stringBuffer.readWordsAsString(2)).toEqual('ab');
            expect(stringBuffer.offset).toEqual(4);
        });

        it('can read null terminated string', () => {
            expect(stringBuffer.offset).toEqual(0);
            expect(stringBuffer.readWordStringZ()).toEqual('ab cd');
            expect(stringBuffer.offset).toEqual(stringData.length);
        });

    });
});
