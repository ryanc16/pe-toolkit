import { DataTypes, WordString } from './data-types';
import { StringTableEntry } from './string-table-entry';

export interface STRING_TABLE {
    wLength: DataTypes.WORD;
    wValueLength: DataTypes.WORD;
    wType: DataTypes.WORD;
    szKey: WordString;
}
export function STRING_TABLE(values?: Partial<STRING_TABLE>): STRING_TABLE {
    return {
        wLength: 0x0000,
        wValueLength: 0x0000,
        wType: 0x0000,
        szKey: '',
        ...values
    };
}

export class StringTable {

    private struct: STRING_TABLE;
    private entries: StringTableEntry[];

    constructor(values: STRING_TABLE) {
        this.struct = STRING_TABLE(values);
        this.entries = [];
    }

    public getKey(): string {
        return this.struct.szKey;
    }

    public getLength(): number {
        return this.struct.wLength;
    }

    public addEntry(entry: StringTableEntry) {
        this.entries.push(entry);
    }

    public getEntries() {
        return this.entries;
    }

    public getStruct(): STRING_TABLE {
        return this.struct;
    }

    public toObject() {
        return this.entries.reduce((map: Record<string, string>, entry) => { map[entry.getKey()] = entry.getValue(); return map; }, {});
    }
}
