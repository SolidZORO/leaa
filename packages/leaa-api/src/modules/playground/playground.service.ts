import { Injectable } from '@nestjs/common';
import { PermissionService } from '@leaa/api/modules/permission/permission.service';
import { RoleService } from '@leaa/api/modules/role/role.service';
import { UserService } from '@leaa/api/modules/user/user.service';

@Injectable()
export class PlaygroundService {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  public async test() {
    const userEmail = 'admin@admin.com';
    const roleSlugs = ['admin', 'staff'];

    const user = await this.userService.userByEmail(userEmail);

    if (user) {
      await this.userService.updateUser(user.id, {
        roleSlugs,
      });

      const nextUser = await this.userService.user(user.id, {});

      console.log(nextUser);
    }
  }

  // public async test() {
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
