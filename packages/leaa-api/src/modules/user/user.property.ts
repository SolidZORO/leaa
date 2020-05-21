import { Injectable } from '@nestjs/common';

import { User, Permission } from '@leaa/common/src/entrys';
import { RoleService } from '@leaa/api/src/modules/role/role.service';

// const CLS_NAME = 'UserProperty';

@Injectable()
export class UserProperty {
  constructor(private readonly roleService: RoleService) {}

  async permissions(user: User | undefined): Promise<Permission[] | undefined> {
    if (!user || !user.roles) return undefined;

    const roleIds = user.roles.map((r) => r.id);
    const permissions = await this.roleService.getManyPermissionsByRoleIds(roleIds);
    if (!permissions) return undefined;

    return permissions;
  }

  async flatPermissions(user: User | undefined): Promise<string[] | undefined> {
    const permissions = await this.permissions(user);

    if (!permissions) return undefined;

    return [...new Set(permissions.map((permission) => permission.slug))];
  }
}
