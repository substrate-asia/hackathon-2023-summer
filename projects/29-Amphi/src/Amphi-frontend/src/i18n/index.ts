import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import Storage from '@/utils/storage';
import { i18nLocal } from '@/constants/storageKeys';

import enUSLocale from './locales/en-US';
import zhCNLocale from './locales/zh-CN';

const resources = {
    en: enUSLocale,
    zh: zhCNLocale
};

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources,
        ns: [...Object.keys(enUSLocale)],
        defaultNS: 'moduleA',
        fallbackLng: Storage.getStorage(i18nLocal) || 'en-US',
        debug: true,

        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
    });

export default i18n;
