import { ImageDosHeader, IMAGE_DOS_HEADER } from "./image-dos-header";
import { ImageFileHeader, IMAGE_FILE_HEADER } from "./image-file-header";
import { ImageOptionalHeader, IMAGE_OPTIONAL_HEADER } from "./image-optional-header";
import { ImageSectionHeader, IMAGE_SECTION_HEADER } from "./image-section-header";

interface IMAGE_DOS {
    dosHeader: IMAGE_DOS_HEADER;
    fileHeader: IMAGE_FILE_HEADER;
    optionalHeader: IMAGE_OPTIONAL_HEADER;
    sections: IMAGE_SECTION_HEADER[];
}

function IMAGE_DOS(values?: Partial<IMAGE_DOS>): IMAGE_DOS {
    return {
        dosHeader: IMAGE_DOS_HEADER(),
        fileHeader: IMAGE_FILE_HEADER(),
        optionalHeader: IMAGE_OPTIONAL_HEADER(),
        sections: [],
        ...values
    }
}

export class ImageDos {

    constructor(
        private dosHeader: ImageDosHeader,
        private fileHeader: ImageFileHeader,
        private optionalHeader: ImageOptionalHeader,
        private sections: ImageSectionHeader[]) {
    }

    public getDosHeader(): ImageDosHeader {
        return this.dosHeader;
    }

    public getFileHeader(): ImageFileHeader {
        return this.fileHeader;
    }

    public getOptionalHeader(): ImageOptionalHeader {
        return this.optionalHeader;
    }

    public getSections(): ImageSectionHeader[] {
        return this.sections;
    }

    public toObject() {
        return {
            dosHeader: this.dosHeader.toObject(),
            fileHeader: this.fileHeader.toObject(),
            optionalHeader: this.optionalHeader.toObject(),
            sections: this.sections.map(section => section.toObject())
        };
    }
}
