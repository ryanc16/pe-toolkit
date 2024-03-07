const { LanguagePack, LanguageId } = require('../../lib/structures/languages');

describe('Languages', () => {

    it('can identify valueOf', () => {
        const lang1 = LanguagePack.valueOf('en_US');
        expect(lang1.id).toEqual(LanguageId.en_US);
        const lang2 = LanguagePack.valueOf(LanguageId.en_US);
        expect(lang2).toBe(LanguagePack.en_US);
    });

});
