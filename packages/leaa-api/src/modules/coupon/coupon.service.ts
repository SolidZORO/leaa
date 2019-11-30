import uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Coupon, User } from '@leaa/common/src/entrys';
import { ILLEGAL_USER } from '@leaa/api/src/constants';
import {
  CouponsArgs,
  CouponsWithPaginationObject,
  CouponArgs,
  CreateCouponInput,
  UpdateCouponInput,
  RedeemCouponInput,
} from '@leaa/common/src/dtos/coupon';
import { formatUtil, curdUtil, paginationUtil, loggerUtil, authUtil } from '@leaa/api/src/utils';

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
    if (!user || !authUtil.checkAvailableUser(user)) throw Error(ILLEGAL_USER);

    const nextArgs = formatUtil.formatArgs(args);
    const qb = getRepository(Coupon).createQueryBuilder();

    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['code', 'name'].forEach(q => {
        qb.orWhere(`${aliasName}.${q} = :${q}`, { [q]: `${nextArgs.q}` });
      });
    }

    if (!authUtil.can(user, 'coupon.list-read--all-user-id')) {
      qb.andWhere('user_id = :user_id', { user_id: user.id });
    }

    if (!authUtil.can(user, 'coupon.list-read--all-status')) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async coupon(id: number, args?: CouponArgs & FindOneOptions<Coupon>, user?: User): Promise<Coupon | undefined> {
    if (!user || !authUtil.checkAvailableUser(user)) throw Error(ILLEGAL_USER);

    const qb = getRepository(Coupon).createQueryBuilder();

    if (user && !authUtil.can(user, 'coupon.item-read--all-user-id')) {
      qb.andWhere('user_id = :user_id', { user_id: user.id });
    }

    if (!user || (user && !authUtil.can(user, 'coupon.item-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return qb.andWhere('id = :id', { id }).getOne();
  }

  async couponByCode(
    code: string,
    args?: CouponArgs & FindOneOptions<Coupon>,
    user?: User,
  ): Promise<Coupon | undefined> {
    const coupon = await this.couponRepository.findOne({ where: { code } });

    if (!coupon) {
      const message = 'Not Found Coupon';

      loggerUtil.warn(`couponByCode: ${message}`, CONSTRUCTOR_NAME);

      return undefined;
    }

    return this.coupon(coupon.id, args, user);
  }

  async createCoupon(args: CreateCouponInput): Promise<Coupon | undefined> {
    const nextArgs = formatUtil.formatDateRange(args, 'start_time', 'expire_time');
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
    const nextArgs = formatUtil.formatDateRange(args, 'start_time', 'expire_time');

    return curdUtil.commonUpdate(this.couponRepository, CONSTRUCTOR_NAME, id, nextArgs);
  }

  async redeemCoupon(info: RedeemCouponInput, user?: User): Promise<Coupon | undefined> {
    if (!user || !authUtil.checkAvailableUser(user)) throw Error(ILLEGAL_USER);

    const coupon = await this.couponByCode(info.code, undefined, user);

    if (!coupon) {
      const message = 'Not Found Coupon';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw Error(message);
    }

    //

    const availableCoupon = this.couponProperty.available(coupon);

    if (!availableCoupon) {
      const message = 'Coupon Unavailable';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw Error(message);
    }

    //

    const canRedeemCoupon = this.couponProperty.canRedeem(coupon);

    if (!canRedeemCoupon) {
      const message = 'Coupon Irredeemable';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw Error(message);
    }

    //

    if (coupon.user_id) {
      const message = 'Coupon Already redeemed';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw Error(message);
    }

    //

    if (!user || !user.id) {
      const message = 'Not Found User';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw Error(message);
    }

    let nextCoupon = {
      ...coupon,
      user_id: user.id,
    };

    if (info.userId && authUtil.can(user, 'coupon.item-redeem--to-all-user-id')) {
      nextCoupon = {
        ...coupon,
        user_id: info.userId,
      };
    }

    return this.couponRepository.save(nextCoupon);
  }

  async deleteCoupon(id: number): Promise<Coupon | undefined> {
    return curdUtil.commonDelete(this.couponRepository, CONSTRUCTOR_NAME, id);
  }
}
