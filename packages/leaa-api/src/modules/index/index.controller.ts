import { Controller, Get } from '@nestjs/common';

@Controller('')
export class IndexController {
  constructor() {}

  @Get('')
  async test() {
    return '<code>hi, leaa-api.</code>';
  }
}
