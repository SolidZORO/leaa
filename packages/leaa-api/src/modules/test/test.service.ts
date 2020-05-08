import { Injectable } from '@nestjs/common';

import { IGqlCtx } from '@leaa/api/src/interfaces';
import { errorMessage, successMessage } from '@leaa/api/src/utils';

const CLS_NAME = 'TestService';

@Injectable()
export class TestService {
  testI18n(x?: number, gqlCtx?: IGqlCtx): string {
    console.log('CLS_NAME', CLS_NAME, 'X(NUMBER)', x, 'LANG', gqlCtx?.lang, 'GQLCTX', gqlCtx);

    if (typeof x !== 'undefined' && x > 0) {
      throw errorMessage({ t: ['_error:test'], gqlCtx });
    }

    return successMessage({ t: ['_error:test'], gqlCtx });
  }
}
