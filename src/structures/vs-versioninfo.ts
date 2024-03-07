import { DataSize, DataTypes, WordString } from "./data-types";
import { FixedFileInfo, VS_FIXEDFILEINFO_structure } from "./vs-fixedfileinfo";
import { StringFileInfo, StringFileInfo_structure } from "./vs-stringfileinfo";
import { VarFileInfo, VarFileInfo_structure } from "./vs-varfileinfo";

/**
 * The VS_VERSIONINFO structure defined here: https://docs.microsoft.com/en-us/windows/win32/menurc/vs-versioninfo
 */
export const VS_VERSIONINFO_structure = {
    wLength: {
        byteSize: DataSize.WORD
    },
    wValueLength: {
        byteSize: DataSize.WORD
    },
    wType: {
        byteSize: DataSize.WORD
    },
    szKey: {
        byteSize: DataSize.WCHAR,
        value: 'VS_VERSION_INFO'
    },
    Padding1: {
        byteSize: DataSize.WORD
    },
    Value: {
        byteSize: VS_FIXEDFILEINFO_structure
    },
    Padding2: {
        byteSize: DataSize.WORD
    },
    Children: {
        byteSize: DataSize.WORD,
        StringFileInfo: StringFileInfo_structure,
        VarFileInfo: VarFileInfo_structure
    }
};

export interface VS_VERSIONINFO {
    wLength: DataTypes.WORD;
    wValueLength: DataTypes.WORD;
    wType: DataTypes.WORD;
    szKey: WordString;
}

export function VS_VERSIONINFO(values?: Partial<VS_VERSIONINFO>): VS_VERSIONINFO {
    return {
        wLength: 0x0000,
        wValueLength: 0x0000,
        wType: 0x0000,
        szKey: '',
        ...values
    }
}

export class VsVersionInfo {

    private struct: VS_VERSIONINFO;

    private fixedFileInfo: FixedFileInfo | undefined;
    private stringFileInfo: StringFileInfo | undefined;
    private varFileInfo: VarFileInfo | undefined;

    constructor(values: VS_VERSIONINFO) {
        this.struct = VS_VERSIONINFO(values);
    }

    public setFixedFileInfo(fixedFileInfo: FixedFileInfo): void {
        this.fixedFileInfo = fixedFileInfo;
    }

    public getFixedFileInfo(): FixedFileInfo | undefined {
        return this.fixedFileInfo;
    }

    public setStringFileInfo(stringFileInfo: StringFileInfo): void {
        this.stringFileInfo = stringFileInfo;
    }

    public getStringFileInfo(): StringFileInfo | undefined {
        return this.stringFileInfo;
    }

    public setVarFileInfo(varFileInfo: VarFileInfo): void {
        this.varFileInfo = varFileInfo;
    }

    public getVarFileInfo(): VarFileInfo | undefined {
        return this.varFileInfo;
    }

    public getStruct(): VS_VERSIONINFO {
        return this.struct;
    }

    public toObject() {
        return {
            fixedFileInfo: this.fixedFileInfo?.toObject(),
            stringFileInfo: this.stringFileInfo?.toObject(),
            varFileInfo: this.varFileInfo?.toObject()
        };
    }
}
