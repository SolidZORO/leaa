import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Ax } from '@leaa/common/entrys';
import { AxsArgs, AxsWithPaginationObject, AxArgs, CreateAxInput, UpdateAxInput } from '@leaa/common/dtos/ax';
import { BaseService } from '@leaa/api/modules/base/base.service';
import { formatUtil } from '@leaa/api/utils';

// const CONSTRUCTOR_NAME = 'AxService';

@Injectable()
export class AxService extends BaseService<Ax, AxsArgs, AxsWithPaginationObject, AxArgs, CreateAxInput, UpdateAxInput> {
  constructor(@InjectRepository(Ax) private readonly axRepository: Repository<Ax>) {
    super(axRepository);
  }

  async axs(args: AxsArgs): Promise<AxsWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    if (nextArgs.q) {
      const qLike = Like(`%${nextArgs.q}%`);

      nextArgs.where = [{ slug: qLike }, { title: qLike }];
    }

    const [items, total] = await this.axRepository.findAndCount(nextArgs);

    return {
      items,
      total,
      page: nextArgs.page || 1,
      pageSize: nextArgs.pageSize || 30,
    };
  }

  async ax(id: number, args?: AxArgs & FindOneOptions<Ax>): Promise<Ax | undefined> {
    let nextArgs: FindOneOptions<Ax> = {};

    if (args) {
      nextArgs = args;
    }

    return this.findOne(id, nextArgs);
  }

  async craeteAx(args: CreateAxInput): Promise<Ax | undefined> {
    return this.axRepository.save({ ...args });
  }

  async updateAx(id: number, args: UpdateAxInput): Promise<Ax | undefined> {
    return this.update(id, args);
  }

  async deleteAx(id: number): Promise<Ax | undefined> {
    return this.delete(id);
  }
}
