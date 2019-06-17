import { Module } from '@nestjs/common';

import { PermissionModule } from '@leaa/api/modules/permission/permission.module';
import { RoleModule } from '@leaa/api/modules/role/role.module';
import { UserModule } from '@leaa/api/modules/user/user.module';

import { TestService } from './test.service';
import { TestController } from './test.controller';

@Module({
  imports: [PermissionModule, RoleModule, UserModule],
  providers: [TestService],
  controllers: [TestController],
  exports: [TestService],
})
export class TestModule {}
