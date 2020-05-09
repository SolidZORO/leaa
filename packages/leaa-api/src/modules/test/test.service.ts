import { Injectable } from '@nestjs/common';

import { IGqlCtx } from '@leaa/api/src/interfaces';
import { errorMsg, msg } from '@leaa/api/src/utils';

const CLS_NAME = 'TestService';

@Injectable()
export class TestService {
  testI18n(gqlCtx: IGqlCtx, x?: number): string {
    const { t } = gqlCtx;
    // console.log('CLS_NAME', CLS_NAME, 'X(NUMBER)', x, 'LANG', gqlCtx?.lang, 'GQLCTX', gqlCtx);
    // console.log('CLS_NAME', CLS_NAME, 'X(NUMBER)', x, 'LANG', gqlCtx?.lang, t());
    // console.log(t('_error:test'));

    // console.log(ctx.t);

    if (typeof x !== 'undefined' && x > 0) {
      throw errorMsg(t('_error:test'), { gqlCtx });
    }

    // return msg({ t: ['_error:test'], gqlCtx });
    return msg(t('_error:test'));
  }
}
