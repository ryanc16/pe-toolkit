import * as fs from 'fs';
import { Icon } from './res/icon';
import { Manifest } from './res/manifest';
import {
    FixedFileInfo, GroupIconDir, GroupIconDirEntry, GROUP_ICON_DIR, GROUP_ICON_DIR_ENTRY,
    ImageDataDirectoryEntry, ImageDataDirectoryTable, ImageDos, ImageDosHeader, ImageFileHeader, ImageImportDirectoryTable,
    ImageImportDirectoryTableEntry, ImageImportEntry, ImageImportLookupTable, ImageOptionalHeader,
    ImageResourceDirectoryDataEntry, ImageResourceDirectory, ImageResourceDirectoryEntry, ImageSectionHeader,
    IMAGE_DATA_DIRECTORY_ENTRY, IMAGE_DATA_DIRECTORY_TYPES, IMAGE_DOS_HEADER, IMAGE_FILE_HEADER,
    IMAGE_IMPORT_DIRECTORY_TABLE_ENTRY, IMAGE_OPTIONAL_HEADER, IMAGE_RESOURCE_DIRECTORY_DATA_ENTRY,
    IMAGE_RESOURCE_DIRECTORY, IMAGE_RESOURCE_DIRECTORY_ENTRY, IMAGE_SECTION_HEADER, RT_RESOURCE_TYPES,
    StringFileInfo, StringTable, StringTableEntry, STRING_FILE_INFO, STRING_TABLE, STRING_TABLE_ENTRY,
    VarFileInfo, VarFileInfoVar, VAR_FILE_INFO, VAR_FILE_INFO_VAR, VsVersionInfo, VS_FIXED_FILE_INFO,
    VS_VERSIONINFO
} from './structures';
import { DataSize, DataTypes } from './structures/data-types';
import { LanguageId, LanguagePack } from './structures/languages';
import { BufferReader } from './utils/buffer-reader';
import { FileStreamReader } from './utils/file-stream-reader';
import { Optional } from './utils/optional';

type ResourceType<T> =
    T extends RT_RESOURCE_TYPES.RT_STRING ? Record<string | number, Partial<Record<LanguageId, string[]>>> :
    T extends RT_RESOURCE_TYPES.RT_GROUP_ICON ? Record<string | number, Partial<Record<LanguageId, GroupIconDirEntry[]>>> :
    T extends RT_RESOURCE_TYPES.RT_ICON ? Record<string | number, Partial<Record<LanguageId, Icon>>> :
    T extends RT_RESOURCE_TYPES.RT_VERSION ? Record<string | number, Partial<Record<LanguageId, VsVersionInfo>>> :
    T extends RT_RESOURCE_TYPES.RT_MANIFEST ? Record<string | number, Record<string | number, Manifest>> :
    T extends RT_RESOURCE_TYPES ? Record<string | number, Partial<Record<LanguageId, any>>> :
    T extends string ? Record<string | number, Partial<Record<LanguageId, any>>> | undefined :
    never;

export class PeFileParser {
    private imageDos: Optional<ImageDos>;
    private buff: BufferReader | FileStreamReader;
    private resources: ImageResourceDirectory | undefined;
    private defaultLanguage: LanguageId | undefined;
    public static RT_RESOURCE_TYPES = RT_RESOURCE_TYPES;

    constructor() {
        this.imageDos = Optional.empty();
        this.buff = new BufferReader(new Uint8Array());
    }

    public setDefaultLanguage(languageId: LanguageId | undefined) {
        this.defaultLanguage = languageId;
    }

    public parseBytes(data: Uint8Array | ArrayBuffer): void {
        this.buff = new BufferReader(new Uint8Array(data));
        this.parse();
    }

    public parseFile(fd: ReturnType<typeof fs.openSync>): void {
        this.buff = new FileStreamReader(fd);
        this.parse();
    }

    public getImage() {
        return this.imageDos;
    }

    public getDosHeader(): ImageDosHeader {
        return this.imageDos.getOrElseThrow().getDosHeader();
    }

    public getFileHeader(): ImageFileHeader {
        return this.imageDos.getOrElseThrow().getFileHeader();
    }

    public getOptionalHeader(): ImageOptionalHeader {
        return this.imageDos.getOrElseThrow().getOptionalHeader();
    }

    public getDataDirectory(): ImageDataDirectoryTable {
        return this.imageDos.getOrElseThrow().getOptionalHeader().getDataDirectory();
    }

    public getSectionHeaders(): ImageSectionHeader[] {
        return this.imageDos.getOrElseThrow().getSections();
    }

    public getSectionHeader(sectionId: string): ImageSectionHeader | undefined {
        return this.getSectionHeaders().find(sec => sec.getName() === sectionId);
    }

    public getDataDirectoryTypes(): string[] {
        return Object.entries(IMAGE_DATA_DIRECTORY_TYPES).reduce((found: string[], [id, value]) => { if (id + '' in this.imageDos.getOrElseThrow().getOptionalHeader().getDataDirectory().getEntries()) found.push(value + ''); return found; }, []);
    }

    public getImportDirectoryTable(): ImageImportDirectoryTable | undefined {
        /**
         * https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#the-idata-section
         * https://aroundthemalware.wordpress.com/2022/02/06/parsing-pe-file-in-python-without-using-pefile-python-package/
         */
        const importDataDir = this.getDataDirectory().getEntry(IMAGE_DATA_DIRECTORY_TYPES.IMPORT);
        if (importDataDir != null) {
            const importDataDirOffset = this.getOffsetFromRva(importDataDir.getStruct().dwVirtualAddress);
            if (importDataDirOffset != null) {
                this.buff.goto(importDataDirOffset);
                const importDirectoryTable = new ImageImportDirectoryTable();
                let done = false;
                while (!done) {
                    const imageImportdirectoryTableEntry = IMAGE_IMPORT_DIRECTORY_TABLE_ENTRY();
                    imageImportdirectoryTableEntry.dwImportLookupTableRva = this.buff.readDWord();
                    imageImportdirectoryTableEntry.dwTimeDateStamp = this.buff.readDWord();
                    imageImportdirectoryTableEntry.dwForwarderChain = this.buff.readDWord();
                    imageImportdirectoryTableEntry.dwModuleNameRva = this.buff.readDWord();
                    imageImportdirectoryTableEntry.dwImportAddressTableRva = this.buff.readDWord();

                    if (imageImportdirectoryTableEntry.dwModuleNameRva === 0x00000000) {
                        done = true;
                        break;
                    }
                    const dirEntry = new ImageImportDirectoryTableEntry(imageImportdirectoryTableEntry);

                    this.buff.pushOffset();
                    const dwNameOffset = this.getOffsetFromRva(dirEntry.getStruct().dwModuleNameRva);
                    if (dwNameOffset != null) {
                        this.buff.goto(dwNameOffset);
                        const szName = dwNameOffset != null ? this.buff.readByteStringZ() : '';
                        dirEntry.setName(szName);
                    }

                    const dwImportLookupTableOffset = this.getOffsetFromRva(dirEntry.getStruct().dwImportLookupTableRva);
                    const dwImportAddressTableOffset = this.getOffsetFromRva(dirEntry.getStruct().dwImportAddressTableRva);
                    const nextOffset = dwImportLookupTableOffset != null ? dwImportLookupTableOffset : dwImportAddressTableOffset != null ? dwImportAddressTableOffset : null;
                    if (nextOffset != null) {
                        this.buff.goto(nextOffset);
                        let done = false;
                        while (!done) {
                            const block = this.buff.readDWord(); // TODO: 64bit?
                            const importLookupTable = new ImageImportLookupTable(block);
                            const importEntry = new ImageImportEntry();
                            if (block === 0x00000000) {
                                done = true;
                                break;
                            } else if (importLookupTable.isOrdinal()) {
                                importEntry.setOrdinal(importLookupTable.getOrdinalNumber());
                            } else {
                                const nameTableOffset = this.getOffsetFromRva(importLookupTable.getHintNameTableRva());
                                if (nameTableOffset != null) {
                                    this.buff.pushOffset();
                                    this.buff.goto(nameTableOffset);
                                    const hint = this.buff.readWord();
                                    const szName = this.buff.readByteStringZ();
                                    if (this.buff.getOffset() % 2 !== 0) {
                                        this.buff.readByte();
                                    }
                                    importEntry.setHint(hint);
                                    importEntry.setName(szName);
                                    this.buff.popOffset();
                                }
                            }
                            dirEntry.addImportEntry(importEntry);
                        }
                    }
                    // const dwImportAddressTableOffset = this.getOffsetFromRva(dirEntry.getStruct().dwImportAddressTableRva);
                    // if (dwImportAddressTableOffset != null) {
                    //     this.buff.goto(dwImportAddressTableOffset);
                    // }
                    importDirectoryTable.addEntry(dirEntry);
                    this.buff.popOffset();
                }

                return importDirectoryTable;
            }
        }
        return undefined;
    }

    public getResourceDirectoryTable(): ImageResourceDirectory | undefined {
        return this.resources;
    }

    public getResourceTypes(): string[] {
        return Object.keys(this.resources?.getEntries() ?? []).map(key => key in RT_RESOURCE_TYPES ? RT_RESOURCE_TYPES[parseInt(key)] + '(' + key + ')' : key);
    }

    public getResourcesOfType<T extends RT_RESOURCE_TYPES>(resourceType: T | string): ResourceType<T> | undefined {
        if (this.resources == null) {
            return undefined;
        }
        if (typeof resourceType === 'string') {
            const potentialRtResourceType = resourceType.split('(')[0];
            if (potentialRtResourceType in RT_RESOURCE_TYPES) {
                resourceType = potentialRtResourceType;
            }
        }
        switch (resourceType) {
            case RT_RESOURCE_TYPES.RT_STRING:
            case RT_RESOURCE_TYPES[RT_RESOURCE_TYPES.RT_STRING]: {
                return this.getStringTableResources() as any;
            }
            case RT_RESOURCE_TYPES.RT_GROUP_ICON:
            case RT_RESOURCE_TYPES[RT_RESOURCE_TYPES.RT_GROUP_ICON]: {
                return this.getGroupIconResources() as any;
            }
            case RT_RESOURCE_TYPES.RT_ICON:
            case RT_RESOURCE_TYPES[RT_RESOURCE_TYPES.RT_ICON]: {
                return this.getIconResources() as any;
            }
            case RT_RESOURCE_TYPES.RT_VERSION:
            case RT_RESOURCE_TYPES[RT_RESOURCE_TYPES.RT_VERSION]: {
                return this.getVersionInfoResources() as any;
            }
            case RT_RESOURCE_TYPES.RT_MANIFEST:
            case RT_RESOURCE_TYPES[RT_RESOURCE_TYPES.RT_MANIFEST]: {
                return this.getManifestResources() as any;
            }
            default: {
                return this.resources.getResourcesForKey(resourceType) as any;
            }
        }
    }

    public getCursorResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_CURSOR);
    }

    public getBitmapResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_BITMAP);
    }

    public getIconResources(languageId: LanguageId | undefined = this.defaultLanguage): Record<string | number, Partial<Record<LanguageId, Icon>>> | undefined {
        if (this.resources == null) {
            return undefined;
        }
        const icons: Record<string | number, Partial<Record<LanguageId, Icon>>> = {};
        const resourceType = PeFileParser.RT_RESOURCE_TYPES.RT_ICON;
        if (this.resources.hasResourcesForKey(resourceType)) {
            const res = this.resources.getResourcesForKey(resourceType) as ImageResourceDirectoryEntry;
            const entries1 = res.getEntries() as Record<string | number, ImageResourceDirectory>;
            for (const resourceId in entries1) {
                icons[resourceId] = {};
                const entries2 = entries1[resourceId].getEntries();
                for (const entryId in entries2) {
                    if (languageId == null || (languageId != null && entryId.toString() === languageId.toString())) {
                        const langId = LanguagePack.valueOf(entryId)?.id!;
                        const iconMetadata = this.getIconMetadataFromIconGroups(resourceId, langId);
                        if (iconMetadata != null) {
                            const fact = entries2[langId ?? entryId].getValue();
                            const result = this.parseIconEntry(fact, iconMetadata);
                            if (result != null) {
                                icons[resourceId][langId ?? entryId] = result;
                            }
                        }
                    }
                }
            }
        }
        return icons;
    }

    public getMenuResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_MENU);
    }

    public getDialogResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_DIALOG);
    }

    public getStringTableResources(languageId: LanguageId | undefined = this.defaultLanguage): Record<string | number, Partial<Record<LanguageId, string[]>>> | undefined {
        if (this.resources == null) {
            return undefined;
        }
        const stringTables: Record<string | number, Partial<Record<LanguageId, string[]>>> = {};
        const resourceType = PeFileParser.RT_RESOURCE_TYPES.RT_STRING;
        if (this.resources.hasResourcesForKey(resourceType)) {
            const res = this.resources.getResourcesForKey(resourceType) as ImageResourceDirectoryEntry;
            const entries1 = res.getEntries() as Record<string | number, ImageResourceDirectory>;
            for (const resourceId in entries1) {
                stringTables[resourceId] = {};
                const entries2 = entries1[resourceId].getEntries();
                for (const entryId in entries2) {
                    if (languageId == null || (languageId != null && entryId.toString() === languageId.toString())) {
                        const langId = LanguagePack.valueOf(entryId)?.id!;
                        const fact = entries2[entryId].getValue();
                        try {
                            const result = this.parseStringTableEntry(fact);
                            if (result != null) {
                                stringTables[resourceId][langId ?? entryId] = result;
                            }
                        } catch (e) {
                            console.warn('[WARN]: ' + (e as Error).message);
                        }
                    }
                }
            }
        }
        return stringTables;
    }

    public getFontDirectoryResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_FONTDIR);
    }

    public getFontResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_FONT);
    }

    public getAcceleratorTableResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_ACCELERATOR);
    }

    public getRCDataResurces() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_RCDATA);
    }

    public getMessageTableResource() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_MESSAGETABLE);
    }

    public getGroupCursorResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_GROUP_CURSOR);
    }

    public getGroupIconResources(languageId: LanguageId | undefined = this.defaultLanguage): Record<string | number, Record<string | number, GroupIconDirEntry[]>> | undefined {
        if (this.resources == null) {
            return undefined;
        }
        const groups: Record<string | number, Record<string | number, GroupIconDirEntry[]>> = {};
        const resourceType = PeFileParser.RT_RESOURCE_TYPES.RT_GROUP_ICON;
        const res = this.resources.getResourcesForKey(resourceType) as ImageResourceDirectoryEntry;
        const entries1 = res.getEntries() as Record<string | number, ImageResourceDirectory>;
        for (const resourceId in entries1) {
            groups[resourceId] = {};
            const entries2 = entries1[resourceId].getEntries();
            for (const entryId in entries2) {
                if (languageId == null || (languageId != null && entryId.toString() === languageId.toString())) {
                    const langId = LanguagePack.valueOf(entryId)?.id!;
                    const fact = entries2[langId ?? entryId].getValue();
                    const result = this.parseGroupIconEntry(fact);
                    if (result != null) {
                        groups[resourceId][langId ?? entryId] = result.getEntries();
                    }
                }
            }
        }
        return groups;
    }

    public getVersionInfoResources(languageId: LanguageId | undefined = this.defaultLanguage): Record<string | number, Partial<Record<LanguageId, VsVersionInfo>>> | undefined {
        if (this.resources == null) {
            return undefined;
        }
        const versionInfo: Record<string | number, Partial<Record<LanguageId, VsVersionInfo>>> = {};
        const resourceType = PeFileParser.RT_RESOURCE_TYPES.RT_VERSION;
        if (this.resources.hasResourcesForKey(resourceType)) {
            const res = this.resources.getResourcesForKey(resourceType) as ImageResourceDirectoryEntry;
            const entries1 = res.getEntries() as Record<string | number, ImageResourceDirectory>;
            for (const resourceId in entries1) {
                versionInfo[resourceId] = {};
                const entries2 = entries1[resourceId].getEntries();
                for (const entryId in entries2) {
                    if (languageId == null || (languageId != null && entryId.toString() === languageId.toString())) {
                        const langId = LanguagePack.valueOf(entryId)?.id!;
                        const fact = entries2[langId ?? entryId].getValue();
                        const result = this.parseVsVersionInfo(fact);
                        if (result != null) {
                            versionInfo[resourceId][langId ?? entryId] = result;
                        }
                    }
                }
            }
        }

        return versionInfo;
    }

    public getDialogIncludeResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_DLGINCLUDE);
    }

    public getPlugAndPlayResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_PLUGPLAY);
    }

    public getVirtualDeviceResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_VXD);
    }

    public getAnimatedCursorResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_ANICURSOR);
    }

    public getAnimatedIconResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_ANIICON);
    }

    public getHTMLResources() {
        return this.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_HTML);
    }

    public getManifestResources(): Record<string | number, Record<string | number, Manifest>> | undefined {
        if (this.resources == null) {
            return undefined;
        }
        const manifests: Record<string | number, Record<string | number, Manifest>> = {};
        const resourceType = PeFileParser.RT_RESOURCE_TYPES.RT_MANIFEST;
        if (this.resources.hasResourcesForKey(resourceType)) {
            const res = this.resources.getResourcesForKey(resourceType) as ImageResourceDirectoryEntry;
            const entries1 = res.getEntries() as Record<string | number, ImageResourceDirectory>;
            for (const resourceId in entries1) {
                manifests[resourceId] = {};
                const entries2 = entries1[resourceId].getEntries();
                for (const entryId in entries2) {
                    const langId = LanguagePack.valueOf(entryId)?.id!;
                    const fact = entries2[langId ?? entryId].getValue();
                    const result = fact();
                    if (result != null) {
                        manifests[resourceId][entryId] = new Manifest(result);
                    }
                }
            }
        }

        return manifests;
    }

    private parse() {
        const dosHeader = this.parseDosHeader();
        const fileHeader = this.parseFileHeader(dosHeader);
        const optionalHeader = this.parseOptionalHeader();
        const sections = this.parseSections(fileHeader);
        this.imageDos = Optional.of(new ImageDos(dosHeader, fileHeader, optionalHeader, sections));
        this.resources = this.parseResourceDirectories();
    }

    private parseDosHeader(): ImageDosHeader {
        this.buff.goto(0);
        const imageDosHeader = IMAGE_DOS_HEADER();
        imageDosHeader.wMagic = this.buff.readBytes(DataSize.WORD);
        imageDosHeader.wCblp = this.buff.readWord();
        imageDosHeader.wCp = this.buff.readWord();
        imageDosHeader.wCrlc = this.buff.readWord();
        imageDosHeader.wCparHdr = this.buff.readWord();
        imageDosHeader.wMinAlloc = this.buff.readWord();
        imageDosHeader.wMaxAlloc = this.buff.readWord();
        imageDosHeader.wSs = this.buff.readWord();
        imageDosHeader.wSp = this.buff.readWord();
        imageDosHeader.wCsum = this.buff.readWord();
        imageDosHeader.wIp = this.buff.readWord();
        imageDosHeader.wCs = this.buff.readWord();
        imageDosHeader.wLfArlc = this.buff.readWord();
        imageDosHeader.wOvNo = this.buff.readWord();
        imageDosHeader.wRes = this.buff.readWords(4);
        imageDosHeader.wOemId = this.buff.readWord();
        imageDosHeader.wOemInfo = this.buff.readWord();
        imageDosHeader.wRes2 = this.buff.readWords(10);
        imageDosHeader.dwLfAnew = this.buff.readDWord();
        return new ImageDosHeader(imageDosHeader);
    }

    private parseFileHeader(imageDosHeader: ImageDosHeader): ImageFileHeader {
        this.buff.goto(imageDosHeader.getStruct().dwLfAnew);
        const imageFileHeaderStruct = IMAGE_FILE_HEADER();
        imageFileHeaderStruct.ntSig = this.buff.readBytes(DataSize.DWORD);
        imageFileHeaderStruct.wMachine = this.buff.readWord();
        imageFileHeaderStruct.wNumberOfSections = this.buff.readWord();
        imageFileHeaderStruct.dwTimeDateStamp = this.buff.readDWord();
        imageFileHeaderStruct.dwPointerToSymbolTable = this.buff.readDWord();
        imageFileHeaderStruct.dwNumberOfSymbols = this.buff.readDWord();
        imageFileHeaderStruct.wSizeOfOptionalHeader = this.buff.readWord();
        imageFileHeaderStruct.wCharacteristics = this.buff.readWord();
        return new ImageFileHeader(imageFileHeaderStruct);
    }

    private parseOptionalHeader(): ImageOptionalHeader {
        const imageOptionalHeaderStruct = IMAGE_OPTIONAL_HEADER();
        //
        // Standard fields
        //
        imageOptionalHeaderStruct.wMagic = this.buff.readWord();
        if (!ImageOptionalHeader.isMagicNumberROM(imageOptionalHeaderStruct.wMagic) &&
            !ImageOptionalHeader.isMagicNumber32Bit(imageOptionalHeaderStruct.wMagic) &&
            !ImageOptionalHeader.isMagicNumber64Bit(imageOptionalHeaderStruct.wMagic)) {
            throw new Error(`While parsing optional header, the magic number was none of the allowable values ROM, PE32, or PE32+. Size: ${imageOptionalHeaderStruct.wMagic}, Offset: ${this.buff.getOffset().toString(16)}`);
        }
        const is64Bit = ImageOptionalHeader.isMagicNumber64Bit(imageOptionalHeaderStruct.wMagic);
        imageOptionalHeaderStruct.bMajorLinkerVersion = this.buff.readByte();
        imageOptionalHeaderStruct.bMinorLinkerVersion = this.buff.readByte();
        imageOptionalHeaderStruct.dwSizeOfCode = this.buff.readDWord();
        imageOptionalHeaderStruct.dwSizeOfInitializedData = this.buff.readDWord();
        imageOptionalHeaderStruct.dwSizeOfUninitializedData = this.buff.readDWord();
        imageOptionalHeaderStruct.dwAddressOfEntryPoint = this.buff.readDWord();
        imageOptionalHeaderStruct.dwBaseOfCode = this.buff.readDWord();
        // PE32 contains this additional field, which is absent in PE32+, following BaseOfCode.
        if (!is64Bit) {
            imageOptionalHeaderStruct.dwBaseOfData = this.buff.readDWord();
        }
        //
        // NT additional fields
        //
        if (is64Bit) {
            imageOptionalHeaderStruct.dwImageBase = this.buff.readQWord();
        } else {
            imageOptionalHeaderStruct.dwImageBase = this.buff.readDWord();
        }
        imageOptionalHeaderStruct.dwSectionAlignment = this.buff.readDWord();
        imageOptionalHeaderStruct.dwFileAlignment = this.buff.readDWord();
        imageOptionalHeaderStruct.wMajorOperatingSystemVersion = this.buff.readWord();
        imageOptionalHeaderStruct.wMinorOperatingSystemVersion = this.buff.readWord();
        imageOptionalHeaderStruct.wMajorImageVersion = this.buff.readWord();
        imageOptionalHeaderStruct.wMinorImageVersion = this.buff.readWord();
        imageOptionalHeaderStruct.wMajorSusbsystemVersion = this.buff.readWord();
        imageOptionalHeaderStruct.wMinorSubsystemVersion = this.buff.readWord();
        imageOptionalHeaderStruct.dwReserved1 = this.buff.readDWord();
        imageOptionalHeaderStruct.dwSizeOfImage = this.buff.readDWord();
        imageOptionalHeaderStruct.dwSizeOfHeaders = this.buff.readDWord();
        imageOptionalHeaderStruct.dwCheckSum = this.buff.readDWord();
        imageOptionalHeaderStruct.wSubsystem = this.buff.readWord();
        imageOptionalHeaderStruct.wDllCharacteristics = this.buff.readWord();

        if (is64Bit) {
            imageOptionalHeaderStruct.dwSizeOfStackReserve = this.buff.readQWord();
            imageOptionalHeaderStruct.dwSizeOfStackCommit = this.buff.readQWord();
            imageOptionalHeaderStruct.dwSizeOfHeapReserve = this.buff.readQWord();
            imageOptionalHeaderStruct.dwSizeOfHeapCommit = this.buff.readQWord();
        } else {
            imageOptionalHeaderStruct.dwSizeOfStackReserve = this.buff.readDWord();
            imageOptionalHeaderStruct.dwSizeOfStackCommit = this.buff.readDWord();
            imageOptionalHeaderStruct.dwSizeOfHeapReserve = this.buff.readDWord();
            imageOptionalHeaderStruct.dwSizeOfHeapCommit = this.buff.readDWord();
        }

        imageOptionalHeaderStruct.dwLoaderFlags = this.buff.readDWord();
        imageOptionalHeaderStruct.dwNumberOfRvaAndSizes = this.buff.readDWord();
        const dataDirectory = new ImageDataDirectoryTable();
        for (let i = 0; i < imageOptionalHeaderStruct.dwNumberOfRvaAndSizes; i++) {
            const imageDataDirectory = IMAGE_DATA_DIRECTORY_ENTRY();
            imageDataDirectory.dwVirtualAddress = this.buff.readDWord();
            imageDataDirectory.dwSize = this.buff.readDWord();
            if (imageDataDirectory.dwVirtualAddress !== 0x0) {
                dataDirectory.addEntry(i, new ImageDataDirectoryEntry(imageDataDirectory));
            }
        }
        return new ImageOptionalHeader(imageOptionalHeaderStruct, dataDirectory);
    }

    private parseSections(imageFileHeader: ImageFileHeader): ImageSectionHeader[] {
        const sections: ImageSectionHeader[] = [];
        for (let i = 0; i < imageFileHeader.getStruct().wNumberOfSections; i++) {
            const imageSectionHeaderStruct = IMAGE_SECTION_HEADER();
            imageSectionHeaderStruct.szName = this.buff.readBytesAsString(DataSize.QWORD);
            imageSectionHeaderStruct.dwPhysicalAddressUnionVirtualSize = this.buff.readDWord();
            imageSectionHeaderStruct.dwVirtualAddress = this.buff.readDWord();
            imageSectionHeaderStruct.dwSizeOfRawData = this.buff.readDWord();
            imageSectionHeaderStruct.dwPointerToRawData = this.buff.readDWord();
            imageSectionHeaderStruct.dwPointerToRelocations = this.buff.readDWord();
            imageSectionHeaderStruct.dwPointerToLineNumbers = this.buff.readDWord();
            imageSectionHeaderStruct.wNumberOfRelocations = this.buff.readWord();
            imageSectionHeaderStruct.wNumberOfLineNumbers = this.buff.readWord();
            imageSectionHeaderStruct.dwCharacteristics = this.buff.readDWord();
            const imageSectionHeader = new ImageSectionHeader(imageSectionHeaderStruct);
            sections.push(imageSectionHeader);
        }

        return sections;
    }

    private parseResourceDirectories(): ImageResourceDirectory | undefined {
        const resourceDataDir = this.getDataDirectory().getEntry(IMAGE_DATA_DIRECTORY_TYPES.RESOURCE);
        if (resourceDataDir != null) {
            const sectionHeader = this.getSectionOfRva(resourceDataDir.getStruct().dwVirtualAddress);
            if (sectionHeader != null) {
                // const bytes = Math.min(sectionHeader.dwPhysicalAddressUnionVirtualSize, sectionHeader.dwSizeOfRawData);
                this.buff.pushOffset();
                const dir = this.parseResourceDirectory(sectionHeader.getStruct().dwPointerToRawData);
                const dirComplete = this.recurseResourceDirectory(sectionHeader, dir);
                this.buff.popOffset();
                return dirComplete;
            }
        }
        return undefined;
    }

    private parseResourceDirectory(address: DataTypes.DWORD): ImageResourceDirectory {
        const imgResDir = IMAGE_RESOURCE_DIRECTORY();
        this.buff.goto(address);
        imgResDir.dwCharacteristics = this.buff.readDWord();
        imgResDir.dwTimeDateStamp = this.buff.readDWord();
        imgResDir.wMajorVersion = this.buff.readWord();
        imgResDir.wMinorVersion = this.buff.readWord();
        imgResDir.wNumberOfNamedEntries = this.buff.readWord();
        imgResDir.wNumberOfIdEntries = this.buff.readWord();
        return new ImageResourceDirectory(imgResDir);
    }

    /**
     * https://docs.microsoft.com/en-us/previous-versions/ms809762(v=msdn.10)
     * @returns {ImageResourceDirectoryEntry}
     */
    private parseResourceDirectoryEntry(sectionHeader: ImageSectionHeader): ImageResourceDirectoryEntry {
        const imgResDirEntry = IMAGE_RESOURCE_DIRECTORY_ENTRY();
        imgResDirEntry.dwName = this.buff.readDWord();
        if (imgResDirEntry.dwName - 0x80000000 > 0) {
            this.buff.pushOffset();
            this.buff.goto(sectionHeader.getStruct().dwPointerToRawData + imgResDirEntry.dwName - 0x80000000);
            const wCharCount = this.buff.readWord();
            const wcChars = this.buff.readWordsAsString(wCharCount);
            imgResDirEntry.dwName = wcChars as any; // TODO this is sometimes a number and then changed to a string
            this.buff.popOffset();
        }
        imgResDirEntry.dwOffsetToData = this.buff.readDWord();
        imgResDirEntry.dwOffsetToData += sectionHeader.getStruct().dwPointerToRawData;
        return new ImageResourceDirectoryEntry(imgResDirEntry);
    }

    /**
    * https://docs.microsoft.com/en-us/previous-versions/ms809762(v=msdn.10)
    */
    private parseResourceDirectoryDataEntry(sectionHeader: ImageSectionHeader): ImageResourceDirectoryDataEntry {
        const imgResDataEntry = IMAGE_RESOURCE_DIRECTORY_DATA_ENTRY();
        imgResDataEntry.dwOffsetToData = this.buff.readDWord();
        imgResDataEntry.dwSize = this.buff.readDWord();
        imgResDataEntry.dwCodePage = this.buff.readDWord();
        imgResDataEntry.dwReserved = this.buff.readDWord();

        const imageResourceDataEntry = new ImageResourceDirectoryDataEntry(imgResDataEntry);
        imageResourceDataEntry.setDataFactory(() => {
            const virtual_address = sectionHeader.getStruct().dwPointerToRawData + imgResDataEntry.dwOffsetToData - sectionHeader.getStruct().dwVirtualAddress;
            this.buff.goto(virtual_address);
            return this.buff.readBytes(imgResDataEntry.dwSize);
        });

        return imageResourceDataEntry;
    }

    private recurseResourceDirectory(sectionHeader: ImageSectionHeader, parentDirectory: ImageResourceDirectory): ImageResourceDirectory {
        for (let i = 0; i < parentDirectory.getNumberOfNamedEntries(); i++) {
            parentDirectory.addEntry(this.parseResourceDirectoryEntry(sectionHeader));
        }
        for (let i = 0; i < parentDirectory.getNumberOfIdEntries(); i++) {
            parentDirectory.addEntry(this.parseResourceDirectoryEntry(sectionHeader));
        }
        for (const [name, entry] of Object.entries(parentDirectory.getEntries())) {
            if (entry.isLeaf() === true) {
                this.buff.goto(entry.getStruct().dwOffsetToData);
                entry.setValue(this.parseResourceDirectoryDataEntry(sectionHeader).getDataFactory());
            } else {
                const dir = this.parseResourceDirectory(entry.getStruct().dwOffsetToData);
                const dirComplete = this.recurseResourceDirectory(sectionHeader, dir);
                entry.setDir(dirComplete);
            }
        }
        return parentDirectory;
    }

    /**
     * https://devblogs.microsoft.com/oldnewthing/20120720-00/?p=7083
     * @param groupIconDataFactory reads the array of group icon entries and returns the results
     */
    private parseGroupIconEntry(groupIconDataFactory: () => Uint8Array | ArrayBuffer): GroupIconDir {
        const buff = new BufferReader(groupIconDataFactory());
        const grpIconDir = GROUP_ICON_DIR();
        grpIconDir.wReserved = buff.readWord();
        grpIconDir.wType = buff.readWord();
        grpIconDir.wCount = buff.readWord();
        const groupIconDir = new GroupIconDir(grpIconDir);
        for (let i = 0; i < grpIconDir.wCount; i++) {
            const grpIconDirEntry = GROUP_ICON_DIR_ENTRY();
            grpIconDirEntry.bWidth = buff.readByte();
            if (grpIconDirEntry.bWidth === 0x00) {
                grpIconDirEntry.bWidth = 0x100;
            }
            grpIconDirEntry.bHeight = buff.readByte();
            if (grpIconDirEntry.bHeight === 0x00) {
                grpIconDirEntry.bHeight = 0x100;
            }
            grpIconDirEntry.bColorCount = buff.readByte();
            grpIconDirEntry.bReserved = buff.readByte();
            grpIconDirEntry.wPlanes = buff.readWord();
            grpIconDirEntry.wBitCount = buff.readWord();
            grpIconDirEntry.dwBytesInRes = buff.readDWord();
            grpIconDirEntry.wId = buff.readWord();

            const groupIconDirEntry = new GroupIconDirEntry(grpIconDirEntry);
            groupIconDir.addEntry(groupIconDirEntry);
        }
        return groupIconDir;
    }

    private parseStringTableEntry(stringTableDataFactory: () => Uint8Array | ArrayBuffer): string[] {
        const strings: string[] = [];
        const buff = new BufferReader(stringTableDataFactory());
        while (buff.getOffset() < buff.getByteLength()) {
            const wValueLength = buff.readWord();
            const str = buff.readWordsAsString(wValueLength);
            strings.push(str);
        }
        return strings;
    }

    private parseIconEntry(iconFactory: () => Uint8Array, metadata: GroupIconDirEntry) {
        const data = iconFactory();
        return new Icon(data, metadata);
    }

    private getIconMetadataFromIconGroups(iconId: string, languageId?: LanguageId): GroupIconDirEntry | undefined {
        if (this.resources == null) {
            return undefined;
        }
        const grpResources = this.getGroupIconResources(languageId);
        for (const resourceId in grpResources) {
            for (const languageId in grpResources[resourceId]) {
                const iconGroup: GroupIconDirEntry[] = grpResources != null ? grpResources[resourceId][languageId] : [];
                return iconGroup.find(entry => (entry.getId() + '') === ('' + iconId));
            }
        }
        return undefined;
    }

    private parseVsVersionInfo(vsVersionInfoFactory: () => Uint8Array | ArrayBuffer) {
        const buff = new BufferReader(vsVersionInfoFactory());

        const vsVersionInfoStruct = VS_VERSIONINFO();
        vsVersionInfoStruct.wLength = buff.readWord();
        vsVersionInfoStruct.wValueLength = buff.readWord();
        vsVersionInfoStruct.wType = buff.readWord();
        vsVersionInfoStruct.szKey = buff.readWordStringZ();

        const vsVersionInfo = new VsVersionInfo(vsVersionInfoStruct);

        buff.seek32BitBoundary();

        const fixedFileInfoStruct = VS_FIXED_FILE_INFO();
        fixedFileInfoStruct.dwSignature = buff.readBytes(DataSize.DWORD, true);
        fixedFileInfoStruct.dwStrucVersion = buff.readWords(DataSize.DWORD / DataSize.WORD);
        fixedFileInfoStruct.dwFileVersionLS = buff.readWord();
        fixedFileInfoStruct.dwFileVersionMS = buff.readWord();
        buff.readDWord();// padding
        fixedFileInfoStruct.dwProductVersionLS = buff.readWord();
        fixedFileInfoStruct.dwProductVersionMS = buff.readWord();
        buff.readDWord(); // padding
        fixedFileInfoStruct.dwFileFlagsMask = buff.readDWord();
        fixedFileInfoStruct.dwFileFlags = buff.readDWord();
        fixedFileInfoStruct.dwFileOS = buff.readDWord();
        fixedFileInfoStruct.dwFileType = buff.readDWord();
        fixedFileInfoStruct.dwFileSubtype = buff.readDWord();
        fixedFileInfoStruct.dwFileDateLS = buff.readWord();
        fixedFileInfoStruct.dwFileDateMS = buff.readWord();
        buff.readDWord(); // padding
        const fixedFileInfo = new FixedFileInfo(fixedFileInfoStruct);
        vsVersionInfo.setFixedFileInfo(fixedFileInfo);

        buff.seek32BitBoundary();

        const preStringFileInfoOffset = buff.getOffset();
        const stringFileInfoStruct = STRING_FILE_INFO();
        stringFileInfoStruct.wLength = buff.readWord();
        stringFileInfoStruct.wValueLength = buff.readWord();
        stringFileInfoStruct.wType = buff.readWord();
        stringFileInfoStruct.szKey = buff.readWordStringZ();

        if (stringFileInfoStruct.szKey === 'StringFileInfo') {
            const stringFileInfo = new StringFileInfo(stringFileInfoStruct);
            buff.seek32BitBoundary();

            const preStringTableOffset = buff.getOffset();
            while (buff.getOffset() < preStringFileInfoOffset + stringFileInfoStruct.wLength) {
                const stringTableStruct = STRING_TABLE();
                stringTableStruct.wLength = buff.readWord();
                stringTableStruct.wValueLength = buff.readWord();
                stringTableStruct.wType = buff.readWord();
                stringTableStruct.szKey = buff.readWordStringZ();
                const stringTable = new StringTable(stringTableStruct);

                buff.seek32BitBoundary();

                while (buff.getOffset() < preStringTableOffset + stringTable.getStruct().wLength) {
                    const stringTableEntryStruct = STRING_TABLE_ENTRY();
                    stringTableEntryStruct.wLength = buff.readWord();
                    stringTableEntryStruct.wValueLength = buff.readWord();
                    stringTableEntryStruct.wType = buff.readWord();
                    stringTableEntryStruct.szKey = buff.readWordStringZ().trim();
                    const stringTableEntry = new StringTableEntry(stringTableEntryStruct);

                    buff.seek32BitBoundary();

                    if (stringTableEntry.getLength() === 0) {
                        break;
                    }

                    if (stringTableEntry.isValueBinary()) {
                        stringTableEntry.setValue(stringTableEntry.getValueLength() > 0 ? buff.readWordsAsString(stringTableEntry.getValueLength() / DataSize.WORD).trim() : '');
                    } else if (stringTableEntry.isValueUtf16()) {
                        stringTableEntry.setValue(stringTableEntry.getValueLength() > 0 ? buff.readWordStringZ().trim() : '');
                    } else {
                        throw new Error(`Invalid wType value ${stringTableEntry.getType()} for szKey '${stringTableEntry.getKey()}' in StringTable at offset ${buff.getOffset().toString(16)}`);
                    }

                    buff.seek32BitBoundary();
                    stringTable.addEntry(stringTableEntry);
                }

                stringFileInfo.addStringTable(stringTable);
            }
            vsVersionInfo.setStringFileInfo(stringFileInfo);
        }

        const preVarFileInfoOffset = buff.getOffset();
        const varFileInfoStruct = VAR_FILE_INFO();
        varFileInfoStruct.wLength = buff.readWord();
        varFileInfoStruct.wValueLength = buff.readWord();
        varFileInfoStruct.wType = buff.readWord();
        varFileInfoStruct.szKey = buff.readWordStringZ();

        if (varFileInfoStruct.szKey === 'VarFileInfo') {
            const varFileInfo = new VarFileInfo(varFileInfoStruct);
            buff.seek32BitBoundary();


            const preVarFileInfoVarOffset = buff.getOffset();
            while (buff.getOffset() < preVarFileInfoOffset + varFileInfo.getLength()) {
                const varFileInfoVarStruct = VAR_FILE_INFO_VAR();
                varFileInfoVarStruct.wLength = buff.readWord();
                varFileInfoVarStruct.wValueLength = buff.readWord();
                varFileInfoVarStruct.wType = buff.readWord();
                varFileInfoVarStruct.szKey = buff.readWordStringZ();
                const varFileInfoVar = new VarFileInfoVar(varFileInfoVarStruct);

                buff.seek32BitBoundary();

                if (varFileInfoVar.isDataBinary()) {
                    for (let i = 0; i < varFileInfoVar.getValueLength(); i += DataSize.DWORD) {
                        const languageId = buff.readWord();
                        const codePageId = buff.readWord();
                        varFileInfoVar.addVar(languageId, codePageId);
                    }
                } else if (varFileInfoVar.isDataUtf16()) { // TODO: maybe if offset is still less than wValueLength continue reading strings?
                    if (varFileInfoVar.getValueLength() > 0) {
                        const languageId = parseInt(buff.readWordsAsString(4), 16); // TODO: this implementation is unverified, but I suspect it would be something like "0409" written out as utf-16 characters
                        const codePageId = parseInt(buff.readWordsAsString(4), 16);
                        varFileInfoVar.addVar(languageId, codePageId);
                    }
                } else {
                    throw new Error(`Invalid wType value ${varFileInfoVar.getType()} for szKey '${varFileInfoVar.getKey()}' in VarFileInfo at offset ${buff.getOffset().toString(16)}`);
                }
                varFileInfo.addEntry(varFileInfoVar);
            }

            vsVersionInfo.setVarFileInfo(varFileInfo);
        }

        return vsVersionInfo;
    }

    public getLanguageIds(): LanguageId[] {
        const langs: LanguageId[] = [];
        const versioninfo = this.getVersionInfoResources();
        for (const resourceId in versioninfo) {
            for (const langId in versioninfo[resourceId]) {
                const vs = versioninfo[resourceId][langId as any as LanguageId];
                const vars = vs?.getVarFileInfo()?.getVar('Translation')?.getVars();
                if (vars != null) {
                    for (const v of vars) {
                        langs.push(v.languageId);
                    }
                }
            }
        }
        return langs;
    }

    private getSectionOfRva(rva: number): ImageSectionHeader | undefined {
        for (const section of this.imageDos.getOrElseThrow().getSections()) {
            if (rva >= section.getStruct().dwVirtualAddress && rva <= section.getStruct().dwVirtualAddress + section.getStruct().dwSizeOfRawData) {
                return section;
            }
        }
        return undefined;
    }

    private getOffsetFromRva(rva: number): number | null {
        const section = this.getSectionOfRva(rva);
        if (section != null) {
            return section.getStruct().dwPointerToRawData + (rva - section.getStruct().dwVirtualAddress);
        }
        return null;
    }
}
