import { DataSize } from '../structures/data-types';

/**
 * The BufferReader provides many utility methods for reading and navigating a data buffer, as well
 * as automatically advance, update, and track the byte offset for operations that advance the offset pointer.
 */
export class BufferReader {
    private data: DataView;
    private offset: number;
    private offsetStack: number[];
    private alignment: number;

    /**
     * @param buffer The original data buffer of read bytes
     */
    constructor(buffer: ArrayBuffer | Uint8Array) {
        this.data = new DataView(new Uint8Array(buffer).buffer);
        this.offset = 0;
        this.offsetStack = [];
        this.alignment = 0;
    }

    public getOffset(): number {
        return this.offset;
    }

    public getByteLength(): number {
        return this.data.byteLength;
    }

    public pushOffset(): void {
        this.offsetStack.push(this.offset);
    }

    public popOffset(): void {
        if (this.offsetStack.length > 0) {
            this.offset = this.offsetStack.pop() as number;
        }
    }

    public trim(start: number = 0, end: number = this.data.byteLength): void {
        this.data = new DataView(new Uint8Array(this.data.buffer.slice(start, end)));
    }

    public slicedBuffer(offset: number = this.offset, byteCount: number): BufferReader {
        return new BufferReader(this.data.buffer.slice(offset, offset + byteCount));
    }

    public readByte(): number {
        const byte = this.data.getUint8(this.offset);
        this.offset += DataSize.BYTE;
        return byte;
    }

    public readBytes(byteCount: number, le: boolean = false): Uint8Array {
        const bytes: number[] = [];
        for (let i = 0; i < byteCount; i++) {
            bytes.push(this.data.getUint8(this.offset));
            this.offset += DataSize.BYTE;
        }
        if (le === true) {
            bytes.reverse();
        }
        return Uint8Array.from(bytes);
    }

    /**
     * Read a WORD worth of bytes
     * @returns {number}
     */
    public readWord(): number {
        const word = this.data.getUint16(this.offset, true);
        this.offset += DataSize.WORD;
        return word;
    }

    /**
     * Reads a specific number of word sized bytes
     * @param wordCount 
     * @returns {Uint16Array}
     */
    public readWords(wordCount: number): Uint16Array {
        const words: number[] = [];
        for (let i = 0; i < wordCount; i++) {
            words.push(this.data.getUint16(this.offset, true));
            this.offset += DataSize.WORD;
        }
        return Uint16Array.from(words);
    }

    /**
     * Reads a DWORD worth of bytes
     * @returns {number}
     */
    public readDWord(): number {
        const dword = this.data.getUint32(this.offset, true);
        this.offset += DataSize.DWORD;
        return dword;
    }

    /**
     * Reads a specific number of dword sized bytes
     * @param dwordCount 
     * @returns {Uint32Array}
     */
    public readDWords(dwordCount: number): Uint32Array {
        const dwords: number[] = [];
        for (let i = 0; i < dwordCount; i++) {
            dwords.push(this.data.getUint32(this.offset, true));
            this.offset += DataSize.DWORD;
        }
        return Uint32Array.from(dwords);
    }

    /**
     * Reads a QWORD worth of bytes
     * @param asInt 
     * @returns {bigint}
     */
    public readQWord(): bigint {
        const qword = this.data.getBigUint64(this.offset, true);
        this.offset += DataSize.QWORD;
        return qword;
    }

    /**
     * Reads a specific number of qword sized bytes
     * @param qwordCount 
     * @returns {BigUint64Array}
     */
    public readQWords(qwordCount: number): BigUint64Array {
        const qwords: bigint[] = [];
        for (let i = 0; i < qwordCount; i++) {
            qwords.push(this.data.getBigUint64(this.offset, true));
            this.offset += DataSize.QWORD;
        }
        return BigUint64Array.from(qwords);
    }

    /**
     * Reads a zero (null byte) terminated two-byte (WORD) per character string
     * @returns {string}
     */
    public readWordStringZ(): string {
        let word = 0x0000;
        const str = [];
        while ((word = this.peekWord()) != 0x0000) {
            str.push(String.fromCharCode(word));
            this.offset += DataSize.WORD;
        }
        this.offset += DataSize.WORD;
        return str.join('').replace(/\0/g, '');
    }

    public readByteStringZ(): string {
        let byte = 0x00;
        const str = [];
        while ((byte = this.peekByte()) != 0x00) {
            str.push(String.fromCharCode(byte));
            this.offset += DataSize.BYTE;
        }
        this.offset += DataSize.BYTE;
        return str.join('').replace(/\0/g, '');
    }

    public readBytesAsString(byteCount: number): string {
        const bytes = this.readBytes(byteCount);
        const str = [];
        for (let i = 0; i < bytes.length; i++) {
            str.push(String.fromCharCode(bytes[i]));
        }
        return str.join('').replace(/\0/g, '');
    }

    public readWordsAsString(wordCount: number): string {
        const words = this.readWords(wordCount);
        const str = []
        for (let i = 0; i < words.length; i++) {
            str.push(String.fromCharCode(words[i]));
        }
        return str.join('').replace(/\0/g, '');
    }

    public peekByte(offset: number = this.offset): number {
        return this.data.getUint8(offset);
    }

    public peekBytes(byteCount: number, offset: number = this.offset): Uint8Array {
        return new Uint8Array(this.data.buffer.slice(offset, offset + (byteCount * DataSize.BYTE)));
    }

    public prevByte(offset: number = this.offset): number {
        return this.data.getUint8(offset - DataSize.BYTE);
    }

    public prevBytes(byteCount: number, offset: number = this.offset): Uint8Array {
        return new Uint8Array(this.data.buffer.slice(offset - (byteCount * DataSize.BYTE), offset));
    }

    public peekWord(offset: number = this.offset): number {
        return this.data.getUint16(offset, true);
    }

    public peekWords(wordCount: number, offset: number = this.offset): Uint8Array {
        return new Uint8Array(this.data.buffer.slice(offset, offset + (wordCount * DataSize.WORD)));
    }

    public prevWord(offset: number = this.offset): Uint8Array | number {
        return this.data.getUint16(offset - DataSize.WORD, true);
    }

    public prevWords(wordCount: number, offset: number = this.offset): Uint8Array {
        return new Uint8Array(this.data.buffer.slice(offset - (wordCount * DataSize.WORD), offset));
    }

    public seekNext(data: string | ArrayLike<number>): void {
        const location = this.findNext(data);
        if (location.start.dec !== -1) {
            this.goto(location.start.dec);
        }
    }

    public seekNonZeroByte(): void {
        while (this.peekByte() === 0x00) {
            this.readByte();
        }
    }

    public seekNonZeroWord(): void {
        while (this.peekWord() === 0x0000) {
            this.readWord();
        }
    }

    public alignTo32BitBoundary(): void {
        let offset = 0;
        while ((this.offset + offset) % DataSize.DWORD !== 0) {
            offset += DataSize.BYTE;
        }
        this.alignment = offset;
    }

    public seek32BitBoundary() {
        if ((this.offset + this.alignment) % DataSize.DWORD === 0) {
            return;
        } else {
            while ((this.offset + this.alignment) % DataSize.DWORD !== 0) {
                this.readByte();
            }
        }
    }

    public findNext(data: string | ArrayLike<number>, offset: number = this.offset): SeekLocation {
        let start = -1;
        let end = -1;
        if (typeof data === 'string') {
            data = Uint8Array.from((data.match(/[\da-f]{2}/gi) ?? []).map(h => parseInt(h, 16)));
        }
        for (let i = offset; i < this.data.byteLength; i++) {
            if (this.data.getUint8(i) === data[0]) {
                let match = true;
                for (let seek = 0; seek < data.length && match === true; seek++) {
                    match = match && this.data.getUint8(i + seek) === data[seek];
                    if (match === false) {
                        break;
                    }
                }
                if (match === true) {
                    start = i;
                    end = (start + (data.length));
                    break;
                }
            }
        }
        return new SeekLocation(start, end);
    }

    public findNextWord(data: string | ArrayLike<number>, offset = this.offset): SeekLocation | null {
        let word;
        if (typeof data === 'string') {
            word = Buffer.from(data, 'hex');
        } else {
            word = Uint8Array.from(data);
        }
        let current = this.peekWords(1, offset);
        function compareWords(word1: ArrayLike<number>, word2: ArrayLike<number>) {
            return word1[0] === word2[0] && word1[1] === word2[1];
        }
        while (!compareWords(word, current) && offset < this.data.byteLength) {
            offset += DataSize.WORD;
            current = this.peekWords(1, offset);
        }
        return offset >= this.data.byteLength ? null : new SeekLocation(offset, offset + word.length / 2);
    }

    public hasNext(data: string | ArrayLike<number>, offset: number = 0): boolean {
        return this.findNext(data, offset).start.dec != -1;
    }

    public findOccurences(data: string | ArrayLike<number>, offset: number = 0): SeekLocation[] {
        const occurences: SeekLocation[] = [];
        let location = null;
        while ((location = this.findNext(data, offset)).start.dec != -1) {
            occurences.push(location);
            offset = location.end.dec;
        }
        return occurences;
    }

    public rewindBytes(byteCount: number): void {
        this.offset -= byteCount * DataSize.BYTE;
    }

    public rewindWords(wordCount: number): void {
        this.offset -= wordCount * DataSize.WORD;
    }

    public goto(offset: number) {
        this.offset = offset;
    }
}

/**
 * Stores location information describing start and end offsets, in both decimal and hex.
 */
class SeekLocation {
    public readonly start: { dec: number; hex: string };
    public readonly end: { dec: number; hex: string };

    constructor(start: number, end: number) {
        this.start = {
            dec: start,
            hex: start.toString(16)
        };

        this.end = {
            dec: end,
            hex: end.toString(16)
        };
    }
}
