const BufferReader = require('./buffer-reader');
const {VsVersionInfo} = require('./vs-version-info');
const DATA_TYPES = require("./data-types");
const Structures = require('./structs');

/**
 * Parses the header and resource data from a windows exe or dll in the PE format
 */
function PeFileParser() {

    this.IMAGE_DOS;
    this.buff;
    this.resources;

    this.parseBytes = function(data) {
        this.buff = new BufferReader(data);
        this.IMAGE_DOS = {
            dosHeader: {},
            peHeader: {},
            peOptHeader: {},
            sections: []
        };
        this.IMAGE_DOS.dosHeader = parseDosHeader.bind(this)();
        this.IMAGE_DOS.peHeader = parsePeImageFileHeader.bind(this)();
        this.IMAGE_DOS.peOptHeader = parsePeOptHeader.bind(this)();
        this.IMAGE_DOS.sections = parseSections.bind(this)();
        this.resources = parseResourceDirectories.bind(this)();
    }

    function parseDosHeader() {
        this.buff.goto(0);
        const IMAGE_DOS_HEADER = Structures.IMAGE_DOS_HEADER();
        IMAGE_DOS_HEADER.wMagic    = this.buff.readBytes(DATA_TYPES.WORD);
        IMAGE_DOS_HEADER.wCblp     = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wCp       = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wCrlc     = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wCparHdr  = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wMinAlloc = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wMaxAlloc = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wSs       = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wSp       = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wCsum     = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wIp       = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wCs       = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wLfArlc   = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wOvNo     = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wRes      = this.buff.readWords(4);
        IMAGE_DOS_HEADER.wOemId    = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wOemInfo  = this.buff.readWord(true);
        IMAGE_DOS_HEADER.wRes2     = this.buff.readWords(10);
        IMAGE_DOS_HEADER.dwLfAnew  = this.buff.readDWord(true);
        return IMAGE_DOS_HEADER;
    }

    function parsePeImageFileHeader() {
        this.buff.goto(this.IMAGE_DOS.dosHeader.dwLfAnew);
        const IMAGE_DOS_SIGNATURE    = 0x5A4D;    // MZ
        const IMAGE_OS2_SIGNATURE    = 0x454E;    // NE
        const IMAGE_OS2_SIGNATURE_LE = 0x454C;    // LE
        const IMAGE_NT_SIGNATURE     = 0x4550 // PE00
        const IMAGE_FILE_HEADER = Structures.IMAGE_FILE_HEADER();
        IMAGE_FILE_HEADER.ntSig                 = this.buff.readWord(true);
        if (IMAGE_FILE_HEADER.ntSig === IMAGE_NT_SIGNATURE) {
            this.buff.readWord(true);
        }
        IMAGE_FILE_HEADER.wMachine               = this.buff.readWord(true);
        IMAGE_FILE_HEADER.wNumberOfSections      = this.buff.readWord(true);
        IMAGE_FILE_HEADER.dwTimeDateStamp        = this.buff.readDWord(true);
        IMAGE_FILE_HEADER.dwPointerToSymbolTable = this.buff.readDWord(true);
        IMAGE_FILE_HEADER.dwNumberOfSymbols      = this.buff.readDWord(true);
        IMAGE_FILE_HEADER.wSizeOfOptionalHeader  = this.buff.readWord(true);
        IMAGE_FILE_HEADER.wCharacteristics       = this.buff.readWord(true);
        return IMAGE_FILE_HEADER;
    }

    function parsePeOptHeader() {
        const IMAGE_OPTIONAL_HEADER = Structures.IMAGE_OPTIONAL_HEADER();
        //
        // Standard fields
        //
        IMAGE_OPTIONAL_HEADER.wMagic                    = this.buff.readWord(true);
        IMAGE_OPTIONAL_HEADER.bMajorLinkerVersion       = this.buff.readByte(true);
        IMAGE_OPTIONAL_HEADER.bMinorLinkerVersion       = this.buff.readByte(true);
        IMAGE_OPTIONAL_HEADER.dwSizeOfCode              = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwSizeOfInitializedData   = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwSizeOfUninitializedData = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwAddressOfEntryPoint     = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwBaseOfCode              = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwBaseOfData              = this.buff.readDWord(true);
        //
        // NT additional fields
        //
        IMAGE_OPTIONAL_HEADER.dwImageBase                  = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwSectionAlignment           = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwFileAlignment              = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.wMajorOperatingSystemVersion = this.buff.readWord(true);
        IMAGE_OPTIONAL_HEADER.wMinorOperatingSystemVersion = this.buff.readWord(true);
        IMAGE_OPTIONAL_HEADER.wMajorImageVersion           = this.buff.readWord(true);
        IMAGE_OPTIONAL_HEADER.wMinorImageVersion           = this.buff.readWord(true);
        IMAGE_OPTIONAL_HEADER.wMajorSusbsystemVersion      = this.buff.readWord(true);
        IMAGE_OPTIONAL_HEADER.wMinorSusbsystemVersion      = this.buff.readWord(true);
        IMAGE_OPTIONAL_HEADER.dwReserved1                  = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwSizeOfImage                = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwSizeOfHeaders              = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwCheckSum                   = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.wSubsystem                   = this.buff.readWord(true);
        IMAGE_OPTIONAL_HEADER.wDllCharacteristics          = this.buff.readWord(true);
        IMAGE_OPTIONAL_HEADER.dwSizeOfStackReserve         = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwSizeOfStackCommit          = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwSizeOfHeapReserve          = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwSizeOfHeapCommit           = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwLoaderFlags                = this.buff.readDWord(true);
        IMAGE_OPTIONAL_HEADER.dwNumberOfRvaAndSizes        = this.buff.readDWord(true);
        for (let i=0; i<IMAGE_OPTIONAL_HEADER.dwNumberOfRvaAndSizes; i++) {
            const IMAGE_DATA_DIRECTORY = Structures.IMAGE_DATA_DIRECTORY();
            IMAGE_DATA_DIRECTORY.dwVirtualAddress   = this.buff.readDWord(true);
            IMAGE_DATA_DIRECTORY.dwSize             = this.buff.readDWord(true);
            if (IMAGE_DATA_DIRECTORY.dwVirtualAddress !== 0x0) {
                IMAGE_OPTIONAL_HEADER.DataDirectory[i] = IMAGE_DATA_DIRECTORY;
            }
        }
        return IMAGE_OPTIONAL_HEADER;
    }

    function parseSections() {
        const sections = [];
        for (let i=0; i<this.IMAGE_DOS.peHeader.wNumberOfSections; i++) {
            const IMAGE_SECTION_HEADER = Structures.IMAGE_SECTION_HEADER();
            IMAGE_SECTION_HEADER.szName                            = this.buff.readBytesAsString(DATA_TYPES.QWORD);
            IMAGE_SECTION_HEADER.dwPhysicalAddressUnionVirtualSize = this.buff.readDWord(true);
            IMAGE_SECTION_HEADER.dwVirtualAddress                  = this.buff.readDWord(true);
            IMAGE_SECTION_HEADER.dwSizeOfRawData                   = this.buff.readDWord(true);
            IMAGE_SECTION_HEADER.dwPointerToRawData                = this.buff.readDWord(true);
            IMAGE_SECTION_HEADER.dwPointerToRelocations            = this.buff.readDWord(true);
            IMAGE_SECTION_HEADER.dwPointerToLineNumbers            = this.buff.readDWord(true);
            IMAGE_SECTION_HEADER.wNumberOfRelocations              = this.buff.readWord(true);
            IMAGE_SECTION_HEADER.wNumberOfLinenumbers              = this.buff.readWord(true);
            IMAGE_SECTION_HEADER.dwCharacteristics                 = this.buff.readDWord(true);
            sections.push(IMAGE_SECTION_HEADER);
        }

        return sections;
    }

    function parseResourceDirectories() {
        const dataDir = this.IMAGE_DOS.peOptHeader.DataDirectory[DATA_DIRECTORY_TYPES.RESOURCE];
        const sectionHeader = this.getSectionHeaders().find(sec => sec.dwVirtualAddress === dataDir.dwVirtualAddress);
        const bytes = Math.min(sectionHeader.dwPhysicalAddressUnionVirtualSize, sectionHeader.dwSizeOfRawData)
        const block = this.buff.slicedBuffer(sectionHeader.dwPointerToRawData, bytes);
        const dir = parseResourceDirectory(block);
        const dirComplete = recurseResourceDirectoryEntry(sectionHeader, dir, block);
        return dirComplete.Children;
    }

    function parseResourceDirectory(buff) {
        const IMAGE_RESOURCE_DIRECTORY = Structures.IMAGE_RESOURCE_DIRECTORY(); 
        IMAGE_RESOURCE_DIRECTORY.dwCharacteristics     = buff.readDWord(true);
        IMAGE_RESOURCE_DIRECTORY.dwTimeDateStamp       = buff.readDWord(true);
        IMAGE_RESOURCE_DIRECTORY.wMajorVersion         = buff.readWord(true);
        IMAGE_RESOURCE_DIRECTORY.wMinorVersion         = buff.readWord(true);
        IMAGE_RESOURCE_DIRECTORY.wNumberOfNamedEntries = buff.readWord(true);
        IMAGE_RESOURCE_DIRECTORY.wNumberOfIdEntries    = buff.readWord(true);
        return IMAGE_RESOURCE_DIRECTORY;
    }

    /**
     * https://docs.microsoft.com/en-us/previous-versions/ms809762(v=msdn.10)
     * @param {BufferReader} buff 
     * @returns 
     */
    function parseResourceDirectoryEntry(buff) {
        const IMAGE_RESOURCE_DIRECTORY_ENTRY = Structures.IMAGE_RESOURCE_DIRECTORY_ENTRY();
        IMAGE_RESOURCE_DIRECTORY_ENTRY.dwName = buff.readDWord(true);
        if (IMAGE_RESOURCE_DIRECTORY_ENTRY.dwName - 0x80000000 > 0) {
            buff.pushOffset();
            buff.goto(IMAGE_RESOURCE_DIRECTORY_ENTRY.dwName - 0x80000000);
            const wCharCount = buff.readWord(true);
            const wcChars = buff.readWordsAsString(wCharCount);
            IMAGE_RESOURCE_DIRECTORY_ENTRY.dwName = wcChars;
            buff.popOffset();
        }
        IMAGE_RESOURCE_DIRECTORY_ENTRY.dwOffsetToData = buff.readDWord(true);
        if (IMAGE_RESOURCE_DIRECTORY_ENTRY.dwOffsetToData - 0x80000000 > 0) {
            IMAGE_RESOURCE_DIRECTORY_ENTRY.dwOffsetToData -= 0x80000000;
        } else {
            IMAGE_RESOURCE_DIRECTORY_ENTRY.isLeaf = true;
        }
        return IMAGE_RESOURCE_DIRECTORY_ENTRY;
    }

    /**
     * https://docs.microsoft.com/en-us/previous-versions/ms809762(v=msdn.10)
     * @param {Number} sectionHeader probably for .rsrc
     * @param {BufferReader} buff 
     * @returns 
     */
    function parseResourceDataEntry(sectionHeader, buff) {
        const IMAGE_RESOURCE_DATA_ENTRY = Structures.IMAGE_RESOURCE_DATA_ENTRY();
        IMAGE_RESOURCE_DATA_ENTRY.dwOffsetToData = buff.readDWord(true);
        IMAGE_RESOURCE_DATA_ENTRY.dwSize = buff.readDWord(true);
        IMAGE_RESOURCE_DATA_ENTRY.dwCodePage = buff.readDWord(true);
        IMAGE_RESOURCE_DATA_ENTRY.dwReserved = buff.readDWord(true);
        
        IMAGE_RESOURCE_DATA_ENTRY.data = () => {
            const virtual_address = IMAGE_RESOURCE_DATA_ENTRY.dwOffsetToData - sectionHeader.dwVirtualAddress; // 438272
            buff.goto(virtual_address);
            return buff.readBytes(IMAGE_RESOURCE_DATA_ENTRY.dwSize);
        };

        return IMAGE_RESOURCE_DATA_ENTRY;
    }

    function recurseResourceDirectoryEntry(sectionHeader, parentDirectory, buff) {
        const entries = [];
        for (let i=0; i<parentDirectory.wNumberOfNamedEntries; i++) {
            entries.push(parseResourceDirectoryEntry(buff));
        }
        for (let i=0; i<parentDirectory.wNumberOfIdEntries; i++) {
            entries.push(parseResourceDirectoryEntry(buff));
        }
        for (const entry of entries) {
            if (entry.isLeaf === true) {
                buff.goto(entry.dwOffsetToData);
                parentDirectory.Children[entry.dwName] = parseResourceDataEntry(sectionHeader, buff).data;
            } else {
                buff.goto(entry.dwOffsetToData);
                const dir = parseResourceDirectory(buff);
                parentDirectory.Children[entry.dwName] = recurseResourceDirectoryEntry(sectionHeader, dir, buff).Children;
            }
        }
        return parentDirectory;
    }

    /**
     * https://devblogs.microsoft.com/oldnewthing/20120720-00/?p=7083
     * @param {Function<Array>} groupIconDataFactory reads the array of group icon entries and returns the results
     */
    function parseGroupIconEntry(groupIconDataFactory) {
        const buff = new BufferReader(groupIconDataFactory());
        const GRPICONDIR = Structures.GROUP_ICON_DIR();
        GRPICONDIR.wReserved = buff.readWord(true);
        GRPICONDIR.wType = buff.readWord(true);
        GRPICONDIR.wCount = buff.readWord(true);
        for (let i=0; i<GRPICONDIR.wCount; i++) {
            const GRPICONDIRENTRY = Structures.GROUP_ICON_DIR_ENTRY();
            GRPICONDIRENTRY.bWidth = buff.readByte(true);
            if (GRPICONDIRENTRY.bWidth === 0x00) {
                GRPICONDIRENTRY.bWidth = 0x100;
            }
            GRPICONDIRENTRY.bHeight = buff.readByte(true);
            if (GRPICONDIRENTRY.bHeight === 0x00) {
                GRPICONDIRENTRY.bHeight = 0x100;
            }
            GRPICONDIRENTRY.bColorCount = buff.readByte(true);
            GRPICONDIRENTRY.bReserved = buff.readByte(true);
            GRPICONDIRENTRY.wPlanes = buff.readWord(true);
            GRPICONDIRENTRY.wBitCount = buff.readWord(true);
            GRPICONDIRENTRY.dwBytesInRes = buff.readDWord(true);
            GRPICONDIRENTRY.wId = buff.readWord(true);
            GRPICONDIR.Children.push(GRPICONDIRENTRY);
        }
        return GRPICONDIR;
    }

    function parseIconEntry(iconFactory, metadata) {
        const icon = {
            likelyFormat: null,
            ext: '',
            metadata: metadata,
            data: iconFactory(),
        };

        if (metadata == null) {
            return icon;
        }

        // PNG files always start with the following 8 bytes:
        // 0x89  0x50  0x4e  0x47  0x0d  0x0a  0x1a  0x0a
        // \211  P     N     G     \r    \n    \032  \n
        const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
        if (icon.data.slice(0, 8).reduce((match, test, i) => match && PNG_HEADER[i] === test, true)) {
            icon.likelyFormat = 'PNG';
            icon.ext = '.png'
        } else if (icon.data[0] === 0x28) {
            // probably an ico file
            icon.likelyFormat = 'ICO';
            icon.ext = '.ico';

            // Inside the exe resources, the ico files are broken up into individual resource entries, resulting
            // in the ico file header information being stripped away.
            // An ico file can contain multiple images at various resolutions, bit-depths, etc.. and when combined,
            // all images share a common header, which lists each image, so that header wouldn't work once broken up
            // for an individual file. So here we need to recreate an ico file header that only lists a single image.
            // https://devblogs.microsoft.com/oldnewthing/20101018-00/?p=12513
            const ICO_HEADER = {
                wReserved: 0x0000,
                wType: 0x0001,
                wCount: 0x0001
            };
            const ICO_DIR_ENTRY = {
                bWidth: metadata.bWidth,
                bHeight: metadata.bHeight,
                bColorCount: metadata.bColorCount,
                bReserved: metadata.bReserved,
                wPlanes: metadata.wPlanes,
                wBitcount: metadata.wBitCount,
                // dwBytesInRes: metadata.dwBytesInRes,
                dwBytesInRes: icon.data.length,
                dwImageOffset: 0x00000016
            };
            const icoStruc = new BufferReader(new ArrayBuffer(0x16));
            icoStruc.writeWord(ICO_HEADER.wReserved);
            icoStruc.writeWord(ICO_HEADER.wType);
            icoStruc.writeWord(ICO_HEADER.wCount);
    
            icoStruc.writeByte(ICO_DIR_ENTRY.bWidth);
            icoStruc.writeByte(ICO_DIR_ENTRY.bHeight);
            icoStruc.writeByte(ICO_DIR_ENTRY.bColorCount);
            icoStruc.writeByte(ICO_DIR_ENTRY.bReserved);
            icoStruc.writeWord(ICO_DIR_ENTRY.wPlanes);
            icoStruc.writeWord(ICO_DIR_ENTRY.wBitcount);
            icoStruc.writeDWord(ICO_DIR_ENTRY.dwBytesInRes);
            icoStruc.writeDWord(ICO_DIR_ENTRY.dwImageOffset);
    
            const icoData = new Uint8Array(icoStruc.data.byteLength + icon.data.length);
            icoData.set(new Uint8Array(icoStruc.data.buffer), 0);
            icoData.set(icon.data, icoStruc.data.byteLength);
            icon.data = icoData;

        }

        return icon;
    }

    function getIconMetadataFromIconGroups(iconId) {
        const iconGroup = this.getResourcesOfType(RT_RESOURCE_TYPES.RT_GROUP_ICON)[0][0];
        return iconGroup.find(entry => (entry.wId + '') === ('' + iconId));
    }

    function parseVsVersionInfo(vsVersionInfoFactory) {
        return new VsVersionInfo().parseBytes(vsVersionInfoFactory())[0];
    }

    this.getDosHeader = function() {
        return this.IMAGE_DOS.dosHeader;
    }

    this.getPeHeader = function() {
        return this.IMAGE_DOS.peHeader;
    }

    this.getPeOptHeader = function() {
        return this.IMAGE_DOS.peOptHeader;
    }

    this.getSectionHeaders = function() {
        return this.IMAGE_DOS.sections;
    }

    this.getSectionHeader = function(sectionId) {
        return this.getSectionHeaders().filter(sec => sec.szName === sectionId)[0];
    }

    this.getResourcesOfType = function(RT_RESOURCE_TYPE) {
        // if (!(RT_RESOURCE_TYPE in this.resources)) {
        //     throw new Error('PE file does not contain resource of type ' + RT_RESOURCE_TYPE);
        // }
        switch (RT_RESOURCE_TYPE) {
            case RT_RESOURCE_TYPES.RT_GROUP_ICON:
                const groups = [];
                if (RT_RESOURCE_TYPE in this.resources) {
                    for (const groupIconDir in this.resources[RT_RESOURCE_TYPE]) {
                        const items = [];
                        for(const groupIconEntry in this.resources[RT_RESOURCE_TYPE][groupIconDir]) {
                            items.push(parseGroupIconEntry.bind(this)(this.resources[RT_RESOURCE_TYPE][groupIconDir][groupIconEntry]).Children);
                        }
                        groups.push(items);
                    }
                }
                return groups;
            case RT_RESOURCE_TYPES.RT_ICON:
                const icons = [];
                if (RT_RESOURCE_TYPE in this.resources) {
                    for (const [id, value] of Object.entries(this.resources[RT_RESOURCE_TYPE])) {
                        const iconMetadata = getIconMetadataFromIconGroups.bind(this)(id);
                        const firstLang = Object.keys(value)[0];
                        icons.push(parseIconEntry(value[firstLang], iconMetadata));
                    }
                }
                return icons;
            case RT_RESOURCE_TYPES.RT_VERSION:
                const vsInfo = [];
                if (RT_RESOURCE_TYPE in this.resources) {
                    for (const [id, value] of Object.entries(this.resources[RT_RESOURCE_TYPE])) {
                        const firstLang = Object.keys(value)[0];
                        vsInfo.push(parseVsVersionInfo(value[firstLang]));
                    }
                }
                return vsInfo;
            default: return this.resources[RT_RESOURCE_TYPE];
        }
    }
}

const DATA_DIRECTORY_TYPES = {
    EXPORT: 0,
    IMPORT: 1,
    RESOURCE: 2,
    EXCEPTION: 3,
    SECURITY: 4,
    BASERELOC: 5,
    DEBUG: 6,
    COPYRIGHT: 7,
    GLOBALPTR: 8,
    TLS: 9,
    LOAD_CONFIG: 10
};

/**
 * https://lief-project.github.io/doc/latest/api/python/pe.html#resource-types
 */
 const RT_RESOURCE_TYPES = {
    RT_CURSOR: 1,
    RT_BITMAP: 2,
    RT_ICON: 3,
    RT_MENU: 4,
    RT_DIALOG: 5,
    RT_STRING: 6,
    RT_FONTDIR: 7,
    RT_FONT: 8,
    RT_ACCELERATOR: 9,
    RT_RCDATA: 10,
    RT_MESSAGETABLE: 11,
    RT_GROUP_CURSOR: 12,
    RT_GROUP_ICON: 14,
    RT_VERSION: 16,
    RT_DLGINCLUDE: 17,
    RT_PLUGPLAY: 19,
    RT_VXD: 20,
    RT_ANICURSOR: 21,
    RT_ANIICON: 22,
    RT_HTML: 23,
    RT_MANIFEST: 24
};

PeFileParser.RT_RESOURCE_TYPES = RT_RESOURCE_TYPES;
module.exports = {
    PeFileParser
};