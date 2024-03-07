import { ImageImportDirectoryTableEntry, IMAGE_IMPORT_DIRECTORY_TABLE_ENTRY } from "./image-import-directory-table-entry";

export interface IMAGE_IMPORT_DIRECTORY_TABLE extends Array<IMAGE_IMPORT_DIRECTORY_TABLE_ENTRY> { }

export class ImageImportDirectoryTable {

    private entries: ImageImportDirectoryTableEntry[];

    constructor() {
        this.entries = [];
    }

    public addEntry(entry: ImageImportDirectoryTableEntry): void {
        this.entries.push(entry);
    }

    public getEntries(): ImageImportDirectoryTableEntry[] {
        return this.entries;
    }

    public toObject() {
        return this.entries.map(e => e.toObject());
    }
}
