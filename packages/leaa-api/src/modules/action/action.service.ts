import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Action } from '@leaa/common/src/entrys';
import { IActionsArgs, IActionArgs, IGqlCtx, ICrudRequest } from '@leaa/api/src/interfaces';
import { ActionsWithPaginationObject, CreateActionInput, UpdateActionInput } from '@leaa/common/src/dtos/action';
import { argsFormat, calcQbPageInfo, commonDelete, commonUpdate, errorMsg } from '@leaa/api/src/utils';
import { Repository } from 'typeorm';
import { CrudRequest, Override } from '@nestjsx/crud';

@Injectable()
export class ActionService extends TypeOrmCrudService<Action> {
  constructor(@InjectRepository(Action) repo: Repository<Action>) {
    super(repo);
  }

  async logAction(req: ICrudRequest, body: CreateActionInput): Promise<Action | undefined> {
    return this.repo.save(body);
  }

  // @Override()
  // async createOne(req: CrudRequest, dto: CreateActionInput): Promise<Action> {
  //   console.log('>>>>>>>>>>>>', req, dto);
  //
  //   return super.createOne(req, dto);
  // }
}

// const CLS_NAME = 'ActionService';
//
// @Injectable()
// export class ActionService {
//   constructor(@InjectRepository(Action) private readonly actionRepository: Repository<Action>) {}
//
//   // async actions(args: IActionsArgs): Promise<ActionsWithPaginationObject> {
//   //   const nextArgs: IActionsArgs = argsFormat(args, gqlCtx);
//   //
//   //   const PRIMARY_TABLE = 'actions';
//   //   const qb = await this.actionRepository.createQueryBuilder(PRIMARY_TABLE);
//   //
//   //   // q
//   //   if (nextArgs.q) {
//   //     const qLike = `%${nextArgs.q}%`;
//   //
//   //     ['title', 'slug'].forEach((key) => {
//   //       qb.orWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
//   //     });
//   //   }
//   //
//   //   // order
//   //   if (nextArgs.orderBy && nextArgs.orderSort) {
//   //     qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);
//   //   }
//   //
//   //   return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
//   // }
//   //
//   // async action(id: number, args?: IActionArgs): Promise<Action | undefined> {
//   //   const { t } = gqlCtx;
//   //
//   //   if (!id) throw errorMsg(t('_error:notFoundId'), { gqlCtx });
//   //
//   //   let nextArgs: IActionArgs = {};
//   //   if (args) nextArgs = args;
//   //
//   //   return this.actionRepository.findOneOrFail(id, nextArgs);
//   // }
//   //
//   // async createAction(args: CreateActionInput): Promise<Action | undefined> {
//   //   return this.actionRepository.save(args);
//   // }
//   //
//   // async updateAction(id: number, args: UpdateActionInput): Promise<Action | undefined> {
//   //   return commonUpdate({
//   //     repository: this.actionRepository,
//   //     CLS_NAME,
//   //     id,
//   //     args,
//   //     gqlCtx,
//   //   });
//   // }
//   //
//   // async deleteAction(id: string): Promise<Action | undefined> {
//   //   return commonDelete({ repository: this.actionRepository, CLS_NAME, id, gqlCtx });
//   // }
// }
//
//
//
//
//
