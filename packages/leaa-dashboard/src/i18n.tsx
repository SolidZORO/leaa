import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enUs from './locales/en-US';
import zhCn from './locales/zh-CN';

// import locales from './locales';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    whitelist: ['en', 'zh', 'en-US', 'zh-CN'],
    resources: {
      en: enUs,
      zh: zhCn,
      'en-US': enUs,
      'zh-CN': zhCn,
    },
    fallbackLng: 'zh-CN',
    saveMissing: true,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
