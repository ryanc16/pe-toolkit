const vsInfo = require('../index');
const fs = require('fs');

const testBinaryFile = 'test/resources/test.bin'

describe('vs-version-info', function() {

    let testBinaryData = [];

    beforeEach(function() {
        testBinaryData = fs.readFileSync(testBinaryFile);
    });

    it('can parse', function() {
        expect(function() {
            vsInfo.parseBytes(testBinaryData);
        }).not.toThrow();
    });

    it('can get results', function() {
        const results = vsInfo.parseBytes(testBinaryData);

        expect(results).toBeInstanceOf(Array);
        expect(results).toHaveSize(1);
    });

    it('can get vs version info', function() {
        const results = vsInfo.parseBytes(testBinaryData);
        const result0 = results[0];
        const vsVersionInfo = result0.getVsVersionInfo();
        
        expect(vsVersionInfo).toBeInstanceOf(Object);
        expect(vsVersionInfo).toEqual(jasmine.objectContaining({
            FixedFileInfo: jasmine.objectContaining(result0.getFixedFileInfo()),
            StringFileInfo: jasmine.objectContaining(result0.getStringFileInfo()),
            VarFileInfo: jasmine.objectContaining(result0.getVarFileInfo())
        }));
    });

    it('can get fixed file info', function() {
        const results = vsInfo.parseBytes(testBinaryData);
        const result0 = results[0];
        const fixedFileInfo = result0.getFixedFileInfo();

        expect(fixedFileInfo).toBeInstanceOf(Object);
        expect(fixedFileInfo).toEqual(jasmine.objectContaining({
            "dwSignature": Buffer.from([0xBD, 0x04, 0xEF, 0xFE]),
            "dwStrucVersion": [0x00, 0x01],
            "fileVersionLS": 3,
            "fileVersionMS": 1,
            "productVersionLS": 3,
            "productVersionMS": 1,
            "fileFlagsMask": 63,
            "fileFlags": {
                debug: false,
                prerelease: false,
                patched: false,
                privatebuild: false,
                infoinferred: false,
                specialbuild: false
            },
            "fileOS": {
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
            "fileType": {
                app: true,
                dll: false,
                drv: false,
                font: false,
                vxd: false,
                staticLib: false,
                unknown: false
            },
            "fileSubtype": 0x00,
            "fileDateLS": 0,
            "fileDateMS": 0
        }));
    });

    it('can get string file info table', function() {
        const results = vsInfo.parseBytes(testBinaryData);
        const result0 = results[0];
        const stringFileInfo = result0.getStringFileInfo();

        expect(stringFileInfo).toBeInstanceOf(Object);
        expect(stringFileInfo).toEqual(jasmine.objectContaining({
            "040904b0": jasmine.any(Object)
        }));
    });

    it('can get string tables', function() {
        const results = vsInfo.parseBytes(testBinaryData);
        const result0 = results[0];
        const stringTables = result0.getStringTables();

        expect(stringTables).toBeInstanceOf(Array);
        const stringTable0 = stringTables[0];
        expect(stringTable0).toBeInstanceOf(Object);
        expect(stringTable0).toEqual(jasmine.objectContaining({
            "CompanyName": "Google LLC",
            "FileDescription": "Google Update Setup",
            "FileVersion": "1.3.36.112",
            "LegalCopyright": "Copyright 2018 Google LLC",
            "ProductName": "Google Update",
            "ProductVersion": "1.3.36.112",
            "LanguageId": "en"
        }));
    });

    it('can get var file info table', function() {
        const results = vsInfo.parseBytes(testBinaryData);
        const result0 = results[0];
        const varFileInfo = result0.getVarFileInfo();

        expect(varFileInfo).toBeInstanceOf(Object);
        expect(varFileInfo).toEqual(jasmine.objectContaining({
            "Translation": [
                Buffer.from([0x09, 0x04, 0xB0, 0x04])
            ]
        }));
    });
});