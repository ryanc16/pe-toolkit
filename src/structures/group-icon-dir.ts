import { DataTypes } from "./data-types";
import { GroupIconDirEntry } from "./group-icon-dir-entry";

export interface GROUP_ICON_DIR {
    wReserved: DataTypes.WORD;
    wType: DataTypes.WORD;
    wCount: DataTypes.WORD;
}

export function GROUP_ICON_DIR(values?: Partial<GROUP_ICON_DIR>): GROUP_ICON_DIR {
    return {
        wReserved: 0x0000,
        wType: 0x0000,
        wCount: 0x0000,
        ...values
    };
}

export class GroupIconDir {
    private struct: GROUP_ICON_DIR;
    private entries: GroupIconDirEntry[];

    constructor(values: GROUP_ICON_DIR) {
        this.struct = GROUP_ICON_DIR(values);
        this.entries = [];
    }

    public addEntry(entry: GroupIconDirEntry): void {
        this.entries.push(entry);
    }

    public getEntries(): GroupIconDirEntry[] {
        return this.entries;
    }

    public getStruct(): GROUP_ICON_DIR {
        return this.struct;
    }
}
