const NextI18Next = require('next-i18next').default;

module.exports = new NextI18Next({
  defaultLanguage: 'zh-CN',
  otherLanguages: ['en-US', 'zh-CN'],
  browserLanguageDetection: true,
  whitelist: ['en-US', 'zh-CN', 'zh', 'en'],
  localeSubpaths: 'foreign',
  // debug: true,
});
