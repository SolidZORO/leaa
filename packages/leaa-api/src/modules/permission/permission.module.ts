import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission, Role } from '@leaa/common/entrys';

import { RoleService } from '@leaa/api/modules/role/role.service';
import { RoleModule } from '@leaa/api/modules/role/role.module';
import { PermissionResolver } from './permission.resolver';
import { PermissionService } from './permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), RoleModule],
  providers: [PermissionResolver, PermissionService, RoleService],
  exports: [PermissionService],
})
export class PermissionModule {}
