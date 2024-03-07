import { ByteString, DataTypes } from "./data-types";

/**
 * https://learn.microsoft.com/en-us/previous-versions/ms809762(v=msdn.10)
 */
export interface IMAGE_SECTION_HEADER {
    /**
     * This is an 8-byte ANSI name (not UNICODE) that names the section.
     * Most section names start with a . (such as ".text"), but this is not a requirement,
     * as some PE documentation would have you believe. You can name your own sections with
     * either the segment directive in assembly language, or with "#pragma data_seg" and "#pragma code_seg"
     * in the Microsoft C/C++ compiler. It's important to note that if the section name takes up
     * the full 8 bytes, there's no NULL terminator byte. If you're a printf devotee, you can use %.8s
     * to avoid copying the name string to another buffer where you can NULL-terminate it.
     * */
    szName: ByteString;
    /**
     * This field has different meanings, in EXEs or OBJs. In an EXE, it holds the actual size of the code or data.
     * This is the size before rounding up to the nearest file alignment multiple.
     * The SizeOfRawData field (seems a bit of a misnomer) later on in the structure holds the rounded up value.
     * The Borland linker reverses the meaning of these two fields and appears to be correct.
     * For OBJ files, this field indicates the physical address of the section. The first section starts at address 0.
     * To find the physical address in an OBJ file of the next section,
     * add the SizeOfRawData value to the physical address of the current section.
     */
    dwPhysicalAddressUnionVirtualSize: DataTypes.DWORD;
    /**
     * In EXEs, this field holds the RVA to where the loader should map the section.
     * To calculate the real starting address of a given section in memory,
     * add the base address of the image to the section's VirtualAddress stored in this field.
     * With Microsoft tools, the first section defaults to an RVA of 0x1000.
     * In OBJs, this field is meaningless and is set to 0.
     */
    dwVirtualAddress: DataTypes.DWORD;
    /**
     * In EXEs, this field contains the size of the section after it's been rounded up to the file alignment size.
     * For example, assume a file alignment size of 0x200. If the VirtualSize field from above says that the section
     * is 0x35A bytes in length, this field will say that the section is 0x400 bytes long.
     * In OBJs, this field contains the exact size of the section emitted by the compiler or assembler.
     * In other words, for OBJs, it's equivalent to the VirtualSize field in EXEs.
     */
    dwSizeOfRawData: DataTypes.DWORD;
    /**
     * This is the file-based offset of where the raw data emitted by the compiler or assembler can be found.
     * If your program memory maps a PE or COFF file itself (rather than letting the operating system load it),
     * this field is more important than the VirtualAddress field.
     * You'll have a completely linear file mapping in this situation, so you'll find the data for the sections at this offset,
     * rather than at the RVA specified in the VirtualAddress field.
     */
    dwPointerToRawData: DataTypes.DWORD;
    /**
     * In OBJs, this is the file-based offset to the relocation information for this section.
     * The relocation information for each OBJ section immediately follows the raw data for that section.
     * In EXEs, this field (and the subsequent field) are meaningless, and set to 0.
     * When the linker creates the EXE, it resolves most of the fixups, leaving only base address relocations and
     * imported functions to be resolved at load time.
     * The information about base relocations and imported functions is kept in their own sections,
     * so there's no need for an EXE to have per-section relocation data following the raw section data.
     */
    dwPointerToRelocations: DataTypes.DWORD;
    /**
     * This is the file-based offset of the line number table.
     * A line number table correlates source file line numbers to the addresses of the code generated for a given line.
     * In modern debug formats like the CodeView format, line number information is stored as part of the debug information.
     * In the COFF debug format, however, the line number information is stored separately from the symbolic name/type information.
     * Usually, only code sections (such as .text) have line numbers.
     * In EXE files, the line numbers are collected towards the end of the file, after the raw data for the sections.
     * In OBJ files, the line number table for a section comes after the raw section data and the relocation table for that section.
     */
    dwPointerToLineNumbers: DataTypes.DWORD;
    /**
     * The number of relocations in the relocation table for this section (the PointerToRelocations field from above).
     * This field seems relevant only for OBJ files.
     */
    wNumberOfRelocations: DataTypes.WORD;
    /**
     * The number of line numbers in the line number table for this section (the PointerToLinenumbers field from above).
     */
    wNumberOfLineNumbers: DataTypes.WORD;
    /**
     * What most programmers call flags, the COFF/PE format calls characteristics.
     * This field is a set of flags that indicate the section's attributes (such as code/data, readable, or writeable,).
     * For a complete list of all possible section attributes, see the IMAGE_SCN_XXX_XXX #defines in WINNT.H.
     * Some of the more important flags are shown below:
     * @example
     * - 0x00000020 | "This section contains code. Usually set in conjunction with the executable flag (0x80000000)."
     * - 0x00000040 | "This section contains initialized data. Almost all sections except executable and the .bss section have this flag set."
     * - 0x00000080 | "This section contains uninitialized data (for example, the .bss section)."
     * - 0x00000200 | "This section contains comments or some other type of information. \
     *                 A typical use of this section is the .drectve section emitted by the compiler, which contains commands for the linker."
     * - 0x00000800 | "This section's contents shouldn't be put in the final EXE file. \
     *                 These sections are used by the compiler/assembler to pass information to the linker."
     * - 0x02000000 | "This section can be discarded, since it's not needed by the process once it's been loaded. \
     *                 The most common discardable section is the base relocations (.reloc)."
     * - 0x10000000 | "This section is shareable. When used with a DLL, the data in this section will be shared among all processes using the DLL. \
     *                 The default is for data sections to be nonshared, meaning that each process using a DLL gets its own copy of this section's data. \
     *                 In more technical terms, a shared section tells the memory manager to set the page mappings for this section such that all processes \
     *                 using the DLL refer to the same physical page in memory. To make a section shareable, use the SHARED attribute at link time. \
     *                 For example: `LINK /SECTION:MYDATA,RWS ...` tells the linker that the section called MYDATA should be readable, writeable, and shared."
     * - 0x20000000 | "This section is executable. This flag is usually set whenever the "contains code" flag (0x00000020) is set."
     * - 0x40000000 | "This section is readable. This flag is almost always set for sections in EXE files."
     * - 0x80000000 | "The section is writeable. If this flag isn't set in an EXE's section, the loader should mark the memory mapped pages as read-only or execute-only. \
     *                 Typical sections with this attribute are .data and .bss. Interestingly, the .idata section also has this attribute set."
     */
    dwCharacteristics: DataTypes.DWORD;
}

export const SectionHeaderCharacteristicsLookup: Record<number, string> = {
    0x00000020: "This section contains code. Usually set in conjunction with the executable flag (0x80000000).",
    0x00000040: "This section contains initialized data. Almost all sections except executable and the .bss section have this flag set.",
    0x00000080: "This section contains uninitialized data. (for example, the .bss section).",
    0x00000200: "This section contains comments or some other type of information. \n\
A typical use of this section is the .drectve section emitted by the compiler, which contains commands for the linker.",
    0x00000800: "This section's contents shouldn't be put in the final EXE file. \n\
These sections are used by the compiler/assembler to pass information to the linker.",
    0x02000000: "This section can be discarded. It's not needed by the process once it's been loaded. \n\
The most common discardable section is the base relocations (.reloc).",
    0x10000000: "This section is shareable. When used with a DLL, the data in this section will be shared among all processes using the DLL. \n\
The default is for data sections to be nonshared, meaning that each process using a DLL gets its own copy of this section's data. \n\
In more technical terms, a shared section tells the memory manager to set the page mappings for this section such that all processes \n\
using the DLL refer to the same physical page in memory. To make a section shareable, use the SHARED attribute at link time. \n\
For example: `LINK /SECTION:MYDATA,RWS ...` tells the linker that the section called MYDATA should be readable, writeable, and shared.",
    0x20000000: "This section is executable. This flag is usually set whenever the \"contains code\" flag (0x00000020) is set.",
    0x40000000: "This section is readable. This flag is almost always set for sections in EXE files.",
    0x80000000: "The section is writeable. If this flag isn't set in an EXE's section, the loader should mark the memory mapped pages as read-only or execute-only. \n\
Typical sections with this attribute are .data and .bss. Interestingly, the .idata section also has this attribute set."
}

export function IMAGE_SECTION_HEADER(values?: Partial<IMAGE_SECTION_HEADER>): IMAGE_SECTION_HEADER {
    return {
        szName: '',
        dwPhysicalAddressUnionVirtualSize: 0x00000000,
        dwVirtualAddress: 0x00000000,
        dwSizeOfRawData: 0x00000000,
        dwPointerToRawData: 0x00000000,
        dwPointerToRelocations: 0x00000000,
        dwPointerToLineNumbers: 0x00000000,
        wNumberOfRelocations: 0x0000,
        wNumberOfLineNumbers: 0x0000,
        dwCharacteristics: 0x00000000,
        ...values
    };
}

export class ImageSectionHeader {

    private struct: IMAGE_SECTION_HEADER;

    constructor(values: IMAGE_SECTION_HEADER) {
        this.struct = IMAGE_SECTION_HEADER(values);
    }

    public getName(): string {
        return this.struct.szName;
    }

    public getVirtualAddress(): string {
        return this.struct.dwVirtualAddress.toString(16).padStart(8, "0");
    }

    public getSizeOfRawData(): number {
        return this.struct.dwSizeOfRawData;
    }

    public getPointerToRawData(): string {
        return this.struct.dwPointerToRawData.toString(16).padStart(8, "0");
    }

    public getPointerToRelocations(): string {
        return this.struct.dwPointerToRelocations.toString(16).padStart(8, "0");
    }

    public getPointerToLineNumbers(): string {
        return this.struct.dwPointerToLineNumbers.toString(16).padStart(8, "0");
    }

    public getNumberOfRelocations(): number {
        return this.struct.wNumberOfRelocations;
    }

    public getNumberOfLineNumbers(): number {
        return this.struct.wNumberOfLineNumbers;
    }

    public getCharacteristics(): { value: string, meaning: string[] } {
        const meaning = [];
        for (const key in SectionHeaderCharacteristicsLookup) {
            if ((this.struct.dwCharacteristics & parseInt(key)) !== 0) {
                meaning.push(`(0x${parseInt(key).toString(16).padStart(8, '0')}) ${SectionHeaderCharacteristicsLookup[key]}`);
            }
        }
        return { value: this.struct.dwCharacteristics.toString(16).padStart(8, "0"), meaning };
    }

    public getStruct(): IMAGE_SECTION_HEADER {
        return this.struct;
    }

    public toObject() {
        return {
            name: this.struct.szName,
            virtualAddress: this.getVirtualAddress(),
            pointerToRawData: this.getPointerToRawData(),
            sizeOfRawData: this.getSizeOfRawData(),
            pointerToRelocations: this.getPointerToRelocations(),
            pointerToLineNumbers: this.getPointerToLineNumbers(),
            numberOfRelocations: this.getNumberOfRelocations(),
            numberOfLineNumbers: this.getNumberOfLineNumbers(),
            characteristics: this.getCharacteristics()
        }
    }
}
