import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Promo } from '@leaa/common/src/entrys';
import {
  PromosWithPaginationObject,
  CreatePromoInput,
  UpdatePromoInput,
  RedeemPromoInput,
} from '@leaa/common/src/dtos/promo';
import {
  argsFormat,
  can,
  commonUpdate,
  commonDelete,
  isOneField,
  calcQbPageInfo,
  formatDateRangeTime,
  errorMessage,
} from '@leaa/api/src/utils';
import { IPromosArgs, IPromoArgs, IGqlCtx } from '@leaa/api/src/interfaces';

import { PromoProperty } from './promo.property';

const CLS_NAME = 'PromoService';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(Promo) private readonly promoRepository: Repository<Promo>,
    private readonly promoProperty: PromoProperty,
  ) {}

  async promos(args: IPromosArgs, gqlCtx?: IGqlCtx): Promise<PromosWithPaginationObject> {
    const nextArgs: IPromosArgs = argsFormat(args, gqlCtx);

    const qb = this.promoRepository.createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'id', nextArgs.orderSort);

    // q
    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['name'].forEach((key) => {
        qb.orWhere(`${aliasName}.${key} = :${key}`, { [key]: `${nextArgs.q}` });
      });
    }

    // can
    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'promo.list-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async promo(id: string, args?: IPromoArgs, gqlCtx?: IGqlCtx): Promise<Promo | undefined> {
    let nextArgs: IPromoArgs = {};
    if (args) nextArgs = args;

    const whereQuery: { id: string; status?: number } = { id };

    // can
    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'promo.item-read--all-status'))) {
      whereQuery.status = 1;
    }

    const promo = await this.promoRepository.findOne({ ...nextArgs, where: whereQuery });
    if (!promo) throw errorMessage({ t: ['_error:notFoundItem'], gqlCtx });

    return promo;
  }

  async promoByCode(code: string, args?: IPromoArgs, gqlCtx?: IGqlCtx): Promise<Promo | undefined> {
    const promo = await this.promoRepository.findOne({ where: { code } });
    if (!promo) throw errorMessage({ t: ['_error:notFoundItem'], gqlCtx });

    return this.promo(promo.id, args, gqlCtx);
  }

  async createPromo(args: CreatePromoInput, gqlCtx?: IGqlCtx): Promise<Promo | undefined> {
    const nextArgs = formatDateRangeTime(args, 'start_time', 'expire_time');

    return this.promoRepository.save({ ...nextArgs });
  }

  async updatePromo(id: string, args: UpdatePromoInput, gqlCtx?: IGqlCtx): Promise<Promo | undefined> {
    if (isOneField(args, 'status')) {
      return commonUpdate({ repository: this.promoRepository, CLS_NAME, id, args });
    }

    const nextArgs = formatDateRangeTime(args, 'start_time', 'expire_time');

    return commonUpdate({ repository: this.promoRepository, CLS_NAME, id, args: nextArgs });
  }

  async deletePromo(id: string, gqlCtx?: IGqlCtx): Promise<Promo | undefined> {
    return commonDelete({ repository: this.promoRepository, CLS_NAME, id });
  }

  async redeemPromo(info: RedeemPromoInput, gqlCtx?: IGqlCtx): Promise<Promo | undefined> {
    const promo = await this.promoByCode(info.code, undefined, gqlCtx);
    if (!promo) throw errorMessage({ t: ['_error:notFoundItem'], gqlCtx });

    if (!this.promoProperty.available(promo)) throw errorMessage({ t: ['_module:promo.unavailable'], gqlCtx });

    // [token user]
    let nextPromo = { ...promo, user_id: gqlCtx?.user?.id };

    // can
    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'promo.item-redeem--to-all-user-id') && info.userId)) {
      nextPromo = { ...promo, user_id: info.userId };
    }

    return this.promoRepository.save(nextPromo);
  }
}
