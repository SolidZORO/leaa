import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role, Permission } from '@leaa/common/src/entrys';
import { PermissionService } from '@leaa/api/src/modules/permission/permission.service';
import { RoleResolver } from '@leaa/api/src/modules/role/role.resolver';
import { RoleService } from '@leaa/api/src/modules/role/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [RoleResolver, RoleService, PermissionService],
  exports: [RoleService],
})
export class RoleModule {}
