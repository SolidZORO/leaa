import { Module } from '@nestjs/common';

import { TestResolver } from '@leaa/api/src/modules/test/test.resolver';
import { TestService } from '@leaa/api/src/modules/test/test.service';
import { TestController } from '@leaa/api/src/modules/test/test.controller';

@Module({
  imports: [],
  controllers: [TestController],
  providers: [TestResolver, TestService],
  exports: [TestService],
})
export class TestModule {}
