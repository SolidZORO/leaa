import { Injectable } from '@nestjs/common';

import { IGqlCtx } from '@leaa/api/src/interfaces';
import { msgUtil } from '@leaa/api/src/utils';
import { Zan } from '@leaa/common/src/entrys';

const CLS_NAME = 'TestService';

@Injectable()
export class TestService {
  testI18n(x?: number, gqlCtx?: IGqlCtx): string {
    console.log(CLS_NAME, x, gqlCtx?.lang);

    console.log(Zan);

    if (typeof x !== 'undefined' && x > 0) {
      throw msgUtil.error({ t: ['_error:test'], gqlCtx });
    }

    return msgUtil.message({ t: ['_error:test'], gqlCtx });
  }
}
