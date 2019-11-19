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
} from '@leaa/common/src/dtos/coupon';
import { formatUtil, permissionUtil, curdUtil, paginationUtil } from '@leaa/api/src/utils';

const CONSTRUCTOR_NAME = 'CouponService';

@Injectable()
export class CouponService {
  constructor(@InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>) {}

  async coupons(args: CouponsArgs, user?: User): Promise<CouponsWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    const qb = getRepository(Coupon).createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['code', 'slug'].forEach(q => {
        qb.andWhere(`${aliasName}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
      });
    }

    if (!user || (user && !permissionUtil.hasPermission(user, 'attachment.list'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async coupon(id: number, args?: CouponArgs & FindOneOptions<Coupon>, user?: User): Promise<Coupon | undefined> {
    let nextArgs: FindOneOptions<Coupon> = {};

    if (args) {
      nextArgs = args;
    }

    const whereQuery: { id: number; status?: number } = { id };

    if (!user || (user && !permissionUtil.hasPermission(user, 'attachment.list'))) {
      whereQuery.status = 1;
    }

    return this.couponRepository.findOne({
      ...nextArgs,
      where: whereQuery,
    });
  }

  generateCouponCode(prefix: string): string {
    return `${prefix}${uuid
      .v4()
      .replace(/-/g, '')
      .slice(0, 15)}`.toUpperCase();
  }

  async createCoupon(args: CreateCouponInput): Promise<Coupon | undefined> {
    const couponInputs = [];

    for (let i = 0; i < args.quantity; i += 1) {
      couponInputs.push({
        ...args,
        code: this.generateCouponCode('C'),
      });
    }

    // TODO: The best way is to pre-generate the list of pairs.
    const result = await this.couponRepository.save(couponInputs);

    return result && result[0];
  }

  async updateCoupon(id: number, args: UpdateCouponInput): Promise<Coupon | undefined> {
    return curdUtil.commonUpdate(this.couponRepository, CONSTRUCTOR_NAME, id, args);
  }

  async deleteCoupon(id: number): Promise<Coupon | undefined> {
    return curdUtil.commonDelete(this.couponRepository, CONSTRUCTOR_NAME, id);
  }
}
