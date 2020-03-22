import { Injectable } from '@nestjs/common';

import { IGqlCtx } from '@leaa/api/src/interfaces';
import { msgUtil } from '@leaa/api/src/utils';

const CLS_NAME = 'TestService';

@Injectable()
export class TestService {
  testI18n(x?: number, gqlCtx?: IGqlCtx): string {
    console.log('CLS_NAME', CLS_NAME, 'X(NUMBER)', x, 'LANG', gqlCtx?.lang, 'GQLCTX', gqlCtx);

    if (typeof x !== 'undefined' && x > 0) {
      throw msgUtil.error({ t: ['_error:test'], gqlCtx });
    }

    return msgUtil.message({ t: ['_error:test'], gqlCtx });
  }
}
