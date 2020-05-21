/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PermissionService } from '@leaa/api/src/modules/permission/permission.service';
import { RoleService } from '@leaa/api/src/modules/role/role.service';
import { UserService } from '@leaa/api/src/modules/user/user.service';
import { CategoryService } from '@leaa/api/src/modules/category/category.service';
import { ArticleService } from '@leaa/api/src/modules/article/article.service';
import { AxService } from '@leaa/api/src/modules/ax/ax.service';
import { SettingService } from '@leaa/api/src/modules/setting/setting.service';
import { CouponService } from '@leaa/api/src/modules/coupon/coupon.service';
import { PromoService } from '@leaa/api/src/modules/promo/promo.service';

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
  axSeed,
  settingSeed,
  attachmentSeed,
  couponSeed,
  promoSeed,
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
    private readonly categoryService: CategoryService,
    private readonly articleService: ArticleService,
    private readonly axService: AxService,
    private readonly settingService: SettingService,
    private readonly couponService: CouponService,
    private readonly promoService: PromoService,
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
      const item = await this.userService.createOne(req, i);

      console.log(item);
    }
  }

  async insertRandomUsers() {
    for (const i of randomSersSeed) {
      await this.userService.createOne(req, i);
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
      let parentId = '';

      if (i.seedParentSlug) {
        const category = await this.categoryService.getOneBySlug(i.seedParentSlug);
        parentId = category?.id || '';
      }

      // const parent_id = await this.categoryService.createCategory(i);
      const item = await this.categoryService.createOne(req, {
        ...i,
        parent_id: parentId,
      });

      console.log(item);
    }
  }

  async insertArticle() {
    for (const i of articleSeed) {
      const item = await this.articleService.createOne(req, i);

      console.log(item);
    }
  }

  async insertAx() {
    for (const i of axSeed) {
      const item = await this.axService.createAx(i);

      console.log(item);
    }
  }

  async insertAttachment() {
    for (const i of attachmentSeed) {
      const item = await this.attachmentRepository.save(i);

      console.log(item);
    }
  }

  async insertSetting() {
    for (const i of settingSeed) {
      const item = await this.settingService.createSetting(i);

      console.log(item);
    }
  }

  async insertCoupon() {
    for (const i of couponSeed) {
      const item = await this.couponService.createCoupon(i);

      console.log(item);
    }
  }

  async insertPromo() {
    for (const i of promoSeed) {
      const item = await this.promoService.createPromo(i);

      console.log(item);
    }
  }

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
