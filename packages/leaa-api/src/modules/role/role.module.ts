import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role, Permission } from '@leaa/common/entrys';
import { PermissionService } from '@leaa/api/modules/permission/permission.service';
import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [RoleResolver, RoleService, PermissionService],
  exports: [RoleService],
})
export class RoleModule {}
