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
import { formatUtil, authUtil, curdUtil, paginationUtil, errorUtil } from '@leaa/api/src/utils';
import { PromoProperty } from '@leaa/api/src/modules/promo/promo.property';

const CONSTRUCTOR_NAME = 'PromoService';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(Promo) private readonly promoRepository: Repository<Promo>,
    private readonly promoProperty: PromoProperty,
  ) {}

  // BASE

  async promos(args: PromosArgs, user?: User): Promise<PromosWithPaginationObject> {
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
    qb.andWhere(
      // @ts-ignore
      ...(user && authUtil.can(user, 'promo.list-read--all-status')
        ? ['', undefined]
        : ['status = :status', { status: 1 }]),
    );

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async promo(id: number, args?: PromoArgs & FindOneOptions<Promo>, user?: User): Promise<Promo | undefined> {
    let nextArgs = {};
    if (args) nextArgs = args;

    const whereQuery: { id: number; status?: number } = { id, status: 1 };

    // can
    if (user && authUtil.can(user, 'promo.item-read--all-status')) {
      delete whereQuery.status;
    }

    const promo = await this.promoRepository.findOne({ ...nextArgs, where: whereQuery });
    if (!promo) return errorUtil.NOT_FOUND({ user });

    return promo;
  }

  async createPromo(args: CreatePromoInput): Promise<Promo | undefined> {
    const nextArgs = formatUtil.formatDateRangeTime(args, 'start_time', 'expire_time');

    return this.promoRepository.save({ ...nextArgs });
  }

  async updatePromo(id: number, args: UpdatePromoInput): Promise<Promo | undefined> {
    const nextArgs = formatUtil.formatDateRangeTime(args, 'start_time', 'expire_time');

    return curdUtil.commonUpdate(this.promoRepository, CONSTRUCTOR_NAME, id, nextArgs);
  }

  async deletePromo(id: number): Promise<Promo | undefined> {
    return curdUtil.commonDelete(this.promoRepository, CONSTRUCTOR_NAME, id);
  }

  // EXT

  async promoByCode(code: string, args?: PromoArgs & FindOneOptions<Promo>, user?: User): Promise<Promo | undefined> {
    const promo = await this.promoRepository.findOne({ where: { code } });
    if (!promo) return errorUtil.NOT_FOUND({ user });

    return this.promo(promo.id, args, user);
  }

  async redeemPromo(info: RedeemPromoInput, user?: User): Promise<Promo | undefined> {
    const promo = await this.promoByCode(info.code, user);
    if (!promo) return errorUtil.NOT_FOUND({ user });

    if (!this.promoProperty.available(promo)) return errorUtil.ERROR({ error: 'Promo Unavailable', user });

    // [token user]
    let nextPromo = { ...promo, user_id: user && user.id };

    // can
    if (user && authUtil.can(user, 'promo.item-redeem--to-all-user-id') && info.userId) {
      nextPromo = { ...promo, user_id: info.userId };
    }

    return this.promoRepository.save(nextPromo);
  }
}
