const BufferReader = require('./lib/buffer-reader');
const DATA_TYPES = require('./lib/data-types');
const SZ_WCHAR = DATA_TYPES.SZ_WCHAR;
const FLAGS = require('./lib/flags');
const {VS_VERSIONINFO_structure, StringFileInfo_structure, VarFileInfo_structure, VS_FIXEDFILEINFO_structure} = require('./lib/structures');

/**
 * Read binary byte data and collect all the VS_VERSIONINFO strutures found in it, if any.
 * If no VS_VSERSIONINFO structures are found in the data, an Error indicating that will be thrown.
 * 
 * @param {Buffer|Blob|Uint8Array} data The binary byte data to parse the VS_VERSIONINFO structure from
 * @returns an array of VS_VERSIONINFO_RESULT
 * @throws Error when no VS_VERSIONINFO tables can be found, or there is an error during parsing of a found structure
 */
function parseBytes(data) {
    const buff = new BufferReader(data);
    const VSVersionInfoKey = SZ_WCHAR(VS_VERSIONINFO_structure.szKey.value);
    const keyLocations = buff.findOccurences(VSVersionInfoKey);
    if (keyLocations.length === 0) {
        throw new Error('Did not find VS_VERSION_INFO in provided byte data');
    }
    const vsVersionInfoTables = [];
    for (const location of keyLocations) {
        let preceeding_bytes = VS_VERSIONINFO_structure.wLength.type + VS_VERSIONINFO_structure.wValueLength.type + VS_VERSIONINFO_structure.wType.type;
        
        buff.goto(location.start.dec);
        buff.rewindBytes(preceeding_bytes);
        buff.alignTo32BitBoundary();
        const VS_VERSION_INFO = {};
        VS_VERSION_INFO['wLength'] = buff.readWord(true);
        VS_VERSION_INFO['wValueLength'] = buff.readWord(true);
        VS_VERSION_INFO['wType'] = buff.readWord(true);
        VS_VERSION_INFO['zsKey'] = buff.readStringZ();
        buff.seek32BitBoundary();
        
        VS_VERSION_INFO['Value'] = {};
            buff.seekNext(VS_FIXEDFILEINFO_structure.dwSignature.value);
            const VS_FIXEDFILEINFO =  {};
            VS_FIXEDFILEINFO['dwSignature'] = buff.readDWord();
            VS_FIXEDFILEINFO['dwStrucVersion'] = [buff.readWord(true), buff.readWord(true)];
            VS_FIXEDFILEINFO['dwFileVersionLS'] = buff.readWord(true);
            VS_FIXEDFILEINFO['dwFileVersionMS'] = buff.readWord(true);
            buff.readDWord();
            VS_FIXEDFILEINFO['dwProductVersionLS'] = buff.readWord(true);
            VS_FIXEDFILEINFO['dwProductVersionMS'] = buff.readWord(true);
            buff.readDWord();
            VS_FIXEDFILEINFO['dwFileFlagsMask'] = buff.readDWord(true);
            VS_FIXEDFILEINFO['dwFileFlags'] = buff.readDWord(true);
            VS_FIXEDFILEINFO['dwFileOS'] = buff.readDWord(true);
            VS_FIXEDFILEINFO['dwFileType'] = buff.readDWord(true);
            VS_FIXEDFILEINFO['dwFileSubtype'] = buff.readDWord(true);
            VS_FIXEDFILEINFO['dwFileDateLS'] = buff.readWord(true);
            VS_FIXEDFILEINFO['dwFileDateMS'] = buff.readWord(true);
            buff.readDWord();
            
        VS_VERSION_INFO['Value'] = VS_FIXEDFILEINFO;
        
        buff.seek32BitBoundary();
        
        VS_VERSION_INFO['Children'] = {};
        const StringFileInfoKey = SZ_WCHAR(StringFileInfo_structure.szKey.value);
        if (buff.hasNext(StringFileInfoKey)) {
            buff.seekNext(StringFileInfoKey);
            buff.rewindBytes(StringFileInfo_structure.wLength.type + StringFileInfo_structure.wValueLength.type + StringFileInfo_structure.wType.type);
            const StringFileInfo = {};
            StringFileInfo['wLength'] = buff.readWord(true);
            StringFileInfo['wValueLength'] = buff.readWord(true);
            StringFileInfo['wType'] = buff.readWord(true);
            StringFileInfo['szKey'] = buff.readStringZ();
            buff.seek32BitBoundary();
            StringFileInfo['Children'] = [];
            
            const StringTable = {};
            const initial_offset = buff.offset;
            StringTable['wLength'] = buff.readWord(true);
            StringTable['wValueLength'] = buff.readWord(true);
            StringTable['wType'] = buff.readWord(true);
            StringTable['szKey'] = buff.readStringZ();
            buff.seek32BitBoundary();
            StringTable['Children'] = [];

            const byteModifier = StringTable['wType'] === 0x00 ? 2 : 1;
            
            while(buff.offset < initial_offset + StringTable['wLength']) {
                const StringTableEntry = {};
                StringTableEntry['wLength'] = buff.readWord(true);
                StringTableEntry['wValueLength'] = buff.readWord(true);
                StringTableEntry['wType'] = buff.readWord(true);
                StringTableEntry['szKey'] = buff.readStringZ().trim();
                
                buff.seek32BitBoundary();
                if (StringTableEntry['wLength'] === 0) {
                    break;
                }
                
                // if wType is 0, value is binary data
                if (StringTableEntry['wType'] === 0) {
                    StringTableEntry['Value'] = StringTableEntry['wValueLength'] > 0 ? buff.readWordsAsString(StringTableEntry['wValueLength']/2).trim() : '';
                }
                // else if wType is 1, value is text data
                else if (StringTableEntry['wType'] === 1) {
                    StringTableEntry['Value'] = StringTableEntry['wValueLength'] > 0 ? buff.readStringZ().trim() : '';
                } else {
                    throw new Error(`Invalid wType value ${StringTableEntry['wType']} for szKey '${StringTableEntry['szKey']}' in StringTable at offset ${buff.offset.toString(16)}`);
                }

                buff.seek32BitBoundary();
                StringTable['Children'].push(StringTableEntry);
            }
            
            StringFileInfo['Children'].push(StringTable);

            VS_VERSION_INFO['Children']['StringFileInfo'] = StringFileInfo;
        }
        
        const VarFileInfoKey = SZ_WCHAR(VarFileInfo_structure.szKey.value);
        if (buff.hasNext(VarFileInfoKey)) {
            buff.seekNext(VarFileInfoKey);
            buff.rewindBytes(VarFileInfo_structure.wLength.type + VarFileInfo_structure.wValueLength.type + VarFileInfo_structure.wType.type);
            const VarFileInfo = {};
            const initial_offset = buff.offset;
            VarFileInfo['wLength'] = buff.readWord(true);
            VarFileInfo['wValueLength'] = buff.readWord(true);
            VarFileInfo['wType'] = buff.readWord(true);
            VarFileInfo['szKey'] = buff.readStringZ();
            buff.seek32BitBoundary();
            VarFileInfo['Children'] = [];
            
            while (buff.offset < initial_offset + VarFileInfo['wLength']) {
                const VarFileInfoVar = {};
                VarFileInfoVar['wLength'] = buff.readWord(true);
                VarFileInfoVar['wValueLength'] = buff.readWord(true);
                VarFileInfoVar['wType'] = buff.readWord(true);
                VarFileInfoVar['szKey'] = buff.readStringZ();
                buff.seek32BitBoundary();
                VarFileInfoVar['Value'] = [];
                // if wType is 0, value is binay data
                if (VarFileInfoVar['wType'] === 0) {
                    for (let i=0; i<VarFileInfoVar['wValueLength']/DATA_TYPES.DWORD; i++) {
                        VarFileInfoVar['Value'].push(buff.readDWord());
                    }
                }
                // else if wType is 1, value is text data
                else if (VarFileInfoVar['wType'] === 1) {
                    VarFileInfoVar['Value'] = VarFileInfoVar['wValueLength'] > 0 ? buff.readStringZ().trim() : '';
                }
                else {
                    throw new Error(`Invalid wType value ${StringTableEntry['wType']} for szKey '${StringTableEntry['szKey']}' in VarFileInfo`)
                }
                
                VarFileInfo['Children'].push(VarFileInfoVar);
            }
            
            VS_VERSION_INFO['Children']['VarFileInfo'] = VarFileInfo;
        }
        vsVersionInfoTables.push(new VS_VERSIONINFO_RESULT(VS_VERSION_INFO));
    }
    return vsVersionInfoTables;
    
}

/**
 * A parsed VS_VERSIONINFO structure result container.
 * 
 * @param {VS_VERSIONINFO_structure} data The javascript descriptor object containing the raw parsed data.
 */
function VS_VERSIONINFO_RESULT(data) {
    this.data = data;

    /**
     * Get a formatted VS_VERSIONINFO data object
     * 
     * @returns {object} The formatted javascript object
     */
    this.getVsVersionInfo = function() {
        const vsVersionInfo = {
            FixedFileInfo: this.getFixedFileInfo()
        };
        const StringFileInfo = this.getStringFileInfo();
        if (StringFileInfo != null) {
            vsVersionInfo['StringFileInfo'] = StringFileInfo;
        }
        const VarFileInfo = this.getVarFileInfo();
        if (VarFileInfo != null) {
            vsVersionInfo['VarFileInfo'] = VarFileInfo;
        }
        return vsVersionInfo;
    }

    /**
     * Get a formatted VS_FIXEDFILEINFO data object
     * 
     * @returns {object} The formatted javascript object
     */
    this.getFixedFileInfo = function() {
        const value = this.data.Value;
        const fixedFileInfo = {
            dwSignature: value.dwSignature,
            dwStrucVersion: value.dwStrucVersion,
            fileVersionLS: value.dwFileVersionLS,
            fileVersionMS: value.dwFileVersionMS,
            productVersionLS: value.dwProductVersionLS,
            productVersionMS: value.dwProductVersionMS,
            fileFlagsMask: value.dwFileFlagsMask,
            fileFlags: FLAGS.parseFileFlags(value.dwFileFlags, value.dwFileFlagsMask),
            fileOS: FLAGS.parseFileOSFlags(value.dwFileOS),
            fileType: FLAGS.parseFileType(value.dwFileType),
            fileSubtype: FLAGS.parseFileSubtype(value.dwFileSubtype),
            fileDateLS: value.dwFileDateLS,
            fileDateMS: value.dwFileDateMS
        };
        return fixedFileInfo;
    }

    /**
     * Get a formatted StringFileInfo data object
     * 
     * @returns {object} The formatted javascript object
     */
    this.getStringFileInfo = function() {
        if (typeof this.data.Children.StringFileInfo === 'object') {
            const strFileInfo = {};
            for (const infoEntry of this.data.Children.StringFileInfo.Children) {
                strFileInfo[infoEntry.szKey] = {};
                for (const strEntry of infoEntry.Children) {
                    strFileInfo[infoEntry.szKey][strEntry.szKey] = strEntry.Value;
                }
            }
            return strFileInfo;
        } else {
            return undefined;
        }
    }

    /**
     * Get an array of formatted StringTable objects
     * 
     * @returns {array} An array of the formatted StringTables
     */
    this.getStringTables = function() {
        const strTables = [];
        for (const infoEntry of this.data.Children.StringFileInfo.Children) {
            const strKV = {};
            for (const strEntry of infoEntry.Children) {
                strKV[strEntry.szKey] = strEntry.Value;
            }
            strTables.push(strKV);
        }
        return strTables;
    }

    /**
     * Get a formatted VarFileInfo data object
     * 
     * @returns {object} The formatted javascript object
     */
    this.getVarFileInfo = function() {
        if (typeof this.data.Children.VarFileInfo === 'object') {
            const varTable = {};
            for (const infoEntry of this.data.Children.VarFileInfo.Children) {
                varTable[infoEntry.szKey] = infoEntry.Value;
            }
            return varTable;
        } else {
            return undefined;
        }
    }
}

exports.parseBytes = parseBytes;