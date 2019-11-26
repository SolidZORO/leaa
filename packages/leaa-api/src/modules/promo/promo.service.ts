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
} from '@leaa/common/src/dtos/promo';
import { formatUtil, permissionUtil, curdUtil, paginationUtil } from '@leaa/api/src/utils';

const CONSTRUCTOR_NAME = 'PromoService';

@Injectable()
export class PromoService {
  constructor(@InjectRepository(Promo) private readonly promoRepository: Repository<Promo>) {}

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

    if (!user || (user && !permissionUtil.hasPermission(user, 'promo.list'))) {
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

    if (!user || (user && !permissionUtil.hasPermission(user, 'promo.list'))) {
      whereQuery.status = 1;
    }

    return this.promoRepository.findOne({
      ...nextArgs,
      where: whereQuery,
    });
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
