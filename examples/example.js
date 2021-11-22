const fs = require('fs');
const vsInfo = require('../index');

const dataFile = '../test/resources/test.bin';
const data = fs.readFileSync(dataFile);

const results = vsInfo.parseBytes(data);