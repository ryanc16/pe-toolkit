# pe-toolkit

A tookit for working with Windows PE exe, dll, and some msi files
___
## Quick Reference
- [VsVersionInfo](#VsVersionInfo)
- [PeFileParser](#PeFileParser)

### VsVersionInfo <a id="VsVersionInfo"></a>
The VsVersionInfo parser reads the `VS_VERSIONINFO` structure embeded in the header information of a WinPE file.

[Full documentation](./docs/vs-version-info.md)

Example:
```js
const fs = require('fs');
const path = require('path');
const { VsVersionInfo } = require('pe-toolkit');

const buff = fs.readFileSync('./resources/ChromeSetup.exe');

const vsVersionInfo = new VsVersionInfo();
const vsInfoResults = vsVersionInfo.parseBytes(buff);
if (vsInfoResults.length > 0) {
    const exeInfo = vsInfoResults[0].getStringTables();
    console.log(exeInfo);
}
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
### PeFileParser <a id="PeFileParser"></a>
The PeFileParser reads the header and resources information structures embeded in the header information of a WinPE file.

[Full documentation](./docs/pe-file-parser.md)

Example:
```js
const fs = require('fs');
const path = require('path');
const { PeFileParser } = require('pe-toolkit');

const buff = fs.readFileSync('./resources/ChromeSetup.exe');

const peFile = new PeFileParser();
peFile.parseBytes(buff);

const optHeader = peFile.getPeOptHeader();
console.log(optHeader);
```
Result:
```json
{
  "wMagic": 267,
  "bMajorLinkerVersion": 14,
  "bMinorLinkerVersion": 20,
  "dwSizeOfCode": 83456,
  "dwSizeOfInitializedData": 1232896,
  "dwSizeOfUninitializedData": 0,
  "dwAddressOfEntryPoint": 20247,
  "dwBaseOfCode": 4096,
  "dwBaseOfData": 90112,
  "dwImageBase": 4194304,
  "dwSectionAlignment": 4096,
  "dwFileAlignment": 512,
  "wMajorOperatingSystemVersion": 5,
  "wMinorOperatingSystemVersion": 1,
  "wMajorImageVersion": 0,
  "wMinorImageVersion": 0,
  "wMajorSusbsystemVersion": 5,
  "wMinorSusbsystemVersion": 1,
  "dwReserved1": 0,
  "dwSizeOfImage": 1335296,
  "dwSizeOfHeaders": 1024,
  "dwCheckSum": 1374046,
  "wSubsystem": 2,
  "wDllCharacteristics": 33088,
  "dwSizeOfStackReserve": 1048576,
  "dwSizeOfStackCommit": 4096,
  "dwSizeOfHeapReserve": 1048576,
  "dwSizeOfHeapCommit": 4096,
  "dwLoaderFlags": 0,
  "dwNumberOfRvaAndSizes": 16,
  "DataDirectory": [
    <1 empty item>,
    { "dwVirtualAddress": 115816, "dwSize": 120 },
    { "dwVirtualAddress": 126976, "dwSize": 1197288 },
    <1 empty item>,
    { "dwVirtualAddress": 1317376, "dwSize": 23896 },
    { "dwVirtualAddress": 1327104, "dwSize": 4320 },
    { "dwVirtualAddress": 113360, "dwSize": 84 },
    <3 empty items>,
    { "dwVirtualAddress": 113448, "dwSize": 64 },
    <1 empty item>,
    { "dwVirtualAddress": 90112, "dwSize": 416 }
  ]
}
```
