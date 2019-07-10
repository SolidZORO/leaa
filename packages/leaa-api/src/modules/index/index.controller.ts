import { Controller, Get } from '@nestjs/common';

@Controller('')
export class IndexController {
  constructor() {}

  @Get('')
  async test() {
    return '<code>-- 0x3F3F3F3F --</code>';
  }
}
