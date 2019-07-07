import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import locales from './locales';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: locales,
    fallbackLng: 'en',
    saveMissing: true,
  });

export default i18n;
