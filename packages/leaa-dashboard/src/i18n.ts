import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enUs from './locales/en-US';
import zhCn from './locales/zh-CN';

i18n
  // @ts-ignore
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    whitelist: ['en-US', 'zh-CN', 'zh', 'en'],
    resources: {
      'en-US': enUs,
      'zh-CN': zhCn,
      'zh-HK': zhCn,
      'zh-TW': zhCn,
      zh: zhCn,
      us: enUs,
    },
    fallbackLng: 'zh-CN',
    saveMissing: true,
    // debug: true,
    debug: false,
  });

export default i18n;
