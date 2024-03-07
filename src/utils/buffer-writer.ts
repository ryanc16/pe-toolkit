import { DataSize } from '../structures/data-types';

export class BufferWriter {

    private data: DataView;
    private offset: number;
    private offsetStack: number[];
    private alignment: number;

    constructor(buffer: ArrayBuffer | Uint8Array) {
        this.data = new DataView(buffer);
        this.offset = 0;
        this.offsetStack = [];
        this.alignment = 0;
    }

    public byteLength(): number {
        return this.data.byteLength;
    }

    public buffer(): ArrayBuffer {
        return this.data.buffer;
    }

    public writeByte(byte: number): void {
        this.data.setUint8(this.offset, byte);
        this.offset += DataSize.BYTE;
    }

    public writeBytes(bytes: ArrayLike<number>) {
        for (const byte of Array.from(bytes)) {
            this.writeByte(byte);
        }
    }

    public writeWord(word: number): void {
        this.data.setUint16(this.offset, word, true);
        this.offset += DataSize.WORD;
    }

    public writeWords(words: ArrayLike<number>): void {
        for (const word of Array.from(words)) {
            this.writeWord(word);
        }
    }

    public writeDWord(dWord: number): void {
        this.data.setUint32(this.offset, dWord, true);
        this.offset += DataSize.DWORD;
    }

    public writeDWords(dwords: ArrayLike<number>): void {
        for (const dword of Array.from(dwords)) {
            this.writeDWord(dword);
        }
    }

    public writeQWord(qword: bigint | number): void {
        this.data.setBigUint64(this.offset, BigInt(qword), true);
        this.offset += DataSize.QWORD;
    }

    public writeQWords(qwords: ArrayLike<number | bigint>): void {
        for (const qword of Array.from(qwords)) {
            this.writeQWord(qword);
        }
    }

    public writeStringZ(str: string): void {
        let word = 0x0000;
        this.writeStringAsBytes(str);
        this.writeWord(word);
    }

    public writeStringAsBytes(str: string): void {
        for (const chr of str.split('').map(char => char.codePointAt(0) as number)) {
            this.writeByte(chr);
        }
    }

    public writeStringAsWords(str: string) {
        for (const chr of str.split('').map(char => char.codePointAt(0) as number)) {
            this.writeWord(chr);
        }
    }
}
