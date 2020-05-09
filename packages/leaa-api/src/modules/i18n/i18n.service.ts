import { Injectable, OnModuleInit } from '@nestjs/common';
import i18next from 'i18next';

import { enUs, zhCn } from '@leaa/api/src/locales';

@Injectable()
export class I18nService implements OnModuleInit {
  onModuleInit() {
    return;
    // return i18next.init({
    //   whitelist: ['en-US', 'zh-CN', 'zh', 'en'],
    //   resources: {
    //     'en-US': enUs,
    //     'zh-CN': zhCn,
    //     'zh-HK': zhCn,
    //     'zh-TW': zhCn,
    //     zh: zhCn,
    //     us: enUs,
    //   },
    //   fallbackLng: 'en-US',
    //   saveMissing: true,
    //   debug: false,
    //   // debug: true,
    // });
  }
}
