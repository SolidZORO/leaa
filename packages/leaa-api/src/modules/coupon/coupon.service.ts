import uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Coupon, User } from '@leaa/common/src/entrys';
import {
  CouponsWithPaginationObject,
  CreateCouponInput,
  UpdateCouponInput,
  RedeemCouponInput,
} from '@leaa/common/src/dtos/coupon';
import { argsUtil, curdUtil, paginationUtil, authUtil, errUtil, dateUtil, stringUtil } from '@leaa/api/src/utils';
import { ICouponsArgs, ICouponArgs } from '@leaa/api/src/interfaces';

import { CouponProperty } from '@leaa/api/src/modules/coupon/coupon.property';

const CLS_NAME = 'CouponService';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>,
    private readonly couponProperty: CouponProperty,
  ) {}

  generateCouponCode(prefix: string): string {
    return `${prefix}${stringUtil.random().slice(0, 15)}`.toUpperCase();
  }

  async coupons(args: ICouponsArgs, user?: User): Promise<CouponsWithPaginationObject> {
    const nextArgs: ICouponsArgs = argsUtil.format(args);
    const qb = this.couponRepository.createQueryBuilder();

    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    // q
    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['code', 'name'].forEach(key => {
        qb.orWhere(`${aliasName}.${key} = :${key}`, { [key]: `${nextArgs.q}` });
      });
    }

    // can
    if (!(user && authUtil.can(user, 'coupon.list-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    if (!(user && authUtil.can(user, 'coupon.list-read--all-user-id'))) {
      qb.andWhere('user_id = :user_id', { user_id: user && user.id });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async coupon(id: number, args?: ICouponArgs, user?: User): Promise<Coupon | undefined> {
    let nextArgs: ICouponArgs = {};
    if (args) nextArgs = args;

    const whereQuery: { id: number; status?: number; user_id?: number } = { id };

    // can
    if (!(user && authUtil.can(user, 'coupon.item-read--all-status'))) {
      whereQuery.status = 1;
    }

    if (!(user && authUtil.can(user, 'coupon.item-read--all-user-id'))) {
      whereQuery.user_id = user && user.id;
    }

    const coupon = await this.couponRepository.findOne({ ...nextArgs, where: whereQuery });
    if (!coupon) return errUtil.ERROR({ error: errUtil.mapping.NOT_FOUND_ITEM.text, user });

    return coupon;
  }

  async couponByCode(code: string, args?: ICouponArgs, user?: User): Promise<Coupon | undefined> {
    const coupon = await this.couponRepository.findOne({ where: { code } });
    if (!coupon) return errUtil.ERROR({ error: errUtil.mapping.NOT_FOUND_ITEM.text, user });

    return this.coupon(coupon.id, args, user);
  }

  async createCoupon(args: CreateCouponInput): Promise<Coupon | undefined> {
    const nextArgs = dateUtil.formatDateRangeTime(args, 'start_time', 'expire_time');
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
    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.couponRepository, CLS_NAME, id, args);

    const nextArgs = dateUtil.formatDateRangeTime(args, 'start_time', 'expire_time');

    return curdUtil.commonUpdate(this.couponRepository, CLS_NAME, id, nextArgs);
  }

  async deleteCoupon(id: number): Promise<Coupon | undefined> {
    return curdUtil.commonDelete(this.couponRepository, CLS_NAME, id);
  }

  async redeemCoupon(info: RedeemCouponInput, user?: User): Promise<Coupon | undefined> {
    const coupon = await this.couponByCode(info.code, undefined, user);
    if (!coupon) return errUtil.ERROR({ error: errUtil.mapping.NOT_FOUND_ITEM.text, user });

    if (!this.couponProperty.available(coupon)) return errUtil.ERROR({ error: 'Coupon Unavailable', user });
    if (!this.couponProperty.canRedeem(coupon)) return errUtil.ERROR({ error: 'Coupon Irredeemable', user });
    if (coupon.user_id) return errUtil.ERROR({ error: 'Coupon Already redeemed', user });

    // [token user]
    let nextCoupon = { ...coupon, user_id: user && user.id };

    if (info.userId && user && authUtil.can(user, 'coupon.item-redeem--to-all-user-id')) {
      nextCoupon = { ...coupon, user_id: info.userId };
    }

    return this.couponRepository.save(nextCoupon);
  }
}
