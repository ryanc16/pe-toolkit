import { DataTypes } from './data-types';
import { ImageResourceDirectory } from './image-resource-directory';


export type EntryType = ImageResourceDirectory | (() => Uint8Array);

/**
 * A directory entry can either point at a subdirectory (that is, to another IMAGE_RESOURCE_DIRECTORY),
 * or it can point to the raw data for a resource.
 * Generally, there are at least three directory levels before you get to the actual raw resource data.
 * The top-level directory (of which there's only one) is always found at the beginning of the resource section (.rsrc).
 * The subdirectories of the top-level directory correspond to the various types of resources found in the file.
 * For example, if a PE file includes dialogs, string tables, and menus, there will be three subdirectories: a dialog directory,
 * a string table directory, and a menu directory. Each of these type subdirectories will in turn have ID subdirectories.
 * There will be one ID subdirectory for each instance of a given resource type.
 * In the above example, if there are three dialog boxes, the dialog directory will have three ID subdirectories.
 * Each ID subdirectory will have either a string name (such as "MyDialog") or the integer ID used to identify the resource in the RC file.
 */
export interface IMAGE_RESOURCE_DIRECTORY_ENTRY {
    /**
     * This field contains either an integer ID or a pointer to a structure that contains a string name.
     * If the high bit (0x80000000) is zero, this field is interpreted as an integer ID.
     * If the high bit is nonzero, the lower 31 bits are an offset (relative to the start of the resources)
     * to an IMAGE_RESOURCE_DIR_STRING_U structure.
     * This structure contains a WORD character count, followed by a UNICODE string with the resource name.
     * Yes, even PE files intended for non-UNICODE Win32 implementations use UNICODE here.
     * To convert the UNICODE string to an ANSI string, use the WideCharToMultiByte function.
     */
    dwName: DataTypes.DWORD;
    /**
     * This field is either an offset to another resource directory or a pointer to information about a specific resource instance.
     * If the high bit (0x80000000) is set, this directory entry refers to a subdirectory.
     * The lower 31 bits are an offset (relative to the start of the resources) to another IMAGE_RESOURCE_DIRECTORY.
     * If the high bit isn't set, the lower 31 bits point to an IMAGE_RESOURCE_DATA_ENTRY structure.
     * The IMAGE_RESOURCE_DATA_ENTRY structure contains the location of the resource's raw data, its size, and its code page.
     */
    dwOffsetToData: DataTypes.DWORD;
}

export function IMAGE_RESOURCE_DIRECTORY_ENTRY(values?: Partial<IMAGE_RESOURCE_DIRECTORY_ENTRY>): IMAGE_RESOURCE_DIRECTORY_ENTRY {
    return {
        dwName: 0x00000000,
        dwOffsetToData: 0x00000000,
        ...values
    };
}

export class ImageResourceDirectoryEntry {

    private struct: IMAGE_RESOURCE_DIRECTORY_ENTRY;
    private _isLeaf: boolean;
    private value: EntryType | undefined;

    constructor(values: IMAGE_RESOURCE_DIRECTORY_ENTRY) {
        this.struct = IMAGE_RESOURCE_DIRECTORY_ENTRY(values);
        this._isLeaf = false
        if (this.struct.dwOffsetToData - 0x80000000 > 0) {
            this.struct.dwOffsetToData -= 0x80000000;
        } else {
            this._isLeaf = true;
        }
    }

    public isLeaf(): boolean {
        return this._isLeaf;
    }

    public setDir(dir: ImageResourceDirectory): void {
        this.value = dir;
    }

    public setValue(value: () => Uint8Array): void {
        this.value = value;
    }

    public getValue(): () => Uint8Array {
        return this.value as () => Uint8Array;
    }

    public getEntries(): Record<string | number, ImageResourceDirectory> | (() => Uint8Array) {
        const obj: Record<string | number, ImageResourceDirectory> = {};
        if (this.value instanceof ImageResourceDirectory) {
            Object.assign(obj, this.value.getEntries());
        } else {
            return this.value!;
        }
        return obj;
    }

    public getOffsetToData(): string {
        return this.struct.dwOffsetToData.toString(16).padStart(8, "0");
    }

    public getName(): string {
        return this.struct.dwName + '';
    }

    public getStruct(): IMAGE_RESOURCE_DIRECTORY_ENTRY {
        return this.struct;
    }

    public toObject() {
        if (this.value instanceof ImageResourceDirectory) {
            return this.value.toObject();
        } else {
            return {
                offsetToData: this.getOffsetToData(),
                isDirectory: !this.isLeaf(),
                value: 'Uint8Array(' + (this.value as () => Uint8Array)().length + ')'
            };
        }
    }
}
