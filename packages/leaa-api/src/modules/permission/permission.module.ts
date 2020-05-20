import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission, Role } from '@leaa/common/src/entrys';

import { RoleService } from '@leaa/api/src/modules/role/role.service';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';

import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), RoleModule],
  providers: [PermissionService, RoleService],
  exports: [PermissionService],
  controllers: [PermissionController],
})
export class PermissionModule {}
