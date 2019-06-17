import { Module } from '@nestjs/common';

import { PermissionModule } from '@leaa/api/modules/permission/permission.module';
import { RoleModule } from '@leaa/api/modules/role/role.module';
import { UserModule } from '@leaa/api/modules/user/user.module';

import { SeedService } from './seed.service';

@Module({
  imports: [PermissionModule, RoleModule, UserModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
