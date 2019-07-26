// import NextI18next from 'next-i18next';
// // import { Trans as OriginalTrans, WithNamespaces as OriginalWithNamespaces } from 'react-i18next';
// import i18n from 'i18next';
//
// export type TFunction = i18n.TFunction;
// // export type I18n = i18n.i18n;
// // export type WithNamespaces = OriginalWithNamespaces;
//
// export const nextI18next = new NextI18next({
//   defaultLanguage: 'zh-CN',
//   otherLanguages: ['en-US', 'zh-CN'],
//   browserLanguageDetection: true,
//   whitelist: ['en-US', 'zh-CN', 'zh', 'en'],
//   localeSubpaths: 'foreign',
// });
//
// export const { appWithTranslation, Link, withTranslation } = nextI18next;
// export { i18n };
// export const Trans = nextI18next.Trans as typeof OriginalTrans;
// export const withNamespaces = nextI18next.withNamespaces; // as typeof originalWithNamespaces;

// import NextI18Next from 'next-i18next';
//
// const NextI18NextInstance = new NextI18Next({
//   defaultLanguage: 'zh-CN',
//   otherLanguages: ['en-US', 'zh-CN'],
//   browserLanguageDetection: true,
//   whitelist: ['en-US', 'zh-CN', 'zh', 'en'],
//   localeSubpaths: 'foreign',
// });
//
// export default NextI18NextInstance;
//
// export const { i18n, appWithTranslation, withTranslation, Link } = NextI18NextInstance;

import NextI18Next from 'next-i18next';

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'zh-CN',
  fallbackLng: 'zh-CN',
  otherLanguages: ['en-US', 'zh-CN'],
  whitelist: ['en-US', 'zh-CN', 'zh', 'en'],
  browserLanguageDetection: true,
  localeSubpaths: 'foreign',
});

export default NextI18NextInstance;

/* Optionally, export class methods as named exports */
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
