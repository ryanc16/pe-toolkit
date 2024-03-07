import { DataSize } from "./data-types";
import { String_structure } from './vs-string';

/**
 * The StringTable structure defined here: https://docs.microsoft.com/en-us/windows/win32/menurc/stringtable
 */
export const StringTable_structure = {
    wLength: {
        byteSize: DataSize.WORD
    },
    wValueLength: {
        byteSize: DataSize.WORD
    },
    wType: {
        byteSize: DataSize.WORD
    },
    szKey: {
        byteSize: DataSize.WCHAR,
        value: ''
    },
    Padding: {
        byteSize: DataSize.WORD
    },
    Children: {
        byteSize: String_structure
    }
};
