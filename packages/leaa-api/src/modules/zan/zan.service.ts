import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Zan } from '@leaa/common/src/entrys';
import { ZansWithPaginationObject, CreateZanInput, UpdateZanInput } from '@leaa/common/src/dtos/zan';
import { IZansArgs, IZanArgs, IGqlCtx } from '@leaa/api/src/interfaces';
import {
  argsFormat,
  commonUpdate,
  commonDelete,
  isOneField,
  calcQbPageInfo,
  uuid,
  errorMessage,
} from '@leaa/api/src/utils';

const CLS_NAME = 'ZanService';

@Injectable()
export class ZanService {
  constructor(@InjectRepository(Zan) private readonly zanRepository: Repository<Zan>) {}

  async zans(args: IZansArgs, gqlCtx?: IGqlCtx): Promise<ZansWithPaginationObject> {
    const nextArgs = argsFormat(args);

    const PRIMARY_TABLE = 'zans';
    const qb = this.zanRepository.createQueryBuilder(PRIMARY_TABLE);

    // relations
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.users`, 'users');
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.creator`, 'creator');

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['title'].forEach((key) => {
        qb.orWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // order
    if (nextArgs.orderBy && nextArgs.orderSort) {
      qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
    }

    return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async zan(id: string, args?: IZanArgs, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    if (!id) throw errorMessage({ t: ['_error:notFoundId'], gqlCtx });

    let nextArgs: IZanArgs = {};
    if (args) {
      nextArgs = args;
      nextArgs.relations = ['users', 'creator'];
    }

    const whereQuery: { id: string; status?: number } = { id };
    const zan = await this.zanRepository.findOne({ ...nextArgs, where: whereQuery });

    if (!zan) throw errorMessage({ t: ['_error:notFoundItem'], gqlCtx });

    const views = zan.views ? zan.views + 1 : 1;
    await this.zanRepository.update(zan.id, { views });

    return zan;
  }

  async createZan(args: CreateZanInput, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    const zan = await this.zanRepository.findOne({ title: args.title }, { relations: ['users', 'creator'] });

    if (zan?.creator?.id === gqlCtx?.user?.id) {
      return zan;
    }

    return this.zanRepository.save({
      ...args,
      uuid: uuid(),
      creator: gqlCtx?.user,
    });
  }

  async updateZan(id: string, args: UpdateZanInput, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    if (isOneField(args, 'status')) {
      return commonUpdate({ repository: this.zanRepository, CLS_NAME, id, args });
    }

    return commonUpdate({ repository: this.zanRepository, CLS_NAME, id, args });
  }

  async deleteZan(id: string, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    return commonDelete({ repository: this.zanRepository, CLS_NAME, id });
  }

  async likeZan(id: string, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    let zan = await this.zanRepository.findOne({ id }, { relations: ['users'] });

    if (!zan) throw errorMessage({ t: ['_error:notFoundItem'], gqlCtx });

    if (!gqlCtx?.user) throw errorMessage({ t: ['_error:notFoundAuth'], gqlCtx, statusCode: 401 });

    if (gqlCtx?.user && !zan.users?.map((u) => u.id).includes(gqlCtx?.user?.id)) {
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

  async deleteZanUser(id: string, userId: string, gqlCtx?: IGqlCtx): Promise<Zan | undefined> {
    if (!userId) throw errorMessage({ t: ['_error:notFoundUser'], gqlCtx });

    let zan = await this.zanRepository.findOne({ id }, { relations: ['users'] });

    if (!zan) throw errorMessage({ t: ['_error:notFoundItem'], gqlCtx });
    if (!zan.users || zan.users.length <= 0 || !zan.users?.map((u) => u.id).includes(userId)) {
      throw errorMessage({ t: ['_error:notFoundUser'], gqlCtx });
    }

    // @ts-ignore
    zan.users = zan.users.filter((u) => u.id !== userId);

    zan = await this.zanRepository.save({
      ...zan,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      current_zan_quantity: zan.users!.length,
    });

    return zan;
  }
}
