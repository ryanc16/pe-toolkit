import { HexUtils } from "../utils/hex-utils";
import { DataTypes } from "./data-types";

export interface IMAGE_DOS_HEADER {
    /** Magic header number, MZ, etc.. */
    wMagic: Uint8Array;
    /** Bytes on last page of file */
    wCblp: DataTypes.WORD;
    /** Code Pages in file */
    wCp: DataTypes.WORD;
    /** Relocations */
    wCrlc: DataTypes.WORD;
    /** Size of header in paragraphs */
    wCparHdr: DataTypes.WORD;
    /** Minimum extra paragraphs needed */
    wMinAlloc: DataTypes.WORD;
    /** Maximum extra paragraphs needed */
    wMaxAlloc: DataTypes.WORD;
    /** Initial (relative) SS value */
    wSs: DataTypes.WORD;
    /** Initial SP (stack pointer?) value */
    wSp: DataTypes.WORD;
    /** Checksum */
    wCsum: DataTypes.WORD;
    /** Initial IP (instruction pointer?) value  */
    wIp: DataTypes.WORD;
    /** Initial (relative) CS value */
    wCs: DataTypes.WORD;
    /** File address of relocation table */
    wLfArlc: DataTypes.WORD;
    /** Overlay number */
    wOvNo: DataTypes.WORD;
    /** Reserved words (4) */
    wRes: Uint16Array;
    /** OEM identifier (for e_oeminfo) */
    wOemId: DataTypes.WORD;
    /** OEM information; e_oemid specific */
    wOemInfo: DataTypes.WORD;
    /** Reserved words (10) */
    wRes2: Uint16Array;
    /** File address of new exe header */
    dwLfAnew: DataTypes.DWORD;
}

export function IMAGE_DOS_HEADER(values?: Partial<IMAGE_DOS_HEADER>): IMAGE_DOS_HEADER {
    return {
        wMagic: new Uint8Array([0x00, 0x00]),
        wCblp: 0x0000,
        wCp: 0x0000,
        wCrlc: 0x0000,
        wCparHdr: 0x0000,
        wMinAlloc: 0x0000,
        wMaxAlloc: 0x0000,
        wSs: 0x0000,
        wSp: 0x0000,
        wCsum: 0x0000,
        wIp: 0x0000,
        wCs: 0x0000,
        wLfArlc: 0x0000,
        wOvNo: 0x0000,
        wRes: new Uint16Array([0x0000, 0x0000, 0x0000, 0x0000]),
        wOemId: 0x0000,
        wOemInfo: 0x0000,
        wRes2: new Uint16Array([0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000]),
        dwLfAnew: 0x00000000,
        ...values
    };
}

export class ImageDosHeader {

    private struct: IMAGE_DOS_HEADER;

    constructor(values: IMAGE_DOS_HEADER) {
        this.struct = IMAGE_DOS_HEADER(values);
    }

    public getMagic(): string {
        return HexUtils.uintArrayToHex(this.struct.wMagic).join('');
    }

    public getCountBytesLastPage(): number {
        return this.struct.wCblp;
    }

    public getCountPages(): number {
        return this.struct.wCp;
    }

    public getCountRelocations(): number {
        return this.struct.wCrlc;
    }

    public getCountHeaderParagraphs(): number {
        return this.struct.wCparHdr;
    }

    public getMinimumAllocation(): number {
        return this.struct.wMinAlloc;
    }

    public getMaximumAllocation(): number {
        return this.struct.wMaxAlloc;
    }

    public getInitialSS(): string {
        return this.struct.wSs.toString(16).padStart(4, "0");
    }

    public getInitialSP(): string {
        return this.struct.wSp.toString(16).padStart(4, "0")
    }

    public getChecksum(): string {
        return this.struct.wCsum.toString(16).padStart(4, "0");
    }

    public getInitialIP(): string {
        return this.struct.wIp.toString(16).padStart(4, "0");
    }

    public getInitialCS(): string {
        return this.struct.wCs.toString(16).padStart(4, "0");
    }

    public getFileAddressOfRelocationTable(): string {
        return this.struct.wLfArlc.toString(16).padStart(4, "0");
    }

    public getOverlayNumber(): number {
        return this.struct.wOvNo;
    }

    public getReservedWords1(): string[] {
        return HexUtils.uintArrayToHex(this.struct.wRes);
    }

    public getOemIdentifer(): string {
        return this.struct.wOemId.toString(16).padStart(4, "0");
    }

    public getOemInformation(): string {
        return this.struct.wOemInfo.toString(16).padStart(4, "0");
    }

    public getReservedWords2(): string[] {
        return HexUtils.uintArrayToHex(this.struct.wRes2);
    }

    public getFileAddressOfNewExeHeader(): string {
        return this.struct.dwLfAnew.toString(16).padStart(8, "0")
    }

    public getStruct(): IMAGE_DOS_HEADER {
        return this.struct;
    }

    public toObject() {
        return {
            magic: this.getMagic(),
            countBytesLastPage: this.getCountBytesLastPage(),
            countPages: this.getCountPages(),
            countRelocations: this.getCountRelocations(),
            countHeaderParagraphs: this.getCountHeaderParagraphs(),
            minimumAllocation: this.getMinimumAllocation(),
            maximumAllocation: this.getMaximumAllocation(),
            initialSS: this.getInitialSS(),
            initialSP: this.getInitialSP(),
            checksum: this.getChecksum(),
            initialIP: this.getInitialIP(),
            initialCS: this.getInitialCS(),
            fileAddressRelocationTable: this.getFileAddressOfRelocationTable(),
            overlayNumber: this.getOverlayNumber(),
            reservedWords1: this.getReservedWords1(),
            owmIdentifier: this.getOemIdentifer(),
            oemInformation: this.getOemInformation(),
            reservedWords2: this.getReservedWords2(),
            fileAddressOfNewExeHeader: this.getFileAddressOfNewExeHeader()
        }
    }
}
