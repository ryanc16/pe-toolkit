const DATA_TYPES = require('./data-types');

/**
 * The VS_FIXEDFILEINFO structure defined here: https://docs.microsoft.com/en-us/windows/win32/api/verrsrc/ns-verrsrc-vs_fixedfileinfo
 */
 const VS_FIXEDFILEINFO_structure = {
    dwSignature: {
        type: DATA_TYPES.DWORD,
        value: Uint8Array.of(0xbd, 0x04, 0xef, 0xfe)
    },
    dwStrucVersion: {
        type: DATA_TYPES.DWORD
    },
    dwFileVersionMS: {
        type: DATA_TYPES.DWORD
    },
    dwFileVersionLS: {
        type: DATA_TYPES.DWORD
    },
    dwProductVersionMS: {
        type: DATA_TYPES.DWORD
    },
    dwProductVersionLS: {
        type: DATA_TYPES.DWORD
    },
    dwFileFlagsMask: {
        type: DATA_TYPES.DWORD
    },
    dwFileFlags: {
        type: DATA_TYPES.DWORD
    },
    dwFileOS: {
        type: DATA_TYPES.DWORD
    },
    dwFileType: {
        type: DATA_TYPES.DWORD
    },
    dwFileSubtype: {
        type: DATA_TYPES.DWORD
    },
    dwFileDateMS: {
        type: DATA_TYPES.DWORD
    },
    dwFileDateLS: {
        type: DATA_TYPES.DWORD
    }
};

/**
 * The String structure defined here: https://docs.microsoft.com/en-us/windows/win32/menurc/string-str
 */
const String_structure = {
    wLength: {
        type: DATA_TYPES.DWORD
    },
    wValueLength: {
        type: DATA_TYPES.WORD
    },
    wType: {
        type: DATA_TYPES.WORD
    },
    szKey: {
        type: DATA_TYPES.WCHAR,
        value: ''
    },
    Padding: {
        type: DATA_TYPES.WORD
    },
    Value: {
        type: DATA_TYPES.WORD
    }
};

/**
 * The StringTable structure defined here: https://docs.microsoft.com/en-us/windows/win32/menurc/stringtable
 */
const StringTable_structure = {
    wLength: {
        type: DATA_TYPES.WORD
    },
    wValueLength: {
        type: DATA_TYPES.WORD
    },
    wType: {
        type: DATA_TYPES.WORD
    },
    szKey: {
        type: DATA_TYPES.WCHAR,
        value: ''
    },
    Padding: {
        type: DATA_TYPES.WORD
    },
    Children: {
        type: String_structure
    }
};

/**
 * The StringFileInfo structure defined here: https://docs.microsoft.com/en-us/windows/win32/menurc/stringfileinfo
 */
const StringFileInfo_structure = {
    wLength: {
        type: DATA_TYPES.WORD
    },
    wValueLength: {
        type: DATA_TYPES.WORD
    },
    wType: {
        type: DATA_TYPES.WORD
    },
    szKey: {
        type: DATA_TYPES.WCHAR,
        value: 'StringFileInfo'
    },
    Padding: {
        type: DATA_TYPES.WORD
    },
    Children: {
        type: StringTable_structure
    }
};

/**
 * The Var structure defined here: https://docs.microsoft.com/en-us/windows/win32/menurc/var-str
 */
const Var_structure = {
    wLength: {
        type: DATA_TYPES.WORD
    },
    wValueLength: {
        type: DATA_TYPES.WORD,
    },
    wType: {
        type: DATA_TYPES.WORD,
    },
    szKey: {
        type: DATA_TYPES.WCHAR,
        value: 'Translation'
    },
    Padding: {
        type: DATA_TYPES.WORD
    },
    Value: {
        type: DATA_TYPES.DWORD
    }
};

/**
 * The VarFileInfo structure defined here: https://docs.microsoft.com/en-us/windows/win32/menurc/varfileinfo
 */
const VarFileInfo_structure = {
    wLength: {
        type: DATA_TYPES.WORD
    },
    wValueLength: {
        type: DATA_TYPES.WORD
    },
    wType: {
        type: DATA_TYPES.WORD
    },
    szKey: {
        type: DATA_TYPES.WCHAR,
        value: 'VarFileInfo'
    },
    Padding: {
        type: DATA_TYPES.WORD
    },
    Children: {
        type: Var_structure
    }
};

/**
 * The VS_VERSIONINFO structure defined here: https://docs.microsoft.com/en-us/windows/win32/menurc/vs-versioninfo
 */
const VS_VERSIONINFO_structure = {
    wLength: {
        type: DATA_TYPES.WORD
    },
    wValueLength: {
        type: DATA_TYPES.WORD
    },
    wType: {
        type: DATA_TYPES.WORD
    },
    szKey: {
        type: DATA_TYPES.WCHAR,
        value: 'VS_VERSION_INFO'
    },
    Padding1: {
        type: DATA_TYPES.WORD
    },
    Value: {
        type: VS_FIXEDFILEINFO_structure
    },
    Padding2: {
        type: DATA_TYPES.WORD
    },
    Children: {
        type: DATA_TYPES.WORD,
        StringFileInfo: StringFileInfo_structure,
        VarFileInfo: VarFileInfo_structure
    }
};

module.exports = {
    VS_VERSIONINFO_structure,
    VS_FIXEDFILEINFO_structure,
    StringFileInfo_structure,
    StringTable_structure,
    String_structure,
    VarFileInfo_structure,
    Var_structure
};