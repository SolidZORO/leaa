import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Action } from '@leaa/common/src/entrys';
import { IActionsArgs, IActionArgs, IGqlCtx } from '@leaa/api/src/interfaces';
import { ActionsWithPaginationObject, CreateActionInput, UpdateActionInput } from '@leaa/common/src/dtos/action';
import { argsFormat, calcQbPageInfo, commonDelete, commonUpdate, errorMsg } from '@leaa/api/src/utils';

const CLS_NAME = 'ActionService';

@Injectable()
export class ActionService {
  constructor(@InjectRepository(Action) private readonly actionRepository: Repository<Action>) {}

  async actions(gqlCtx: IGqlCtx, args: IActionsArgs): Promise<ActionsWithPaginationObject> {
    const nextArgs: IActionsArgs = argsFormat(args, gqlCtx);

    const PRIMARY_TABLE = 'actions';
    const qb = await this.actionRepository.createQueryBuilder(PRIMARY_TABLE);

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['title', 'slug'].forEach((key) => {
        qb.orWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // order
    if (nextArgs.orderBy && nextArgs.orderSort) {
      qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
    }

    return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async action(gqlCtx: IGqlCtx, id: number, args?: IActionArgs): Promise<Action | undefined> {
    const { t } = gqlCtx;

    if (!id) throw errorMsg(t('_error:notFoundId'), { gqlCtx });

    let nextArgs: IActionArgs = {};
    if (args) nextArgs = args;

    return this.actionRepository.findOneOrFail(id, nextArgs);
  }

  async createAction(gqlCtx: IGqlCtx, args: CreateActionInput): Promise<Action | undefined> {
    return this.actionRepository.save(args);
  }

  async updateAction(gqlCtx: IGqlCtx, id: number, args: UpdateActionInput): Promise<Action | undefined> {
    return commonUpdate({
      repository: this.actionRepository,
      CLS_NAME,
      id,
      args,
      gqlCtx,
    });
  }

  async deleteAction(gqlCtx: IGqlCtx, id: string): Promise<Action | undefined> {
    return commonDelete({ repository: this.actionRepository, CLS_NAME, id, gqlCtx });
  }
}
