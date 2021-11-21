# vs-version-info-js

Reads the `VS_VERSIONINFO` data structure embedded in windows exe, msi, and dlls.

Parsing logic implemented to the Microsoft spec: https://docs.microsoft.com/en-us/windows/win32/menurc/vs-versioninfo

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

### getVsVersionInfo()
Get a formatted VS_VERSIONINFO data object

This corresponds to the `VS_VERSIOINFO` structure spec: https://docs.microsoft.com/en-us/windows/win32/menurc/vs-versioninfo

The spec allows for zero or more VS_VERSIONINFO structures in a file

Example:
```js
result.getVsVersionInfo();
```
```json
{
  "FixedFileInfo": {
    "dwSignature": <Buffer bd 04 ef fe>,
    "dwStrucVersion": [ 0, 1 ],
    "fileVersionLS": 3,
    "fileVersionMS": 1,
    "productVersionLS": 3,
    "productVersionMS": 1,
    "fileFlagsMask": 63,
    "fileFlags": {
      "debug": false,
      "prerelease": false,
      "patched": false,
      "privatebuild": false,
      "infoinferred": false,
      "specialbuild": false
    },
    "fileOS": {
      "dos": false,
      "os216": false,
      "os232": false,
      "nt": true,
      "windows16": false,
      "pm16": false,
      "pm32": false,
      "windows32": true,
      "unknown": false
    },
    "fileType": {
      "app": true,
      "dll": false,
      "drv": false,
      "font": false,
      "vxd": false,
      "staticLib": false,
      "unknown": false
    },
    "fileSubtype": 0,
    "fileDateLS": 0,
    "fileDateMS": 0
  },
  "StringFileInfo": {
    "040904b0": {
      "CompanyName": "Google LLC",
      "FileDescription": "Google Update Setup",
      "FileVersion": "1.3.36.112",
      "InternalName": "Google Update Setup",
      "LegalCopyright": "Copyright 2018 Google LLC",
      "OriginalFilename": "GoogleUpdateSetup.exe",
      "ProductName": "Google Update",
      "ProductVersion": "1.3.36.112",
      "LanguageId": "en"
    }
  },
  "VarFileInfo": {
    "Translation": [
      <Buffer 09 04 b0 04>
    ]
  }
}
```
___
### getFixedFileInfo()
Get a formatted VS_FIXEDFILEINFO data object

This corresponds to the `VS_FIXEDFILEINFO` structure spec: https://docs.microsoft.com/en-us/windows/win32/api/verrsrc/ns-verrsrc-vs_fixedfileinfo

Example:
```js
result.getFixedFileInfo();
```
```json
{
  "dwSignature": <Buffer bd 04 ef fe>,
  "dwStrucVersion": [ 0, 1 ],
  "fileVersionLS": 3,
  "fileVersionMS": 1,
  "productVersionLS": 3,
  "productVersionMS": 1,
  "fileFlagsMask": 63,
  "fileFlags": {
    "debug": false,
    "prerelease": false,
    "patched": false,
    "privatebuild": false,
    "infoinferred": false,
    "specialbuild": false
  },
  "fileOS": {
    "dos": false,
    "os216": false,
    "os232": false,
    "nt": true,
    "windows16": false,
    "pm16": false,
    "pm32": false,
    "windows32": true,
    "unknown": false
  },
  "fileType": {
    "app": true,
    "dll": false,
    "drv": false,
    "font": false,
    "vxd": false,
    "staticLib": false,
    "unknown": false
  },
  "fileSubtype": 0,
  "fileDateLS": 0,
  "fileDateMS": 0
}
```
___
### getStringFileInfo()
Get a formatted StringFileInfo data object

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
    "InternalName": "Google Update Setup",
    "LegalCopyright": "Copyright 2018 Google LLC",
    "OriginalFilename": "GoogleUpdateSetup.exe",
    "ProductName": "Google Update",
    "ProductVersion": "1.3.36.112",
    "LanguageId": "en"
  }
}
```
___
### getStringTables()
Get an array of formatted StringTable objects

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
    "InternalName": "Google Update Setup",
    "LegalCopyright": "Copyright 2018 Google LLC",
    "OriginalFilename": "GoogleUpdateSetup.exe",
    "ProductName": "Google Update",
    "ProductVersion": "1.3.36.112",
    "LanguageId": "en"
  }
]
```
___
### getVarFileInfo()
Get a formatted VarFileInfo data object

This corresponds to the `VarFileInfo` structure spec: https://docs.microsoft.com/en-us/windows/win32/menurc/varfileinfo

The spec allows for zero or one `VarFileInfo` structure.

Example:
```js
result.getVarFileInfo();
```
```json
{
  "Translation": [
    <Buffer 09 04 b0 04>
  ]
}
```