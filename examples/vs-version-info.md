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
