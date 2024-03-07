import { DataTypes, WordString } from "./data-types";


export interface STRING_TABLE_ENTRY {
    wLength: DataTypes.WORD;
    wValueLength: DataTypes.WORD;
    /** 0x0000 = BINARY data, 0x0001 = TEXT data */
    wType: DataTypes.WORD;
    szKey: WordString;
}

export function STRING_TABLE_ENTRY(values?: Partial<STRING_TABLE_ENTRY>): STRING_TABLE_ENTRY {
    return {
        wLength: 0x0000,
        wValueLength: 0x0000,
        wType: 0x0000,
        szKey: '',
        ...values
    };
}

export class StringTableEntry {

    private struct: STRING_TABLE_ENTRY;
    private key: string;
    private value: string;

    constructor(values: STRING_TABLE_ENTRY) {
        this.struct = STRING_TABLE_ENTRY(values);
        this.key = this.struct.szKey;
        this.value = '';
    }

    public getLength(): number {
        return this.struct.wLength;
    }

    public getType(): number {
        return this.struct.wType;
    }

    public isValueBinary(): boolean {
        return this.struct.wType === 0;
    }

    public isValueUtf16(): boolean {
        return this.struct.wType === 1;
    }

    public getValueLength(): number {
        return this.struct.wValueLength;
    }

    public getKey(): string {
        return this.key;
    }

    public setValue(value: string) {
        this.value = value;
    }

    public getValue(): string {
        return this.value;
    }

    public getStruct(): STRING_TABLE_ENTRY {
        return this.struct;
    }
}
