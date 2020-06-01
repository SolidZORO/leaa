import { Injectable } from '@nestjs/common';

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
