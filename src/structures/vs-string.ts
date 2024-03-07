import { DataSize } from './data-types';
/**
* The String structure defined here: https://docs.microsoft.com/en-us/windows/win32/menurc/string-str
*/
export const String_structure = {
    wLength: {
        byteSize: DataSize.DWORD
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
    Value: {
        byteSize: DataSize.WORD
    }
};
