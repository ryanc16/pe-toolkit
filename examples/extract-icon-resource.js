const fs = require('fs');
const path = require('path');
const {PeFileParser} = require('../index');

const dir = './resources';
const file = 'ChromeSetup.exe';

const filepath = path.join(dir, file);

console.log('reading', filepath);
const buff = fs.readFileSync(filepath);

// Create a new PeFileParser object
const peFile = new PeFileParser();
// parse the byte data
peFile.parseBytes(buff);

// Get all the icon type resources embedded in the exe file.
const icons = peFile.getResourcesOfType(PeFileParser.RT_RESOURCE_TYPES.RT_ICON);
// There may or may not be resources of the provided type, make sure there were some returned
if (icons.length > 0) {
    // Find the best icon by finding the largest resolution one with the best bit-depth
    // The resource information doesn't indicate what file type the image is, so some liberty is take at making
    // a best guess based on the data in the resource. It is usually a ICO or PNG image type.
    const bestIcon = icons.filter(i => i.metadata != null).sort((a, b) => (b.metadata.bWidth * b.metadata.bHeight * b.metadata.wBitCount) - (a.metadata.bWidth * a.metadata.bHeight * a.metadata.wBitCount))[0];
    console.log(`selected icon: ${bestIcon.likelyFormat} ${bestIcon.metadata.bWidth}x${bestIcon.metadata.bHeight}-${bestIcon.metadata.wBitCount} ${bestIcon.metadata.dwBytesInRes} bytes`);
    
    // create a new file name using the same name as the original file and include the guessed image type extension.
    const filename = filepath + bestIcon.ext;
    console.log('saving to:', filename);
    // Save off a new file by writing the bytes for the resource.
    fs.writeFileSync(filename, bestIcon.data);
}