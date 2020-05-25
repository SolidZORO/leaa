import { Controller, Get } from '@nestjs/common';

import { PlaygroundService } from '@leaa/api/src/modules/v1/playground/playground.service';

@Controller('/v1/playground')
export class PlaygroundController {
  constructor(private readonly playgroundService: PlaygroundService) {}

  @Get('')
  async test() {
    return this.playgroundService.test();
  }
}
