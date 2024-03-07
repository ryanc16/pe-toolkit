import { DataTypes } from "./data-types";

export interface IMAGE_DATA_DIRECTORY_ENTRY {
    dwVirtualAddress: DataTypes.DWORD;
    dwSize: DataTypes.DWORD;
}
export function IMAGE_DATA_DIRECTORY_ENTRY(values?: Partial<IMAGE_DATA_DIRECTORY_ENTRY>): IMAGE_DATA_DIRECTORY_ENTRY {
    return {
        dwVirtualAddress: 0x00000000,
        dwSize: 0x00000000,
        ...values
    };
}

export class ImageDataDirectoryEntry {
    private struct: IMAGE_DATA_DIRECTORY_ENTRY;

    constructor(struct: IMAGE_DATA_DIRECTORY_ENTRY) {
        this.struct = IMAGE_DATA_DIRECTORY_ENTRY(struct);
    }

    public getVirtualAddress(): string {
        return this.struct.dwVirtualAddress.toString(16).padStart(8, "0");
    }

    public getSize(): DataTypes.DWORD {
        return this.struct.dwSize;
    }

    public getStruct(): IMAGE_DATA_DIRECTORY_ENTRY {
        return this.struct;
    }

    public toObject() {
        return {
            virtualAddress: this.getVirtualAddress(),
            size: this.getSize()
        };
    }
}
