import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestService } from '@leaa/api/src/modules/v1/test/test.service';
import { TestController } from '@leaa/api/src/modules/v1/test/test.controller';
import { Zan, Role, Permission } from '@leaa/common/src/entrys';
import { RoleService } from '@leaa/api/src/modules/v1/role/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Zan, Role, Permission])],
  controllers: [TestController],
  providers: [TestService, RoleService],
  exports: [TestService],
})
export class TestModule {}
