import { DataSize, DataTypes, WordString } from "./data-types";
import { VarFileInfoVar, Var_structure } from "./vs-var";

/**
 * The VarFileInfo structure defined here: https://docs.microsoft.com/en-us/windows/win32/menurc/varfileinfo
 */
export const VarFileInfo_structure = {
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
        value: 'VarFileInfo'
    },
    Padding: {
        byteSize: DataSize.WORD
    },
    Children: {
        byteSize: Var_structure
    }
};

export interface VAR_FILE_INFO {
    wLength: DataTypes.WORD;
    wValueLength: DataTypes.WORD;
    wType: DataTypes.WORD;
    szKey: WordString;
}

export function VAR_FILE_INFO(values?: Partial<VAR_FILE_INFO>): VAR_FILE_INFO {
    return {
        wLength: 0x0000,
        wValueLength: 0x0000,
        wType: 0x0000,
        szKey: '',
        ...values
    };
}

export class VarFileInfo {

    private struct: VAR_FILE_INFO;
    private entries: VarFileInfoVar[];

    constructor(values: VAR_FILE_INFO) {
        this.struct = VAR_FILE_INFO(values);
        this.entries = [];
    }

    public getKey(): string {
        return this.struct.szKey;
    }

    public getLength(): number {
        return this.struct.wLength;
    }

    public addEntry(entry: VarFileInfoVar) {
        this.entries.push(entry);
    }

    public getEntries(): VarFileInfoVar[] {
        return this.entries;
    }

    public getVar(name: string): VarFileInfoVar | undefined {
        return this.entries.find(entry => entry.getKey() === name);
    }

    public getStruct(): VAR_FILE_INFO {
        return this.struct;
    }

    public toObject() {
        const varTable: Record<string, { languageId: string; codePageId: string }[]> = {};
        for (const entry of this.entries) {
            const obj = entry.toObject();
            Object.assign(varTable, obj);
        }
        return varTable;
    }
}
