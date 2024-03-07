import { DataSize, DataTypes, WordString } from "./data-types";
import { CodePageId } from "./code-pages";
import { LanguageId } from "./languages";

/**
 * The Var structure defined here: https://docs.microsoft.com/en-us/windows/win32/menurc/var-str
 */
export const Var_structure = {
    wLength: {
        byteSize: DataSize.WORD
    },
    wValueLength: {
        byteSize: DataSize.WORD,
    },
    wType: {
        byteSize: DataSize.WORD,
    },
    szKey: {
        byteSize: DataSize.WCHAR,
        value: 'Translation'
    },
    Padding: {
        byteSize: DataSize.WORD
    },
    Value: {
        byteSize: DataSize.DWORD
    }
};

export interface VAR_FILE_INFO_VAR {
    /** The length, in bytes, of the Var structure. */
    wLength: DataTypes.WORD;
    /** The length, in bytes, of the Value member. */
    wValueLength: DataTypes.WORD;
    /**
     * The type of data in the version resource.
     * This member is 0x0001 if the version resource contains text data and 0x0000 if the version resource contains binary data.
     */
    wType: DataTypes.WORD;
    /** The Unicode string "Translation". */
    szKey: WordString;
    /** Padding - As many zero words as necessary to align the Value member on a 32-bit boundary. */
}

export function VAR_FILE_INFO_VAR(values?: Partial<VAR_FILE_INFO_VAR>): VAR_FILE_INFO_VAR {
    return {
        wLength: 0x0000,
        wValueLength: 0x0000,
        wType: 0x0000,
        szKey: '',
        ...values
    }
}

export interface VarEntry {
    languageId: LanguageId;
    codePageId: CodePageId;
}

export class VarFileInfoVar {

    private struct: VAR_FILE_INFO_VAR;
    /**
     * The Value member contains an array of one or more DWORD values that are language and code page identifier pairs
     * indicating the language and code page combinations supported by this file.
     * The low-order word of each DWORD must contain a Microsoft language identifier, and the high-order word must contain the IBM code page number.
     * Either high-order or low-order word can be zero, indicating that the file is language or code page independent.
     * If the Var structure is omitted, the file will be interpreted as both language and code page independent.
     */
    private vars: VarEntry[];

    constructor(values: VAR_FILE_INFO_VAR) {
        this.struct = VAR_FILE_INFO_VAR(values);
        this.vars = [];
    }

    public getValueLength(): number {
        return this.struct.wValueLength;
    }

    public getType(): number {
        return this.struct.wType;
    }

    public isDataBinary(): boolean {
        return this.struct.wType === 0;
    }

    public isDataUtf16(): boolean {
        return this.struct.wType === 1;
    }

    public getKey(): string {
        return this.struct.szKey;
    }

    public addVar(languageId: LanguageId, codePageId: CodePageId): void {
        this.vars.push({ languageId, codePageId });
    }

    public getVars(): { languageId: LanguageId; codePageId: CodePageId }[] {
        return this.vars;
    }

    public toObject() {
        return { [this.getKey()]: this.vars.map(e => ({ languageId: e.languageId.toString(16).padStart(4, "0"), codePageId: e.codePageId.toString(16).padStart(4, "0") })) };
    }
}
