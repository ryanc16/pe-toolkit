import { ImageDataDirectoryEntry, IMAGE_DATA_DIRECTORY_ENTRY } from "./image-data-directory-entry";


export class ImageDataDirectoryTable {

    private entries: Record<IMAGE_DATA_DIRECTORY_TYPES, ImageDataDirectoryEntry>;

    constructor() {
        this.entries = {} as any;
        for (const type in IMAGE_DATA_DIRECTORY_TYPES) {
            if (typeof type === 'number') {
                this.entries[type as IMAGE_DATA_DIRECTORY_TYPES] = new ImageDataDirectoryEntry(IMAGE_DATA_DIRECTORY_ENTRY());
            }
        }
    }

    public addEntry(type: IMAGE_DATA_DIRECTORY_TYPES, entry: ImageDataDirectoryEntry): void {
        this.entries[type] = entry;
    }

    public getEntries(): Record<IMAGE_DATA_DIRECTORY_TYPES, ImageDataDirectoryEntry> {
        return this.entries;
    }

    public getEntry(type: IMAGE_DATA_DIRECTORY_TYPES): ImageDataDirectoryEntry | undefined {
        return this.entries[type];
    }

    toObject() {
        const obj: Record<string, ReturnType<ImageDataDirectoryEntry['toObject']>> = {};
        for (const type in this.entries) {
            const int_type = parseInt(type) as IMAGE_DATA_DIRECTORY_TYPES;
            obj[IMAGE_DATA_DIRECTORY_TYPES[int_type]] = this.entries[int_type].toObject();
        }
        return obj;
    }
}

export enum IMAGE_DATA_DIRECTORY_TYPES {
    /** Export table */
    EXPORT = 0,
    /** Import table */
    IMPORT = 1,
    /** Resource table */
    RESOURCE = 2,
    /** Exception table */
    EXCEPTION = 3,
    /** Attribute authentication table */
    SECURITY = 4,
    /** Base relocation table */
    BASERELOC = 5,
    /** Debug data */
    DEBUG = 6,
    /** Architecture-specific data */
    COPYRIGHT = 7,
    /** Global pointer register */
    GLOBALPTR = 8,
    /** Thread local storage table */
    TLS = 9,
    /** Load configuration table */
    LOAD_CONFIG = 10,
    /** Bound import table */
    BOUND_IMPORT = 11,
    /** Import Address Table */
    IMPORT_ADDR = 12,
    /** Delay import descriptor */
    DID = 13,
    /** Reserve */
    RES1 = 14,
    /** Reserve */
    RES2 = 15
}
