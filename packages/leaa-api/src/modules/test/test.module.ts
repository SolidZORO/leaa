import { Module } from '@nestjs/common';

import { TestResolver } from '@leaa/api/src/modules/test/test.resolver';
import { TestService } from '@leaa/api/src/modules/test/test.service';

@Module({
  imports: [],
  providers: [TestResolver, TestService],
  exports: [TestService],
})
export class TestModule {}
