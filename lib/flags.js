const VS_FF = {
    /** The file contains debugging information or is compiled with debugging features enabled. */
    DEBUG: 0x00000001,
    /** The file is a development version, not a commercially released product. */
    PRERELEASE: 0x00000002,
    /** The file has been modified and is not identical to the original shipping file of the same version number. */
    PATCHED: 0x00000004,
    /** The file was not built using standard release procedures. If this flag is set, the StringFileInfo structure should contain a PrivateBuild entry. */
    PRIVATEBUILD: 0x00000008,
    /** The file's version structure was created dynamically; therefore, some of the members in this structure may be empty or incorrect. This flag should never be set in a file's VS_VERSIONINFO data. */
    INFOINFERRED: 0x00000010,
    /** The file was built by the original company using standard release procedures but is a variation of the normal file of the same version number. If this flag is set, the StringFileInfo structure should contain a SpecialBuild entry. */
    SPECIALBUILD:0x00000020
};

/**
 * Parses a file flags value to an object describing its features.
 * 
 * @param {Number} fileFlagsValue The dwFileFlags value
 * @param {Number} fileFlagsMask The dwFileFlagsMask value
 * @returns {object} The formatted descriptor table
 */
function parseFileFlags(fileFlagsValue, fileFlagsMask) {
    return {
        debug: ((fileFlagsMask & fileFlagsValue) & VS_FF.DEBUG) != 0,
        prerelease: ((fileFlagsMask & fileFlagsValue) & VS_FF.PRERELEASE) != 0,
        patched: ((fileFlagsMask & fileFlagsValue) & VS_FF.PATCHED) != 0,
        privatebuild: ((fileFlagsMask & fileFlagsValue) & VS_FF.PRIVATEBUILD) != 0,
        infoinferred: ((fileFlagsMask & fileFlagsValue) & VS_FF.INFOINFERRED) != 0,
        specialbuild: ((fileFlagsMask & fileFlagsValue) & VS_FF.SPECIALBUILD) != 0
    };
}

const VOS = {
    /** The file was designed for MS-DOS. */
    DOS: 0x00010000,
    /** The file was designed for 16-bit OS/2. */
    OS216: 0x00020000,
    /** The file was designed for 32-bit OS/2. */
    OS232: 0x00030000,
    /** The file was designed for Windows NT. */
    NT: 0x00040000,
    /** The file was designed for 16-bit Windows. */
    WINDOWS16: 0x00000001,
    /** The file was designed for 16-bit Presentation Manager. */
    PM16: 0x00000002,
    /** The file was designed for 32-bit Presentation Manager. */
    PM32: 0x00000003,
    /** The file was designed for 32-bit Windows. */
    WINDOWS32: 0x00000004,
    /** The operating system for which the file was designed is unknown to the system. */
    UNKNOWN: 0x00000000
};

/**
 * Parse a file os value to an object describing its features.
 * 
 * @param {Number} fileOSValue The read dwFileOS value
 * @returns {object} The formatted descriptor table
 */
function parseFileOSFlags(fileOSValue) {
    return {
        dos: (fileOSValue & VOS.DOS) === VOS.DOS,
        os216: (fileOSValue & VOS.OS216) === VOS.OS216,
        os232: (fileOSValue & VOS.OS232) === VOS.OS232,
        nt: (fileOSValue & VOS.NT) === VOS.NT,
        windows16: (fileOSValue & VOS.WINDOWS16) === VOS.WINDOWS16,
        pm16: (fileOSValue & VOS.PM16) === VOS.PM16,
        pm32: (fileOSValue & VOS.PM32) === VOS.PM32,
        windows32: (fileOSValue & VOS.WINDOWS32) === VOS.WINDOWS32,
        unknown: fileOSValue === VOS.UNKNOWN
    };
}

const VFT = {
    /** The file contains an application. */
    APP: 0x00000001,
    /** The file contains a DLL. */
    DLL: 0x00000002,
    /** The file contains a device driver. If dwFileType is VFT_DRV, dwFileSubtype contains a more specific description of the driver. */
    DRV: 0x00000003,
    /** The file contains a font. If dwFileType is VFT_FONT, dwFileSubtype contains a more specific description of the font file. */
    FONT: 0x00000004,
    /** The file contains a virtual device. */
    VXD: 0x00000005,
    /** The file contains a static-link library. */
    STATIC_LIB: 0x00000007,
    /** The file type is unknown to the system. */
    UNKNOWN: 0x00000000
};

/**
 * Parse a file type to an object describing its features.
 * 
 * @param {Number} fileTypeValue The read dwFileType value
 * @returns {object} The formatted descriptor table for the file type
 */
function parseFileType(fileTypeValue) {
    return {
        app: fileTypeValue === VFT.APP,
        dll: fileTypeValue === VFT.DLL,
        drv: fileTypeValue === VFT.DRV,
        font: fileTypeValue === VFT.FONT,
        vxd: fileTypeValue === VFT.VXD,
        staticLib: fileTypeValue === VFT.STATIC_LIB,
        unknown: fileTypeValue === VFT.UNKNOWN
    };
}

const VFT2 = {
    /** The file contains a printer driver. */
    DRV_PRINTER: 0x00000001,
    /** The file contains a raster font. */
    FONT_RASTER: 0x00000001,
    /** The file contains a keyboard driver. */
    DRV_KEYBOARD: 0x00000002,
    /** The file contains a vector font. */
    FONT_VECTOR: 0x00000002,
    /** The file contains a language driver. */
    DRV_LANGUAGE: 0x00000003,
    /** The file contains a TrueType font. */
    FONT_TRUETYPE: 0x00000003,
    /** The file contains a display driver. */
    DRV_DISPLAY: 0x00000004,
    /** The file contains a mouse driver. */
    DRV_MOUSE: 0x00000005,
    /** The file contains a network driver. */
    DRV_NETWORK: 0x00000006,
    /** The file contains a system driver. */
    DRV_SYSTEM: 0x00000007,
    /** The file contains an installable driver. */
    DRV_INSTALLABLE: 0x00000008,
    /** The file contains a sound driver. */
    DRV_SOUND: 0x00000009,
    /** The file contains a communications driver. */
    DRV_COMM: 0x0000000A,
    /** The file contains a versioned printer driver. */
    DRV_VERSIONED_PRINTER: 0x0000000C,
    /** The driver/font type is unknown by the system. */
    UNKNOWN: 0x00000000
};

/**
 * Parse a file subtype to an object describing its features. The subtype depends on the 
 * fileType. For example, the same value for fileSubtype means something different depending on if the
 * fileType is VFT.DRV or VFT.FONT
 * 
 * @param {Number} fileTypeValue The read dwFileType value
 * @param {Number} fileSubtypeValue The read dwFileSubtype value
 * @returns {object} The formatted descriptor table for the file subtype
 */
function parseFileSubtype(fileTypeValue, fileSubtypeValue) {
    const fileTypeInfo = parseFileType(fileTypeValue);
    if (fileTypeInfo.drv === true) {
        return  {
            printer: fileSubtypeValue === VFT2.DRV_PRINTER,
            keyboard: fileSubtypeValue === VFT2.DRV_KEYBOARD,
            language: fileSubtypeValue === VFT2.DRV_LANGUAGE,
            display: fileSubtypeValue === VFT2.DRV_DISPLAY,
            mouse: fileSubtypeValue === VFT2.DRV_MOUSE,
            network: fileSubtypeValue === VFT2.DRV_NETWORK,
            system: fileSubtypeValue === VFT2.DRV_SYSTEM,
            installable: fileSubtypeValue === VFT2.DRV_INSTALLABLE,
            sound: fileSubtypeValue === VFT2.DRV_SOUND,
            comm: fileTypeValue === VFT2.DRV_COMM,
            versionedPrinter: fileTypeValue === VFT2.DRV_VERSIONED_PRINTER,
            unknown: fileTypeValue === VFT2.UNKNOWN
        };
    } else if (fileTypeInfo.font === true) {
        return  {
            raster: fileSubtypeValue === VFT2.FONT_RASTER,
            vector: fileSubtypeValue === VFT2.FONT_VECTOR,
            truetype: fileSubtypeValue === VFT2.FONT_TRUETYPE,
            unknown: fileSubtypeValue === VFT2.UNKNOWN
        }
    } else if (fileTypeInfo.vxd === true) {
        return fileSubtypeValue;
    } else {
        return 0x00
    }
}

module.exports = {
    VS_FF,
    VOS,
    VFT,
    VFT2,
    parseFileFlags,
    parseFileOSFlags,
    parseFileType,
    parseFileSubtype
};