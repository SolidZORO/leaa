import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission, Role } from '@leaa/common/src/entrys';

import { RoleService } from '@leaa/api/src/modules/role/role.service';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';
import { PermissionResolver } from '@leaa/api/src/modules/permission/permission.resolver';
import { PermissionService } from '@leaa/api/src/modules/permission/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), RoleModule],
  providers: [PermissionResolver, PermissionService, RoleService],
  exports: [PermissionService],
})
export class PermissionModule {}
