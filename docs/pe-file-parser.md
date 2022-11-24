# PeFileParser
Reads a binary WindowsPE file to extract PE header information and provides access to its resource table

## Quick Reference
- [Example program](#example-program)
- [Constructor](#Constructor)
- [Methods](#Methods)
  - [parseBytes](#parseBytes)
  - [getSectionHeaders](#getSectionHeaders)
  - getSectionHeader
  - getDosHeader
  - getPeHeader
  - getPeOptHeader
  - getResourcesOfType
___
## Example program <a id="example-program"></a>
```js
const { PeFileParser } = require('pe-toolkit');
const fs = require('fs');

// Acquire the binary byte data by some means. Could be through the NodeJS fs module, or the HTML5 FileReader
const bytes = fs.readFileSync("./resources/ChromeSetup.exe");
// Parse the VS_VERSIONINFO structure out of the provided byte data and store the results
const prFile = new PeFileParser();
peFile.parseBytes(bytes);

// Retrieve the section headers
const sectionHeaders = peFile.getSectionHeaders();
// Retrieve a specific section header
const dataSection = peFile.getSectionHeader('.data');
// Retrieve the DOS header
const dosHeader = peFile.getDosHeader();
// Retrieve the PE header
const peHeader = peFile.getPeHeader();
// Retrieve the PE Optional header
const prOptHeader = peFile.getPeOptHeader();
// Retrieve the resources for allowable types
const iconResources = peFile.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_ICON);
```
___
## Constructor <a id="Constructor"></a>

### **PeFileParser**

#### Args
_(none)_

#### Example
```js
const { PeFileParser } = require('pe-toolkit');

const peFile = new PeFileParser();
```
___
## Methods <a id="Methods"></a>

### **parseBytes** <a id="parseBytes"></a>
Parses the 

#### Args
- `data`: (_`Buffer`_ | _`Uint8Array`_ | _`Blob`_) - 

#### Returns
`void`

#### Example
```js
const fs = require('fs');
const { PeFileParser } = require('pe-toolkit');

const data = fs.readFileSync('./resources/ChromeSetup.exe');
const peFile = new PeFileParser();
peFile.parseBytes(data);
```

### **getSectionHeaders** <a id="getSectionHeaders"></a>

#### Args
_(none)_

#### Returns
`Array<object>` - An array of all the section tables

#### Example
```js
peFile.getSectionHeaders();
```
Result:
```json
[
  {
    "szName": ".text",
    "dwPhysicalAddressUnionVirtualSize": 82991,
    "dwVirtualAddress": 4096,
    "dwSizeOfRawData": 83456,
    "dwPointerToRawData": 1024,
    "dwPointerToRelocations": 0,
    "dwPointerToLineNumbers": 0,
    "wNumberOfRelocations": 0,
    "wNumberOfLinenumbers": 0,
    "dwCharacteristics": 1610612768
  },
  {
    "szName": ".rdata",
    "dwPhysicalAddressUnionVirtualSize": 28076,
    "dwVirtualAddress": 90112,
    "dwSizeOfRawData": 28160,
    "dwPointerToRawData": 84480,
    "dwPointerToRelocations": 0,
    "dwPointerToLineNumbers": 0,
    "wNumberOfRelocations": 0,
    "wNumberOfLinenumbers": 0,
    "dwCharacteristics": 1073741888
  },
  {
    "szName": ".data",
    "dwPhysicalAddressUnionVirtualSize": 4752,
    "dwVirtualAddress": 118784,
    "dwSizeOfRawData": 2560,
    "dwPointerToRawData": 112640,
    "dwPointerToRelocations": 0,
    "dwPointerToLineNumbers": 0,
    "wNumberOfRelocations": 0,
    "wNumberOfLinenumbers": 0,
    "dwCharacteristics": 3221225536
  },
  {
    "szName": ".rsrc",
    "dwPhysicalAddressUnionVirtualSize": 1197288,
    "dwVirtualAddress": 126976,
    "dwSizeOfRawData": 1197568,
    "dwPointerToRawData": 115200,
    "dwPointerToRelocations": 0,
    "dwPointerToLineNumbers": 0,
    "wNumberOfRelocations": 0,
    "wNumberOfLinenumbers": 0,
    "dwCharacteristics": 1073741888
  },
  {
    "szName": ".reloc",
    "dwPhysicalAddressUnionVirtualSize": 4320,
    "dwVirtualAddress": 1327104,
    "dwSizeOfRawData": 4608,
    "dwPointerToRawData": 1312768,
    "dwPointerToRelocations": 0,
    "dwPointerToLineNumbers": 0,
    "wNumberOfRelocations": 0,
    "wNumberOfLinenumbers": 0,
    "dwCharacteristics": 1107296320
  }
]
```
___
### **getSectionHeader** <a id="getSectionHeader"></a>
Retrieve a single section table by providing it's identifier name
#### Args
- `sectionId`: (_`string`_) - A section identifier

### Returns
`object` - A section table entry

### Example
```js
peFile.getSectionHeader('.data');
```
Result:
```json
{
  "szName": ".data",
  "dwPhysicalAddressUnionVirtualSize": 4752,
  "dwVirtualAddress": 118784,
  "dwSizeOfRawData": 2560,
  "dwPointerToRawData": 112640,
  "dwPointerToRelocations": 0,
  "dwPointerToLineNumbers": 0,
  "wNumberOfRelocations": 0,
  "wNumberOfLinenumbers": 0,
  "dwCharacteristics": 3221225536
}
```