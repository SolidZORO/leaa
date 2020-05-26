/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PermissionService } from '@leaa/api/src/modules/v1/permission/permission.service';
import { RoleService } from '@leaa/api/src/modules/v1/role/role.service';
import { UserService } from '@leaa/api/src/modules/v1/user/user.service';
import { CategoryService } from '@leaa/api/src/modules/v1/category/category.service';
import { ArticleService } from '@leaa/api/src/modules/v1/article/article.service';
import { AxService } from '@leaa/api/src/modules/v1/ax/ax.service';
import { SettingService } from '@leaa/api/src/modules/v1/setting/setting.service';
import { AuthService } from '@leaa/api/src/modules/v1/auth/auth.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Attachment, Action } from '@leaa/common/src/entrys';

import {
  permissionsSeed,
  rolesSeed,
  usersSeed,
  randomSersSeed,
  permissionsToRoleSeed,
  rolesToUserSeed,
  categorySeed,
  articleSeed,
  settingSeed,
  attachmentSeed,
} from './seed.data';

import { req } from './__seed__.mock';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
    @InjectRepository(Action) private readonly actionRepository: Repository<Action>,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly categoryService: CategoryService,
    private readonly articleService: ArticleService,
    private readonly axService: AxService,
    private readonly settingService: SettingService,
  ) {}

  async insertPermissions() {
    for (const i of permissionsSeed) {
      const item = await this.permissionService.createOne(req, i);

      console.log(item);
    }
  }
  //
  async insertRoles() {
    for (const i of rolesSeed) {
      const item = await this.roleService.createOne(req, i);

      console.log(item);
    }
  }

  async insertUsers() {
    for (const i of usersSeed) {
      const item = await this.userService.createOne(req, i as any);

      console.log(item);
    }
  }

  async insertRandomUsers() {
    for (const i of randomSersSeed) {
      await this.userService.createOne(req, i as any);
    }
  }

  async insertPermissionsToRole() {
    for (const i of permissionsToRoleSeed) {
      const role = await this.roleService.getOneBySlug(i.roleSlug);

      if (role) {
        const nextReq = req;
        // nextReq.parsed.paramsFilter = [{ field: 'id', operator: '$eq', value: role.id }];
        nextReq.parsed.search = { $and: [undefined, { id: { $eq: role.id } }] };
        nextReq.options.params = { id: role.id };

        const permissionIds = await this.permissionService.transSlugsToIds(i.permissionSlugs);
        await this.roleService.updateOne(nextReq, { permissionIds });
      }
    }
  }

  async insertRolesToUser() {
    for (const i of rolesToUserSeed) {
      const user = await this.userService.getOneByEmail(i.userEmail);

      if (user) {
        const nextReq = req;
        // nextReq.parsed.paramsFilter = [{ field: 'id', operator: '$eq', value: user.id }];
        nextReq.parsed.search = { $and: [undefined, { id: { $eq: user.id } }] };
        nextReq.options.params = { id: user.id };

        const roleIds = await this.roleService.transSlugsToIds(i.roleSlugs);
        await this.userService.updateOne(nextReq, { roleIds });
      }
    }
  }

  async insertCategory() {
    for (const i of categorySeed) {
      let parent = null;
      // eslint-disable-next-line @typescript-eslint/camelcase
      let parent_id = null;

      if (i.seedParentSlug) {
        parent = await this.categoryService.getOneBySlug(i?.seedParentSlug);
        // eslint-disable-next-line @typescript-eslint/camelcase
        parent_id = parent?.id;
        await console.log('insertCategory >>>>>>>>>>>>>>', i.seedParentSlug, parent);
      }

      const item = await this.categoryService.createOne(req, {
        ...i,
        parent,
        parent_id,
      });

      console.log(item);
    }
  }

  async insertArticle() {
    for (const i of articleSeed) {
      const item = await this.articleService.createOne(req, i as any);

      console.log(item);
    }
  }

  // async insertAx() {
  //   for (const i of axSeed) {
  //     const item = await this.axService.createAx(i);
  //
  //     console.log(item);
  //   }
  // }

  async insertAttachment() {
    for (const i of attachmentSeed) {
      const item = await this.attachmentRepository.save(i);

      console.log(item);
    }
  }

  async insertSetting() {
    for (const i of settingSeed) {
      const item = await this.settingService.createOne(req, i as any);

      console.log(item);
    }
  }

  // async insertCoupon() {
  //   for (const i of couponSeed) {
  //     const item = await this.couponService.createCoupon(i);
  //
  //     console.log(item);
  //   }
  // }
  //
  // async insertPromo() {
  //   for (const i of promoSeed) {
  //     const item = await this.promoService.createPromo(i);
  //
  //     console.log(item);
  //   }
  // }

  randomArray = (items: any[]) => items[Math.floor(Math.random() * items.length)];

  async fillAction() {
    for (let i = 0; i < 500; i += 1) {
      const modules = [
        'config',
        'seed',
        'playground',
        'index',
        //
        'article',
        'auth',
        'user',
        'permission',
        'role',
        'category',
        'action',
        'attachment',
        'ax',
        'authtoken',
        'setting',
        'tag',
        'coupon',
        'promo',
        'product',
        'address',
        'division',
        'export',
        'zan',
        'test',
        'i18n',
      ];

      const item = await this.actionRepository.save({
        account: this.randomArray(usersSeed).email,
        module: this.randomArray(modules),
        action: this.randomArray(['edit', 'delete', 'create']),
      } as Action);

      console.log(item);
    }
  }
}
