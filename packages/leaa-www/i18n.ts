import NextI18Next from 'next-i18next';

const NextI18NextInstance = new NextI18Next({
  defaultNS: 'common',
  defaultLanguage: 'zh-CN',
  fallbackLng: 'zh-CN',
  otherLanguages: ['en-US'],
  whitelist: ['en-US', 'zh-CN', 'zh', 'en'],
  localeSubpaths: 'foreign',
  // load: 'currentOnly',
  keySeparator: '###',
  serverLanguageDetection: true,
  browserLanguageDetection: true,
});

export default NextI18NextInstance;

export const {
  appWithTranslation,
  withTranslation,
  i18n,
  Link,
  config,
  Router,
  Trans,
  useTranslation,
} = NextI18NextInstance;
