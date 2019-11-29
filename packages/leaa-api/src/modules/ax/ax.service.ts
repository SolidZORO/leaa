import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Ax, User } from '@leaa/common/src/entrys';
import { AxsArgs, AxsWithPaginationObject, AxArgs, CreateAxInput, UpdateAxInput } from '@leaa/common/src/dtos/ax';
import { formatUtil, loggerUtil, authUtil, curdUtil, paginationUtil } from '@leaa/api/src/utils';

const CONSTRUCTOR_NAME = 'AxService';

@Injectable()
export class AxService {
  constructor(@InjectRepository(Ax) private readonly axRepository: Repository<Ax>) {}

  async axs(args: AxsArgs, user?: User): Promise<AxsWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    const qb = getRepository(Ax).createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'created_at', nextArgs.orderSort);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['title', 'slug'].forEach(q => {
        qb.orWhere(`${aliasName}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
      });
    }

    if (!user || (user && !authUtil.hasPermission(user, 'attachment.list'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async ax(id: number, args?: AxArgs & FindOneOptions<Ax>, user?: User): Promise<Ax | undefined> {
    let nextArgs: FindOneOptions<Ax> = {};

    if (args) {
      nextArgs = args;
    }

    const whereQuery: { id: number; status?: number } = { id };

    if (!user || (user && !authUtil.hasPermission(user, 'attachment.list'))) {
      whereQuery.status = 1;
    }

    return this.axRepository.findOne({
      ...nextArgs,
      where: whereQuery,
    });
  }

  async axBySlug(slug: string, args?: AxArgs & FindOneOptions<Ax>, user?: User): Promise<Ax | undefined> {
    const ax = await this.axRepository.findOne({ where: { slug } });

    if (!ax) {
      const message = 'not found ax';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return undefined;
    }

    return this.ax(ax.id, args, user);
  }

  async createAx(args: CreateAxInput): Promise<Ax | undefined> {
    return this.axRepository.save({ ...args });
  }

  async updateAx(id: number, args: UpdateAxInput): Promise<Ax | undefined> {
    return curdUtil.commonUpdate(this.axRepository, CONSTRUCTOR_NAME, id, args);
  }

  async deleteAx(id: number): Promise<Ax | undefined> {
    return curdUtil.commonDelete(this.axRepository, CONSTRUCTOR_NAME, id);
  }
}
