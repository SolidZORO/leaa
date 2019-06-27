import { Controller, Get, UseInterceptors } from '@nestjs/common';

import { PlaygroundService } from './playground.service';

@Controller('/playground')
export class PlaygroundController {
  constructor(private readonly playgroundService: PlaygroundService) {}

  @Get('')
  async test() {
    return this.playgroundService.test();
  }
}
