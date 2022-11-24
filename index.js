const PeFileParser = require('./lib/pe-file-parser');
const VsVersionInfo = require('./lib/vs-version-info');

module.exports = {
    ...PeFileParser,
    ...VsVersionInfo
}