import { Injectable } from '@nestjs/common';
import { PermissionService } from '@leaa/api/modules/permission/permission.service';
import { RoleService } from '@leaa/api/modules/role/role.service';
import { UserService } from '@leaa/api/modules/user/user.service';

import { permissionsSeed, rolesSeed, usersSeed, roleAddPermissionsSeed, userAddRolesSeed } from './seed.data';

@Injectable()
export class SeedService {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-await-in-loop */

  public async insertPermissions() {
    for (const i of permissionsSeed) {
      const item = await this.permissionService.craetePermission(i);

      console.log(item);
    }
  }

  public async insertRoles() {
    for (const i of rolesSeed) {
      const item = await this.roleService.craeteRole(i);

      console.log(item);
    }
  }

  public async insertUsers() {
    for (const i of usersSeed) {
      const item = await this.userService.craeteUser(i);

      console.log(item);
    }
  }

  public async insertRoleAddPermissions() {
    for (const i of roleAddPermissionsSeed) {
      const role = await this.roleService.roleBySlug(i.roleSlug);

      console.log(role);

      if (role) {
        const nextRole = await this.roleService.updateRole(role.id, { permissionSlugs: i.permissionSlugs });

        console.log(nextRole);
      }
    }
  }

  public async insertUserAddRole() {
    for (const i of userAddRolesSeed) {
      const user = await this.userService.userByEmail(i.userEmail);

      console.log(user);

      if (user) {
        const nextUser = await this.userService.updateUser(user.id, { roleSlugs: i.roleSlugs });

        console.log(nextUser);
      }
    }
  }
}
