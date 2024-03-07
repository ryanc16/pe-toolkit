import { DataTypes } from "./data-types";
import { IMAGE_DATA_DIRECTORY_TYPES } from "./image-data-directory-table";
import { ImageResourceDirectoryEntry } from "./image-resource-directory-entry";

export interface IMAGE_RESOURCE_DIRECTORY {
    /**
     * Theoretically this field could hold flags for the resource, but appears to always be 0.
     */
    dwCharacteristics: DataTypes.DWORD;
    /**
     * The time/date stamp describing the creation time of the resource.
     */
    dwTimeDateStamp: DataTypes.DWORD;
    /**
     * Theoretically these fields would hold a version number for the resource. These field appear to always be set to 0.
     */
    wMajorVersion: DataTypes.WORD;
    /**
     * Theoretically these fields would hold a version number for the resource. These field appear to always be set to 0.
     */
    wMinorVersion: DataTypes.WORD;
    /**
     * The number of array elements that use names and that follow this structure.
     */
    wNumberOfNamedEntries: DataTypes.WORD;
    /**
     * The number of array elements that use integer IDs, and which follow this structure.
     */
    wNumberOfIdEntries: DataTypes.WORD;
}

export function IMAGE_RESOURCE_DIRECTORY(values?: Partial<IMAGE_RESOURCE_DIRECTORY>): IMAGE_RESOURCE_DIRECTORY {
    return {
        dwCharacteristics: 0x00000000,
        dwTimeDateStamp: 0x00000000,
        wMajorVersion: 0x0000,
        wMinorVersion: 0x0000,
        wNumberOfNamedEntries: 0x0000,
        wNumberOfIdEntries: 0x0000,
        ...values
    };
}

export class ImageResourceDirectory {

    private struct: IMAGE_RESOURCE_DIRECTORY;
    /**
     * This field isn't really part of the IMAGE_RESOURCE_DIRECTORY structure. Rather, it's an array of IMAGE_RESOURCE_DIRECTORY_ENTRY
     * structures that immediately follow the IMAGE_RESOURCE_DIRECTORY structure.
     * The number of elements in the array is the sum of the NumberOfNamedEntries and NumberOfIdEntries fields.
     * The directory entry elements that have name identifiers (rather than integer IDs) come first in the array.
     */
    private entries: Record<IMAGE_DATA_DIRECTORY_TYPES.RESOURCE | string | number, ImageResourceDirectoryEntry>;

    constructor(values: IMAGE_RESOURCE_DIRECTORY) {
        this.struct = IMAGE_RESOURCE_DIRECTORY(values);
        this.entries = {};
    }

    public getNumberOfNamedEntries(): number {
        return this.struct.wNumberOfNamedEntries;
    }

    public getNumberOfIdEntries(): number {
        return this.struct.wNumberOfIdEntries;
    }

    public addEntry(entry: ImageResourceDirectoryEntry) {
        this.entries[entry.getStruct().dwName] = entry;
    }

    public getEntries(): Record<IMAGE_DATA_DIRECTORY_TYPES.RESOURCE | string | number, ImageResourceDirectoryEntry> {
        return this.entries;
    }

    public hasResourcesForKey(key: IMAGE_DATA_DIRECTORY_TYPES.RESOURCE | string | number): boolean {
        return key in this.entries;
    }

    public getResourcesForKey(key: IMAGE_DATA_DIRECTORY_TYPES.RESOURCE | string | number): ImageResourceDirectoryEntry {
        return this.entries[key];
    }

    public getStruct(): IMAGE_RESOURCE_DIRECTORY {
        return this.struct;
    }

    // @ts-ignore
    public toObject() {
        // @ts-ignore
        const obj: Record<string | number, Record<string | number, any>> = {};
        for (const id1 in this.entries) {
            const entry1 = this.entries[id1];
            const entries2 = entry1.getEntries();
            if (typeof entries2 === 'object') {
                obj[id1] = {};
                for (const id2 in entries2) {
                    const entry2 = entries2[id2];
                    if (entry2 instanceof ImageResourceDirectoryEntry) {
                        const entryObj = (entry2 as ImageResourceDirectoryEntry).toObject();
                        obj[id1][id2] = entryObj;
                    }
                }
            } else {
                obj[id1] = entries2;
            }
        }
        return obj;
    }
}

/**
 * https://lief-project.github.io/doc/latest/api/python/pe.html#resource-types
 */
export enum RT_RESOURCE_TYPES {
    /** Hardware-dependent cursor resource. */
    RT_CURSOR = 1,
    /** Bitmap resource. */
    RT_BITMAP = 2,
    /** Hardware-dependent icon resource. */
    RT_ICON = 3,
    /** Menu resource. */
    RT_MENU = 4,
    /** Dialog box. */
    RT_DIALOG = 5,
    /** String-table entry. */
    RT_STRING = 6,
    /** Font directory resource. */
    RT_FONTDIR = 7,
    /** Font resource. */
    RT_FONT = 8,
    /** Accelerator table. */
    RT_ACCELERATOR = 9,
    /** Application-defined resource (raw data). */
    RT_RCDATA = 10,
    /** Message-table entry. */
    RT_MESSAGETABLE = 11,
    /** Hardware-independent cursor resource. RT_CURSOR + 11 */
    RT_GROUP_CURSOR = 12,
    /** Hardware-independent cursor resource. RT_ICON + 11 */
    RT_GROUP_ICON = 14,
    /** Version resource. */
    RT_VERSION = 16,
    /** Allows a resource editing tool to associate a string with an .rc file.
     * Typically, the string is the name of the header file that provides symbolic names.
     * The resource compiler parses the string but otherwise ignores the value. For example, `1 DLGINCLUDE "MyFile.h"` */
    RT_DLGINCLUDE = 17,
    /** Plug and Play resource. */
    RT_PLUGPLAY = 19,
    /** VXD. */
    RT_VXD = 20,
    /** Animated cursor. */
    RT_ANICURSOR = 21,
    /** Animated icon. */
    RT_ANIICON = 22,
    /** HTML resource. */
    RT_HTML = 23,
    /** Side-by-Side Assembly Manifest. */
    RT_MANIFEST = 24
};
