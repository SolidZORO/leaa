import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Zan } from '@leaa/common/src/entrys';
import { ZansWithPaginationObject, CreateZanInput, UpdateZanInput } from '@leaa/common/src/dtos/zan';
import { IZansArgs, IZanArgs, IGqlCtx } from '@leaa/api/src/interfaces';
import { argsUtil, curdUtil, paginationUtil, stringUtil, msgUtil } from '@leaa/api/src/utils';

const CLS_NAME = 'ZanService';

@Injectable()
export class ZanService {
  constructor(@InjectRepository(Zan) private readonly zanRepository: Repository<Zan>) {}

  async zans(args: IZansArgs, gqlCtx?: IGqlCtx): Promise<ZansWithPaginationObject> {
    const nextArgs = argsUtil.format(args);

    const PRIMARY_TABLE = 'zans';
    const qb = this.zanRepository.createQueryBuilder(PRIMARY_TABLE);

    // relations
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.users`, 'users');
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.creator`, 'creator');

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

    return paginationUtil.calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async zan(uuid: string, args?: IZanArgs, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    let nextArgs: IZanArgs = {};
    if (args) {
      nextArgs = args;
      nextArgs.relations = ['users', 'creator'];
    }

    const whereQuery: { uuid: string; status?: number } = { uuid };
    const zan = await this.zanRepository.findOne({ ...nextArgs, where: whereQuery });

    if (!zan) throw msgUtil.error({ t: ['_error:notFoundItem'], gqlCtx });

    const views = zan.views ? zan.views + 1 : 1;
    await this.zanRepository.update(zan.id, { views });

    return zan;
  }

  async createZan(args: CreateZanInput, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    const zan = await this.zanRepository.findOne({ title: args.title }, { relations: ['users', 'creator'] });

    console.log('QQQQQQQQQ', zan?.creator?.id, gqlCtx?.user?.id);

    if (zan?.creator?.id === gqlCtx?.user?.id) {
      return zan;
    }

    return this.zanRepository.save({
      ...args,
      uuid: stringUtil.uuid(),
      creator: gqlCtx?.user,
    });
  }

  async updateZan(id: number, args: UpdateZanInput, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.zanRepository, CLS_NAME, id, args);

    return curdUtil.commonUpdate(this.zanRepository, CLS_NAME, id, args);
  }

  async deleteZan(id: number, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    return curdUtil.commonDelete(this.zanRepository, CLS_NAME, id);
  }

  async likeZan(uuid: string, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    let zan = await this.zanRepository.findOne({ uuid }, { relations: ['users'] });

    console.log(1111111111111);
    if (!zan) throw msgUtil.error({ t: ['_error:notFoundItem'], gqlCtx });

    console.log(222222222);
    if (!gqlCtx?.user) throw msgUtil.error({ t: ['_error:notFoundAuth'], gqlCtx, statusCode: 401 });

    if (gqlCtx?.user && !zan.users?.map(u => u.id).includes(gqlCtx?.user?.id)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await zan.users!.push(gqlCtx?.user);
    }

    zan = await this.zanRepository.save({
      ...zan,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      current_zan_quantity: zan.users!.length,
    });

    return zan;
  }

  async deleteZanUser(uuid: string, userId: number, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    if (!userId) throw msgUtil.error({ t: ['_error:notFoundUser'], gqlCtx });

    let zan = await this.zanRepository.findOne({ uuid }, { relations: ['users'] });

    if (!zan) throw msgUtil.error({ t: ['_error:notFoundItem'], gqlCtx });
    if (!zan.users || zan.users.length <= 0 || !zan.users?.map(u => u.id).includes(userId)) {
      throw msgUtil.error({ t: ['_error:notFoundUser'], gqlCtx });
    }

    // @ts-ignore
    zan.users = zan.users.filter(u => u.id !== userId);

    zan = await this.zanRepository.save({
      ...zan,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      current_zan_quantity: zan.users!.length,
    });

    return zan;
  }
}
