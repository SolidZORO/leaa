import uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Coupon, User } from '@leaa/common/src/entrys';
import {
  CouponsArgs,
  CouponsWithPaginationObject,
  CouponArgs,
  CreateCouponInput,
  UpdateCouponInput,
  RedeemCouponInput,
} from '@leaa/common/src/dtos/coupon';
import { formatUtil, curdUtil, paginationUtil, authUtil, errorUtil } from '@leaa/api/src/utils';

import { CouponProperty } from '@leaa/api/src/modules/coupon/coupon.property';

const CONSTRUCTOR_NAME = 'CouponService';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>,
    private readonly couponProperty: CouponProperty,
  ) {}

  generateCouponCode(prefix: string): string {
    return `${prefix}${uuid
      .v4()
      .replace(/-/g, '')
      .slice(0, 15)}`.toUpperCase();
  }

  async coupons(args: CouponsArgs, user?: User): Promise<CouponsWithPaginationObject> {
    if (!user || !authUtil.checkAvailableUser(user)) return errorUtil.ILLEGAL_USER({ user });

    const nextArgs = formatUtil.formatArgs(args);
    const qb = getRepository(Coupon).createQueryBuilder();

    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    // q
    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['code', 'name'].forEach(key => {
        qb.orWhere(`${aliasName}.${key} = :${key}`, { [key]: `${nextArgs.q}` });
      });
    }

    // can
    if (!authUtil.can(user, 'coupon.list-read--all-user-id')) {
      qb.andWhere('user_id = :user_id', { user_id: user.id });
    }

    if (!authUtil.can(user, 'coupon.list-read--all-status')) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async coupon(id: number, args?: CouponArgs & FindOneOptions<Coupon>, user?: User): Promise<Coupon | undefined> {
    if (!user || !authUtil.checkAvailableUser(user)) return errorUtil.ILLEGAL_USER({ user });

    let nextArgs = {};
    if (args) nextArgs = args;

    const whereQuery = { id };

    const coupon = await this.couponRepository.findOne({ ...nextArgs, where: whereQuery });

    if (!coupon) return errorUtil.NOT_FOUND({ user });

    if (coupon.status !== 1 && !authUtil.can(user, 'coupon.item-read--all-status')) return errorUtil.NOT_AUTH({ user });

    if (coupon.user_id !== user.id && !authUtil.can(user, 'coupon.item-read--all-user-id'))
      return errorUtil.NOT_AUTH({ user });

    return coupon;
  }

  async couponByCode(
    code: string,
    args?: CouponArgs & FindOneOptions<Coupon>,
    user?: User,
  ): Promise<Coupon | undefined> {
    const coupon = await this.couponRepository.findOne({ where: { code } });

    if (!coupon) return errorUtil.NOT_FOUND({ user });

    return this.coupon(coupon.id, args, user);
  }

  async createCoupon(args: CreateCouponInput): Promise<Coupon | undefined> {
    const nextArgs = formatUtil.formatDateRangeTime(args, 'start_time', 'expire_time');
    const couponInputs = [];

    for (let i = 0; i < nextArgs.quantity; i += 1) {
      couponInputs.push({
        ...nextArgs,
        code: this.generateCouponCode('C'),
      });
    }

    // TODO: The best way is to pre-generate the list of pairs.
    const result = await this.couponRepository.save(couponInputs);

    return result && result[0];
  }

  async updateCoupon(id: number, args: UpdateCouponInput): Promise<Coupon | undefined> {
    const nextArgs = formatUtil.formatDateRangeTime(args, 'start_time', 'expire_time');

    return curdUtil.commonUpdate(this.couponRepository, CONSTRUCTOR_NAME, id, nextArgs);
  }

  async deleteCoupon(id: number): Promise<Coupon | undefined> {
    return curdUtil.commonDelete(this.couponRepository, CONSTRUCTOR_NAME, id);
  }

  async redeemCoupon(info: RedeemCouponInput, user?: User): Promise<Coupon | undefined> {
    if (!user || !user.id) return errorUtil.ILLEGAL_USER({ user });

    const coupon = await this.couponByCode(info.code, undefined, user);
    if (!coupon) return errorUtil.NOT_FOUND({ user });

    if (!this.couponProperty.available(coupon)) return errorUtil.ERROR({ error: 'Coupon Unavailable', user });
    if (!this.couponProperty.canRedeem(coupon)) return errorUtil.ERROR({ error: 'Coupon Irredeemable', user });
    if (coupon.user_id) return errorUtil.ERROR({ error: 'Coupon Already redeemed', user });

    // [token user]
    let nextCoupon = { ...coupon, user_id: user.id };

    if (info.userId && authUtil.can(user, 'coupon.item-redeem--to-all-user-id')) {
      nextCoupon = { ...coupon, user_id: info.userId };
    }

    return this.couponRepository.save(nextCoupon);
  }
}
