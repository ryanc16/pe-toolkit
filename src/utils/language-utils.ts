import { LanguagePack } from "../structures/languages";

export namespace LanguageUtils {
    export function languageIdLookup(languageId: string | number): LanguagePack | undefined {
        return LanguagePack.valueOf(languageId);
    }
}
