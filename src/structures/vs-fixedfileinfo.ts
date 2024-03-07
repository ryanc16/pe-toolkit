import { DataSize, DataTypes } from "./data-types";
import { Flags } from "./flags";

/**
 * The VS_FIXEDFILEINFO structure defined here: https://docs.microsoft.com/en-us/windows/win32/api/verrsrc/ns-verrsrc-vs_fixedfileinfo
 */
export const VS_FIXEDFILEINFO_structure = {
    dwSignature: {
        byteSize: DataSize.DWORD,
        value: Uint8Array.of(0xbd, 0x04, 0xef, 0xfe)
    },
    dwStrucVersion: {
        byteSize: DataSize.DWORD
    },
    dwFileVersionMS: {
        byteSize: DataSize.DWORD
    },
    dwFileVersionLS: {
        byteSize: DataSize.DWORD
    },
    dwProductVersionMS: {
        byteSize: DataSize.DWORD
    },
    dwProductVersionLS: {
        byteSize: DataSize.DWORD
    },
    dwFileFlagsMask: {
        byteSize: DataSize.DWORD
    },
    dwFileFlags: {
        byteSize: DataSize.DWORD
    },
    dwFileOS: {
        byteSize: DataSize.DWORD
    },
    dwFileType: {
        byteSize: DataSize.DWORD
    },
    dwFileSubtype: {
        byteSize: DataSize.DWORD
    },
    dwFileDateMS: {
        byteSize: DataSize.DWORD
    },
    dwFileDateLS: {
        byteSize: DataSize.DWORD
    }
}

export interface VS_FIXED_FILE_INFO {
    /** 4 BYTES */
    dwSignature: Uint8Array;
    /** 2 WORDS */
    dwStrucVersion: Uint16Array;
    dwFileVersionLS: DataTypes.WORD;
    dwFileVersionMS: DataTypes.WORD;
    dwProductVersionLS: DataTypes.WORD;
    dwProductVersionMS: DataTypes.WORD;
    dwFileFlagsMask: DataTypes.DWORD;
    dwFileFlags: DataTypes.DWORD;
    dwFileOS: DataTypes.DWORD;
    dwFileType: DataTypes.DWORD;
    dwFileSubtype: DataTypes.DWORD;
    dwFileDateLS: DataTypes.WORD;
    dwFileDateMS: DataTypes.WORD;
}

export function VS_FIXED_FILE_INFO(values?: Partial<VS_FIXED_FILE_INFO>): VS_FIXED_FILE_INFO {
    return {
        dwSignature: new Uint8Array([0x00, 0x00, 0x00, 0x00]),
        dwStrucVersion: new Uint16Array([0x0000, 0x0000]),
        dwFileVersionLS: 0x00000000,
        dwFileVersionMS: 0x00000000,
        dwProductVersionLS: 0x00000000,
        dwProductVersionMS: 0x00000000,
        dwFileFlagsMask: 0x00000000,
        dwFileFlags: 0x00000000,
        dwFileOS: 0x00000000,
        dwFileType: 0x00000000,
        dwFileSubtype: 0x00000000,
        dwFileDateLS: 0x00000000,
        dwFileDateMS: 0x00000000,
        ...values
    };
}

export class FixedFileInfo {

    private struct: VS_FIXED_FILE_INFO;

    constructor(values: VS_FIXED_FILE_INFO) {
        this.struct = VS_FIXED_FILE_INFO(values);
    }

    public getSignature(): string {
        return this.struct.dwSignature.reduce((str: string, b: number) => str + b.toString(16).padStart(2, "0"), '')
    }

    public getStruct(): VS_FIXED_FILE_INFO {
        return this.struct;
    }

    public toObject() {
        return {
            signature: this.getSignature(),
            strucVersion: this.struct.dwStrucVersion.join('.'),
            fileVersionLS: this.struct.dwFileVersionLS,
            fileVersionMS: this.struct.dwFileVersionMS,
            productVersionLS: this.struct.dwProductVersionLS,
            productVersionMS: this.struct.dwProductVersionMS,
            fileFlagsMask: this.struct.dwFileFlagsMask,
            fileFlags: Flags.parseFileFlags(this.struct.dwFileFlags, this.struct.dwFileFlagsMask),
            fileOS: Flags.parseFileOSFlags(this.struct.dwFileOS),
            fileType: Flags.parseFileType(this.struct.dwFileType),
            fileSubtype: Flags.parseFileSubtype(this.struct.dwFileType, this.struct.dwFileSubtype),
            fileDateLS: this.struct.dwFileDateLS,
            fileDateMS: this.struct.dwFileDateMS
        };
    }
}
