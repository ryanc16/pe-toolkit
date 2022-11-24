const fs = require('fs');
const path = require('path');
const {PeFileParser, VsVersionInfo} = require('../index');

const dir = './resources';
const file = 'ChromeSetup.exe';

const filepath = path.join(dir, file);

const buff = fs.readFileSync(filepath);
// PeFileParser
console.log('using PeFileParser');
const peFile = new PeFileParser();
peFile.parseBytes(buff);
const vsInfoResources = peFile.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_VERSION);
if (vsInfoResources.length > 0) {
    const exeInfo = vsInfoResources[0].getStringTables();
    console.log(exeInfo);
}

// VsVersionInfo
console.log('using VsVersionInfo');
const vsVersionInfo = new VsVersionInfo();
const vsInfoResults = vsVersionInfo.parseBytes(buff);
if (vsInfoResults.length > 0) {
    const exeInfo = vsInfoResults[0].getStringTables();
    console.log(exeInfo);
}