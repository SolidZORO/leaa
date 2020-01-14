import { Injectable } from '@nestjs/common';
import i18next from 'i18next';

import { IRequest } from '@leaa/api/src/interfaces';

const CLS_NAME = 'TestService';

@Injectable()
export class TestService {
  async i18n(req: IRequest): Promise<string> {
    return i18next.t('_lang:hello');
  }
}
