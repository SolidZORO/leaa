import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Coupon } from '@leaa/common/src/entrys';
import {
  CouponsWithPaginationObject,
  CreateCouponInput,
  UpdateCouponInput,
  RedeemCouponInput,
} from '@leaa/common/src/dtos/coupon';
import {
  argsFormat,
  commonUpdate,
  commonDelete,
  isOneField,
  calcQbPageInfo,
  can,
  formatDateRangeTime,
  randomString,
  errorMessage,
} from '@leaa/api/src/utils';
import { ICouponsArgs, ICouponArgs, IGqlCtx } from '@leaa/api/src/interfaces';

import { CouponProperty } from '@leaa/api/src/modules/coupon/coupon.property';

const CLS_NAME = 'CouponService';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>,
    private readonly couponProperty: CouponProperty,
  ) {}

  generateCouponCode(prefix: string): string {
    return `${prefix}${randomString().slice(0, 15)}`.toUpperCase();
  }

  async coupons(args: ICouponsArgs, gqlCtx?: IGqlCtx): Promise<CouponsWithPaginationObject> {
    const nextArgs: ICouponsArgs = argsFormat(args, gqlCtx);
    const qb = this.couponRepository.createQueryBuilder();

    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    // q
    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['code', 'name'].forEach((key) => {
        qb.orWhere(`${aliasName}.${key} = :${key}`, { [key]: `${nextArgs.q}` });
      });
    }

    // can
    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'coupon.list-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'coupon.list-read--all-user-id'))) {
      qb.andWhere('user_id = :user_id', { user_id: gqlCtx?.user?.id });
    }

    return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async coupon(id: string, args?: ICouponArgs, gqlCtx?: IGqlCtx): Promise<Coupon | undefined> {
    if (!id) throw errorMessage({ t: ['_error:notFoundId'], gqlCtx });

    let nextArgs: ICouponArgs = {};
    if (args) nextArgs = args;

    const whereQuery: { id: string; status?: number; user_id?: string } = { id };

    // can
    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'coupon.item-read--all-status'))) {
      whereQuery.status = 1;
    }

    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'coupon.item-read--all-user-id'))) {
      whereQuery.user_id = gqlCtx?.user?.id;
    }

    const coupon = await this.couponRepository.findOne({ ...nextArgs, where: whereQuery });
    if (!coupon) throw errorMessage({ t: ['_error:notFoundItem'], gqlCtx });

    return coupon;
  }

  async couponByCode(code: string, args?: ICouponArgs, gqlCtx?: IGqlCtx): Promise<Coupon | undefined> {
    const coupon = await this.couponRepository.findOne({ where: { code } });
    if (!coupon) throw errorMessage({ t: ['_error:notFoundItem'], gqlCtx });

    return this.coupon(coupon.id, args, gqlCtx);
  }

  async createCoupon(args: CreateCouponInput, gqlCtx?: IGqlCtx): Promise<Coupon | undefined> {
    const nextArgs = formatDateRangeTime(args, 'start_time', 'expire_time');
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

  async updateCoupon(id: string, args: UpdateCouponInput, gqlCtx?: IGqlCtx): Promise<Coupon | undefined> {
    if (isOneField(args, 'status')) {
      return commonUpdate({ repository: this.couponRepository, CLS_NAME, id, args });
    }

    const nextArgs = formatDateRangeTime(args, 'start_time', 'expire_time');

    return commonUpdate({ repository: this.couponRepository, CLS_NAME, id, args: nextArgs });
  }

  async deleteCoupon(id: string, gqlCtx?: IGqlCtx): Promise<Coupon | undefined> {
    return commonDelete({ repository: this.couponRepository, CLS_NAME, id });
  }

  async redeemCoupon(info: RedeemCouponInput, gqlCtx?: IGqlCtx): Promise<Coupon | undefined> {
    const coupon = await this.couponByCode(info.code, undefined, gqlCtx);
    if (!coupon) throw errorMessage({ t: ['_error:notFoundItem'], gqlCtx });

    if (!this.couponProperty.available(coupon)) throw errorMessage({ t: ['_module:coupon.unavailable'], gqlCtx });
    if (!this.couponProperty.canRedeem(coupon)) throw errorMessage({ t: ['_module:coupon.irredeemable'], gqlCtx });
    if (coupon.user_id) throw errorMessage({ t: ['_module:coupon.alreadyRedeemed'], gqlCtx });

    // [token user]
    let nextCoupon = { ...coupon, user_id: gqlCtx?.user?.id };

    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'coupon.item-redeem--to-all-user-id'))) {
      nextCoupon = { ...coupon, user_id: info.userId };
    }

    return this.couponRepository.save(nextCoupon);
  }
}
