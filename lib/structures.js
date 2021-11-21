const DATA_TYPES = require('./data-types');

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
        type: DATA_TYPES.WORD
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