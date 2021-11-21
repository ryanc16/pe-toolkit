const DATA_TYPES = require('./data-types');
const SZ_WCHAR = DATA_TYPES.SZ_WCHAR;

function BufferReader(buffer) {
    this.buffer = buffer;
    this.offset = 0;
    this.alignment = 0;

    this.trim = function(start=0, end=this.buffer.length) {
        this.buffer = this.buffer.slice(start, end);
    }

    this.readBytes = function(byte_count) {
        const bytes = this.buffer.slice(this.offset, this.offset + byte_count);
        this.offset+=bytes.length;
        return bytes;
    }

    this.readByte = function(asInt=false) {
        let byte = 0x00;
        if (asInt === true) {
            byte = this.buffer.readUInt8();
        } else {
            byte = this.buffer.slice(this.offset, this.offset + DATA_TYPES.BYTE)[0];
        }
        this.offset += DATA_TYPES.BYTE;
        return byte;
    }
    
    this.readWord = function(asInt=false) {
        let word = [];
        if (asInt === true) {
            word = this.buffer.readUInt16LE(this.offset);
        } else {
            word = this.buffer.slice(this.offset, this.offset + DATA_TYPES.WORD);   
        }
        this.offset += DATA_TYPES.WORD;
        return word;
    }

    this.readWords = function(word_count) {
        const words = this.buffer.slice(this.offset, this.offset + (word_count * DATA_TYPES.WORD));
        this.offset += words.length;
        return words;
    }
    
    this.readDWord = function(asInt=false) {
        let dword = [];
        if (asInt === true) {
            dword = this.buffer.readUInt32LE(this.offset);
        } else {
            dword = this.buffer.slice(this.offset, this.offset + DATA_TYPES.DWORD);
        }
        this.offset += DATA_TYPES.DWORD;
        return dword;
    }
    
    this.readQWord = function() {
        const qword = this.buffer.slice(this.offset, this.offset + DATA_TYPES.QWORD);
        this.offset += DATA_TYPES.QWORD;
        return qword;
    }
    
    this.readStringZ = function() {
        const location = this.findNextWord(SZ_WCHAR('\0'), this.offset);
        const data = this.buffer.slice(this.offset, location.end.dec);
        const str = [];
        for (let i=0; i<data.length-1; i+=DATA_TYPES.WORD) {
            str.push(String.fromCharCode(data.readUInt16LE(i)));
        }
        this.offset += data.length;
        return str.join('').replace(/\0/g, '');
    }

    this.readWordsAsString = function(word_count) {
        const words = this.readWords(word_count);
        const str = []
        for (let i=0; i<words.length; i+=DATA_TYPES.WORD) {
            str.push(String.fromCharCode(words.readUInt16LE(i)));
        }
        return str.join('').replace(/\0/g, '');
    }

    this.peekByte = function(asInt=false, offset=this.offset) {
        if (asInt === true) {
            return this.buffer.readUInt8(offset);
        } else {
            return this.buffer.slice(offset, offset + DATA_TYPES.BYTE);
        }
    }

    this.prevByte = function(asInt=false, offset=this.offset) {
        if (asInt === true) {
            return this.buffer.readUInt8(offset - DATA_TYPES.BYTE);
        } else {
            return this.buffer.slice(offset - DATA_TYPES.BYTE, offset);
        }
    }

    this.peekWord = function(asInt=false, offset=this.offset) {
        if (asInt === true) {
            return this.buffer.readUInt16LE(offset);
        } else {
            return this.buffer.slice(offset, offset + DATA_TYPES.WORD);
        }
    }

    this.prevWord = function(asInt=false, offset=this.offset) {
        if (asInt === true) {
            return this.buffer.readUInt16LE(offset - DATA_TYPES.WORD);
        } else {
            return this.buffser.slice(offset - DATA_TYPES.WORD, offset);
        }
    }
    
    this.seekNext = function(data) {
        const location = this.findNext(data);
        if (location.start.dec !== -1) {
            this.goto(location.start.dec);
        }
    }

    this.seekNonZeroByte = function() {
        while (this.peekByte(true) === 0x00) {
            this.readByte();
        }
    }

    this.seekNonZeroWord = function() {
        while (this.peekWord(true) === 0x00) {
            this.readWord();
        }
    }

    this.alignTo32BitBoundary = function() {
        let offset = 0;
        while ((this.offset + offset) % DATA_TYPES.DWORD !== 0) {
            offset += DATA_TYPES.BYTE;
        }
        this.alignment = offset;
    }
    
    this.seek32BitBoundary = function() {
        if ((this.offset + this.alignment) % DATA_TYPES.DWORD === 0) {
            return;
        } else {
            while ((this.offset + this.alignment) % DATA_TYPES.DWORD !== 0) {
                this.readByte();
            }
        }
    }

    this.findNext = function(data, offset=this.offset) {
        const start = this.buffer.indexOf(data, offset, 'hex');
        const end = (start + (data.length/2));
        return Location(start, end);
    }
    
    this.findNextWord = function(data, offset=this.offset) {
        const word = Buffer.from(data, 'hex');
        let current = this.peekWord(false, offset);
        function compareWords(word1, word2) {
            return word1[0] === word2[0] && word1[1] === word2[1];
        }
        while(!compareWords(word, current)) {
            offset += DATA_TYPES.WORD;
            current = this.peekWord(false, offset);
        }
        return Location(offset, offset + word.length/2);
    }

    this.hasNext = function(data, offset=0) {
        return this.findNext(data, offset).start.dec != -1;
    }

    this.findOccurences = function(data, offset=0) {
        const occurences = [];
        while (this.hasNext(data, offset)) {
            const location = this.findNext(data, offset);
            occurences.push(location);
            offset = location.end.dec;
        }
        return occurences;
    }

    this.rewindBytes = function(byte_count) {
        this.offset -= byte_count * DATA_TYPES.BYTE;
    }

    this.rewindWords = function(word_count) {
        this.offset -= word_count * DATA_TYPES.WORD;
    }

    this.goto = function(offset) {
        this.offset = offset;
    }
}

function Location(start, end) {
    return {
        start: {
            dec: start,
            hex: start.toString(16)
        },
        end: {
            dec: end,
            hex: end.toString(16)
        }
    };
}

module.exports = BufferReader;