import { DataTypes } from "./data-types";

export interface IMAGE_IMPORT_DIRECTORY_TABLE_ENTRY {
    dwImportLookupTableRva: DataTypes.DWORD;
    dwTimeDateStamp: DataTypes.DWORD;
    dwForwarderChain: DataTypes.DWORD;
    dwModuleNameRva: DataTypes.DWORD;
    dwImportAddressTableRva: DataTypes.DWORD;
}

export function IMAGE_IMPORT_DIRECTORY_TABLE_ENTRY(values?: Partial<IMAGE_IMPORT_DIRECTORY_TABLE_ENTRY>): IMAGE_IMPORT_DIRECTORY_TABLE_ENTRY {
    return {
        dwImportLookupTableRva: 0x00000000,
        dwTimeDateStamp: 0x00000000,
        dwForwarderChain: 0x00000000,
        dwModuleNameRva: 0x00000000,
        dwImportAddressTableRva: 0x00000000,
        ...values
    };
}

export class ImageImportDirectoryTableEntry {
    private struct: IMAGE_IMPORT_DIRECTORY_TABLE_ENTRY;
    private name: string;
    private imports: ImageImportEntry[];

    constructor(values?: Partial<IMAGE_IMPORT_DIRECTORY_TABLE_ENTRY>) {
        this.struct = IMAGE_IMPORT_DIRECTORY_TABLE_ENTRY(values);
        this.name = '';
        this.imports = [];
    }

    public getModuleNameRva(): DataTypes.DWORD {
        return this.struct.dwModuleNameRva;
    }

    public getImportLookupTableRva(): DataTypes.DWORD {
        return this.struct.dwImportLookupTableRva;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public addImportEntry(importEntry: ImageImportEntry): void {
        this.imports.push(importEntry);
    }

    public getImports(): ImageImportEntry[] {
        return this.imports;
    }

    public getStruct(): IMAGE_IMPORT_DIRECTORY_TABLE_ENTRY {
        return this.struct;
    }

    public toObject() {
        return { name: this.name, imports: this.imports.map(i => i.toObject()) };
    }
}

export interface IMAGE_IMPORT_ENTRY {
    name: string | undefined;
    hint: number | undefined;
    ordinal: number | undefined;
}

export class ImageImportEntry {
    private name: string | undefined;
    private hint: number | undefined;
    private ordinal: number | undefined;

    constructor() {
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getName(): string | undefined {
        return this.name;
    }

    public setHint(hint: number): void {
        this.hint = hint;
    }

    public getHint(): number | undefined {
        return this.hint;
    }

    public setOrdinal(ordinal: number): void {
        this.ordinal = ordinal;
    }

    public getOrdinal(): number | undefined {
        return this.ordinal;
    }

    public toObject(): IMAGE_IMPORT_ENTRY {
        return {
            name: this.getName(),
            hint: this.getHint(),
            ordinal: this.getOrdinal()
        };
    }
}

function IMAGE_IMPORT_ENTRY(values?: Partial<IMAGE_IMPORT_ENTRY>): IMAGE_IMPORT_ENTRY {
    return {
        name: undefined,
        hint: undefined,
        ordinal: undefined,
        ...values
    };
}
