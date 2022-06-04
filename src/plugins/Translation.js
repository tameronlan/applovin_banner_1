import {SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE} from '@/consts';
import {i18n} from './i18n';
import Formatter from './formatter'

const Trans = {
    get defaultLanguage() {
        return DEFAULT_LANGUAGE;
    },
    get supportedLanguages() {
        return SUPPORTED_LANGUAGES;
    },
    get currentLanguage() {
        return i18n.locale;
    },
    isLangSupported(lang) {
        return Trans.supportedLanguages.includes(lang);
    },
    changeLanguage (lang) {
        if (!Trans.isLangSupported(lang)) return Promise.reject(new Error('Language not supported'));

        if (i18n.locale === lang) return Promise.resolve(lang);

        return Trans.loadLanguageFile(lang).then(msgs => {
            i18n.setLocaleMessage(lang, msgs.default || msgs);
            i18n.locale = lang;
            i18n.formatter = new Formatter({locale: lang});

            return lang;
        });
    },
    loadLanguageFile(lang) {
        return import(/* webpackChunkName: "lang/[request]" */ `@/lang/${lang}.json`)
    }
};

export {Trans}
