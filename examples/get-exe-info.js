const fs = require('fs');
const path = require('path');
const { PeFileParser } = require('../lib/index');

const dir = './resources';
const file = 'ChromeSetup.exe';

const filepath = path.join(dir, file);

const buff = fs.readFileSync(filepath);
// PeFileParser
console.log('using PeFileParser');
const peFile = new PeFileParser();
peFile.parseBytes(buff);
const vsInfoResources = peFile.getVersionInfoResources();

if (Object.keys(vsInfoResources).length > 0) {
    const id = Object.keys(vsInfoResources)[0];
    const languageId = Object.keys(vsInfoResources[id])[0];
    const exeInfo = vsInfoResources[id][languageId].getStringFileInfo().toObject();
    console.log(exeInfo);
}
