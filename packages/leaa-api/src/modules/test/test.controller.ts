import { Controller, Get } from '@nestjs/common';
import { stringUtil } from '@leaa/api/src/utils';

@Controller('/test')
export class TestController {
  constructor() {}

  @Get('/hashids')
  async hashids() {
    const hashidsArr = [];

    for (let i = 9988; i < 9999; i += 1) {
      hashidsArr.push(stringUtil.encodeId(i));
    }

    return `<code>${hashidsArr.join(' ')}</code>`;
  }
}
