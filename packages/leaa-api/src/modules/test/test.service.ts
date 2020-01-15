import { Injectable } from '@nestjs/common';

import { IGqlCtx } from '@leaa/api/src/interfaces';
import { msgUtil } from '@leaa/api/src/utils';

const CLS_NAME = 'TestService';

@Injectable()
export class TestService {
  async i18n(gqlCtx: IGqlCtx): Promise<string> {
    console.log(CLS_NAME);

    return msgUtil.error({ t: ['_error:test'], gqlCtx });
  }
}
