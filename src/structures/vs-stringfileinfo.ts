import { DataSize, DataTypes, WordString } from "./data-types";
import { StringTable, STRING_TABLE } from "./string-table";
import { StringTable_structure } from "./vs-stringtable";

/**
 * The StringFileInfo structure defined here: https://docs.microsoft.com/en-us/windows/win32/menurc/stringfileinfo
 */
export const StringFileInfo_structure = {
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
        value: 'StringFileInfo'
    },
    Padding: {
        byteSize: DataSize.WORD
    },
    Children: {
        byteSize: StringTable_structure
    }
};

export interface STRING_FILE_INFO {
    wLength: DataTypes.WORD;
    wValueLength: DataTypes.WORD;
    wType: DataTypes.WORD;
    szKey: WordString;
}

export function STRING_FILE_INFO(values?: Partial<STRING_FILE_INFO>): STRING_FILE_INFO {
    return {
        wLength: 0x0000,
        wValueLength: 0x0000,
        wType: 0x0000,
        szKey: '',
        ...values
    };
}

export class StringFileInfo {

    private struct: STRING_FILE_INFO;
    private stringTables: Record<string, StringTable>;

    constructor(values: STRING_FILE_INFO) {
        this.struct = STRING_FILE_INFO(values);
        this.stringTables = {};
    }

    public addStringTable(stringTable: StringTable) {
        this.stringTables[stringTable.getKey()] = stringTable;
    }

    public getStringTables(): Record<string, StringTable> {
        return this.stringTables;
    }

    public getStruct(): STRING_TABLE {
        return this.struct;
    }

    public toObject() {
        const obj: Record<string, any> = {};
        for (const key in this.stringTables) {
            obj[key] = this.stringTables[key].getEntries().reduce((record: Record<string, string>, entry) => { record[entry.getKey()] = entry.getValue(); return record; }, {});
        }
        return obj;
    }
}
