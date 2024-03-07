import { BufferWriter } from '../utils/buffer-writer';
import { GroupIconDirEntry, ICO_DIR_ENTRY, ICO_HEADER } from '../structures';
import { Resource } from './resource';

export interface ICON {
    likelyFormat: string | null;
    ext: string;
    metadata: GroupIconDirEntry;
    data: Uint8Array;
}

export function ICON(values?: Partial<ICON>): ICON {
    return {
        likelyFormat: null,
        ext: '',
        metadata: new GroupIconDirEntry({} as any),
        data: new Uint8Array(),
        ...values
    }
}

export class Icon extends Resource {

    private likelyFormat: string;

    constructor(data: Uint8Array, private metadata: GroupIconDirEntry) {
        super(data);
        this.likelyFormat = '';
        this.ext = '';
        this.parse();
    }

    public getMetadata(): GroupIconDirEntry {
        return this.metadata;
    }

    private parse(): void {
        if (this.metadata == null) {
            return;
        }
        // PNG files always start with the following 8 bytes:
        // 0x89  0x50  0x4e  0x47  0x0d  0x0a  0x1a  0x0a
        // \211  P     N     G     \r    \n    \032  \n
        const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
        if (this.data.slice(0, 8).reduce((match: boolean, test: number, i: number) => match && PNG_HEADER[i] === test, true)) {
            this.likelyFormat = 'PNG';
            this.ext = '.png'
            // else probably an ico file
        } else if (this.data[0] === 0x28) {
            this.likelyFormat = 'ICO';
            this.ext = '.ico';
        }
    }

    public export(): Uint8Array {
        if (this.likelyFormat === 'ICO') {
            return this.exportAsIco();
        } else {
            return this.data;
        }
    }

    private exportAsIco(): Uint8Array {
        // Inside the exe resources, the ico files are broken up into individual resource entries, resulting
        // in the ico file header information being stripped away.
        // An ico file can contain multiple images at various resolutions, bit-depths, etc.. and when combined,
        // all images share a common header, which lists each image, so that header wouldn't work once broken up
        // for an individual file. So here we need to recreate an ico file header that only lists a single image.
        // https://devblogs.microsoft.com/oldnewthing/20101018-00/?p=12513
        const icoHeader = ICO_HEADER();
        const icoDirEntry = ICO_DIR_ENTRY({
            bWidth: this.metadata.getWidth(),
            bHeight: this.metadata.getHeight(),
            bColorCount: this.metadata.getColorCount(),
            bReserved: this.metadata.getReservedByte(),
            wPlanes: this.metadata.getPlanes(),
            wBitcount: this.metadata.getBitCount(),
            // dwBytesInRes: metadata.dwBytesInRes,
            dwBytesInRes: this.data.length,
            dwImageOffset: 0x00000016
        });
        const icoStruc = new BufferWriter(new ArrayBuffer(0x16));
        icoStruc.writeWord(icoHeader.wReserved);
        icoStruc.writeWord(icoHeader.wType);
        icoStruc.writeWord(icoHeader.wCount);

        icoStruc.writeByte(icoDirEntry.bWidth);
        icoStruc.writeByte(icoDirEntry.bHeight);
        icoStruc.writeByte(icoDirEntry.bColorCount);
        icoStruc.writeByte(icoDirEntry.bReserved);
        icoStruc.writeWord(icoDirEntry.wPlanes);
        icoStruc.writeWord(icoDirEntry.wBitcount);
        icoStruc.writeDWord(icoDirEntry.dwBytesInRes);
        icoStruc.writeDWord(icoDirEntry.dwImageOffset);

        const icoData = new Uint8Array(icoStruc.byteLength() + this.data.length);
        icoData.set(new Uint8Array(icoStruc.buffer()), 0);
        icoData.set(this.data, icoStruc.byteLength());
        return icoData;
    }
}
