const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const testRes = path.join('test', 'resources');
const testData = path.join('test', 'data');

const TestDataHelpers = {
    decompressTestData: function (testBinaryFile) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(path.join(testRes, testBinaryFile) + '.gz')) {
                // decompress the test resource file
                exec('gunzip -k ' + path.join(testRes, testBinaryFile) + '.gz', (err, stdout, stderr) => {
                    if (err) {
                        reject();
                    } else {
                        fs.mkdir(testData, { recursive: true }, (err) => {
                            if (err) {
                                reject();
                            } else {
                                const inFile = path.join(testRes, testBinaryFile)
                                const outFile = path.join(testData, testBinaryFile)
                                fs.rename(inFile, outFile, () => {
                                    resolve(outFile);
                                });
                            }
                        });
                    }
                });
            }
            else {
                resolve();
            }
        });
    },
    compressTestData: function (testBinaryFile) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(testBinaryFile)) {
                // create the test file
                fs.readFile(path.join(testRes, testBinaryFile), (err, buff) => {
                    if (err) {
                        reject();
                    } else {
                        fs.mkdir(testData, { recursive: true }, (err, path) => {
                            if (err) {
                                reject();
                            } else {
                                fs.writeFile(path.join(testData, testBinaryFile), buff.subarray(0, buff.byteLength), resolve);
                            }
                        });
                    }
                });
            }
        });
    },
    cleanupTestData: function (dataFile) {
        return new Promise((resolve, reject) => {
            fs.unlink(dataFile, (err) => {
                if (err) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = TestDataHelpers;
