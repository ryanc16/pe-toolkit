const DATA_TYPES = require('./data-types');
const SZ_WCHAR = DATA_TYPES.SZ_WCHAR;

/**
 * The BufferReader provides many utility methods for reading and navigating a data buffer, as well
 * as automatically advance, update, and track the byte offset for operations that advance the offset pointer.
 * 
 * @param {Buffer} buffer The original data buffer of read bytes
 */
function BufferReader(buffer) {
    this.data = new DataView(new Uint8Array(buffer).buffer);
    this.offset = 0;
    this.alignment = 0;

    this.trim = function(start=0, end=this.data.byteLength) {
        this.data = new DataView(new Uint8Array(this.data.buffer.slice(start, end)));
    }

    this.readBytes = function(byte_count) {
        const bytes = new Uint8Array(this.data.buffer.slice(this.offset, this.offset + byte_count));
        this.offset+=bytes.length;
        return bytes;
    }

    this.readByte = function(asInt=false) {
        let byte = 0x00;
        if (asInt === true) {
            byte = this.data.getUint8(this.offset);
        } else {
            byte = new Uint8Array(this.data.buffer.slice(this.offset, this.offset + DATA_TYPES.BYTE))[0];
        }
        this.offset += DATA_TYPES.BYTE;
        return byte;
    }
    
    this.readWord = function(asInt=false) {
        let word = [];
        if (asInt === true) {
            word = this.data.getUint16(this.offset, true);
        } else {
            word = new Uint8Array(this.data.buffer.slice(this.offset, this.offset + DATA_TYPES.WORD));   
        }
        this.offset += DATA_TYPES.WORD;
        return word;
    }

    this.readWords = function(word_count) {
        const words = new Uint8Array(this.data.buffer.slice(this.offset, this.offset + (word_count * DATA_TYPES.WORD)));
        this.offset += words.length;
        return words;
    }
    
    this.readDWord = function(asInt=false) {
        let dword = [];
        if (asInt === true) {
            dword = this.data.getUint32(this.offset, true);
        } else {
            dword = new Uint8Array(this.data.buffer.slice(this.offset, this.offset + DATA_TYPES.DWORD));
        }
        this.offset += DATA_TYPES.DWORD;
        return dword;
    }
    
    this.readQWord = function(asInt=false) {
        let qword = [];
        if (asInt === true) {
            qword = this.data.getBigUint64(this.offset, true);
        } else {
            qword = new Uint8Array(this.data.buffer.slice(this.offset, this.offset + DATA_TYPES.QWORD));
        }
        this.offset += DATA_TYPES.QWORD;
        return qword;
    }
    
    this.readStringZ = function() {
        let word = 0x0000;
        const str = [];
        while((word = this.data.getUint16(this.offset, true)) != 0x0000) {
            str.push(String.fromCharCode(word));
            this.offset += DATA_TYPES.WORD;
        }
        this.offset += DATA_TYPES.WORD;
        return str.join('').replace(/\0/g, '');
    }

    this.readWordsAsString = function(word_count) {
        const words = this.readWords(word_count);
        const str = []
        for (let i=0; i<words.length; i+=DATA_TYPES.WORD) {
            str.push(String.fromCharCode(words.getUint16(i, true)));
        }
        return str.join('').replace(/\0/g, '');
    }

    this.peekByte = function(asInt=false, offset=this.offset) {
        if (asInt === true) {
            return this.data.getUint8(offset);
        } else {
            return new Uint8Array(this.data.buffer.slice(offset, offset + DATA_TYPES.BYTE));
        }
    }

    this.prevByte = function(asInt=false, offset=this.offset) {
        if (asInt === true) {
            return this.data.getUint8(offset - DATA_TYPES.BYTE);
        } else {
            return new Uint8Array(this.data.buffer.slice(offset - DATA_TYPES.BYTE, offset));
        }
    }

    this.peekWord = function(asInt=false, offset=this.offset) {
        if (asInt === true) {
            return this.data.getUint16(offset, true);
        } else {
            return new Uint8Array(this.data.buffer.slice(offset, offset + DATA_TYPES.WORD));
        }
    }

    this.prevWord = function(asInt=false, offset=this.offset) {
        if (asInt === true) {
            return this.data.getUint16(offset - DATA_TYPES.WORD, true);
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
        let start = -1;
        let end = -1;
        if (typeof data === 'string') {
          data = new Uint8Array(data.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
        }
        for (let i=offset; i<this.data.byteLength; i++) {
          if (this.data.getUint8(i) === data[0]) {
            let match = true;
            for (let seek=0; seek<data.length && match===true; seek++) {
              match = match && this.data.getUint8(i + seek) === data[seek];
              if (match === false) {
                break;
              }
            }
            if (match === true) {
              start = i;
              end = (start + (data.length));
              break;
            }
          }
        }
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
        let location = null;
        while ((location = this.findNext(data, offset)).start.dec != -1) {
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

/**
 * Stores a location start and end offsets.
 * 
 * @param {Number} start 
 * @param {Number} end 
 * @returns {object} An Object describing the start and end offsets, in both decimal and hex
 */
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