import { Injectable, OnModuleInit } from '@nestjs/common';
import i18next from 'i18next';

import enUs from '@leaa/api/src/locales/en-US';
import zhCn from '@leaa/api/src/locales/zh-CN';

@Injectable()
export class I18nService implements OnModuleInit {
  onModuleInit() {
    return i18next.init({
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
      // detection: {
      //   lookupQuerystring: 'lang',
      // },
    });
  }
}
