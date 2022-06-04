import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en_US from '../lang/en_US.json';
import ru_RU from '../lang/ru_RU.json';
import pt_PT from '../lang/pt_PT.json';
import es_ES from '../lang/es_ES.json';
import Formatter from './formatter'
import {DEFAULT_LANGUAGE, FALLBACK_LANGUAGE} from '../consts';

const formatter = new Formatter({ locale: process.env.VUE_APP_LANG });

let messages = {en_US}

switch (process.env.VUE_APP_LANG){
    case "ru_RU":
        messages = {ru_RU}
        break;
    case "pt_PT":
        messages = {pt_PT}
        break;
    case "es_ES":
        messages = {es_ES}
        break;
}

Vue.use(VueI18n);

export const i18n = new VueI18n({
    locale: process.env.VUE_APP_LANG,
    formatter,
    fallbackLocale: process.env.VUE_APP_LANG,
    messages: messages
});
