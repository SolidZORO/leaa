import { Module } from '@nestjs/common';

import { PermissionModule } from '@leaa/api/src/modules/permission/permission.module';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';
import { UserModule } from '@leaa/api/src/modules/user/user.module';

import { PlaygroundService } from '@leaa/api/src/modules/playground/playground.service';
import { PlaygroundController } from '@leaa/api/src/modules/playground/playground.controller';

@Module({
  imports: [PermissionModule, RoleModule, UserModule],
  providers: [PlaygroundService],
  controllers: [PlaygroundController],
  exports: [PlaygroundService],
})
export class PlaygroundModule {}
