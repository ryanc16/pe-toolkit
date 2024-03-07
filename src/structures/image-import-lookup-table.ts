import { DataTypes } from "./data-types";

/**
 * https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#import-lookup-table
 */
interface IMAGE_IMPORT_LOOKUP_TABLE {
    ordinalNameFlag: boolean;
    ordinalNumber: DataTypes.WORD;
    hintNameTableRva: DataTypes.DWORD;
}

function IMAGE_IMPORT_LOOKUP_TABLE(values?: Partial<IMAGE_IMPORT_LOOKUP_TABLE>): IMAGE_IMPORT_LOOKUP_TABLE {
    return {
        ordinalNameFlag: false,
        ordinalNumber: 0x0000,
        hintNameTableRva: 0x00000000,
        ...values
    };
}

export class ImageImportLookupTable {

    private value: DataTypes.DWORD;

    constructor(value: number) {
        this.value = value;
    }

    public isOrdinal(): boolean {
        return this.value - 0x80000000 > 0;
    }

    public getOrdinalNumber(): DataTypes.WORD {
        return this.value - 0x80000000;
    }

    public getHintNameTableRva(): DataTypes.DWORD {
        return this.value;
    }

    public getStruct() {
        return this.value;
    }

    public toObject(): IMAGE_IMPORT_LOOKUP_TABLE {
        return {
            ordinalNameFlag: this.isOrdinal(),
            ordinalNumber: this.isOrdinal() ? this.getOrdinalNumber() : 0,
            hintNameTableRva: this.isOrdinal() ? 0 : this.getHintNameTableRva()
        };
    }
}
