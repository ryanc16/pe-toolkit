const BufferReader = require('../lib/buffer-reader');

describe('BufferReader', function() {

    it('can create', function() {
        const data = [0x01, 0x02];
        const buffer = new BufferReader(data)
        expect(buffer).not.toBeNull();
        expect(buffer.data).toBeInstanceOf(DataView);
        expect(buffer.data.byteLength).toEqual(data.length);
        expect(buffer.offset).toEqual(0);
        expect(buffer.alignment).toEqual(0);
    });

    describe('with byte data', function() {
        let byteData = [0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01];
        /** @type BufferReader */
        let dataBuffer = null;

        beforeEach(function() {
            dataBuffer = new BufferReader(byteData);
        });

        it('can goto offset', function() {
            expect(dataBuffer.offset).toEqual(0);
            dataBuffer.goto(4);
            expect(dataBuffer.offset).toEqual(4);
        });

        it('can read a byte', function() {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.readByte(true)).toEqual(0x08);
            expect(dataBuffer.offset).toEqual(1);
            expect(dataBuffer.readByte(true)).toEqual(0x07);
            expect(dataBuffer.offset).toEqual(2);
        });
    
        it('can read word', function() {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.readWord(true)).toEqual(0x0708);
            expect(dataBuffer.offset).toEqual(2);
            expect(dataBuffer.readWord(true)).toEqual(0x0506);
            expect(dataBuffer.offset).toEqual(4);
        });
    
        it('can read words', function() {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.readWords(2)).toEqual(new Uint8Array([0x0708, 0x0506]));
            expect(dataBuffer.offset).toEqual(4);
        });

        it('can read dword', function() {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.readDWord(true)).toEqual(0x05060708);
            expect(dataBuffer.offset).toEqual(4);
        });
    
        it('can read qword', function() {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.readQWord(true).toString(16)).toEqual('102030405060708');
            expect(dataBuffer.offset).toEqual(8);
        });

        it('can peek byte', function() {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.peekByte(true)).toEqual(0x08);
            expect(dataBuffer.offset).toEqual(0);
        });

        it('can check prev byte', function() {
            expect(dataBuffer.offset).toEqual(0);
            dataBuffer.readByte(true);
            expect(dataBuffer.offset).toEqual(1);
            expect(dataBuffer.prevByte(true)).toEqual(0x08);
            expect(dataBuffer.offset).toEqual(1);
        });

        it('can peek word', function() {
            expect(dataBuffer.offset).toEqual(0);
            expect(dataBuffer.peekWord(true)).toEqual(0x0708);
            expect(dataBuffer.offset).toEqual(0);
        });

        it('can check prev word', function() {
            expect(dataBuffer.offset).toEqual(0);
            dataBuffer.readWord(true);
            expect(dataBuffer.offset).toEqual(2);
            expect(dataBuffer.prevWord(true)).toEqual(0x0708);
            expect(dataBuffer.offset).toEqual(2);
        });

        it('can find next word when it exists', function() {
            expect(dataBuffer.offset).toEqual(0);
            const loc = dataBuffer.findNextWord('0403');
            expect(dataBuffer.offset).toEqual(0);
            expect(loc).not.toBeNull();
            expect(loc.start.dec).toEqual(4);
            expect(loc.end.dec).toEqual(5);
        });

        it('can safely attempt to find next word, even when it doesn\'t exist', function() {
            expect(dataBuffer.offset).toEqual(0);
            const loc = dataBuffer.findNextWord('0102');
            expect(dataBuffer.offset).toEqual(0);
            expect(loc).toBeNull();
        });

    });

    describe('with string data', function() {
        let stringData = [0x61, 0x00, 0x62, 0x00, 0x20, 0x00, 0x63, 0x00, 0x64, 0x00, 0x00, 0x00]; // ab cd
        let stringBuffer = null;
    
        beforeEach(function() {
            stringBuffer = new BufferReader(stringData);
        });

        it('can read words as string', function() {
            expect(stringBuffer.offset).toEqual(0);
            expect(stringBuffer.readWordsAsString(2)).toEqual('ab');
            expect(stringBuffer.offset).toEqual(4);
        });

        it('can read null terminated string', function() {
            expect(stringBuffer.offset).toEqual(0);
            expect(stringBuffer.readStringZ()).toEqual('ab cd');
            expect(stringBuffer.offset).toEqual(stringData.length);
        });

    });
});