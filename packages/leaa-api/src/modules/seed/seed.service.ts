import { Injectable } from '@nestjs/common';
import { PermissionService } from '@leaa/api/src/modules/permission/permission.service';
import { RoleService } from '@leaa/api/src/modules/role/role.service';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { CategoryService } from '@leaa/api/src/modules/category/category.service';
import { ArticleService } from '@leaa/api/src/modules/article/article.service';
import { AxService } from '@leaa/api/src/modules/ax/ax.service';
import { SettingService } from '@leaa/api/src/modules/setting/setting.service';
import { AttachmentService } from '@leaa/api/src/modules/attachment/attachment.service';

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
  settingSeed,
  attachmentSeed,
} from '@leaa/api/src/modules/seed/seed.data';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '@leaa/common/src/entrys';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly articleService: ArticleService,
    private readonly axService: AxService,
    private readonly settingService: SettingService,
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

  public async insertAttachment() {
    for (const i of attachmentSeed) {
      const item = await this.attachmentRepository.save(i);

      console.log(item);
    }
  }

  public async insertSetting() {
    for (const i of settingSeed) {
      const item = await this.settingService.craeteSetting(i);

      console.log(item);
    }
  }
}
