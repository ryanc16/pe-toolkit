/**
 * Enumerated language identifiers
 * 
 * https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/available-language-packs-for-windows
 */
export enum LanguageId {
    /** 0x0401 / 1025 */
    ar_SA = 0x0401,
    /** 0x042D / 1069 */
    eu_ES = 0x042D,
    /** 0x0402 / 1026 */
    bg_BG = 0x0402,
    /** 0x0403 / 1027 */
    ca_ES = 0x0403,
    /** 0x0C04 / 3076  
     * Note: No longer used. See zh-TW. */
    zh_HK = 0x0C04,
    /** 0x0804 / 2052 */
    zh_CN = 0x0804,
    /** 0x0404 / 1028 */
    zh_TW = 0x0404,
    /** 0x041A / 1050 */
    hr_HR = 0x041A,
    /** 0x0405 / 1029 */
    cs_CZ = 0x0405,
    /** 0x0406 / 1030 */
    da_DK = 0x0406,
    /** 0x0413 / 1043 */
    nl_NL = 0x0413,
    /** 0x0409 / 1033 */
    en_US = 0x0409,
    /** 0x0809 / 2057 */
    en_GB = 0x0809,
    /** 0x0425 / 1061 */
    et_EE = 0x0425,
    /** 0x040B / 1035 */
    fi_FI = 0x040B,
    /** 0x0C0C / 3084 */
    fr_CA = 0x0C0C,
    /** 0x040C / 1036 */
    fr_FR = 0x040C,
    /** 0x0456 / 1110 */
    gl_ES = 0x0456,
    /** 0x0407 / 1031 */
    de_DE = 0x0407,
    /** 0x0408 / 1032 */
    el_GR = 0x0408,
    /** 0x040D / 1037 */
    he_IL = 0x040D,
    /** 0x040E / 1038 */
    hu_HU = 0x040E,
    /** 0x0421 / 1057 */
    id_ID = 0x0421,
    /** 0x0410 / 1040 */
    it_IT = 0x0410,
    /** 0x0411 / 1041 */
    ja_JP = 0x0411,
    /** 0x0412 / 1042 */
    ko_KR = 0x0412,
    /** 0x0426 / 1062 */
    lv_LV = 0x0426,
    /** 0x0427 / 1063 */
    lt_LT = 0x0427,
    /** 0x0414 / 1044 */
    nb_NO = 0x0414,
    /** 0x0415 / 1045 */
    pl_PL = 0x0415,
    /** 0x0416 / 1046 */
    pt_BR = 0x0416,
    /** 0x0816 / 2070 */
    pt_PT = 0x0816,
    /** 0x0418 / 1048 */
    ro_RO = 0x0418,
    /** 0x0419 / 1049 */
    ru_RU = 0x0419,
    /** 0x081A / 2074  
     * Note: No longer used. See sr-Latn-RS. */
    sr_Latn_CS = 0x081A,
    /** 0x241A / 9242 */
    sr_Latn_RS = 0x241A,
    /** 0x041B / 1051 */
    sk_SK = 0x041B,
    /** 0x0424 / 1060 */
    sl_SI = 0x0424,
    /** 0x080A / 2058 */
    es_MX = 0x080A,
    /** 0x040A / 1034 */
    es_ES = 0x040A,
    /** 0x041D / 1053 */
    sv_SE = 0x041D,
    /** 0x041E / 1054 */
    th_TH = 0x041E,
    /** 0x041F / 1055 */
    tr_TR = 0x041F,
    /** 0x0422 / 1058 */
    uk_UA = 0x0422,
    /** 0x042A / 1066 */
    vi_VN = 0x042A,
}

/**
 * Language Identifier information
 */
export class LanguagePack {
    private static readonly VALUES: LanguagePack[] = [];

    /** Arabic (Saudi Arabia) */
    public static readonly ar_SA = new LanguagePack(LanguageId.ar_SA, 'Arabic (Saudi Arabia)', 'ar-SA', false);
    /** Basque (Basque) */
    public static readonly eu_ES = new LanguagePack(LanguageId.eu_ES, 'Basque (Basque)', 'eu-ES', false);
    /** Bulgarian (Bulgaria) */
    public static readonly bg_BG = new LanguagePack(LanguageId.bg_BG, 'Bulgarian (Bulgaria)', 'bg-BG', false);
    /** Catalan */
    public static readonly ca_ES = new LanguagePack(LanguageId.ca_ES, 'Catalan', 'ca-ES', false);
    /** Chinese (Traditional, Hong Kong SAR)  
     * Note: No longer used. See zh-TW. */
    public static readonly zh_HK = new LanguagePack(LanguageId.zh_HK, 'Chinese (Traditional, Hong Kong SAR)', 'zh-HK', false);
    /** Chinese (Simplified, China) */
    public static readonly zh_CN = new LanguagePack(LanguageId.zh_CN, 'Chinese (Simplified, China)', 'zh-CN', true);
    /** Chinese (Traditional, Taiwan) */
    public static readonly zh_TW = new LanguagePack(LanguageId.zh_TW, 'Chinese (Traditional, Taiwan)', 'zh-TW', true);
    /** Croatian (Croatia) */
    public static readonly hr_HR = new LanguagePack(LanguageId.hr_HR, 'Croatian (Croatia)', 'hr-HR', false);
    /** Czech (Czech Republic) */
    public static readonly cs_CZ = new LanguagePack(LanguageId.cs_CZ, 'Czech (Czech Republic)', 'cs-CZ', true);
    /** Danish (Denmark) */
    public static readonly da_DK = new LanguagePack(LanguageId.da_DK, 'Danish (Denmark)', 'da-DK', false);
    /** Dutch (Netherlands) */
    public static readonly nl_NL = new LanguagePack(LanguageId.nl_NL, 'Dutch (Netherlands)', 'nl-NL', true);
    /** English (United States) */
    public static readonly en_US = new LanguagePack(LanguageId.en_US, 'English (United States)', 'en-US', true);
    /** English (United Kingdom) */
    public static readonly en_GB = new LanguagePack(LanguageId.en_GB, 'English (United Kingdom)', 'en-GB', false);
    /** Estonian (Estonia) */
    public static readonly et_EE = new LanguagePack(LanguageId.et_EE, 'Estonian (Estonia)', 'et-EE', false);
    /** Finnish (Finland) */
    public static readonly fi_FI = new LanguagePack(LanguageId.fi_FI, 'Finnish (Finland)', 'fi-FI', false);
    /** French (Canada) */
    public static readonly fr_CA = new LanguagePack(LanguageId.fr_CA, 'French (Canada)', 'fr-CA', false);
    /** French (France) */
    public static readonly fr_FR = new LanguagePack(LanguageId.fr_FR, 'French (France)', 'fr-FR', true);
    /** Galician */
    public static readonly gl_ES = new LanguagePack(LanguageId.gl_ES, 'Galician', 'gl-ES', false);
    /** German (Germany) */
    public static readonly de_DE = new LanguagePack(LanguageId.de_DE, 'German (Germany)', 'de-DE', true);
    /** Greek (Greece) */
    public static readonly el_GR = new LanguagePack(LanguageId.el_GR, 'Greek (Greece)', 'el-GR', false);
    /** Hebrew (Israel) */
    public static readonly he_IL = new LanguagePack(LanguageId.he_IL, 'Hebrew (Israel)', 'he-IL', false);
    /** Hungarian (Hungary) */
    public static readonly hu_HU = new LanguagePack(LanguageId.hu_HU, 'Hungarian (Hungary)', 'hu-HU', true);
    /** Indonesian (Indonesia) */
    public static readonly id_ID = new LanguagePack(LanguageId.id_ID, 'Indonesian (Indonesia)', 'id-ID', false);
    /** Italian (Italy) */
    public static readonly it_IT = new LanguagePack(LanguageId.it_IT, 'Italian (Italy)', 'it-IT', true);
    /** Japanese (Japan) */
    public static readonly ja_JP = new LanguagePack(LanguageId.ja_JP, 'Japanese (Japan)', 'ja-JP', true);
    /** Korean (Korea) */
    public static readonly ko_KR = new LanguagePack(LanguageId.ko_KR, 'Korean (Korea)', 'ko-KR', true);
    /** Latvian (Latvia) */
    public static readonly lv_LV = new LanguagePack(LanguageId.lv_LV, 'Latvian (Latvia)', 'lv-LV', false);
    /** Lithuanian (Lithuania) */
    public static readonly lt_LT = new LanguagePack(LanguageId.lt_LT, 'Lithuanian (Lithuania)', 'lt-LT', false);
    /** Norwegian, Bokmål (Norway) */
    public static readonly nb_NO = new LanguagePack(LanguageId.nb_NO, 'Norwegian, Bokmål (Norway)', 'nb-NO', false);
    /** Polish (Poland) */
    public static readonly pl_PL = new LanguagePack(LanguageId.pl_PL, 'Polish (Poland)', 'pl-PL', true);
    /** Portuguese (Brazil) */
    public static readonly pt_BR = new LanguagePack(LanguageId.pt_BR, 'Portuguese (Brazil)', 'pt-BR', true);
    /** Portuguese (Portugal) */
    public static readonly pt_PT = new LanguagePack(LanguageId.pt_PT, 'Portuguese (Portugal)', 'pt-PT', true);
    /** Romanian (Romania) */
    public static readonly ro_RO = new LanguagePack(LanguageId.ro_RO, 'Romanian (Romania)', 'ro-RO', false);
    /** Russian (Russia) */
    public static readonly ru_RU = new LanguagePack(LanguageId.ru_RU, 'Russian (Russia)', 'ru-RU', true);
    /** Serbian (Latin, Serbia)  
     * Note: No longer used. See sr-Latn-RS. */
    public static readonly sr_Latn_CS = new LanguagePack(LanguageId.sr_Latn_CS, 'Serbian (Latin, Serbia)', 'sr-Latn-CS', false);
    /** Serbian (Latin, Serbia) */
    public static readonly sr_Latn_RS = new LanguagePack(LanguageId.sr_Latn_RS, 'Serbian (Latin, Serbia)', 'sr-Latn-RS', false);
    /** Slovak (Slovakia) */
    public static readonly sk_SK = new LanguagePack(LanguageId.sk_SK, 'Slovak (Slovakia)', 'sk-SK', false);
    /** Slovenian (Slovenia) */
    public static readonly sl_SI = new LanguagePack(LanguageId.sl_SI, 'Slovenian (Slovenia)', 'sl-SI', false);
    /** Spanish (Mexico) */
    public static readonly es_MX = new LanguagePack(LanguageId.es_MX, 'Spanish (Mexico)', 'es-MX', false);
    /** Spanish (Spain) */
    public static readonly es_ES = new LanguagePack(LanguageId.es_ES, 'Spanish (Spain)', 'es-ES', true);
    /** Swedish (Sweden) */
    public static readonly sv_SE = new LanguagePack(LanguageId.sv_SE, 'Swedish (Sweden)', 'sv-SE', true);
    /** Thai (Thailand) */
    public static readonly th_TH = new LanguagePack(LanguageId.th_TH, 'Thai (Thailand)', 'th-TH', false);
    /** Turkish (Turkey) */
    public static readonly tr_TR = new LanguagePack(LanguageId.tr_TR, 'Turkish (Turkey)', 'tr-TR', true);
    /** Ukrainian (Ukraine) */
    public static readonly uk_UA = new LanguagePack(LanguageId.uk_UA, 'Ukrainian (Ukraine)', 'uk-UA', false);
    /** Vietnamese */
    public static readonly vi_VN = new LanguagePack(LanguageId.vi_VN, 'Vietnamese', 'vi-VN', false);

    /**
     * The hexadecimal representation of the language identifier.
     * This setting is used with the keyboard identifier when specifying an input method using DISM.
     * The decimal representation of the language identifier is used in Oobe.xml.
     */
    public readonly id: LanguageId;
    /**
     * The name of the language that will be displayed in the UI.
     * All Windows language packs are available for Windows Server.
     * In Windows Server 2012 and later the user interface (UI) is localized only for
     * the 18 languages indicated.
     */
    public readonly language_region: string;
    /**
     * The language identifier based on the language tagging conventions of RFC 3066.
     * This setting is used with the Deployment Image Servicing and Management (DISM) tool,
     * or in an unattended answer file.
     */
    public readonly tag: string;
    /**
     * In Windows Server 2012 and later the user interface (UI) is localized only
     * for 18 languages.
     */
    public readonly localized: boolean;

    private constructor(id: LanguageId, language_region: string, tag: string, localized: boolean) {
        this.id = id;
        this.language_region = language_region;
        this.tag = tag;
        this.localized = localized;
        LanguagePack.VALUES.push(this);
    }

    public static values(): LanguagePack[] {
        return LanguagePack.VALUES;
    }

    public static valueOf(value: string | LanguageId): LanguagePack | undefined {
        const names = Object.keys(this);
        const normalized = value.toString().toLowerCase().replace('-', '_');
        for (let i = 0; i < names.length; i++) {
            if ((this as any)[names[i]] instanceof LanguagePack && (normalized === names[i].toLowerCase() || value.toString() === (this as any)[names[i]].id.toString())) {
                return (this as any)[names[i]];
            }
        }

        return undefined;
    }
}
