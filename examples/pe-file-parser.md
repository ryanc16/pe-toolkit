Example:

**Set up**
```js
const fs = require('fs');
const path = require('path');
const { PeFileParser } = require('pe-toolkit');

const buff = fs.readFileSync('./resources/ChromeSetup.exe');

const peFile = new PeFileParser();
peFile.parseBytes(buff);
```

**Dos Header**
```js
peFile.getDosHeader().toObject()
```
Result:
```js
{
  magic: '4d5a',
  countBytesLastPage: 144,
  countPages: 3,
  countRelocations: 0,
  countHeaderParagraphs: 4,
  minimumAllocation: 0,
  maximumAllocation: 65535,
  initialSS: '0000',
  initialSP: '00b8',
  checksum: '0000',
  initialIP: '0000',
  initialCS: '0000',
  fileAddressRelocationTable: '0040',
  overlayNumber: 0,
  reservedWords1: [ '0000', '0000', '0000', '0000' ],
  owmIdentifier: '0000',
  oemInformation: '0000',
  reservedWords2: [
    '0000', '0000',
    '0000', '0000',
    '0000', '0000',
    '0000', '0000',
    '0000', '0000'
  ],
  fileAddressOfNewExeHeader: '00000100'
}
```
**File header**
```js
peFile.getFileHeader().toObject();
```
Result:
```js
{
  ntSignature: '50450000',
  machine: {
    value: '014c',
    meaning: 'Intel i386, i486, i586, or later processors and compatible processors'
  },
  numberOfSections: 5,
  timeDateStamp: '2021-09-17T03:51:07.000Z',
  pointerToSymbolTable: '00000000',
  numberOfSymbols: 0,
  sizeOfOptionalHeader: 224,
  characteristics: {
    value: '0102',
    meaning: [
      '(0x0002) EXECUTABLE_IMAGE - File is an executable image (not a OBJ or LIB).',
      '(0x0100) 32BIT_MACHINE - Machine is based on a 32-bit-word architecture.'
    ]
  }
}
```
**Optional header**
```js
peFile.getOptionalHeader().toObject()
```
Result:
```js
{
  magic: {
    value: '010b',
    meaning: 'Identifies as a PE32 (32bit) executable file.'
  },
  majorLinkerVersion: 14,
  minorLinkerVersion: 20,
  sizeOfCode: 83456,
  sizeOfInitializedData: 1232896,
  sizeOfUninitializedData: 0,
  addressOfEntryPoint: '00004f17',
  baseOfCode: '00001000',
  baseOfData: '00016000',
  imageBase: '00400000',
  sectionAlignment: 4096,
  fileAlignment: 512,
  majorOperatingSystemVersion: 5,
  minorOperatingSystemVersion: 1,
  majorImageVersion: 0,
  minorImageVersion: 0,
  majorSubsystemVersion: 5,
  minorSubsystemVersion: 1,
  sizeOfImage: 1335296,
  sizeOfHeaders: 1024,
  checksum: '0014f75e',
  subsystem: {
    value: '0002',
    meaning: 'WINDOWS_GUI - Runs in the Windows GUI subsystem'
  },
  dllCharacteristics: {
    value: '8140',
    meaning: [
      '(0x0040) DYNAMIC_BASE - DLL can be relocated at load time.',
      '(0x0100) NX_COMPAT - Image is NX compatible.',
      '(0x8000) TERMINAL_SERVER_AWARE - Terminal Server aware.'
    ]
  },
  sizeOfStackReserve: '00100000',
  sizeOfStackCommit: '00001000',
  sizeOfHeapReserve: '00100000',
  sizeOfHeapCommit: '00001000',
  loaderFlags: { value: '00000000', meaning: 'None' },
  numberOfRvaAndSizes: 16,
  DataDirectory: {
    IMPORT: { virtualAddress: '0001c468', size: 120 },
    RESOURCE: { virtualAddress: '0001f000', size: 1197288 },
    SECURITY: { virtualAddress: '00141a00', size: 23896 },
    BASERELOC: { virtualAddress: '00144000', size: 4320 },
    DEBUG: { virtualAddress: '0001bad0', size: 84 },
    LOAD_CONFIG: { virtualAddress: '0001bb28', size: 64 },
    IMPORT_ADDR: { virtualAddress: '00016000', size: 416 }
  }
}
```
**Section headers**
```js
peFile.getSectionHeaders().map(header => header.toObject())
```
```js
[
  {
    name: '.text',
    virtualAddress: '00001000',
    pointerToRawData: '00000400',
    sizeOfRawData: 83456,
    pointerToRelocations: '00000000',
    pointerToLineNumbers: '00000000',
    numberOfRelocations: 0,
    numberOfLineNumbers: 0,
    characteristics: { value: '60000020', meaning: [Array] }
  },
  {
    name: '.rdata',
    virtualAddress: '00016000',
    pointerToRawData: '00014a00',
    sizeOfRawData: 28160,
    pointerToRelocations: '00000000',
    pointerToLineNumbers: '00000000',
    numberOfRelocations: 0,
    numberOfLineNumbers: 0,
    characteristics: { value: '40000040', meaning: [Array] }
  },
  {
    name: '.data',
    virtualAddress: '0001d000',
    pointerToRawData: '0001b800',
    sizeOfRawData: 2560,
    pointerToRelocations: '00000000',
    pointerToLineNumbers: '00000000',
    numberOfRelocations: 0,
    numberOfLineNumbers: 0,
    characteristics: { value: 'c0000040', meaning: [Array] }
  },
  {
    name: '.rsrc',
    virtualAddress: '0001f000',
    pointerToRawData: '0001c200',
    sizeOfRawData: 1197568,
    pointerToRelocations: '00000000',
    pointerToLineNumbers: '00000000',
    numberOfRelocations: 0,
    numberOfLineNumbers: 0,
    characteristics: { value: '40000040', meaning: [Array] }
  },
  {
    name: '.reloc',
    virtualAddress: '00144000',
    pointerToRawData: '00140800',
    sizeOfRawData: 4608,
    pointerToRelocations: '00000000',
    pointerToLineNumbers: '00000000',
    numberOfRelocations: 0,
    numberOfLineNumbers: 0,
    characteristics: { value: '42000040', meaning: [Array] }
  }
]
```
**.data Section header**
```js
peFile.getSectionHeader('.data').toObject()
```
```js
{
  name: '.data',
  virtualAddress: '0001d000',
  pointerToRawData: '0001b800',
  sizeOfRawData: 2560,
  pointerToRelocations: '00000000',
  pointerToLineNumbers: '00000000',
  numberOfRelocations: 0,
  numberOfLineNumbers: 0,
  characteristics: {
    value: 'c0000040',
    meaning: [
      '(0x00000040) This section contains initialized data. Almost all sections except executable and the .bss section have this flag set.',
      '(0x40000000) This section is readable. This flag is almost always set for sections in EXE files.',
      "(0x80000000) The section is writeable. If this flag isn't set in an EXE's section, the loader should mark the memory mapped pages as read-only or execute-only. \n" +
        'Typical sections with this attribute are .data and .bss. Interestingly, the .idata section also has this attribute set.'
    ]
  }
}
```
