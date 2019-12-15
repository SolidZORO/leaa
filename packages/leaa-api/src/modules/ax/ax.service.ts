import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Ax, User } from '@leaa/common/src/entrys';
import { AxsArgs, AxsWithPaginationObject, AxArgs, CreateAxInput, UpdateAxInput } from '@leaa/common/src/dtos/ax';
import { argsUtil, authUtil, curdUtil, paginationUtil, errorUtil } from '@leaa/api/src/utils';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { axSeed } from '@leaa/api/src/modules/seed/seed.data';

type IAxsArgs = AxsArgs & FindOneOptions<Ax>;
type IAxArgs = AxArgs & FindOneOptions<Ax>;

const CLS_NAME = 'AxService';

@Injectable()
export class AxService {
  constructor(
    @InjectRepository(Ax) private readonly axRepository: Repository<Ax>,
    private readonly configService: ConfigService,
  ) {}

  async PLEASE_DONT_MODIFY_DEMO_DATA(id?: number, user?: User): Promise<boolean> {
    if (this.configService.DEMO_MODE && !process.argv.includes('--nuke')) {
      if (!id) return true;

      const ax = await this.ax(id, user);

      if (ax && ax.slug && axSeed.map(seed => seed.slug).includes(ax.slug)) {
        throw errorUtil.ERROR({ error: 'PLEASE DONT MODIFY DEMO DATA', user });
      }
    }

    return true;
  }

  async axs(args: IAxsArgs, user?: User): Promise<AxsWithPaginationObject> {
    const nextArgs = argsUtil.format(args);

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
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id);

    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.axRepository, CLS_NAME, id, args);

    return curdUtil.commonUpdate(this.axRepository, CLS_NAME, id, args);
  }

  async deleteAx(id: number): Promise<Ax | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id);

    return curdUtil.commonDelete(this.axRepository, CLS_NAME, id);
  }
}
