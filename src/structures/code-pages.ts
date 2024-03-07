/**
 * Enumerated code page identifiers
 * 
 * https://learn.microsoft.com/en-us/windows/win32/intl/code-page-identifiers
 */
export enum CodePageId {
    /** 0x0FDE8 / 65000 */
    utf7 = 0xFDE8,
    /** 0x0FDE9 / 65001 */
    utf8 = 0xFDE9,
    /** 0x04B0 / 1200 */
    utf16 = 0x04B0,
    /** 0x04B1 / 1201 */
    utf16be = 0x04B1,
    /** 0x2EE0 / 12000 */
    utf32 = 0x2EE0,
    /** 0x2EE1 / 12001 */
    utf32be = 0x2EE1,
    /** 0xf#9F / 20127 */
    usascii = 0x4E9F
}

export class CodePage {
    private static readonly VALUES: CodePage[] = [];

    /** Unicode (UTF-7) */
    public static readonly utf7 = new CodePage(CodePageId.utf7, 'utf-7', 'Unicode (UTF-7)');
    /** Unicode (UTF-8) */
    public static readonly utf8 = new CodePage(CodePageId.utf8, 'utf-8', 'Unicode (UTF-8)');
    /** Unicode UTF-16, little endian byte order (BMP of ISO 10646) */
    public static readonly utf16 = new CodePage(CodePageId.utf16, 'utf-16', 'Unicode UTF-16, little endian byte order (BMP of ISO 10646); available only to managed applications');
    /** Unicode UTF-16, big endian byte order */
    public static readonly utf16be = new CodePage(CodePageId.utf16be, 'utf-16be', 'Unicode UTF-16, big endian byte order; available only to managed applications');
    /** Unicode UTF-32, little endian byte order */
    public static readonly utf32 = new CodePage(CodePageId.utf32, 'utf-32', 'Unicode UTF-32, little endian byte order; available only to managed applications');
    /** Unicode UTF-32, big endian byte order */
    public static readonly utf32be = new CodePage(CodePageId.utf32be, 'utf-32be', 'Unicode UTF-32, big endian byte order; available only to managed applications');
    /** US-ASCII (7-bit) */
    public static readonly usascii = new CodePage(CodePageId.usascii, 'us-ascii', 'US-ASCII (7-bit)');

    /** Identifier */
    public readonly id: CodePageId;
    public readonly name: string;
    public readonly description: string;
    private constructor(id: CodePageId, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public static values(): CodePage[] {
        return CodePage.VALUES;
    }

    public static valueOf(value: string | number): CodePage | null {
        const names = Object.keys(this);
        for (let i = 0; i < names.length; i++) {
            if ((this as any)[names[i]] instanceof CodePage && (value.toString().toLowerCase() === names[i].toLowerCase() || value.toString() === (this as any)[names[i]].id.toString())) {
                return (this as any)[names[i]];
            }
        }

        return null;
    }
}
