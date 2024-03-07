const { PeFileParser } = require('../lib/pe-file-parser');
const fs = require('fs');
const { LanguageId } = require('../lib/structures/languages');
const TestDataHelpers = require('./helpers/test-data-helpers');
const { ImageImportDirectoryTable, GroupIconDirEntry, ImageSectionHeader, ImageDos, VsVersionInfo, StringFileInfo, FixedFileInfo, VarFileInfo, ImageDataDirectoryTable } = require('../lib/structures');
const { Icon } = require('../lib/res/icon');
const { StringTable } = require('../lib/structures/string-table');
const { ImageResourceDirectoryEntry } = require('../lib/structures/image-resource-directory-entry');
const { Resource } = require('../lib/res/resource');

describe('PeFileParser', () => {

    describe('with ChromeSetup.bin', () => {

        const testBinaryFile = 'ChromeSetup.bin';

        /** @type PeFileParser */
        let parser;
        let dataFile;

        beforeAll((done) => {
            TestDataHelpers.decompressTestData(testBinaryFile).then(outFile => {
                dataFile = outFile;
                done();
            }).catch(done.fail);
        });

        afterAll(done => {
            TestDataHelpers.cleanupTestData(dataFile).then(done).catch(done.fail);
        });

        beforeEach(() => {
            parser = new PeFileParser();
        });

        describe('using a file', () => {

            let fd;
            beforeEach(() => {
                fd = fs.openSync(dataFile, 'r');
            });

            afterEach(() => {
                fs.closeSync(fd);
            })

            it('can parse from file descriptor', () => {
                parser.parseFile(fd);
            });
        });

        describe('using bytes', () => {

            let bytes;

            beforeEach(() => {
                bytes = fs.readFileSync(dataFile);
            });

            afterEach(() => {
                bytes = null;
            });

            it('can parse from buffer', () => {
                parser.parseBytes(bytes);
            });

            describe('once parsed', () => {
                beforeEach(() => {
                    parser.parseBytes(bytes);
                });

                it('can get the parsed dos image as object', () => {
                    const imageDos = parser.getImage().get();
                    expect(imageDos).toBeDefined();
                    expect(imageDos).toBeInstanceOf(ImageDos);
                    const obj = imageDos.toObject();
                    expect(obj).toBeInstanceOf(Object);
                    expect(obj.dosHeader).toBeDefined();
                    expect(obj.fileHeader).toBeDefined();
                    expect(obj.optionalHeader).toBeDefined();
                    expect(obj.sections).toBeDefined();
                });

                it('can read the dos header', () => {
                    const dosHeader = parser.getDosHeader();
                    expect(dosHeader).toBeDefined();
                });

                it('can get the file header', () => {
                    const fileHeader = parser.getFileHeader();
                    expect(fileHeader).toBeDefined();
                });

                it('can get the opt header', () => {
                    const optionalHeader = parser.getOptionalHeader();
                    expect(optionalHeader).toBeDefined();
                });

                it('can get the data directory from the pe opt header', () => {
                    const dataDir = parser.getDataDirectory();
                    expect(dataDir).toBeInstanceOf(ImageDataDirectoryTable);
                    expect(dataDir.getEntries()).toBeInstanceOf(Object);
                    expect(Object.keys(dataDir.getEntries())).toHaveSize(7);
                });

                it('can read the import directory table', () => {
                    const importDirTable = parser.getImportDirectoryTable();
                    expect(importDirTable).toBeInstanceOf(ImageImportDirectoryTable);
                    expect(importDirTable.getEntries()).toBeInstanceOf(Array);
                    expect(importDirTable.getEntries()).toHaveSize(5);
                    expect(importDirTable.getEntries().map(entry => entry.getName())).toEqual(jasmine.arrayWithExactContents(['KERNEL32.dll', 'SHLWAPI.dll', 'ole32.dll', 'SHELL32.dll', 'USER32.dll']));
                });

                it('can get data directory types', () => {
                    const dataDirectoryTypes = parser.getDataDirectoryTypes();
                    expect(dataDirectoryTypes).toBeInstanceOf(Array);
                    expect(dataDirectoryTypes).toHaveSize(7);
                    expect(dataDirectoryTypes).toEqual(jasmine.arrayWithExactContents(['IMPORT', 'RESOURCE', 'SECURITY', 'BASERELOC', 'DEBUG', 'LOAD_CONFIG', 'IMPORT_ADDR']));
                });

                it('can get the sections headers', () => {
                    const sectionHeaders = parser.getSectionHeaders();
                    expect(sectionHeaders).toBeInstanceOf(Array);
                    expect(sectionHeaders).toHaveSize(5);
                    const sectionHeader = sectionHeaders[0];
                    expect(sectionHeader).toBeInstanceOf(ImageSectionHeader);
                    expect(sectionHeader.getName()).toEqual(".text");
                    expect(sectionHeader.getVirtualAddress()).toBeInstanceOf(String);
                    expect(sectionHeader.getSizeOfRawData()).toBeInstanceOf(Number);
                    expect(sectionHeader.getPointerToRawData()).toBeInstanceOf(String);
                    expect(sectionHeader.getPointerToRelocations()).toBeInstanceOf(String);
                    expect(sectionHeader.getPointerToLineNumbers()).toBeInstanceOf(String);
                    expect(sectionHeader.getNumberOfRelocations()).toBeInstanceOf(Number);
                    expect(sectionHeader.getNumberOfLineNumbers()).toBeInstanceOf(Number);
                    expect(sectionHeader.getCharacteristics()).toEqual(jasmine.objectContaining({
                        value: jasmine.any(String),
                        meaning: jasmine.any(Array)
                    }));
                    const sectionHeaderStruct = sectionHeader.getStruct();
                    expect(sectionHeaderStruct).toBeInstanceOf(Object);
                    expect(sectionHeaderStruct.szName).toEqual(".text");
                    expect(sectionHeaderStruct.dwPhysicalAddressUnionVirtualSize).toBeInstanceOf(Number);
                    expect(sectionHeaderStruct.dwVirtualAddress).toBeInstanceOf(Number);
                    expect(sectionHeaderStruct.dwSizeOfRawData).toBeInstanceOf(Number);
                    expect(sectionHeaderStruct.dwPointerToRawData).toBeInstanceOf(Number);
                    expect(sectionHeaderStruct.dwPointerToRelocations).toBeInstanceOf(Number);
                    expect(sectionHeaderStruct.dwPointerToLineNumbers).toBeInstanceOf(Number);
                    expect(sectionHeaderStruct.wNumberOfRelocations).toBeInstanceOf(Number);
                    expect(sectionHeaderStruct.wNumberOfLineNumbers).toBeInstanceOf(Number);
                    expect(sectionHeaderStruct.dwCharacteristics).toBeInstanceOf(Number);
                });

                it('can get identified resource types', () => {
                    const resourceTypes = parser.getResourceTypes();
                    expect(resourceTypes).toBeInstanceOf(Array);
                    expect(resourceTypes).toHaveSize(7);
                });

                it('can get resources of type toObject', () => {
                    const resources = parser.getResourcesOfType('GOOGLEUPDATE');
                    expect(resources).toBeDefined();
                    expect(resources).toBeInstanceOf(ImageResourceDirectoryEntry);
                    const obj = resources.toObject();
                    expect(obj).toBeDefined();
                    expect(Object.keys(obj)).toContain('1');
                });

                it('all claimed resources types can be individually retrieved', () => {
                    const resTypes = parser.getResourceTypes();
                    for (const resType of resTypes) {
                        expect(parser.getResourcesOfType(resType)).toBeDefined();
                    }
                });

                it('can get string table resources', () => {
                    const stringTables = parser.getStringTableResources();
                    expect(stringTables).toBeInstanceOf(Object);
                    const en_us = stringTables['1321'][LanguageId.en_US];
                    expect(en_us[8]).toEqual('Google');
                });

                it('can get string table resources for specified language id', () => {
                    const stringTables1 = parser.getStringTableResources(LanguageId.en_US);
                    expect(stringTables1).toBeInstanceOf(Object);
                    expect(Object.keys(stringTables1)).toHaveSize(1);
                    expect(Object.keys(stringTables1)[0]).toEqual('1321');
                    expect(Object.keys(stringTables1['1321'])).toHaveSize(1);
                    expect(Object.keys(stringTables1['1321'])[0]).toEqual(LanguageId.en_US.toString());
                    expect(stringTables1['1321']).toEqual(jasmine.objectContaining({
                        [LanguageId.en_US]: jasmine.any(Array)
                    }));
                    const stringTables2 = parser.getStringTableResources(LanguageId.fr_CA);
                    expect(stringTables2).toBeInstanceOf(Object);
                    expect(Object.keys(stringTables2)).toHaveSize(1);
                    expect(Object.keys(stringTables2)[0]).toEqual('1321');
                    expect(Object.keys(stringTables2['1321'])).toHaveSize(0);
                });

                it('can get group icon metadata resources', () => {
                    const groupIcons = parser.getGroupIconResources(LanguageId.en_US);
                    expect(groupIcons).toBeInstanceOf(Object);
                    expect(groupIcons).toHaveSize(1);
                    expect(Object.keys(groupIcons)[0]).toEqual('101');
                    expect(groupIcons['101']).toBeInstanceOf(Object);
                    expect(groupIcons['101']).toHaveSize(1);
                    expect(Object.keys(groupIcons['101'])[0]).toEqual(LanguageId.en_US.toString());
                    expect(groupIcons['101'][LanguageId.en_US]).toBeInstanceOf(Array);
                    expect(groupIcons['101'][LanguageId.en_US]).toHaveSize(6);
                    for (const group of groupIcons['101'][LanguageId.en_US]) {
                        expect(group).toBeInstanceOf(GroupIconDirEntry);
                        const struct = group.getStruct();
                        const props = Object.keys(struct);
                        expect(props).toEqual(jasmine.arrayWithExactContents(['wId', 'bWidth', 'bHeight', 'bColorCount', 'bReserved', 'wPlanes', 'wBitCount', 'dwBytesInRes']));
                        for (const prop of props) {
                            expect(struct[prop]).toEqual(jasmine.any(Number));
                        }
                    }
                });

                it('can get icon resources', () => {
                    const icons = parser.getIconResources();
                    expect(icons).toBeInstanceOf(Object);
                    expect(Object.keys(icons)).toHaveSize(6);
                    expect(Object.keys(icons)).toContain('1');
                    expect(Object.keys(icons['1'])).toContain(LanguageId.en_US.toString());
                    expect(icons['1'][LanguageId.en_US]).toBeInstanceOf(Icon);
                    const icon = icons['1'][LanguageId.en_US];
                    expect(icon.getExtension()).toEqual('.ico');
                    expect(icon.getMetadata()).toBeInstanceOf(GroupIconDirEntry);
                    expect(icon.export()).toBeInstanceOf(Uint8Array);
                });

                it('can get icon resources for specified language id', () => {
                    const icons1 = parser.getIconResources(LanguageId.en_US);
                    expect(icons1).toBeInstanceOf(Object);
                    expect(Object.keys(icons1)).toHaveSize(6);
                    expect(Object.keys(icons1)).toContain('1');
                    expect(Object.keys(icons1['1'])[0]).toEqual(LanguageId.en_US.toString());
                    expect(icons1['1']).toEqual(jasmine.objectContaining({
                        [LanguageId.en_US]: jasmine.any(Object)
                    }));
                    const icons2 = parser.getIconResources(LanguageId.en_GB);
                    expect(icons2).toBeInstanceOf(Object);
                    expect(Object.keys(icons2)).toHaveSize(6);
                    expect(Object.keys(icons2)).toContain('1');
                    expect(Object.keys(icons2['1'])).toHaveSize(0);
                });

                describe('vs version info resources', () => {
                    it('can get vs version info', () => {
                        const vsVersionInfos = parser.getVersionInfoResources();
                        expect(vsVersionInfos).toBeInstanceOf(Object);
                        expect(Object.keys(vsVersionInfos)).toHaveSize(1);
                        expect(Object.keys(vsVersionInfos)[0]).toEqual('1');
                        expect(Object.keys(vsVersionInfos['1'])).toHaveSize(1);
                        expect(Object.keys(vsVersionInfos['1'])[0]).toEqual(LanguageId.en_US.toString());
                        const result = vsVersionInfos['1'][LanguageId.en_US];
                        expect(result).toBeInstanceOf(VsVersionInfo);
                        expect(result).toEqual(jasmine.objectContaining({
                            fixedFileInfo: jasmine.objectContaining(result.getFixedFileInfo()),
                            stringFileInfo: jasmine.objectContaining(result.getStringFileInfo()),
                            varFileInfo: jasmine.objectContaining(result.getVarFileInfo())
                        }));
                    });

                    it('can get fixed file info', function () {
                        const vsVersionInfos = parser.getVersionInfoResources();
                        const result = vsVersionInfos['1'][LanguageId.en_US];
                        expect(result).toBeInstanceOf(VsVersionInfo);
                        const fixedFileInfo = result.getFixedFileInfo();
                        expect(fixedFileInfo).toBeInstanceOf(FixedFileInfo);
                        expect(fixedFileInfo.toObject()).toEqual(jasmine.objectContaining({
                            signature: 'feef04bd',
                            strucVersion: '0.1',
                            fileVersionLS: 3,
                            fileVersionMS: 1,
                            productVersionLS: 3,
                            productVersionMS: 1,
                            fileFlagsMask: 63,
                            fileFlags: {
                                debug: false,
                                prerelease: false,
                                patched: false,
                                privatebuild: false,
                                infoinferred: false,
                                specialbuild: false
                            },
                            fileOS: {
                                dos: false,
                                os216: false,
                                os232: false,
                                nt: true,
                                windows16: false,
                                pm16: false,
                                pm32: false,
                                windows32: true,
                                unknown: false
                            },
                            fileType: {
                                app: true,
                                dll: false,
                                drv: false,
                                font: false,
                                vxd: false,
                                staticLib: false,
                                unknown: false
                            },
                            fileSubtype: 0x00,
                            fileDateLS: 0,
                            fileDateMS: 0
                        }));
                    });

                    it('can get string file info table', function () {
                        const vsVersionInfos = parser.getVersionInfoResources();
                        const result = vsVersionInfos['1'][LanguageId.en_US];
                        expect(result).toBeInstanceOf(VsVersionInfo);
                        const stringFileInfo = result.getStringFileInfo();
                        expect(stringFileInfo).toBeInstanceOf(StringFileInfo);

                        expect(stringFileInfo.toObject()).toEqual(jasmine.objectContaining({
                            "040904b0": jasmine.any(Object)
                        }));
                    });

                    it('can get string tables', function () {
                        const vsVersionInfos = parser.getVersionInfoResources();
                        const result = vsVersionInfos['1'][LanguageId.en_US];
                        expect(result).toBeInstanceOf(VsVersionInfo);

                        const stringTables = result.getStringFileInfo().getStringTables();
                        expect(stringTables).toBeInstanceOf(Object);
                        const stringTable0 = stringTables['040904b0'];
                        expect(stringTable0).toBeInstanceOf(StringTable);
                        expect(stringTable0.toObject()).toEqual(jasmine.objectContaining({
                            "CompanyName": "Google LLC",
                            "FileDescription": "Google Update Setup",
                            "FileVersion": "1.3.36.112",
                            "InternalName": "Google Update Setup",
                            "LegalCopyright": "Copyright 2018 Google LLC",
                            "OriginalFilename": "GoogleUpdateSetup.exe",
                            "ProductName": "Google Update",
                            "ProductVersion": "1.3.36.112",
                            "LanguageId": "en"
                        }));
                    });

                    it('can get var file info table', function () {
                        const vsVersionInfos = parser.getVersionInfoResources();
                        const result = vsVersionInfos['1'][LanguageId.en_US];
                        expect(result).toBeInstanceOf(VsVersionInfo);

                        const varFileInfo = result.getVarFileInfo();
                        expect(varFileInfo).toBeInstanceOf(VarFileInfo);
                        const translation = varFileInfo.toObject()['Translation'];
                        const translationValue = translation[0];
                        const translationKey = [translationValue.languageId, translationValue.codePageId].join('');
                        expect(translationKey).toEqual("040904b0");
                        expect(varFileInfo.toObject()).toEqual(jasmine.objectContaining({
                            "Translation": [{ languageId: '0409', codePageId: '04b0' }]
                        }));
                    });

                    it('contains the translation key for the string file info', () => {
                        const vsVersionInfos = parser.getVersionInfoResources();
                        const result = vsVersionInfos['1'][LanguageId.en_US];
                        expect(result).toBeInstanceOf(VsVersionInfo);

                        const varFileInfo = result.getVarFileInfo();
                        expect(varFileInfo).toBeInstanceOf(VarFileInfo);
                        const translation = varFileInfo.toObject()['Translation'];
                        const translationValue = translation[0];
                        const translationKey = [translationValue.languageId, translationValue.codePageId].join('');
                        const stringFileInfo = result.getStringFileInfo();
                        expect(Object.keys(stringFileInfo.toObject())).toContain(translationKey);
                    });
                });


                it('can get manifest resources', () => {
                    const manifests = parser.getManifestResources();
                    expect(manifests).toBeInstanceOf(Object);
                    expect(Object.keys(manifests)).toHaveSize(1);
                    expect(Object.keys(manifests)[0]).toEqual('1');
                    expect(Object.keys(manifests['1'])).toHaveSize(1);
                    expect(Object.keys(manifests['1'])[0]).toEqual('0');
                    const manifest = manifests['1']['0'];
                    expect(manifest).toBeInstanceOf(Resource);
                    expect(manifest.getData()).toBeInstanceOf(Uint8Array);
                    expect(manifest.export()).toEqual(jasmine.any(String));
                    expect(manifest.getExtension()).toEqual(".xml");
                });

            });

        });

    });

    describe('with rufus-3.19.bin', () => {
        const testBinaryFile = 'rufus-3.19.bin';

        /** @type PeFileParser */
        let parser;
        let dataFile;

        beforeAll((done) => {
            TestDataHelpers.decompressTestData(testBinaryFile).then(outFile => {
                dataFile = outFile;
                done();
            }).catch(done.fail);
        });

        afterAll(done => {
            TestDataHelpers.cleanupTestData(dataFile).then(done).catch(done.fail);
        });

        beforeEach(() => {
            parser = new PeFileParser();
            const fd = fs.openSync(dataFile);
            parser.parseFile(fd);
        });

        it('can get import directory table', () => {
            const importTable = parser.getImportDirectoryTable();
            expect(importTable).toBeDefined();
        });
    });

});
