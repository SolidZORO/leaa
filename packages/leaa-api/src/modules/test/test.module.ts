import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestService } from '@leaa/api/src/modules/test/test.service';
import { TestController } from '@leaa/api/src/modules/test/test.controller';
import { Zan } from '@leaa/common/src/entrys';

@Module({
  imports: [TypeOrmModule.forFeature([Zan])],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
