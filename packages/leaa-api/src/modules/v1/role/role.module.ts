import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role, Permission } from '@leaa/api/src/entrys';
import { PermissionService } from '@leaa/api/src/modules/v1/permission/permission.service';
// import { RoleResolver } from '@leaa/api/src/modules/role/role.resolver';
import { RoleService } from '@leaa/api/src/modules/v1/role/role.service';

import { RoleController } from './role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [RoleService, PermissionService],
  exports: [RoleService, PermissionService],
  controllers: [RoleController],
})
export class RoleModule {}
