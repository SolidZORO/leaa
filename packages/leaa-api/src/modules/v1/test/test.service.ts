import { Injectable } from '@nestjs/common';

import { IRequest } from '@leaa/api/src/interfaces';
import { msgT } from '@leaa/api/src/utils';
import { I18nextMiddleware } from '@leaa/api/src/middlewares';
import { InjectRepository } from '@nestjs/typeorm';
import { Zan } from '@leaa/common/src/entrys';
import { Repository } from 'typeorm';

const CLS_NAME = 'TestService';

@Injectable()
export class TestService {
  // async testI18n(id: string, args?: { sort: string; t: any }): Promise<string> {
  //   const { t } = args;
  //
  //   console.log(id, args);
  //
  //   return msgT('_error:notFoundItem', { language: args.language });
  // }
}
