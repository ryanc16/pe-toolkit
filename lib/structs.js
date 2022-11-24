
function IMAGE_DOS_HEADER() {
    return {
        /** Magic header number, MZ, etc.. */
        wMagic: 0x0000,
        /** Bytes on last page of file */
        wCblp: 0x0000,
        /** Pages in file */
        wCp: 0x0000,
        /** Relocations */
        wCrlc: 0x0000,
        /** Size of header in paragraphs */
        wCparHdr: 0x0000,
        /** Minimum extra paragraphs needed */
        wMinAlloc: 0x0000,
        /** Maximum extra paragraphs needed */
        wMaxAlloc: 0x0000,
        /** Initial (relative) SS value */
        wSs: 0x0000,
        /** Initial SP (stack pointer?) value */
        wSp: 0x0000,
        /** Checksum */
        wCsum: 0x0000,
        /** Initial IP (instruction pointer?) value  */
        wIp: 0x0000,
        /** Initial (relative) CS value */
        wCs: 0x0000,
        /** File address of relocation table */
        wLfArlc: 0x0000,
        /** Overlay number */
        wOvNo: 0x0000,
        /** Reserved words */
        wRes: [0x00, 0x00, 0x00, 0x00],
        /** OEM identifier (for e_oeminfo) */
        wOemId: 0x0000,
        /** OEM information; e_oemid specific */
        wOemInfo: 0x0000,
        /** Reserved words */
        wRes2: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        /** File address of new exe header */
        dwLfAnew: 0x00000000
    };
}

/**
 * https://docs.microsoft.com/en-us/previous-versions/ms809762(v=msdn.10)
 */
function IMAGE_FILE_HEADER() {
    return {
        ntSig: 0x0000,
        /** The CPU that this file is intended for.
         * The following CPU IDs are defined:
         * @example
         * | 0x14d  | Intel i860             |
         * | 0x14c  | Intel i386, i486, i586 |
         * | 0x162  | MIPS R3000             |
         * | 0x166  | MIPS R4000             |
         * | 0x183  | DEC Alpha AXP          |
         */
        wMachine: 0x0000,
        /** The number of sections in the file. (.text, .bss. .data, .rsrc) */
        wNumberOfSections: 0x0000,
        /** The time that the linker (or compiler for an OBJ file) produced this file. This field holds the number of seconds since December 31st, 1969, at 4:00 P.M. */
        dwTimeDateStamp: 0x00000000,
        /**
         * The file offset of the COFF symbol table. This field is only used in OBJ files and PE files with COFF debug information.
         * PE files support multiple debug formats, so debuggers should refer to the IMAGE_DIRECTORY_ENTRY_DEBUG entry in the data directory (defined later).
         */
        dwPointerToSymbolTable: 0x00000000,
        /** The number of symbols in the COFF symbol table. See above. */
        dwNumberOfSymbols: 0x00000000,
        /**
         * The size of an optional header that can follow this structure.
         * In OBJs, the field is 0.
         * In executables, it is the size of the IMAGE_OPTIONAL_HEADER structure that follows this structure.
         */
        wSizeOfOptionalHeader: 0x0000,
        /**
         * Flags with information about the file.
         * Some important fields:
         * @example
         * | 0x0001 | There are not relocations in the file          |
         * | 0x0002 | File is an executable image (not a OBJ or LIB) |
         * | 0x2000 | File is a dynamic-link library, not a program  |
         */
        wCharacteristics: 0x0000
    };
}

/**
 * https://blog.kowalczyk.info/articles/pefileformat.html
 * @returns 
 */
function IMAGE_OPTIONAL_HEADER() {
    return {
        //
        // Standard fields
        //
        wMagic: 0x0000,
        /** Indicates major version of the linker that linked this image. */
        bMajorLinkerVersion: 0x00,
        /** Indicates minor version of the linker that linked this image. */
        bMinorLinkerVersion: 0x00,
        /** Size of executable code. */
        dwSizeOfCode: 0x00000000,
        dwSizeOfInitializedData: 0x00000000,
        /** Size of uninitialized data (".bss" section) in loaded image. */
        dwSizeOfUninitializedData: 0x00000000,
        /** This field indicates the location of the entry point for the application and, perhaps more importantly to system hackers, the location of the end of the Import Address Table (IAT). */
        dwAddressOfEntryPoint: 0x00000000,
        /** Relative offset of code (".text" section) in loaded image. */
        dwBaseOfCode: 0x00000000,
        /** Relative offset of uninitialized data (".bss" section) in loaded image. */
        dwBaseOfData: 0x00000000,
        //
        // NT additional fields
        //
        /** Preferred base address in the address space of a process to map the executable image to. The linker defaults to 0x00400000, but you can override the default with the -BASE: linker switch. */
        dwImageBase: 0x00000000,
        /**
         * Each section is loaded into the address space of a process sequentially, beginning at ImageBase. SectionAlignment dictates the minimum amount of space a section can occupy when loaded--that is, sections are aligned on SectionAlignment boundaries.
         * Section alignment can be no less than the page size (currently 4096 bytes on the x86 platform) and must be a multiple of the page size as dictated by the behavior of Windows NT's virtual memory manager. 4096 bytes is the x86 linker default, but this can be set using the -ALIGN: linker switch.
         */
        dwSectionAlignment: 0x00000000,
        /**
         * Minimum granularity of chunks of information within the image file prior to loading. For example, the linker zero-pads a section body (raw data for a section) up to the nearestFileAlignment boundary in the file. This value is constrained to be a power of 2 between 512 and 65,535.
         */
        dwFileAlignment: 0x00000000,
        /** Indicates the major version of the Windows NT operating system. */
        wMajorOperatingSystemVersion: 0x0000,
        /** Indicates the minor version of the Windows NT operating system. */
        wMinorOperatingSystemVersion: 0x0000,
        /** Used to indicate the major version number of the application. */
        wMajorImageVersion: 0x0000,
        /** Used to indicate the minor version number of the application. */
        wMinorImageVersion: 0x0000,
        /** Indicates the Windows NT Win32 subsystem major version number. */
        wMajorSusbsystemVersion: 0x0000,
        /** Indicates the Windows NT Win32 subsystem minor version number. */
        wMinorSusbsystemVersion: 0x0000,
        /** Unknown purpose, currently not used by the system and set to zero by the linker. */
        dwReserved1: 0x00000000,
        /**
         * Indicates the amount of address space to reserve in the address space for the loaded executable image. This number is influenced greatly by SectionAlignment.
         * For example, consider a system having a fixed page size of 4096 bytes. If you have an executable with 11 sections, each less than 4096 bytes, aligned on a 65,536-byte boundary,
         * the SizeOfImage field would be set to 11 * 65,536 = 720,896 (176 pages). The same file linked with 4096-byte alignment would result in 11 * 4096 = 45,056 (11 pages) for the SizeOfImage field.
         * This is a simple example in which each section requires less than a page of memory. In reality, the linker determines the exact SizeOfImage by figuring each section individually.
         * It first determines how many bytes the section requires, then it rounds up to the nearest page boundary, and finally it rounds page count to the nearest SectionAlignment boundary.
         * The total is then the sum of each section's individual requirement.
         */
        dwSizeOfImage: 0x00000000,
        /** This field indicates how much space in the file is used for representing all the file headers, including the MS-DOS header, PE file header, PE optional header, and PE section headers. The section bodies begin at this location in the file. */
        dwSizeOfHeaders: 0x00000000,
        /**
         * A checksum value is used to validate the executable file at load time.
         * The value is set and verified by the linker.
         * The algorithm used for creating these checksum values is proprietary information and will not be published.
         */
        dwCheckSum: 0x00000000,
        /** Field used to identify the target subsystem for this executable. Each of the possible subsystem values are listed in the WINNT.H file immediately after the IMAGE_OPTIONAL_HEADER structure. */
        wSubsystem: 0x0000,
        /** Flags used to indicate if a DLL image includes entry points for process and thread initialization and termination. */
        wDllCharacteristics: 0x0000,
        /** Controls the amount of address space to reserve for the stack. The stack has a default value of 16 pages reserved. This value is set with the linker switch -STACKSIZE: */
        dwSizeOfStackReserve: 0x00000000,
        /** Controls the amount of address space to commit for the stack. The stack has a default value of 1 page commited. This value is set with the linker switch -STACKSIZE: */
        dwSizeOfStackCommit: 0x00000000,
        /** Controls the amount of address space to reserve for the heap. The heap has a default value of 16 pages reserved. This value is set with the linker switch -HEAPSIZE: */
        dwSizeOfHeapReserve: 0x00000000,
        /** Controls the amount of address space to commit for the heap. The heap has a default value of 1 pages commited. This value is set with the linker switch -HEAPSIZE: */
        dwSizeOfHeapCommit: 0x00000000,
        /** Tells the loader whether to break on load, debug on load, or the default, which is to let things run normally. */
        dwLoaderFlags: 0x00000000,
        /**
         * This field identifies the length of the DataDirectory array that follows.
         * It is important to note that this field is used to identify the size of the array, not the number of valid entries in the array.
         * This value is always set to 16 by the current tools.
         */
        dwNumberOfRvaAndSizes: 0x00000000,
        /**
         * The data directory indicates where to find other important components of executable information in the file.
         * It is really nothing more than an array of IMAGE_DATA_DIRECTORY structures that are located at the end of the optional header structure.
         * The current PE file format defines 16 (?) possible data directories, 11 of which are now being used.
         */
        DataDirectory: []
    };
}

function IMAGE_DATA_DIRECTORY() {
    return {
        dwVirtualAddress: 0x00000000,
        dwSize: 0x00000000
    };
}

function IMAGE_SECTION_HEADER() {
    return {
        szName: 0x0000000000000000,
        dwPhysicalAddressUnionVirtualSize: 0x00000000,
        dwVirtualAddress: 0x00000000,
        dwSizeOfRawData: 0x00000000,
        dwPointerToRawData: 0x00000000,
        dwPointerToRelocations: 0x00000000,
        dwPointerToLineNumbers: 0x00000000,
        wNumberOfRelocations: 0x0000,
        wNumberOfLinenumbers: 0x0000,
        dwCharacteristics: 0x00000000
    };
}

function IMAGE_RESOURCE_DIRECTORY() {
    return {
        dwCharacteristics: 0x00000000,
        dwTimeDateStamp: 0x00000000,
        wMajorVersion: 0x0000,
        wMinorVersion: 0x0000,
        wNumberOfNamedEntries: 0x0000,
        wNumberOfIdEntries: 0x0000,
        Children: {}
    };
}

function IMAGE_RESOURCE_DIRECTORY_ENTRY() {
    return {
        dwName: 0x00000000,
        dwOffsetToData: 0x00000000,
        isLeaf: false,
        Children: {}
    };
}

function IMAGE_RESOURCE_DATA_ENTRY() {
    return {
        dwOffsetToData: 0x00000000,
        dwSize: 0x00000000,
        dwCodePage: 0x00000000,
        dwReserved: 0x00000000,
        data: () => {[]}
    };
}

function GROUP_ICON_DIR() {
    return {
        wReserved: 0x0000,
        wType: 0x0000,
        wCount: 0x0000,
        Children: []
    };
}

function GROUP_ICON_DIR_ENTRY() {
    return {
        bWidth: 0x00,
        bHeight: 0x00,
        bColorCount: 0x00,
        bReserved: 0x00,
        wPlanes: 0x0000,
        wBitCount: 0x0000,
        dwBytesInRes: 0x00000000,
        wId: 0x0000
    }
}

module.exports = {
    IMAGE_DOS_HEADER,
    IMAGE_FILE_HEADER,
    IMAGE_OPTIONAL_HEADER,
    IMAGE_DATA_DIRECTORY,
    IMAGE_SECTION_HEADER,
    IMAGE_RESOURCE_DIRECTORY,
    IMAGE_RESOURCE_DIRECTORY_ENTRY,
    IMAGE_RESOURCE_DATA_ENTRY,
    GROUP_ICON_DIR,
    GROUP_ICON_DIR_ENTRY
};