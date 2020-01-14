import { Injectable } from '@nestjs/common';
import { ITagsArgs } from '@leaa/api/src/interfaces';

const CLS_NAME = 'TestService';

@Injectable()
export class TestService {
  async i18n(args?: ITagsArgs): Promise<string> {
    console.log(args);

    return `${CLS_NAME} - i18n`;
  }
}
