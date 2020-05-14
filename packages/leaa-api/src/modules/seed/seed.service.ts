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
import { ActionService } from '@leaa/api/src/modules/action/action.service';

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
  couponSeed,
  promoSeed,
} from '@leaa/api/src/modules/seed/seed.data';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment, Action } from '@leaa/common/src/entrys';
import { Repository } from 'typeorm';
import i18next from 'i18next';

const gqlCtx = { t: i18next.t };

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
    private readonly actionService: ActionService,
  ) {}

  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-await-in-loop */

  async insertPermissions() {
    for (const i of permissionsSeed) {
      const item = await this.permissionService.createPermission(i);

      console.log(item);
    }
  }

  async insertRoles() {
    for (const i of rolesSeed) {
      const item = await this.roleService.createRole(i);

      console.log(item);
    }
  }

  async insertUsers() {
    for (const i of usersSeed) {
      const item = await this.userService.createUser(i);

      console.log(item);
    }
  }

  async insertRandomUsers() {
    for (const i of randomSersSeed) {
      await this.userService.createUser(i);
    }
  }

  async insertRoleAddPermissions() {
    for (const i of roleAddPermissionsSeed) {
      const role = await this.roleService.roleBySlug(i.roleSlug);

      if (role) {
        const nextRole = await this.roleService.updateRole(role.id, { permissionSlugs: i.permissionSlugs });

        console.log(nextRole);
      }
    }
  }

  async insertUserAddRole() {
    for (const i of userAddRolesSeed) {
      const user = await this.userService.userByEmail(i.userEmail);

      if (user) {
        const nextUser = await this.userService.updateUser(user.id, { roleSlugs: i.roleSlugs });

        console.log(nextUser);
      }
    }
  }

  async insertCategory() {
    for (const i of categorySeed) {
      let parentId = '';

      if (i.seedParentSlug) {
        const category = await this.categoryService.categoryBySlug(i.seedParentSlug);
        parentId = category?.id || '';
      }

      // const parent_id = await this.categoryService.createCategory(i);
      const item = await this.categoryService.createCategory({
        ...i,
        parent_id: parentId,
      });

      console.log(item);
    }
  }

  async insertArticle() {
    for (const i of articleSeed) {
      const item = await this.articleService.createArticle(i);

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
    for (let i = 0; i < 20000; i += 1) {
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
