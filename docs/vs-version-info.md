# VsVersionInfo
Reads the `VS_VERSIONINFO` data structure embedded in windows exe, msi, and dlls.

Parsing logic implemented to the Microsoft spec: https://docs.microsoft.com/en-us/windows/win32/menurc/vs-versioninfo

## Quick Reference
- [Example program](#example-program)
- [`VsVersionInfo`](#VsVersionInfo)
  - [Constructor](#VsVersionInfo-Constructor)
  - [Methods](#VsVersionInfo-Methods)
    - [`parseBytes`](#VsVersionInfo-parseBytes)
- [VsVersionInfoResult](#VsVersionInfoResult)
  - [Methods](#VsVersionInfoResult-Methods)
    - [`getVsVersionInfo`](#VsVersionInfoResult-getVsVersionInfo)
    - [`getFixedFileInfo`](#VsVersionInfoResult-getFixedFileInfo)
    - [`getStringFileInfo`](#VsVersionInfoResult-getStringFileInfo)
    - [`getStringTables`](#VsVersionInfoResult-getStringTables)
    - [`getVarFileInfo`](#VsVersionInfoResult-getVarFileInfo)
___

## Example program <a id="example-program"></a>
```js
const { VsVersionInfo } = require('pe-toolkit');
const fs = require('fs');

// Acquire the binary byte data by some means. Could be through the NodeJS fs module, or the HTML5 FileReader
const bytes = fs.readFileSync("./resources/ChromeSetup.exe");
// Parse the VS_VERSIONINFO structure out of the provided byte data and store the results
const vsVersionInfo = new VsVersionInfo();
const results = vsVersionInfo.parseBytes(bytes);

// The spec allows for zero or more VS_VERSIONINFO tables to be embedded in a single file
for (const result of results) {
  // Retrieve a formatted complete VS_VERSIONINFO structure
  const vsVersionInfo = result.getVsVersionInfo();
  // Retrieve a formatted FixedFileInfo structure
  const fixedFileInfo = result.getFixedFileInfo();
  // Retrieve a formatted StringFileInfo structure
  const stringFileInfo = result.getStringFileInfo();
  // Retrieve a list of formatted StringTable structures
  const stringTables = result.getStringTables();
  // Retrieve a formatted VarFileIinfo structure
  const varFileInfo = result.getVarFileInfo();
}
```
___
## Constructor <a id="VsVersionInfo-Constructor"></a>

### **VsVersionInfo** <a id="VsVersionInfo"></a>
Create a new instance of a VsVersionInfo parsing object.
#### Args
_(none)_
#### Example
```js
const { VsVersionInfo } = require('pe-toolkit');

const vsInfo = new VsVersionInfo();
```
## Methods <a id="VsVersionInfo-Methods"></a>

### **parseBytes** <a id="VsVersionInfo-parseBytes"></a>
Read binary byte data and collect all the `VS_VERSIONINFO` strutures found in it, if any. The spec allows for zero or more `VS_VERSIONINFO` tables to be embedded in a single file. This means that not all files provided as input will contain a `VS_VERSIONINFO` table. If this is the case while attempting to parse a file, an error will indicating that is the case will be thrown.
#### Args
- `data`: (_`Buffer`_ | _`Uint8Array`_ | _`Blob`_) - The binary byte data to parse the `VS_VERSIONINFO` structure from
#### Returns
`Array<VsVersionInfoResult>` - An array of VsVersionInfoResult objects
#### Throws
Error when no VS_VERSIONINFO tables can be found, or there is an error during parsing of a found structure
#### Example
```js
const fs = require('fs');
const { VsVersionInfo } = require('pe-toolkit');

const data = fs.readFileSync('./resources/ChromeSetup.exe');

const vsInfo = new VsVersionInfo();
const results = vsInfo.parseBytes(data);
```




# VsVersionInfoResult <a id="VsVersionInfoResult"></a>
A parsed VS_VERSIONINFO structure result container.

## Methods <a id="VsVersionInfoResult-Methods"></a>

### **getVsVersionInfo** <a id="VsVersionInfoResult-getVsVersionInfo"></a>
Get a formatted VS_VERSIONINFO data object

This corresponds to the `VS_VERSIONINFO` structure spec: https://docs.microsoft.com/en-us/windows/win32/menurc/vs-versioninfo

The spec allows for zero or more VS_VERSIONINFO structures in a file
#### Args
_(none)_

#### Returns
`object` - The complete `VS_VERSIONINFO` structure

Example:
```js
result.getVsVersionInfo();
```
Returns:
```json
{
  "FixedFileInfo": {
    "dwSignature": Uint8Array(4) [ 189, 4, 239, 254 ],
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
      Uint8Array(4) [ 9, 4, 176, 4 ]
    ]
  }
}
```
___
### **getFixedFileInfo** <a id="VsVersionInfoResult-getFixedFileInfo"></a>
Get a formatted VS_FIXEDFILEINFO data object

This corresponds to the `VS_FIXEDFILEINFO` structure spec: https://docs.microsoft.com/en-us/windows/win32/api/verrsrc/ns-verrsrc-vs_fixedfileinfo

#### Args
_(none)_

#### Returns
`object` - A `VS_FIXEDFILEINFO` structure

#### Example
```js
result.getFixedFileInfo();
```
Result:
```json
{
  "dwSignature": Uint8Array(4) [ 189, 4, 239, 254 ],
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
### **getStringFileInfo** <a id="VsVersionInfoResult-getStringFileInfo"></a>
Get a formatted `StringFileInfo` data object

This corresponds to the `StringFileInfo` structure spec: https://docs.microsoft.com/en-us/windows/win32/menurc/stringfileinfo

The spec allows for zero or one `StringFileInfo` structure.

#### Args
_(none)_

#### Returns
`object` - A map of `StringFileInfo` objects, keyed to their translation key. The translation key can be found in `VarFileInfo`.

#### Example
```js
result.getStringFileInfo();
```
Result:
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
### **getStringTables** <a id="VsVersionInfoResult-getStringTables"></a>
Get an array of formatted StringTable objects

This corresponds to the `StringTable` structure spec: https://docs.microsoft.com/en-us/windows/win32/menurc/stringtable

The spec allows for one or more `StringTable` structures.

#### Args
_(none)_

#### Returns
`Array<object>` - An array of all `StringFileInfo` values

#### Example
```js
result.getStringTables();
```
Result:
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
### **getVarFileInfo** <a id="VsVersionInfoResult-getVarFileInfo"></a>
Get a formatted `VarFileInfo` data object

This corresponds to the `VarFileInfo` structure spec: https://docs.microsoft.com/en-us/windows/win32/menurc/varfileinfo

The spec allows for zero or one `VarFileInfo` structure.

#### Args
_(none)_

#### Returns
`object` - A `VarFileInfo` object

#### Example
```js
result.getVarFileInfo();
```
Result:
```json
{
  "Translation": [
    Uint8Array(4) [ 9, 4, 176, 4 ]
  ]
}
```