import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Zan, User } from '@leaa/common/src/entrys';
import { ZansArgs, ZansWithPaginationObject, ZanArgs, CreateZanInput, UpdateZanInput } from '@leaa/common/src/dtos/zan';
import { argsUtil, curdUtil, paginationUtil, errorUtil } from '@leaa/api/src/utils';

type IZansArgs = ZansArgs & FindOneOptions<Zan>;
type IZanArgs = ZanArgs & FindOneOptions<Zan>;

const CLS_NAME = 'ZanService';

@Injectable()
export class ZanService {
  constructor(@InjectRepository(Zan) private readonly zanRepository: Repository<Zan>) {}

  async zans(args: IZansArgs, user?: User): Promise<ZansWithPaginationObject> {
    const nextArgs = argsUtil.format(args);

    const qb = this.zanRepository.createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'created_at', nextArgs.orderSort);

    // q
    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['title'].forEach(key => {
        qb.orWhere(`${aliasName}.${key} = :${key}`, { [key]: `${nextArgs.q}` });
      });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async zan(uuid: string, args?: IZanArgs, user?: User): Promise<Zan | undefined> {
    let nextArgs: IZanArgs = {};
    if (args) nextArgs = args;

    const whereQuery: { uuid: string; status?: number } = { uuid };

    const zan = await this.zanRepository.findOne({ ...nextArgs, where: whereQuery });
    if (!zan) return errorUtil.NOT_FOUND({ user });

    const views = zan.views ? zan.views + 1 : 1;
    await this.zanRepository.update(zan.id, { views });

    return zan;
  }

  async createZan(args: CreateZanInput): Promise<Zan | undefined> {
    return this.zanRepository.save({
      ...args,
      uuid: v4(),
    });
  }

  async updateZan(id: number, args: UpdateZanInput): Promise<Zan | undefined> {
    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.zanRepository, CLS_NAME, id, args);

    return curdUtil.commonUpdate(this.zanRepository, CLS_NAME, id, args);
  }

  async deleteZan(id: number): Promise<Zan | undefined> {
    return curdUtil.commonDelete(this.zanRepository, CLS_NAME, id);
  }
}
