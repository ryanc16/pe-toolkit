const fs = require('fs');
const path = require('path');
const { PeFileParser } = require('../lib/index');

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
const iconResources = peFile.getIconResources();
// There may or may not be resources of the provided type, make sure there were some returned
if (Object.keys(iconResources).length > 0) {
    const icons = [];
    for (const resourceId in iconResources) {
        for (const languageId in iconResources[resourceId]) {
            icons.push(iconResources[resourceId][languageId]);
        }
    }
    // Find the best icon by finding the largest resolution one with the best bit-depth
    // The resource information doesn't indicate what file type the image is, so some liberty is take at making
    // a best guess based on the data in the resource. It is usually a ICO or PNG image type.
    const bestIcon = icons.filter(i => i.getMetadata() != null).sort((a, b) => (b.getMetadata().getWidth() * b.getMetadata().getHeight() * b.getMetadata().getBitCount()) - (a.getMetadata().getWidth() * a.getMetadata().getHeight() * a.getMetadata().getBitCount()))[0];
    console.log(`selected icon: ${bestIcon.getMetadata().getWidth()}x${bestIcon.getMetadata().getHeight()}-${bestIcon.getMetadata().getBitCount()} ${bestIcon.getMetadata().getByteLength()} bytes`);

    // create a new file name using the same name as the original file and include the guessed image type extension.
    const filename = filepath + bestIcon.getExtension();
    console.log('saving to:', filename);
    // Save off a new file by writing the bytes for the resource.
    fs.writeFileSync(filename, bestIcon.export());
}
