import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Promo, User } from '@leaa/common/src/entrys';
import {
  PromosArgs,
  PromosWithPaginationObject,
  PromoArgs,
  CreatePromoInput,
  UpdatePromoInput,
  RedeemPromoInput,
} from '@leaa/common/src/dtos/promo';
import { formatUtil, authUtil, curdUtil, loggerUtil, paginationUtil } from '@leaa/api/src/utils';
import { PromoProperty } from '@leaa/api/src/modules/promo/promo.property';

const CONSTRUCTOR_NAME = 'PromoService';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(Promo) private readonly promoRepository: Repository<Promo>,
    private readonly promoProperty: PromoProperty,
  ) {}

  async promos(args: PromosArgs, user?: User): Promise<PromosWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    const qb = getRepository(Promo).createQueryBuilder();

    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['code', 'name'].forEach(q => {
        qb.orWhere(`${aliasName}.${q} = :${q}`, { [q]: `${nextArgs.q}` });
      });
    }

    if (!user || (user && !authUtil.hasPermission(user, 'promo.list'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async promo(id: number, args?: PromoArgs & FindOneOptions<Promo>, user?: User): Promise<Promo | undefined> {
    let nextArgs: FindOneOptions<Promo> = {};

    if (args) {
      nextArgs = args;
    }

    const whereQuery: { id: number; status?: number } = { id };

    if (!user || (user && !authUtil.hasPermission(user, 'promo.list'))) {
      whereQuery.status = 1;
    }

    return this.promoRepository.findOne({
      ...nextArgs,
      where: whereQuery,
    });
  }

  async promoByCode(code: string, args?: PromoArgs & FindOneOptions<Promo>, user?: User): Promise<Promo | undefined> {
    const promo = await this.promoRepository.findOne({ where: { code } });

    if (!promo) {
      const message = 'Not Found Promo';

      loggerUtil.warn(`promoByCode: ${message}`, CONSTRUCTOR_NAME);

      return undefined;
    }

    return this.promo(promo.id, args, user);
  }

  async redeemPromo(info: RedeemPromoInput, user?: User): Promise<Promo | undefined> {
    const promo = await this.promoByCode(info.code);

    if (!promo) {
      const message = 'Not Found Coupon';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw Error(message);
    }

    //

    const availableCoupon = this.promoProperty.available(promo);

    if (!availableCoupon) {
      const message = 'Coupon Unavailable';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw Error(message);
    }

    //
    //
    // const canRedeemCoupon = this.promoProperty.canRedeem(promo);
    //
    // if (!canRedeemCoupon) {
    //   const message = 'Coupon Irredeemable';
    //
    //   loggerUtil.warn(message, CONSTRUCTOR_NAME);
    //   throw Error(message);
    // }

    //

    // if (promo.user_id) {
    //   const message = 'Coupon Already redeemed';
    //
    //   loggerUtil.warn(message, CONSTRUCTOR_NAME);
    //   throw Error(message);
    // }

    //

    if (!user || !user.id) {
      const message = 'Not Found User';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw Error(message);
    }

    let nextCoupon = {
      ...promo,
      user_id: user.id,
    };

    if (info.userId && authUtil.hasPermission(user, 'promo.redeem-to-any-user')) {
      nextCoupon = {
        ...promo,
        user_id: info.userId,
      };
    }

    return this.promoRepository.save(nextCoupon);
  }

  async createPromo(args: CreatePromoInput): Promise<Promo | undefined> {
    const nextArgs = formatUtil.formatDataRange(args, 'start_time', 'expire_time');

    return this.promoRepository.save({ ...nextArgs });
  }

  async updatePromo(id: number, args: UpdatePromoInput): Promise<Promo | undefined> {
    const nextArgs = formatUtil.formatDataRange(args, 'start_time', 'expire_time');

    return curdUtil.commonUpdate(this.promoRepository, CONSTRUCTOR_NAME, id, nextArgs);
  }

  async deletePromo(id: number): Promise<Promo | undefined> {
    return curdUtil.commonDelete(this.promoRepository, CONSTRUCTOR_NAME, id);
  }
}
