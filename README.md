# vs-version-info-js

Reads the `VS_VERSIONINFO` data structure embedded in windows exe, msi, and dlls.

Parsing logic implemented from the Microsoft spec: https://docs.microsoft.com/en-us/windows/win32/menurc/vs-versioninfo

Example usage:
```js
const vsInfo = require('vs-version-info');
// Parse the VS_VERSIONINFO table data out of the file and store the results
const results = vsInfo.parseFromFile("./ChromeSetup.exe");

// The spec allows for zero or more VS_VERSIONINFO tables to be embedded in a single file
for (const result of results) {
    // Retrieve the embedded fixed file info structure
    const fixedFileInfo = result.getFixedFileInfo();
    // Retrieve the embedded string file info structure
    const stringFileInfo = result.getStringFileInfo();
    // Retrieve the embedded string tables
    const stringTables = result.getStringTables();
    // Retrieve the embedded var file info structure
    const varFileInfo = result.getVarFileInfo();
}
```
___
## Results
The spec allows for zero or more `VS_VERSIONINFO` tables to be embedded in a single file. This means that not all files provided as input will contain a `VS_VERSIONINFO` table. If this is the case while attempting to parse a file, an error will be thrown informing of that.

### getFixedFileInfo
This corresponds to the `VS_FIXEDFILEINFO` structure spec: https://docs.microsoft.com/en-us/windows/win32/api/verrsrc/ns-verrsrc-vs_fixedfileinfo

Example:
```js
result.getFixedFileInfo();
```
```json
{
  "dwSignature": [189,4,239,254],
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
}
```
___
### getStringFileInfo()
This corresponds to the `StringFileInfo` structure spec: https://docs.microsoft.com/en-us/windows/win32/menurc/stringfileinfo

The spec allows for zero or one `StringFileInfo` structure.

Example:
```js
result.getStringFileInfo();
```
```json
{
    "040904b0": {
        "CompanyName": "Google LLC",
        "FileDescription": "Google Update Setup",
        "FileVersion": "1.3.36.112",
        "LegalCopyright": "Copyright 2018 Google LLC",
        "ProductName": "Google Update",
        "ProductVersion": "1.3.36.112"
    }
}
```
___
### getStringTables()
This corresponds to the `StringTable` structure spec: https://docs.microsoft.com/en-us/windows/win32/menurc/stringtable

The spec allows for one or more `StringTable` structures.

Example:
```js
result.getStringTables();
```
```json
[
    {
        "CompanyName": "Google LLC",
        "FileDescription": "Google Update Setup",
        "FileVersion": "1.3.36.112",
        "LegalCopyright": "Copyright 2018 Google LLC",
        "ProductName": "Google Update",
        "ProductVersion": "1.3.36.112"
    }
]
```
___
### getVarFileInfo()
This corresponds to the `VarFileInfo` structure spec: https://docs.microsoft.com/en-us/windows/win32/menurc/varfileinfo

The spec allows for zero or one `VarFileInfo` structure.

Example:
```js
result.getVarFileInfo();
```
```json
{
    "Translation": [
        [0x09, 0x04, 0xB0, 0x04]
    ]
}
```