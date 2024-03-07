import { DataTypes } from './data-types';

export interface IMAGE_RESOURCE_DIRECTORY_DATA_ENTRY {
    dwOffsetToData: DataTypes.DWORD;
    dwSize: DataTypes.DWORD;
    dwCodePage: DataTypes.DWORD;
    dwReserved: DataTypes.DWORD;
}

export function IMAGE_RESOURCE_DIRECTORY_DATA_ENTRY(values?: Partial<IMAGE_RESOURCE_DIRECTORY_DATA_ENTRY>): IMAGE_RESOURCE_DIRECTORY_DATA_ENTRY {
    return {
        dwOffsetToData: 0x00000000,
        dwSize: 0x00000000,
        dwCodePage: 0x00000000,
        dwReserved: 0x00000000,
        ...values
    };
}

export class ImageResourceDirectoryDataEntry {

    private struct: IMAGE_RESOURCE_DIRECTORY_DATA_ENTRY;
    private dataFactory: () => Uint8Array;

    constructor(values: IMAGE_RESOURCE_DIRECTORY_DATA_ENTRY) {
        this.struct = IMAGE_RESOURCE_DIRECTORY_DATA_ENTRY(values);
        this.dataFactory = () => new Uint8Array();
    }

    public setDataFactory(data: () => Uint8Array) {
        this.dataFactory = data;
    }

    public getDataFactory(): () => Uint8Array {
        return this.dataFactory;
    }

    public getData(): Uint8Array {
        return this.dataFactory();
    }

    public getStruct(): IMAGE_RESOURCE_DIRECTORY_DATA_ENTRY {
        return this.struct;
    }
}
