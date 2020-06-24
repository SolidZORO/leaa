import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { enUs, zhCn } from '@leaa/dashboard/src/locales';

i18n
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
    fallbackLng: 'en-US',
    saveMissing: true,
    debug: false,
    // debug: true,
  });

export default i18n;
