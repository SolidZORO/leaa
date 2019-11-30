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
import { formatUtil, authUtil, curdUtil, paginationUtil, messageUtil } from '@leaa/api/src/utils';
import { PromoProperty } from '@leaa/api/src/modules/promo/promo.property';

const CONSTRUCTOR_NAME = 'PromoService';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(Promo) private readonly promoRepository: Repository<Promo>,
    private readonly promoProperty: PromoProperty,
  ) {}

  async promos(args: PromosArgs, user?: User): Promise<PromosWithPaginationObject> {
    if (!user || !authUtil.checkAvailableUser(user)) return messageUtil.ILLEGAL_USER({ user });

    const nextArgs = formatUtil.formatArgs(args);
    const qb = getRepository(Promo).createQueryBuilder();

    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    // q
    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['code', 'name'].forEach(key => {
        qb.orWhere(`${aliasName}.${key} = :${key}`, { [key]: `${nextArgs.q}` });
      });
    }

    // can
    if (!authUtil.can(user, 'promo.list-read--all-user-id')) {
      qb.andWhere('user_id = :user_id', { user_id: user.id });
    }

    if (!authUtil.can(user, 'promo.list-read--all-status')) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async promo(id: number, args?: PromoArgs & FindOneOptions<Promo>, user?: User): Promise<Promo | undefined> {
    if (!user || !authUtil.checkAvailableUser(user)) return messageUtil.ILLEGAL_USER({ user });

    let nextArgs = {};
    if (args) nextArgs = args;

    const whereQuery = { id };
    const promo = await this.promoRepository.findOne({ ...nextArgs, where: whereQuery });

    if (!promo) return messageUtil.NOT_FOUND({ user });
    if (promo.status !== 1 && !authUtil.can(user, 'promo.item-read--all-status')) return messageUtil.NOT_AUTH({ user });

    return promo;
  }

  async promoByCode(code: string, args?: PromoArgs & FindOneOptions<Promo>, user?: User): Promise<Promo | undefined> {
    const promo = await this.promoRepository.findOne({ where: { code } });

    if (!promo) return messageUtil.NOT_FOUND({ user });

    return this.promo(promo.id, args, user);
  }

  async redeemPromo(info: RedeemPromoInput, user?: User): Promise<Promo | undefined> {
    const promo = await this.promoByCode(info.code);
    if (!promo) return messageUtil.NOT_FOUND({ user });

    const availableCoupon = this.promoProperty.available(promo);
    if (!availableCoupon) return messageUtil.ERROR({ error: 'Coupon Unavailable', user });
    if (!user || !user.id) return messageUtil.ERROR({ error: 'Not Found User', user });

    // [token user]
    let nextCoupon = { ...promo, user_id: user.id };

    if (info.userId && authUtil.can(user, 'promo.item-redeem--to-all-user-id')) {
      nextCoupon = { ...promo, user_id: info.userId };
    }

    return this.promoRepository.save(nextCoupon);
  }

  async createPromo(args: CreatePromoInput): Promise<Promo | undefined> {
    const nextArgs = formatUtil.formatDateRange(args, 'start_time', 'expire_time');

    return this.promoRepository.save({ ...nextArgs });
  }

  async updatePromo(id: number, args: UpdatePromoInput): Promise<Promo | undefined> {
    const nextArgs = formatUtil.formatDateRange(args, 'start_time', 'expire_time');

    return curdUtil.commonUpdate(this.promoRepository, CONSTRUCTOR_NAME, id, nextArgs);
  }

  async deletePromo(id: number): Promise<Promo | undefined> {
    return curdUtil.commonDelete(this.promoRepository, CONSTRUCTOR_NAME, id);
  }
}
