import { Module } from '@nestjs/common';

import { DemoResolver } from '@leaa/api/src/modules/demo/demo.resolver';
import { DemoService } from '@leaa/api/src/modules/demo/demo.service';

@Module({
  imports: [],
  providers: [DemoResolver, DemoService],
  exports: [DemoService],
})
export class DemoModule {}
