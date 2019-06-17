import { Injectable, Inject } from '@nestjs/common';

import { PermissionService } from '@leaa/api/modules/permission/permission.service';
import { RoleService } from '@leaa/api/modules/role/role.service';
import { UserService } from '@leaa/api/modules/user/user.service';

import { permissionsSeed, rolesSeed, usersSeed } from './seed.data';

@Injectable()
export class SeedService {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  public async insertPermissions() {
    await Promise.all(
      permissionsSeed.map(async p => {
        const item = await this.permissionService.craetePermission(p);

        console.log(item);
      }),
    );
  }

  public async insertRoles() {
    await Promise.all(
      rolesSeed.map(async r => {
        const item = await this.roleService.craeteRole(r);

        console.log(item);
      }),
    );
  }

  public async insertUsers() {
    await Promise.all(
      usersSeed.map(async u => {
        const item = await this.userService.craeteUser(u);

        console.log(item);
      }),
    );
  }
}
