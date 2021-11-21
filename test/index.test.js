const vsInfo = require('../index');

const testBinaryData = 'test/resources/test.bin'

describe('vs-version-info', function() {
    it('can parse', function() {
        expect(function() {
            vsInfo.parseFromFile(testBinaryData);
        }).not.toThrow();
    });

    it('can get results', function() {
        const results = vsInfo.parseFromFile(testBinaryData);

        expect(results).toBeInstanceOf(Array);
        expect(results).toHaveSize(1);
    });

    it('can get fixed file info', function() {
        const results = vsInfo.parseFromFile(testBinaryData);
        const result0 = results[0];
        const fixedFileInfo = result0.getFixedFileInfo();

        expect(fixedFileInfo).toBeInstanceOf(Object);
        expect(fixedFileInfo).toEqual(jasmine.objectContaining({
            "dwSignature": Buffer.from([0xBD, 0x04, 0xEF, 0xFE]),
            "dwStrucVersion": "1.0",
            "dwFileVersionLS": 3,
            "dwFileVersionMS": 1,
            "dwProductVersionLS": 3,
            "dwProductVersionMS": 1,
            "dwFileFlagsMask": 63,
            "dwFileFlags": 0,
            "dwFileOS": 262148,
            "dwFileType": 1,
            "dwFileSubtype": 0,
            "dwFileDateLS": 0,
            "dwFileDateMS": 0
        }));
    });

    it('can get string file info table', function() {
        const results = vsInfo.parseFromFile(testBinaryData);
        const result0 = results[0];
        const stringFileInfo = result0.getStringFileInfo();

        expect(stringFileInfo).toBeInstanceOf(Object);
        expect(stringFileInfo).toEqual(jasmine.objectContaining({
            "040904b0": jasmine.any(Object)
        }));
    });

    it('can get string tables', function() {
        const results = vsInfo.parseFromFile(testBinaryData);
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
            "ProductVersion": "1.3.36.112"
        }));
    });

    it('can get var file info table', function() {
        const results = vsInfo.parseFromFile(testBinaryData);
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