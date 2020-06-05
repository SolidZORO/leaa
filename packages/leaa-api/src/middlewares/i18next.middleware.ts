// import { Injectable, NestMiddleware } from '@nestjs/common';
import i18next from 'i18next';
// @ts-ignore
import i18nextHttpMiddleware from 'i18next-http-middleware/cjs';

import { enUs, zhCn } from '@leaa/api/src/locales';

i18next.use(i18nextHttpMiddleware.LanguageDetector).init({
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

export const I18nextMiddleware = i18nextHttpMiddleware.handle(i18next);
