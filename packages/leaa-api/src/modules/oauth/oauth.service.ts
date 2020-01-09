import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User, Oauth } from '@leaa/common/src/entrys';
import { CreateOauthInput, OauthsWithPaginationObject } from '@leaa/common/src/dtos/oauth';
import { argsUtil, paginationUtil } from '@leaa/api/src/utils';
import { IOauthsArgs } from '@leaa/api/src/interfaces';

const CLS_NAME = 'OauthService';

@Injectable()
export class OauthService {
  constructor(@InjectRepository(Oauth) private readonly oauthRepository: Repository<Oauth>) {}

  async oauths(args: IOauthsArgs, user?: User): Promise<OauthsWithPaginationObject | undefined> {
    const nextArgs: IOauthsArgs = argsUtil.format(args);

    const PRIMARY_TABLE = 'oauths';
    const qb = await this.oauthRepository.createQueryBuilder(PRIMARY_TABLE);

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['nickname'].forEach(key => {
        qb.andWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // order
    if (nextArgs.orderBy && nextArgs.orderSort) {
      qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async oauth(openId: string, platform: string): Promise<Oauth | undefined> {
    const qb = await this.oauthRepository.createQueryBuilder();

    return qb.where({ open_id: openId, platform }).getOne();
  }

  async createOauth(args: CreateOauthInput): Promise<Oauth | undefined> {
    return this.oauthRepository.save({ ...args });
  }
}
