import { Controller, Get, UseInterceptors } from '@nestjs/common';

import { TestService } from './test.service';

@Controller('/t')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('')
  async test() {
    return this.testService.test();
  }
}
