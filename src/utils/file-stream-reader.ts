import { DataSize } from '../structures/data-types';
import * as fs from 'fs';

export class FileStreamReader {
    private data: ReturnType<typeof fs.openSync>;
    private offset: number;
    private offsetStack: number[];
    private alignment: number;

    constructor(fd: ReturnType<typeof fs.openSync>) {
        this.data = fd;
        this.offset = 0;
        this.offsetStack = [];
        this.alignment = 0;
    }

    public getOffset(): number {
        return this.offset;
    }

    public pushOffset(): void {
        this.offsetStack.push(this.offset);
    }

    public popOffset(): void {
        if (this.offsetStack.length > 0) {
            this.offset = this.offsetStack.pop() as number;
        }
    }

    public readByte(): number {
        const byte = this.getUint8(this.offset);
        this.offset += DataSize.BYTE;
        return byte;
    }

    public readBytes(byteCount: number): Uint8Array {
        const bytes = new Uint8Array(byteCount);
        fs.readSync(this.data, bytes, 0, byteCount, this.offset);
        this.offset += (bytes.length * DataSize.BYTE);
        return bytes;
    }

    public getUint8(offset: number = this.offset): number {
        const byte = new Uint8Array(DataSize.BYTE);
        fs.readSync(this.data, byte, 0, DataSize.BYTE, offset);
        return byte.at(0) as number;
    }

    public readWord(): number {
        const word = this.getUint16(this.offset, true);
        this.offset += DataSize.WORD;
        return word;
    }

    public readWords(wordCount: number): Uint16Array {
        const words: number[] = [];
        for (let i = 0; i < wordCount; i++) {
            words.push(this.readWord());
        }
        return new Uint16Array(words);
    }

    public getUint16(offset: number = this.offset, le: boolean = true) {
        const bytes = new Uint8Array(DataSize.WORD);
        fs.readSync(this.data, bytes, 0, DataSize.WORD, offset);
        let num = 0x00;
        if (le === true) {
            for (let i = 0; i < bytes.length; i++) {
                num += bytes[i] << (8 * i);
            }
            return num;
        } else {
            for (let i = bytes.length - 1; i >= 0; i--) {
                num += bytes[i] << (8 * i);
            }
            return num;
        }
    }

    public readDWord(): number {
        const dword = this.getUint32(this.offset, true);
        this.offset += DataSize.DWORD;
        return dword;
    }

    public readDWords(dwordCount: number): Uint32Array {
        const dwords: number[] = [];
        for (let i = 0; i < dwordCount; i++) {
            dwords.push(this.readDWord());
        }
        return new Uint32Array(dwords);
    }

    public getUint32(offset: number = this.offset, le: boolean = true): number {
        const bytes = new Uint8Array(DataSize.DWORD);
        fs.readSync(this.data, bytes, 0, DataSize.DWORD, offset);
        let num = 0x00;
        if (le === true) {
            for (let i = 0; i < bytes.length; i++) {
                num += bytes[i] << (8 * i) >>> 0;
            }
            return num;
        } else {
            for (let i = bytes.length - 1; i >= 0; i--) {
                num += bytes[i] << (8 * i) >>> 0;
            }
            return num;
        }
    }

    /**
     * Reads a QWORD worth of bytes
     * @param asInt 
     * @returns {bigint}
     */
    public readQWord(): bigint {
        const qword = this.getBigUint64(this.offset, true);
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
            qwords.push(this.getBigUint64(this.offset, true));
            this.offset += DataSize.QWORD;
        }
        return BigUint64Array.from(qwords);
    }

    public getBigUint64(offset: number = this.offset, le: boolean = true): bigint {
        const bytes = new Uint8Array(DataSize.QWORD);
        fs.readSync(this.data, bytes, 0, DataSize.QWORD, offset);
        let num = 0x00;
        if (le === true) {
            for (let i = 0; i < bytes.length; i++) {
                num += bytes[i] << (8 * i) >>> 0;
            }
            return BigInt(num);
        } else {
            for (let i = bytes.length - 1; i >= 0; i--) {
                num += bytes[i] << (8 * i) >>> 0;
            }
            return BigInt(num);
        }
    }

    public peekByte(offset: number = this.offset): number {
        return this.getUint8(offset);
    }

    public peekWord(offset: number = this.offset): number {
        return this.getUint16(offset, true);
    }

    public readBytesAsString(byteCount: number): string {
        const bytes = this.readBytes(byteCount);
        const str = String.fromCharCode.apply(null, Array.from(bytes));
        return str.replace(/\0/g, '');
    }

    public readWordsAsString(wordCount: number): string {
        const words = this.readWords(wordCount);
        const str = String.fromCharCode.apply(null, Array.from(words));
        return str.replace(/\0/g, '');
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

    public goto(offset: number): void {
        this.offset = offset;
    }
}
