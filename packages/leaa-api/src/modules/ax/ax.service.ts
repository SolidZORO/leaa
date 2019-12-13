import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Ax, User } from '@leaa/common/src/entrys';
import { AxsArgs, AxsWithPaginationObject, AxArgs, CreateAxInput, UpdateAxInput } from '@leaa/common/src/dtos/ax';
import { formatUtil, authUtil, curdUtil, paginationUtil, errorUtil } from '@leaa/api/src/utils';

type IAxsArgs = AxsArgs & FindOneOptions<Ax>;
type IAxArgs = AxArgs & FindOneOptions<Ax>;

const CLS_NAME = 'AxService';

@Injectable()
export class AxService {
  constructor(@InjectRepository(Ax) private readonly axRepository: Repository<Ax>) {}

  async axs(args: IAxsArgs, user?: User): Promise<AxsWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    const qb = this.axRepository.createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'created_at', nextArgs.orderSort);

    // q
    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['title', 'slug'].forEach(key => {
        qb.orWhere(`${aliasName}.${key} = :${key}`, { [key]: `${nextArgs.q}` });
      });
    }

    // can
    if (!(user && authUtil.can(user, 'ax.list-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async ax(id: number, args?: IAxArgs, user?: User): Promise<Ax | undefined> {
    let nextArgs: IAxArgs = {};
    if (args) nextArgs = args;

    const whereQuery: { id: number; status?: number } = { id };

    // can
    if (!(user && authUtil.can(user, 'ax.item-read--all-status'))) {
      whereQuery.status = 1;
    }

    const ax = await this.axRepository.findOne({ ...nextArgs, where: whereQuery });
    if (!ax) return errorUtil.NOT_FOUND({ user });

    return ax;
  }

  async axBySlug(slug: string, args?: IAxArgs, user?: User): Promise<Ax | undefined> {
    const ax = await this.axRepository.findOne({ where: { slug } });
    if (!ax) return errorUtil.NOT_FOUND({ user });

    return this.ax(ax.id, args, user);
  }

  async createAx(args: CreateAxInput): Promise<Ax | undefined> {
    return this.axRepository.save({ ...args });
  }

  async updateAx(id: number, args: UpdateAxInput): Promise<Ax | undefined> {
    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.axRepository, CLS_NAME, id, args);

    return curdUtil.commonUpdate(this.axRepository, CLS_NAME, id, args);
  }

  async deleteAx(id: number): Promise<Ax | undefined> {
    return curdUtil.commonDelete(this.axRepository, CLS_NAME, id);
  }
}
