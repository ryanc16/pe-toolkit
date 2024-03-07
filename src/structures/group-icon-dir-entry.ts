import { DataTypes } from "./data-types";

export interface GROUP_ICON_DIR_ENTRY {
    bWidth: DataTypes.BYTE;
    bHeight: DataTypes.BYTE;
    bColorCount: DataTypes.BYTE;
    bReserved: DataTypes.BYTE;
    wPlanes: DataTypes.WORD;
    wBitCount: DataTypes.WORD;
    dwBytesInRes: DataTypes.DWORD;
    wId: DataTypes.WORD;
}

export function GROUP_ICON_DIR_ENTRY(values?: Partial<GROUP_ICON_DIR_ENTRY>): GROUP_ICON_DIR_ENTRY {
    return {
        bWidth: 0x00,
        bHeight: 0x00,
        bColorCount: 0x00,
        bReserved: 0x00,
        wPlanes: 0x0000,
        wBitCount: 0x0000,
        dwBytesInRes: 0x00000000,
        wId: 0x0000,
        ...values
    }
}

export class GroupIconDirEntry {

    private struct: GROUP_ICON_DIR_ENTRY;
    constructor(values: GROUP_ICON_DIR_ENTRY) {
        this.struct = GROUP_ICON_DIR_ENTRY(values);
    }

    public getWidth(): number {
        return this.struct.bWidth;
    }

    public getHeight(): number {
        return this.struct.bHeight;
    }

    public getColorCount(): number {
        return this.struct.bColorCount === 0 ? 256 : this.struct.bColorCount;
    }

    public getReservedByte(): number {
        return this.struct.bReserved;
    }

    public getPlanes(): number {
        return this.struct.wPlanes;
    }

    public getBitCount(): number {
        return this.struct.wBitCount;
    }

    public getByteLength(): number {
        return this.struct.dwBytesInRes;
    }

    public getId(): number {
        return this.struct.wId;
    }

    public getStruct(): GROUP_ICON_DIR_ENTRY {
        return this.struct;
    }

    public toObject() {
        return {
            id: this.getId(),
            size: this.getByteLength(),
            width: this.getWidth(),
            height: this.getHeight(),
            colorCount: this.getColorCount(),
            planes: this.getPlanes(),
            bitCount: this.getBitCount()
        };
    }
}
