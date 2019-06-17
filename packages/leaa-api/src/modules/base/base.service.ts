import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral, FindConditions, FindOneOptions } from 'typeorm';

import { formatUtil, loggerUtil } from '@leaa/api/utils';

//
// Base Service C U R D Class
// --------------------------
@Injectable()
export abstract class BaseService<Entity, ItemsArgs, ItemsObject, ItemArgs, CreateItemInput, UpdateItemInput> {
  protected constructor(private readonly repository: Repository<Entity>) {}

  //
  // R items
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

  //
  // R item
  // --------------------
  async findOne(id: number, args?: ItemArgs & FindOneOptions<Entity>): Promise<Entity | undefined> {
    const item = await this.repository.findOne(id, args);

    if (!item) {
      const message = `item ${id} does not exist`;

      loggerUtil.warn(message, this.constructor.name);
      throw new Error(message);
    }

    return item;
  }

  //
  // C item
  // --------------------
  async create(args: CreateItemInput): Promise<Entity | undefined> {
    return this.repository.save({ ...args });
  }

  //
  // U item
  // --------------------
  async update(
    id: number,
    args?: UpdateItemInput & FindOneOptions,
    relationArgs: any = {},
  ): Promise<Entity | undefined> {
    if (!args) {
      const message = `update item ${id} args does not exist`;

      loggerUtil.warn(message, this.constructor.name);
      throw new Error(message);
    }

    let prevItem = await this.repository.findOne(id, args.relations ? { relations: args.relations } : undefined);

    if (!prevItem) {
      const message = `update item ${id} does not exist`;

      loggerUtil.warn(message, this.constructor.name);
      throw new Error(message);
    }

    prevItem = {
      ...prevItem,
      ...args,
      ...relationArgs,
    };

    // @ts-ignore
    const nextItem = await this.repository.save(prevItem);

    loggerUtil.updateLog({ id, prevItem, nextItem, constructorName: this.constructor.name });

    return nextItem;
  }

  //
  // D item
  // --------------------
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
