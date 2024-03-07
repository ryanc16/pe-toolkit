import { DataTypes } from "./data-types";
import { ImageDataDirectoryEntry } from "./image-data-directory-entry";
import { ImageDataDirectoryTable, IMAGE_DATA_DIRECTORY_TYPES } from './image-data-directory-table';

/**
 * https://blog.kowalczyk.info/articles/pefileformat.html
 * https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#optional-header-image-only
 * https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#optional-header-standard-fields-image-only
 */
export interface IMAGE_OPTIONAL_HEADER {
    //////////////////////////
    // Standard fields
    //////////////////////////

    /**
     * The optional header magic number determines whether an image is a ROM image, a PE32 (32bit), or a PE32+ (64bit) executable.
     * 0x0107 = ROM / 0x010B = PE32 / 0x020B = PE32+
     * */
    wMagic: DataTypes.WORD;
    /** Indicates major version of the linker that linked this image. */
    bMajorLinkerVersion: DataTypes.BYTE;
    /** Indicates minor version of the linker that linked this image. */
    bMinorLinkerVersion: DataTypes.BYTE;
    /** The size of the executable code (.text) section, or the sum of all code sections if there are multiple sections. */
    dwSizeOfCode: DataTypes.DWORD;
    /** The size of the initialized data section, or the sum of all such sections if there are multiple data sections. */
    dwSizeOfInitializedData: DataTypes.DWORD;
    /** The size of the uninitialized data section (.bss), or the sum of all such sections if there are multiple BSS sections. */
    dwSizeOfUninitializedData: DataTypes.DWORD;
    /**
     * This field indicates the location of the entry point for the application and,
     * perhaps more importantly to system hackers, the location of the end of the Import Address Table (IAT).
     * The address of the entry point is relative to the image base when the executable file is loaded into memory.
     * - For program images, this is the starting address.
     * - For device drivers, this is the address of the initialization function.
     * - For DLLs an entry point is optional.
     *
     * When no entry point is present, this field must be zero.
     */
    dwAddressOfEntryPoint: DataTypes.DWORD;
    /** Relative offset of code (".text" section) in loaded image. */
    dwBaseOfCode: DataTypes.DWORD;
    /**
     * Relative offset of uninitialized data (".bss" section) in loaded image.
     * PE32 contains this additional field, which is absent in PE32+, following BaseOfCode.
     */
    dwBaseOfData: DataTypes.DWORD;

    //////////////////////////
    // NT additional fields
    //////////////////////////

    /**
     * The preferred address of the first byte of image when loaded into memory; must be a multiple of 64K.
     * - The default for DLLs is 0x10000000.
     * - The default for Windows CE EXEs is 0x00010000.
     * - The default for Windows NT, Windows 2000, Windows XP, Windows 95, Windows 98, and Windows Me is 0x00400000.
     * The linker default can be overridden with the -BASE: linker switch.
     * Will be DWORD for PE32 or QWORD for PE32+
     */
    dwImageBase: DataTypes.DWORD | DataTypes.QWORD;
    /**
     * Each section is loaded into the address space of a process sequentially, beginning at ImageBase. SectionAlignment dictates the minimum amount of space a section can occupy when loaded--that is, sections are aligned on SectionAlignment boundaries.
     * Section alignment can be no less than the page size (currently 4096 bytes on the x86 platform) and must be a multiple of the page size as dictated by the behavior of Windows NT's virtual memory manager. 4096 bytes is the x86 linker default, but this can be set using the -ALIGN: linker switch.
     */
    dwSectionAlignment: DataTypes.DWORD;
    /** * Minimum granularity of chunks of information within the image file prior to loading. For example, the linker zero-pads a section body (raw data for a section) up to the nearestFileAlignment boundary in the file. This value is constrained to be a power of 2 between 512 and 65,535. */
    dwFileAlignment: DataTypes.DWORD;
    /** Indicates the major version of the Windows NT operating system. */
    wMajorOperatingSystemVersion: DataTypes.WORD;
    /** Indicates the minor version of the Windows NT operating system. */
    wMinorOperatingSystemVersion: DataTypes.WORD;
    /** Used to indicate the major version number of the application. */
    wMajorImageVersion: DataTypes.WORD;
    /** Used to indicate the minor version number of the application. */
    wMinorImageVersion: DataTypes.WORD;
    /** Indicates the Windows NT Win32 subsystem major version number. */
    wMajorSusbsystemVersion: DataTypes.WORD;
    /** Indicates the Windows NT Win32 subsystem minor version number. */
    wMinorSubsystemVersion: DataTypes.WORD;
    /** Unknown purpose, currently not used by the system and set to zero by the linker. */
    dwReserved1: DataTypes.DWORD;
    /**
     * Indicates the amount of address space to reserve in the address space for the loaded executable image. This number is influenced greatly by SectionAlignment.
     * For example, consider a system having a fixed page size of 4096 bytes. If you have an executable with 11 sections, each less than 4096 bytes, aligned on a 65,536-byte boundary;
     * the SizeOfImage field would be set to 11 * 65,536 = 720,896 (176 pages). The same file linked with 4096-byte alignment would result in 11 * 4096 = 45,056 (11 pages) for the SizeOfImage field.
     * This is a simple example in which each section requires less than a page of memory. In reality, the linker determines the exact SizeOfImage by figuring each section individually.
     * It first determines how many bytes the section requires, then it rounds up to the nearest page boundary, and finally it rounds page count to the nearest SectionAlignment boundary.
     * The total is then the sum of each section's individual requirement.
     */
    dwSizeOfImage: DataTypes.DWORD;
    /** This field indicates how much space in the file is used for representing all the file headers, including the MS-DOS header, PE file header, PE optional header, and PE section headers. The section bodies begin at this location in the file. */
    dwSizeOfHeaders: DataTypes.DWORD;
    /**
     * A checksum value is used to validate the executable file at load time.
     * The value is set and verified by the linker.
     * The algorithm used for creating these checksum values is proprietary information and will not be published.
     */
    dwCheckSum: DataTypes.DWORD;
    /** Field used to identify the target subsystem for this executable. Each of the possible subsystem values are listed in the WINNT.H file immediately after the IMAGE_OPTIONAL_HEADER structure. */
    wSubsystem: DataTypes.WORD;
    /** Flags used to indicate if a DLL image includes entry points for process and thread initialization and termination. */
    wDllCharacteristics: DataTypes.WORD;

    ////////////////////////////
    // 32 or 64 bit stack and heap reserve values
    ///////////////////////////
    /** Controls the amount of address space to reserve for the stack. The stack has a default value of 16 pages reserved. This value is set with the linker switch -STACKSIZE: */
    dwSizeOfStackReserve: DataTypes.DWORD | DataTypes.QWORD;
    /** Controls the amount of address space to commit for the stack. The stack has a default value of 1 page commited. This value is set with the linker switch -STACKSIZE: */
    dwSizeOfStackCommit: DataTypes.DWORD | DataTypes.QWORD;
    /** Controls the amount of address space to reserve for the heap. The heap has a default value of 16 pages reserved. This value is set with the linker switch -HEAPSIZE: */
    dwSizeOfHeapReserve: DataTypes.DWORD | DataTypes.QWORD;
    /** Controls the amount of address space to commit for the heap. The heap has a default value of 1 pages commited. This value is set with the linker switch -HEAPSIZE: */
    dwSizeOfHeapCommit: DataTypes.DWORD | DataTypes.QWORD;

    /** Tells the loader whether to break on load, debug on load, or the default, which is to let things run normally. */
    dwLoaderFlags: DataTypes.DWORD;
    /**
     * This field identifies the length of the DataDirectory array that follows.
     * It is important to note that this field is used to identify the size of the array, not the number of valid entries in the array.
     * This value is always set to 16 by the current tools.
     */
    dwNumberOfRvaAndSizes: DataTypes.DWORD;
}

export enum OptionalHeaderMagicNumber {
    ROM = 0x0107,
    PE32 = 0x010B,
    PE32Plus = 0x020B
}

export const OptionalHeaderCpuArchitectureLookup = {
    [OptionalHeaderMagicNumber.PE32]: 'x86',
    [OptionalHeaderMagicNumber.PE32Plus]: 'x64'
}

export const OptionalHeaderMagicNumberLookup: Record<number, string> = {
    [OptionalHeaderMagicNumber.ROM]: 'Identifies as a ROM image.',
    [OptionalHeaderMagicNumber.PE32]: 'Identifies as a PE32 (32bit) executable file.',
    [OptionalHeaderMagicNumber.PE32Plus]: 'Identifies as a PE32+ (64bit) executable.'
}

export const SubsystemLookup: Record<number, string> = {
    0x0000: 'UNKNOWN - An unknown subsystem',
    0x0001: 'NATIVE - Doesn\'t require a subsystem (such as a device driver)',
    0x0002: 'WINDOWS_GUI - Runs in the Windows GUI subsystem',
    0x0003: 'WINDOWS_CUI - Runs in the Windows character subsystem (a console app)',
    0x0005: 'OS2_CUI - Runs in the OS/2 character subsystem (OS/2 1.x apps only)',
    0x0007: 'POSIX_CUI - Runs in the Posix character subsystem',
    0x0008: 'NATIVE_WINDOWS - Native Win9x driver',
    0x0009: 'WINDOWS_CE_GUI - Windows CE',
    0x000A: 'EFI_APPLICATION - An Extensible Firmware Interface (EFI) application',
    0x000B: 'EFI_BOOT_SERVICE_DRIVER - An EFI driver with boot services',
    0x000C: 'EFI_RUNTIME_DRIVER - An EFI driver with run-time services',
    0x000D: 'EFI_ROM - An EFI ROM image',
    0x000E: 'XBOX - XBOX',
    0x0010: 'WINDOWS_BOOT_APPLICATION - Windows boot application'
}

/**
 * https://www.aldeid.com/wiki/PE-Portable-executable#DLL_Characteristics
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-image_optional_header32
 */
export const DllCharacteristicsLookup: Record<number, string> = {
    0x0000: 'None',
    0x0001: 'RESERVED - must be zero.',
    0x0002: 'RESERVED - must be zero.',
    0x0004: 'RESERVED - must be zero.',
    0x0008: 'RESERVED - must be zero.',
    0x0020: 'HIGH_ENTROPY_VA - ASLR with 64 bit address space.',
    0x0040: 'DYNAMIC_BASE - DLL can be relocated at load time.',
    0x0080: 'FORCE_INTEGRITY - Code integrity checks are enforced.',
    0x0100: 'NX_COMPAT - Image is NX compatible.',
    0x0200: 'NO_ISOLATION - Isolation aware, but do not isolate the image.',
    0x0400: 'NO_SEH - Does not use structured exception (SE) handling. No SE handler may be called in this image.',
    0x0800: 'NO_BIND - Do not bind the image.',
    0x1000: 'RESERVED - must be zero.',
    0x2000: 'WDM_DRIVER - A WDM driver.',
    0x4000: 'GUARD_CF - Image supports Control Flow Guard.',
    0x8000: 'TERMINAL_SERVER_AWARE - Terminal Server aware.'
    // 0x0001: 'Call when DLL is first loaded into a process\'s address space',
    // 0x0002: 'Call when a thread terminates',
    // 0x0004: 'Call when a thread starts up',
    // 0x0008: 'Call when DLL exits'
}

export const LoaderFlagsLookup: Record<number, string> = {
    0x0001: 'Invoke a breakpoint instruction before starting the process',
    0x0002: 'Invoke a debugger on the process after it\'s been loaded'
}

export function IMAGE_OPTIONAL_HEADER(values?: Partial<IMAGE_OPTIONAL_HEADER>): IMAGE_OPTIONAL_HEADER {
    return {
        //////////////////////////
        // Standard fields
        //////////////////////////
        wMagic: 0x0000,
        bMajorLinkerVersion: 0x00,
        bMinorLinkerVersion: 0x00,
        dwSizeOfCode: 0x00000000,
        dwSizeOfInitializedData: 0x00000000,
        dwSizeOfUninitializedData: 0x00000000,
        dwAddressOfEntryPoint: 0x00000000,
        dwBaseOfCode: 0x00000000,
        dwBaseOfData: 0x00000000,

        //////////////////////////
        // NT additional fields
        //////////////////////////
        dwImageBase: 0x00000000,
        dwSectionAlignment: 0x00000000,
        dwFileAlignment: 0x00000000,
        wMajorOperatingSystemVersion: 0x0000,
        wMinorOperatingSystemVersion: 0x0000,
        wMajorImageVersion: 0x0000,
        wMinorImageVersion: 0x0000,
        wMajorSusbsystemVersion: 0x0000,
        wMinorSubsystemVersion: 0x0000,
        dwReserved1: 0x00000000,
        dwSizeOfImage: 0x00000000,
        dwSizeOfHeaders: 0x00000000,
        dwCheckSum: 0x00000000,
        wSubsystem: 0x0000,
        wDllCharacteristics: 0x0000,
        ////////////////////////////
        // 32 or 64 bit stack and heap reserve values
        ///////////////////////////
        dwSizeOfStackReserve: 0x00000000,
        dwSizeOfStackCommit: 0x00000000,
        dwSizeOfHeapReserve: 0x00000000,
        dwSizeOfHeapCommit: 0x00000000,

        dwLoaderFlags: 0x00000000,
        dwNumberOfRvaAndSizes: 0x00000000,
        ...values
    };
}

export class ImageOptionalHeader {

    protected struct: IMAGE_OPTIONAL_HEADER;
    /**
     * The data directory indicates where to find other important components of executable information in the file.
     * It is really nothing more than an array of IMAGE_DATA_DIRECTORY structures that are located at the end of the optional header structure.
     * The current PE file format defines 16 (?) possible data directories, 11 of which are now being used.
     */
    private DataDirectory: ImageDataDirectoryTable;

    constructor(struct: IMAGE_OPTIONAL_HEADER, dataDirectory: ImageDataDirectoryTable) {
        this.struct = IMAGE_OPTIONAL_HEADER(struct);
        this.DataDirectory = dataDirectory;
    }

    public static isMagicNumberROM(wMagic: DataTypes.DWORD): boolean {
        return wMagic === OptionalHeaderMagicNumber.ROM;
    }

    public static isMagicNumber32Bit(wMagic: DataTypes.WORD): boolean {
        return wMagic === OptionalHeaderMagicNumber.PE32;
    }

    public static isMagicNumber64Bit(wMagic: DataTypes.WORD): boolean {
        return wMagic === OptionalHeaderMagicNumber.PE32Plus;
    }

    public getCpuArchitecture(): string {
        if (this.struct.wMagic in OptionalHeaderCpuArchitectureLookup) {
            return OptionalHeaderCpuArchitectureLookup[this.struct.wMagic as keyof typeof OptionalHeaderCpuArchitectureLookup];
        } else {
            return 'Unknown';
        }
    }

    public getMagic() {
        const value = this.struct.wMagic.toString(16).padStart(4, "0");
        const meaning = this.struct.wMagic in OptionalHeaderMagicNumberLookup ? OptionalHeaderMagicNumberLookup[this.struct.wMagic] : 'Unknown';
        return { value, meaning };
    }

    public getMajorLinkerVersion(): number {
        return this.struct.bMajorLinkerVersion;
    }

    public getMinorLinkerVersion(): number {
        return this.struct.bMinorLinkerVersion;
    }

    public getSizeOfCode(): number {
        return this.struct.dwSizeOfCode;
    }

    public getSizeOfInitializedData(): number {
        return this.struct.dwSizeOfInitializedData;
    }

    public getSizeOfUninitializedData(): number {
        return this.struct.dwSizeOfUninitializedData;
    }

    public getAddressOfEntryPoint(): string {
        return this.struct.dwAddressOfEntryPoint.toString(16).padStart(8, "0");
    }

    public getBaseOfCode(): string {
        return this.struct.dwBaseOfCode.toString(16).padStart(8, "0");
    }

    public getBaseOfData(): string {
        return this.struct.dwBaseOfData.toString(16).padStart(8, "0");
    }

    public getImageBase(): string {
        if (typeof this.struct.dwImageBase === DataTypes.QWORD) {
            return this.struct.dwImageBase.toString(16).padStart(16, "0");
        } else {
            return this.struct.dwImageBase.toString(16).padStart(8, "0");
        }
    }

    public getSectionAlignment(): number {
        return this.struct.dwSectionAlignment;
    }

    public getFileAlignment(): number {
        return this.struct.dwFileAlignment;
    }

    public getMajorOperatingSystemVersion(): number {
        return this.struct.wMajorOperatingSystemVersion;
    }

    public getMinorOperatingSystemVersion(): number {
        return this.struct.wMinorOperatingSystemVersion;
    }

    public getMajorImageVersion(): number {
        return this.struct.wMajorImageVersion;
    }

    public getMinorImageVersion(): number {
        return this.struct.wMinorImageVersion;
    }

    public getMajorSubsystemVersion(): number {
        return this.struct.wMajorSusbsystemVersion;
    }

    public getMinorSubsystemVersion(): number {
        return this.struct.wMinorSubsystemVersion;
    }

    public getSizeOfImage(): number {
        return this.struct.dwSizeOfImage;
    }

    public getSizeOfHeaders(): number {
        return this.struct.dwSizeOfHeaders;
    }

    public getChecksum(): string {
        return this.struct.dwCheckSum.toString(16).padStart(8, "0");
    }

    public getSubsystem() {
        const value = this.struct.wSubsystem.toString(16).padStart(4, "0");
        const meaning = this.struct.wSubsystem in SubsystemLookup ? SubsystemLookup[this.struct.wSubsystem] : 'Unknown';
        return { value, meaning };
    }

    public getDllCharacteristics() {
        const value = this.struct.wDllCharacteristics.toString(16).padStart(4, "0");
        const meaning: string[] = [];
        for (const key in DllCharacteristicsLookup) {
            if ((this.struct.wDllCharacteristics & parseInt(key)) !== 0) {
                meaning.push(`(0x${parseInt(key).toString(16).padStart(4, "0")}) ${DllCharacteristicsLookup[key]}`);
            }
        }
        return { value, meaning };
    }

    public getSizeOfStackReserve(): string {
        if (typeof this.struct.dwSizeOfStackReserve === 'bigint') {
            return this.struct.dwSizeOfStackReserve.toString(16).padStart(16, "0");
        } else {
            return this.struct.dwSizeOfStackReserve.toString(16).padStart(8, "0");
        }
    }

    public getSizeOfStackCommit(): string {
        if (typeof this.struct.dwSizeOfStackCommit === 'bigint') {
            return this.struct.dwSizeOfStackCommit.toString(16).padStart(16, "0");
        } else {
            return this.struct.dwSizeOfStackCommit.toString(16).padStart(8, "0");
        }
    }

    public getSizeOfHeapReserve(): string {
        if (typeof this.struct.dwSizeOfHeapReserve === 'bigint') {
            return this.struct.dwSizeOfHeapReserve.toString(16).padStart(16, "0");
        } else {
            return this.struct.dwSizeOfHeapReserve.toString(16).padStart(8, "0");
        }
    }

    public getSizeOfHeapCommit(): string {
        if (typeof this.struct.dwSizeOfHeapCommit === 'bigint') {
            return this.struct.dwSizeOfHeapCommit.toString(16).padStart(16, "0");
        } else {
            return this.struct.dwSizeOfHeapCommit.toString(16).padStart(8, "0");
        }
    }

    public getLoaderFlags() {
        const value = this.struct.dwLoaderFlags.toString(16).padStart(8, "0");
        const meaning = this.struct.dwLoaderFlags in LoaderFlagsLookup ? LoaderFlagsLookup[this.struct.dwLoaderFlags] : 'None';
        return { value, meaning };
    }

    public getNumberOfRvaAndSizes(): number {
        return this.struct.dwNumberOfRvaAndSizes;
    }

    public getDataDirectory(): ImageDataDirectoryTable {
        return this.DataDirectory;
    }

    private formattedDataDirectory() {
        return this.getDataDirectory().toObject();
    }

    public getStruct(): IMAGE_OPTIONAL_HEADER {
        return this.struct;
    }

    public toObject() {
        return {
            magic: this.getMagic(),
            majorLinkerVersion: this.getMajorLinkerVersion(),
            minorLinkerVersion: this.getMinorLinkerVersion(),
            sizeOfCode: this.getSizeOfCode(),
            sizeOfInitializedData: this.getSizeOfInitializedData(),
            sizeOfUninitializedData: this.getSizeOfUninitializedData(),
            addressOfEntryPoint: this.getAddressOfEntryPoint(),
            baseOfCode: this.getBaseOfCode(),
            baseOfData: this.getBaseOfData(),
            /////
            imageBase: this.getImageBase(),
            sectionAlignment: this.getSectionAlignment(),
            fileAlignment: this.getFileAlignment(),
            majorOperatingSystemVersion: this.getMajorOperatingSystemVersion(),
            minorOperatingSystemVersion: this.getMinorOperatingSystemVersion(),
            majorImageVersion: this.getMajorImageVersion(),
            minorImageVersion: this.getMinorImageVersion(),
            majorSubsystemVersion: this.getMajorSubsystemVersion(),
            minorSubsystemVersion: this.getMinorSubsystemVersion(),
            sizeOfImage: this.getSizeOfImage(),
            sizeOfHeaders: this.getSizeOfHeaders(),
            checksum: this.getChecksum(),
            subsystem: this.getSubsystem(),
            dllCharacteristics: this.getDllCharacteristics(),
            sizeOfStackReserve: this.getSizeOfStackReserve(),
            sizeOfStackCommit: this.getSizeOfStackCommit(),
            sizeOfHeapReserve: this.getSizeOfHeapReserve(),
            sizeOfHeapCommit: this.getSizeOfHeapCommit(),
            loaderFlags: this.getLoaderFlags(),
            numberOfRvaAndSizes: this.getNumberOfRvaAndSizes(),
            DataDirectory: this.formattedDataDirectory()
        };
    }
}
