import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Ax } from '@leaa/common/src/entrys';
import { AxsWithPaginationObject, CreateAxInput, UpdateAxInput } from '@leaa/common/src/dtos/ax';
import { argsFormat, can, commonUpdate, commonDelete, isOneField, calcQbPageInfo, errorMsg } from '@leaa/api/src/utils';
import { IAxsArgs, IAxArgs, IGqlCtx } from '@leaa/api/src/interfaces';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { axSeed } from '@leaa/api/src/modules/seed/seed.data';

const CLS_NAME = 'AxService';

@Injectable()
export class AxService {
  constructor(
    @InjectRepository(Ax) private readonly axRepository: Repository<Ax>,
    private readonly configService: ConfigService,
  ) {}

  async PLEASE_DONT_MODIFY_DEMO_DATA(id?: string): Promise<boolean> {
    const { t } = gqlCtx;

    if (this.configService.DEMO_MODE && !process.argv.includes('--nuke')) {
      if (!id) return true;

      const ax = await this.ax(gqlCtx, id, {});

      if (ax?.slug && axSeed.map((seed) => seed.slug).includes(ax.slug)) {
        throw errorMsg(t('_error:pleaseDontModify'), { gqlCtx });
      }
    }

    return true;
  }

  async axs(args: IAxsArgs): Promise<AxsWithPaginationObject> {
    const nextArgs = argsFormat(args, gqlCtx);

    const qb = this.axRepository.createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'created_at', nextArgs.orderSort);

    // q
    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['title', 'slug'].forEach((key) => {
        qb.orWhere(`${aliasName}.${key} = :${key}`, { [key]: `${nextArgs.q}` });
      });
    }

    // can
    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'ax.list-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async ax(id: string, args?: IAxArgs): Promise<Ax | undefined> {
    const { t } = gqlCtx;

    if (!id) throw errorMsg(t('_error:notFoundId'), { gqlCtx });

    let nextArgs: IAxArgs = {};
    if (args) nextArgs = args;

    const whereQuery: { id: string; status?: number } = { id };

    // can
    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'ax.item-read--all-status'))) {
      whereQuery.status = 1;
    }

    const ax = await this.axRepository.findOne({ ...nextArgs, where: whereQuery });
    if (!ax) throw errorMsg(t('_error:notFoundItem'), { gqlCtx });

    return ax;
  }

  async axBySlug(slug: string, args?: IAxArgs): Promise<Ax | undefined> {
    const { t } = gqlCtx;

    const ax = await this.axRepository.findOne({ where: { slug } });
    if (!ax) throw errorMsg(t('_error:notFoundItem'), { gqlCtx });

    return this.ax(gqlCtx, ax.id, args);
  }

  async createAx(args: CreateAxInput): Promise<Ax | undefined> {
    return this.axRepository.save({ ...args });
  }

  async updateAx(id: string, args: UpdateAxInput): Promise<Ax | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(gqlCtx, id);

    if (isOneField(args, 'status')) {
      return commonUpdate({ repository: this.axRepository, CLS_NAME, id, args, gqlCtx });
    }

    return commonUpdate({ repository: this.axRepository, CLS_NAME, id, args, gqlCtx });
  }

  async deleteAx(id: string): Promise<Ax | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(gqlCtx, id);

    return commonDelete({ repository: this.axRepository, CLS_NAME, id, gqlCtx });
  }
}
