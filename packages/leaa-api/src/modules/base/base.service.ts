import { diff } from 'jsondiffpatch';
import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral, FindConditions } from 'typeorm';

import { formatUtil, loggerUtil } from '@leaa/api/utils';

@Injectable()
export abstract class BaseService<Entity, ItemsArgs, ItemsObject, ItemArgs, CreateItemInput, UpdateItemInput> {
  protected constructor(private readonly repository: Repository<Entity>) {}

  //
  // Base Service C U R D
  // --------------------
  async findAll(args: ItemsArgs & FindConditions<Entity>): Promise<ItemsObject & ObjectLiteral> {
    const formatArgs = formatUtil.formatArgs(args);
    const [items, total] = await this.repository.findAndCount(formatArgs);

    // @ts-ignore
    return {
      items,
      total,
      page: formatArgs.page || 1,
      pageSize: formatArgs.pageSize || 30,
    };
  }

  async findOne(args: ItemArgs & { id: number }): Promise<Entity | undefined> {
    return this.repository.findOne(args.id);
  }

  async create(args: CreateItemInput): Promise<Entity | undefined> {
    return this.repository.save({ ...args });
  }

  async update(id: number, args: UpdateItemInput): Promise<Entity | undefined> {
    const prevItem = await this.repository.findOne(id);

    if (!prevItem) {
      const message = `update item ${id} does not exist`;

      loggerUtil.warn(message, this.constructor.name);
      throw new Error(message);
    }

    await this.repository
      .createQueryBuilder()
      .update()
      .set({ ...args })
      .where('id = :id', { id })
      .execute();

    const nextItem = await this.repository.findOne(id);

    loggerUtil.log(`update item ${id} successful PREV-ITEM: \n${JSON.stringify(prevItem)}\n\n`, this.constructor.name);
    loggerUtil.log(`update item ${id} successful NEXT-ITEM: \n${JSON.stringify(nextItem)}\n\n`, this.constructor.name);
    loggerUtil.log(`update item ${id} DIFF: ${JSON.stringify(diff(prevItem, nextItem))}`, this.constructor.name);

    return nextItem;
  }

  async delete(id: number): Promise<Entity | undefined> {
    const prevItem = await this.repository.findOne(id);

    if (!prevItem) {
      const message = `delete item ${id} does not exist`;

      loggerUtil.warn(message, this.constructor.name);
      throw new Error(message);
    }

    const nextItem = await this.repository.remove(prevItem);

    if (!nextItem) {
      const message = `delete item ${id} faild`;

      loggerUtil.warn(message, this.constructor.name);
      throw new Error(message);
    }

    loggerUtil.warn(`delete item ${id} successful: ${JSON.stringify(nextItem)}\n\n`, this.constructor.name);

    return nextItem;
  }
}
