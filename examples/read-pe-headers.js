const fs = require('fs');
const {PeFileParser} = require('../index');
const path = require('path');

const dir = './resources';
const file = 'ChromeSetup.exe';

const filepath = path.join(dir, file);

console.log('reading', filepath);
const buff = fs.readFileSync(filepath);

const peFile = new PeFileParser()
peFile.parseBytes(buff);

console.log('section headers');
console.log(peFile.getSectionHeaders());

console.log('section header');
console.log(peFile.getSectionHeader('.data'));

console.log('DOS header');
console.log(peFile.getDosHeader());

console.log('PE header');
console.log(peFile.getPeHeader());

console.log('PE Opt header');
console.log(peFile.getPeOptHeader());