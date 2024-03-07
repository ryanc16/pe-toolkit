const fs = require('fs');
const path = require('path');
const { PeFileParser } = require('../lib/index');

const dir = './resources';
const file = 'ChromeSetup.exe';

const filepath = path.join(dir, file);

console.log('reading', filepath);
const buff = fs.readFileSync(filepath);

const peFile = new PeFileParser();
peFile.parseBytes(buff);

console.log('DOS header');
console.log(peFile.getDosHeader().toObject());

console.log('File header');
console.log(peFile.getFileHeader().toObject());

console.log('Optional header');
console.log(peFile.getOptionalHeader().toObject());

console.log('section headers');
console.log(peFile.getSectionHeaders().map(header => header.toObject()));

console.log('section header');
console.log(peFile.getSectionHeader('.data').toObject());
