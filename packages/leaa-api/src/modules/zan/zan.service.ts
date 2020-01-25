import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Zan } from '@leaa/common/src/entrys';
import { ZansWithPaginationObject, CreateZanInput, UpdateZanInput } from '@leaa/common/src/dtos/zan';
import { IZansArgs, IZanArgs, IGqlCtx } from '@leaa/api/src/interfaces';
import { argsUtil, curdUtil, paginationUtil, stringUtil, msgUtil, authUtil } from '@leaa/api/src/utils';

const CLS_NAME = 'ZanService';

@Injectable()
export class ZanService {
  constructor(@InjectRepository(Zan) private readonly zanRepository: Repository<Zan>) {}

  async zans(args: IZansArgs, gqlCtx?: IGqlCtx): Promise<ZansWithPaginationObject> {
    const nextArgs = argsUtil.format(args, gqlCtx);

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

  async zan(hashId: string, args?: IZanArgs, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    const id = stringUtil.decodeId(hashId, gqlCtx);

    let nextArgs: IZanArgs = {};

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['users', 'creator'];
    }

    const whereQuery: { id: number; status?: number } = { id };
    const zan = await this.zanRepository.findOne({ ...nextArgs, where: whereQuery });

    if (!zan) throw msgUtil.error({ t: ['_error:notFoundItem'], gqlCtx });

    await this.zanRepository.increment({ id }, 'views', 1);

    // hide id
    if (!authUtil.isAdmin()) delete zan.id;

    return zan;
  }

  async createZan(args: CreateZanInput, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    const zan = await this.zanRepository.findOne({ title: args.title }, { relations: ['users', 'creator'] });

    if (zan?.creator?.id === gqlCtx?.user?.id) {
      return zan;
    }

    return curdUtil.commonCreate<Zan, CreateZanInput>({
      repository: this.zanRepository,
      args,
      extArgs: { creator: gqlCtx?.user },
      CLS_NAME,
    });
  }

  async updateZan(hashId: string, args: UpdateZanInput, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    const id = stringUtil.decodeId(hashId, gqlCtx);

    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.zanRepository, CLS_NAME, id, args);

    return curdUtil.commonUpdate(this.zanRepository, CLS_NAME, id, args);
  }

  async deleteZan(hashId: string, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    const id = stringUtil.decodeId(hashId, gqlCtx);

    return curdUtil.commonDelete(this.zanRepository, CLS_NAME, id);
  }

  async likeZan(hashId: string, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    let zan = await this.zanRepository.findOne({ hashId }, { relations: ['users'] });

    if (!zan) throw msgUtil.error({ t: ['_error:notFoundItem'], gqlCtx });
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

  async deleteZanUser(hashId: string, userId: number, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    if (!userId) throw msgUtil.error({ t: ['_error:notFoundUser'], gqlCtx });

    let zan = await this.zanRepository.findOne({ hashId }, { relations: ['users'] });

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
