import { Module } from '@nestjs/common';

import { PermissionModule } from '@leaa/api/src/modules/v1/permission/permission.module';
import { RoleModule } from '@leaa/api/src/modules/v1/role/role.module';
import { UserModule } from '@leaa/api/src/modules/v1/user/user.module';

import { PlaygroundService } from '@leaa/api/src/modules/v1/playground/playground.service';
import { PlaygroundController } from '@leaa/api/src/modules/v1/playground/playground.controller';

@Module({
  imports: [PermissionModule, RoleModule, UserModule],
  providers: [PlaygroundService],
  controllers: [PlaygroundController],
  exports: [PlaygroundService],
})
export class PlaygroundModule {}
