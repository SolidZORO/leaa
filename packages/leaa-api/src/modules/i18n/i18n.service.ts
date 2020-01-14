import { Injectable, OnModuleInit } from '@nestjs/common';
import { Handler, Request } from 'express';
// import { GraphQLError } from 'graphql';
import i18next, { TFunction } from 'i18next';
import i18nextMiddleware from 'i18next-express-middleware';
import Backend from 'i18next-node-fs-backend';

// @ts-ignore
import ICU from 'i18next-icu';

import enUs from '@leaa/api/src/locales/en-US';
import zhCn from '@leaa/api/src/locales/zh-CN';

export interface I18nRequest extends Request {
  t: TFunction;
}

@Injectable()
export class I18nService implements OnModuleInit {
  onModuleInit() {
    return i18next
      .use(i18nextMiddleware.LanguageDetector)
      .use(Backend)
      .use(ICU)
      .init({
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

  handle(): Handler {
    return i18nextMiddleware.handle(i18next);
  }

  // /**
  //  * Translates the originalError if it is an instance of I18nError.
  //  */
  // translateError(req: I18nRequest, error: GraphQLError) {
  //   const originalError = error.originalError;
  //   const t: i18next.TFunction = req.t;
  //
  //   if (t && originalError instanceof I18nError) {
  //     let translation = originalError.message;
  //     try {
  //       translation = t(originalError.message, originalError.variables);
  //     } catch (e) {
  //       translation += ` (Translation format error: ${e.message})`;
  //     }
  //     error.message = translation;
  //     // We can now safely remove the variables object so that they do not appear in
  //     // the error returned by the GraphQL API
  //     delete originalError.variables;
  //   }
  //
  //   return error;
  // }
}
