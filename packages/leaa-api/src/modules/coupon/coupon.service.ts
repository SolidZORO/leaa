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
import { formatUtil, curdUtil, paginationUtil, loggerUtil, authUtil } from '@leaa/api/src/utils';

import { CouponProperty } from '@leaa/api/src/modules/coupon/coupon.property';

const CONSTRUCTOR_NAME = 'CouponService';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>,
    private readonly couponProperty: CouponProperty,
  ) {}

  async coupons(args: CouponsArgs, user?: User): Promise<CouponsWithPaginationObject | undefined> {
    if (!user || !authUtil.checkAvailabilityUser(user)) throw Error();

    const nextArgs = formatUtil.formatArgs(args);

    const qb = getRepository(Coupon).createQueryBuilder();

    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['code', 'name'].forEach(q => {
        qb.orWhere(`${aliasName}.${q} = :${q}`, { [q]: `${nextArgs.q}` });
      });
    }

    if (!authUtil.hasPermission(user, 'coupon.list-allow-all-user-id')) {
      qb.andWhere('user_id = :user_id', { user_id: user.id });
    }

    if (!authUtil.hasPermission(user, 'coupon.list-allow-all-status')) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async coupon(id: number, args?: CouponArgs & FindOneOptions<Coupon>, user?: User): Promise<Coupon | undefined> {
    if (!user || !authUtil.checkAvailabilityUser(user)) throw Error();

    let nextArgs: FindOneOptions<Coupon> = {};

    if (args) {
      nextArgs = args;
    }

    const qb = getRepository(Coupon).createQueryBuilder();

    if (!authUtil.hasPermission(user, 'coupon.item-allow-all-user-id')) {
      qb.andWhere('user_id = :user_id', { user_id: user.id });
    }

    const whereQuery: { id: number; status?: number } = { id };

    if (!user || (user && !authUtil.hasPermission(user, 'coupon.list'))) {
      whereQuery.status = 1;
    }

    return this.couponRepository.findOne({
      ...nextArgs,
      where: whereQuery,
    });
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

  generateCouponCode(prefix: string): string {
    return `${prefix}${uuid
      .v4()
      .replace(/-/g, '')
      .slice(0, 15)}`.toUpperCase();
  }

  async createCoupon(args: CreateCouponInput): Promise<Coupon | undefined> {
    const nextArgs = formatUtil.formatDataRange(args, 'start_time', 'expire_time');
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
    const nextArgs = formatUtil.formatDataRange(args, 'start_time', 'expire_time');

    return curdUtil.commonUpdate(this.couponRepository, CONSTRUCTOR_NAME, id, nextArgs);
  }

  async redeemCoupon(info: RedeemCouponInput, user?: User): Promise<Coupon | undefined> {
    const coupon = await this.couponByCode(info.code);

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

    if (info.userId && authUtil.hasPermission(user, 'coupon.redeem-to-any-user')) {
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
