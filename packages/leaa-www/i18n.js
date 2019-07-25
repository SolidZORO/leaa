// const { LOCALE_SUBPATHS } = require('next/config').default().publicRuntimeConfig;
const NextI18Next = require('next-i18next').default;

module.exports = new NextI18Next({
  defaultLanguage: 'en-US',
  otherLanguages: ['en-US', 'zh-CN'],
  browserLanguageDetection: true,
  whitelist: ['en-US', 'zh-CN', 'zh', 'en'],
  localeSubpaths: 'foreign',
  // localeSubpaths: LOCALE_SUBPATHS,
  // debug: true,
});
