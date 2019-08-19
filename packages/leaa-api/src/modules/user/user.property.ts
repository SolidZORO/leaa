import { Injectable } from '@nestjs/common';

import { User } from '@leaa/common/src/entrys';
import { RoleService } from '@leaa/api/src/modules/role/role.service';

// const CONSTRUCTOR_NAME = 'UserProperty';

@Injectable()
export class UserProperty {
  constructor(private readonly roleService: RoleService) {}

  async resolvePropertyFlatPermissions(user: User | undefined): Promise<string[] | undefined> {
    const nextUser = user;

    if (!nextUser || !nextUser.roles) {
      return undefined;
    }

    const roleIds = nextUser.roles.map(r => r.id);
    nextUser.permissions = await this.roleService.rolePermissionsByRoleIds(roleIds);

    if (!nextUser.permissions || (nextUser.permissions.length && nextUser.permissions.length === 0)) {
      return undefined;
    }

    return [...new Set(nextUser.permissions.map(p => p.slug))];
  }
}
