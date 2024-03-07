import { DataTypes } from "./data-types";

/**
 * https://docs.microsoft.com/en-us/previous-versions/ms809762(v=msdn.10)
 */
export interface IMAGE_FILE_HEADER {
    /**
     * file signature  
     * type: WORD, size 2
     */
    ntSig: Uint8Array;
    /** The CPU that this file is intended for.
     * The following CPU IDs are defined:
     * @example
     * | 0x14d  | Intel i860             |
     * | 0x14c  | Intel i386, i486, i586 |
     * | 0x162  | MIPS R3000             |
     * | 0x166  | MIPS R4000             |
     * | 0x183  | DEC Alpha AXP          |
     */
    wMachine: DataTypes.WORD;
    /** The number of sections in the file. (.text, .bss. .data, .rsrc) */
    wNumberOfSections: DataTypes.WORD;
    /** The time that the linker (or compiler for an OBJ file) produced this file. This field holds the number of seconds since December 31st, 1969, at 4:00 P.M. */
    dwTimeDateStamp: DataTypes.DWORD;
    /**
     * The file offset of the COFF symbol table. This field is only used in OBJ files and PE files with COFF debug information.
     * PE files support multiple debug formats, so debuggers should refer to the IMAGE_DIRECTORY_ENTRY_DEBUG entry in the data directory (defined later).
     */
    dwPointerToSymbolTable: DataTypes.DWORD;
    /** The number of symbols in the COFF symbol table. See above. */
    dwNumberOfSymbols: DataTypes.DWORD;
    /**
     * The size of an optional header that can follow this structure.
     * In OBJs, the field is 0.
     * In executables, it is the size of the IMAGE_OPTIONAL_HEADER structure that follows this structure.
     * For 32bit it is `0x00E0` (224) bytes and for 64bit it is `0x00F0` (240) bytes.
     */
    wSizeOfOptionalHeader: DataTypes.WORD;
    /**
     * Flags with information about the file.
     * Some important fields:
     * @example
     * | 0x0001 | There are no relocations in the file           |
     * | 0x0002 | File is an executable image (not a OBJ or LIB) |
     * | 0x2000 | File is a dynamic-link library, not a program  |
     */
    wCharacteristics: DataTypes.WORD;
}

/**
 * https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#characteristics
 */
export const MachineLookup: Record<number, string> = {
    0x0000: 'The content of this field is assumed to be applicable to any machine typ',
    0x014d: 'Intel i860',
    0x014c: 'Intel i386, i486, i586, or later processors and compatible processors',
    0x0162: 'MIPS R3000',
    0x0166: 'MIPS R4000 LE',
    0x0183: 'DEC Alpha AXP',
    0x01c0: 'ARM little endian',
    0xaa64: 'ARM64 little endian',
    0x8664: 'x64'
}

/**
 * https://www.aldeid.com/wiki/PE-Portable-executable#Image_Characteristics
 */
export const FileHeaderImageCharacteristicsLookup: Record<number, string> = {
    /** Image only, Windows CE, and Microsoft Windows NT and later.
     * This indicates that the file does not contain base relocations and must therefore
     * be loaded at its preferred base address. If the base address is not available,
     * the loader reports an error. The default behavior of the linker is to strip
     * base relocations from executable (EXE) files.
     */
    0x0001: 'RELOCS_STRIPPED - There are no relocations in this file.',
    /** Image only. This indicates that the image file is valid and can be run.
     * If this flag is not set, it indicates a linker error.
     */
    0x0002: 'EXECUTABLE_IMAGE - File is an executable image (not a OBJ or LIB).',
    /**
     * COFF line numbers have been removed.
     * This flag is deprecated and should be zero.
     */
    0x0004: 'LINE_NUMS_STRIPPED - COFF line numbers have been removed (deprecated).',
    /**
     * COFF symbol table entries for local symbols have been removed.
     * This flag is deprecated and should be zero.
     */
    0x0008: 'LOCAL_SYMS_STRIPPED - COFF symbol table entries for local symbols have been removed (deprecated).',
    /**
     * Obsolete. Aggressively trim working set.
     * This flag is deprecated for Windows 2000 and later and must be zero.
     */
    0x0010: 'AGGRESSIVE_WS_TRIM - Aggressively trim working set (deprecated).',
    /** Application can handle > 2-GB addresses. */
    0x0020: 'LARGE_ADDRESS_AWARE - Application can handle > 2-GB addresses.',
    /** This flag is reserved for future use. */
    0x0040: 'RESERVED - This flag is reserved for future use.',
    /**
     * Little endian: the least significant bit (LSB) precedes the most significant bit (MSB) in memory.
     * This flag is deprecated and should be zero.
     */
    0x0080: 'BYTES_REVERSED_LO - Little endian: the least significant bit (LSB) precedes the most significant bit (MSB) in memory (deprecated).',
    /** Machine is based on a 32-bit-word architecture. */
    0x0100: '32BIT_MACHINE - Machine is based on a 32-bit-word architecture.',
    /** Debugging information is removed from the image file. */
    0x0200: 'DEBUG_STRIPPED - Debugging information is removed from the image file.',
    /** If the image is on removable media, fully load it and copy it to the swap file. */
    0x0400: 'REMOVABLE_RUN_FROM_SWAP - If the image is on removable media, fully load it and copy it to the swap file.',
    /** If the image is on network media, fully load it and copy it to the swap file. */
    0x0800: 'NET_RUN_FROM_SWAP - If the image is on network media, fully load it and copy it to the swap file.',
    /** The image file is a system file, not a user program. */
    0x1000: 'SYSTEM - The image file is a system file, not a user program.',
    /**
     * The image file is a dynamic-link library (DLL).
     * Such files are considered executable files for almost all purposes,
     * although they cannot be directly run.
     */
    0x2000: 'DLL - File is a dynamic-link library (DLL), not a program',
    /** The file should be run only on a uniprocessor machine. */
    0x4000: 'UP_SYSTEM_ONLY - The file should be run only on a uniprocessor machine.',
    /** Big endian: the MSB precedes the LSB in memory. This flag is deprecated and should be zero. */
    0x8000: 'BYTES_REVERSED_HI - Big endian: the MSB precedes the LSB in memory. (deprecated)'
}

export enum IMAGE_SIGNATURE {
    /** 0x4D5A = MZ */
    DOS_SIGNATURE = 0x4D5A0000,
    /** 0x4E45 = NE */
    OS2_SIGNATURE = 0x4E450000,
    /** 0x4C45 = NE LE */
    OS2_LE_SIGNATURE = 0x4C450000,
    /** 0x5045 = PE00 */
    NT_SIGNATURE = 0x50450000
}

export enum IMAGE_OPTIONAL_HEADER_SIZE {
    /** 0x00E0 = 224 for 32bit */
    $32_BIT = 0x00E0,
    /** 0x00F0 = 240 for 64bit */
    $64_BIT = 0x00F0
}

export function IMAGE_FILE_HEADER(values?: Partial<IMAGE_FILE_HEADER>): IMAGE_FILE_HEADER {
    return {
        ntSig: Uint8Array.from([0x00, 0x00]),
        wMachine: 0x0000,
        wNumberOfSections: 0x0000,
        dwTimeDateStamp: 0x00000000,
        dwPointerToSymbolTable: 0x00000000,
        dwNumberOfSymbols: 0x00000000,
        wSizeOfOptionalHeader: 0x0000,
        wCharacteristics: 0x0000,
        ...values
    };
}

export class ImageFileHeader {

    private struct: IMAGE_FILE_HEADER;
    constructor(struct: IMAGE_FILE_HEADER) {
        this.struct = IMAGE_FILE_HEADER(struct);
    }

    public getSignature(): string {
        return this.struct.ntSig.reduce((str, b) => str + b.toString(16).padStart(2, "0"), '');
    }

    public getMachine() {
        const meaning = this.struct.wMachine in MachineLookup ? MachineLookup[this.struct.wMachine as 0x14c] : 'Unknown';
        return { value: this.struct.wMachine.toString(16).padStart(4, "0"), meaning };
    }

    public getNumberOfSections(): number {
        return this.struct.wNumberOfSections;
    }

    public getTimeDateStamp(): string {
        return new Date(this.struct.dwTimeDateStamp * 1000).toISOString();
    }

    public getPointerToSymbolTable(): string {
        return this.struct.dwPointerToSymbolTable.toString(16).padStart(8, "0");
    }

    public getNumberOfSymbols(): number {
        return this.struct.dwNumberOfSymbols;
    }

    public getSizeOfOptionalHeader(): IMAGE_OPTIONAL_HEADER_SIZE {
        return this.struct.wSizeOfOptionalHeader;
    }

    public getCharacteristics() {
        const value = this.struct.wCharacteristics.toString(16).padStart(4, "0");
        const meaning: string[] = [];
        for (const key in FileHeaderImageCharacteristicsLookup) {
            if ((this.struct.wCharacteristics & parseInt(key)) !== 0) {
                meaning.push(`(0x${parseInt(key).toString(16).padStart(4, "0")}) ${FileHeaderImageCharacteristicsLookup[key]}`);
            }
        }
        return { value, meaning };
    }

    public is32Bit(): boolean {
        return this.struct.wSizeOfOptionalHeader === IMAGE_OPTIONAL_HEADER_SIZE.$32_BIT;
    }

    public is64Bit(): boolean {
        return this.struct.wSizeOfOptionalHeader === IMAGE_OPTIONAL_HEADER_SIZE.$64_BIT;
    }

    public getStruct(): IMAGE_FILE_HEADER {
        return this.struct;
    }

    public toObject() {
        return {
            ntSignature: this.getSignature(),
            machine: this.getMachine(),
            numberOfSections: this.getNumberOfSections(),
            timeDateStamp: this.getTimeDateStamp(),
            pointerToSymbolTable: this.getPointerToSymbolTable(),
            numberOfSymbols: this.getNumberOfSymbols(),
            sizeOfOptionalHeader: this.getSizeOfOptionalHeader(),
            characteristics: this.getCharacteristics()
        };
    }
}
