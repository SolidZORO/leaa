import { Controller, Get } from '@nestjs/common';

import { PlaygroundService } from '@leaa/api/src/modules/playground/playground.service';

@Controller('/playground')
export class PlaygroundController {
  constructor(private readonly playgroundService: PlaygroundService) {}

  @Get('')
  async test() {
    return this.playgroundService.test();
  }
}
