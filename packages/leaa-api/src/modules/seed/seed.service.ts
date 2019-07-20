import { Injectable } from '@nestjs/common';
import { PermissionService } from '@leaa/api/modules/permission/permission.service';
import { RoleService } from '@leaa/api/modules/role/role.service';
import { UserService } from '@leaa/api/modules/user/user.service';
import { CategoryService } from '@leaa/api/modules/category/category.service';
import { ArticleService } from '@leaa/api/modules/article/article.service';
import { AxService } from '@leaa/api/modules/ax/ax.service';

import {
  permissionsSeed,
  rolesSeed,
  usersSeed,
  randomSersSeed,
  roleAddPermissionsSeed,
  userAddRolesSeed,
  categorySeed,
  articleSeed,
  axSeed,
} from './seed.data';

@Injectable()
export class SeedService {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly articleService: ArticleService,
    private readonly axService: AxService,
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

  public async insertRandomUsers() {
    for (const i of randomSersSeed) {
      await this.userService.craeteUser(i);
    }
  }

  public async insertRoleAddPermissions() {
    for (const i of roleAddPermissionsSeed) {
      const role = await this.roleService.roleBySlug(i.roleSlug);

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

  public async insertCategory() {
    for (const i of categorySeed) {
      const item = await this.categoryService.craeteCategory(i);

      console.log(item);
    }
  }

  public async insertArticle() {
    for (const i of articleSeed) {
      const item = await this.articleService.craeteArticle(i);

      console.log(item);
    }
  }

  public async insertAx() {
    for (const i of axSeed) {
      const item = await this.axService.craeteAx(i);

      console.log(item);
    }
  }
}
