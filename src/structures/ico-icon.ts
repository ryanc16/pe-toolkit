import { DataSize } from "./data-types";


// Inside the exe resources, the ico files are broken up into individual resource entries, resulting
// in the ico file header information being stripped away.
// An ico file can contain multiple images at various resolutions, bit-depths, etc.. and when combined,
// all images share a common header, which lists each image, so that header wouldn't work once broken up
// for an individual file. So here we need to recreate an ico file header that only lists a single image.
// https://devblogs.microsoft.com/oldnewthing/20101018-00/?p=12513
export interface ICO_HEADER {
    wReserved: DataSize.WORD;
    wType: DataSize.WORD;
    wCount: DataSize.WORD;
}

export interface ICO_DIR_ENTRY {
    bWidth: DataSize.BYTE;
    bHeight: DataSize.BYTE;
    bColorCount: DataSize.BYTE;
    bReserved: DataSize.BYTE;
    wPlanes: DataSize.WORD;
    wBitcount: DataSize.WORD;
    dwBytesInRes: DataSize.DWORD;
    dwImageOffset: DataSize.DWORD;
}

export function ICO_HEADER(): ICO_HEADER {
    return {
        wReserved: 0x0000,
        wType: 0x0001,
        wCount: 0x0001
    };
}

export function ICO_DIR_ENTRY(values?: Partial<ICO_DIR_ENTRY>): ICO_DIR_ENTRY {
    return {
        bWidth: 0x00,
        bHeight: 0x00,
        bColorCount: 0x00,
        bReserved: 0x00,
        wPlanes: 0x0000,
        wBitcount: 0x0000,
        dwBytesInRes: 0x00000000,
        dwImageOffset: 0x00000000,
        ...values
    }
}
