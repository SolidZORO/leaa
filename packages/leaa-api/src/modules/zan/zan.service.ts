import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Zan, User } from '@leaa/common/src/entrys';
import { ZansWithPaginationObject, CreateZanInput, UpdateZanInput } from '@leaa/common/src/dtos/zan';
import { IZansArgs, IZanArgs } from '@leaa/api/src/interfaces';
import { argsUtil, curdUtil, paginationUtil, errorUtil } from '@leaa/api/src/utils';

const CLS_NAME = 'ZanService';

@Injectable()
export class ZanService {
  constructor(@InjectRepository(Zan) private readonly zanRepository: Repository<Zan>) {}

  async zans(args: IZansArgs, user?: User): Promise<ZansWithPaginationObject> {
    const nextArgs = argsUtil.format(args);

    const PRIMARY_TABLE = 'zans';
    const qb = this.zanRepository.createQueryBuilder(PRIMARY_TABLE);

    // relations
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.users`, 'users');

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['title'].forEach(key => {
        qb.orWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // order
    if (nextArgs.orderBy && nextArgs.orderSort) {
      qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async zan(uuid: string, args?: IZanArgs, user?: User): Promise<Zan | undefined> {
    let nextArgs: IZanArgs = {};
    if (args) {
      nextArgs = args;
      nextArgs.relations = ['users'];
    }

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

  async likeZan(uuid: string, user?: User): Promise<Zan | undefined> {
    let zan = await this.zanRepository.findOne({ uuid }, { relations: ['users'] });

    if (!zan) return errorUtil.NOT_FOUND();
    if (!user) return errorUtil.NOT_FOUND();

    if (!zan.users?.map(u => u.id).includes(user.id)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await zan.users!.push(user);
    }

    zan = await this.zanRepository.save({
      ...zan,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      current_zan_quantity: zan.users!.length,
    });

    return zan;
  }
}
