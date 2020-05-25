import { Injectable } from '@nestjs/common';
import { PermissionService } from '@leaa/api/src/modules/v1/permission/permission.service';
import { RoleService } from '@leaa/api/src/modules/v1/role/role.service';
import { UserService } from '@leaa/api/src/modules/v1/user/user.service';
import i18next from 'i18next';

@Injectable()
export class PlaygroundService {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  async test() {
    const userEmail = 'admin@admin.com';
    const roleSlugs = ['admin', 'staff'];

    // const user = await this.userService.userByEmail(userEmail);
    //
    // const gqlCtx = { t: i18next.t };
    //
    // if (user) {
    //   await this.userService.updateUser(gqlCtx, user.id, {
    //     roleSlugs,
    //   });
    //
    //   const nextUser = await this.userService.user(gqlCtx, user.id, {});
    //
    //   console.log(nextUser);
    // }
  }

  // async test() {
  //   const roleSlug = 'admin';
  //   const permissionSlugs = ['user.update', 'user.delete'];
  //
  //   const role = await this.roleService.roleBySlug(roleSlug);
  //   // const permissionIds = await this.permissionService.permissionSlugsToIds(permissionSlugs);
  //
  //   if (role) {
  //     await this.roleService.updateRole(role.id, {
  //       permissionSlugs,
  //     });
  //
  //     const nextRole = await this.roleService.role(role.id, {});
  //
  //     console.log(nextRole);
  //   }
  // }
}
