import { Controller, Get } from '@nestjs/common';

@Controller('')
export class IndexController {
  @Get('')
  async test() {
    return '<code>hi, leaa-api.</code>';
  }
}
