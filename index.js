const fs = require('fs');
const BufferReader = require('./lib/buffer-reader');
const DATA_TYPES = require('./lib/data-types');
const SZ_WCHAR = DATA_TYPES.SZ_WCHAR;
const {VS_VERSIONINFO_structure, StringFileInfo_structure, VarFileInfo_structure, VS_FIXEDFILEINFO_structure} = require('./lib/structures');

function parseFromFile(file) {
    const buff = new BufferReader(fs.readFileSync(file));
    const VSVersionInfoKey = SZ_WCHAR(VS_VERSIONINFO_structure.szKey.value);
    const keyLocations = buff.findOccurences(VSVersionInfoKey);
    if (keyLocations.length === 0) {
        throw new Error('Did not find VS_VERSION_INFO in provided executable: ' + file);
    }
    const vsVersionInfoTables = [];
    let itr = 1;
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
            const strucVersionMinor = buff.readWord(true);
            const strucVersionMajor = buff.readWord(true);
            VS_FIXEDFILEINFO['dwStrucVersion'] = strucVersionMajor + '.' + strucVersionMinor;
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
                    StringTableEntry['Value'] = StringTableEntry['Value'] = StringTableEntry['wValueLength'] > 0 ? buff.readWordsAsString(StringTableEntry['wValueLength']/2).trim() : '';
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

                }
                else {
                    throw new Error(`Invalid wType value ${StringTableEntry['wType']} for szKey '${StringTableEntry['szKey']}' in VarFileInfo`)
                }
                
                VarFileInfo['Children'].push(VarFileInfoVar);
            }
            
            VS_VERSION_INFO['Children']['VarFileInfo'] = VarFileInfo;
        }
        vsVersionInfoTables.push(new VS_VERSIONINFO_RESULT(file, VS_VERSION_INFO));
        
        itr++;
    }
    return vsVersionInfoTables;
    
}

function VS_VERSIONINFO_RESULT(file, data) {
    this.file = file;
    this.data = data;

    this.getFixedFileInfo = function() {
        return this.data.Value;
    }

    this.getStringFileInfo = function() {
        const strFileInfo = {};
        for (const infoEntry of this.data.Children.StringFileInfo.Children) {
            strFileInfo[infoEntry.szKey] = {};
            for (const strEntry of infoEntry.Children) {
                strFileInfo[infoEntry.szKey][strEntry.szKey] = strEntry.Value;
            }
        }
        
        return strFileInfo;
    }

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

    this.getVarFileInfo = function() {
        const varTable = {};
        for (const infoEntry of this.data.Children.VarFileInfo.Children) {
            varTable[infoEntry.szKey] = infoEntry.Value;
        }
        return varTable;
    }

    this.writeToFile = function() {
        fs.writeFileSync(file+'.json', JSON.stringify(this.data, null, 2).replace(/\\u0000/g, ''));
    }
}

exports.parseFromFile = parseFromFile;