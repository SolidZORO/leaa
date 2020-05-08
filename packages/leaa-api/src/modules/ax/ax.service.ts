import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Ax } from '@leaa/common/src/entrys';
import { AxsWithPaginationObject, CreateAxInput, UpdateAxInput } from '@leaa/common/src/dtos/ax';
import {
  argsFormat,
  can,
  commonUpdate,
  commonDelete,
  isOneField,
  calcQbPageInfo,
  errorMessage,
} from '@leaa/api/src/utils';
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

  async PLEASE_DONT_MODIFY_DEMO_DATA(id?: string, gqlCtx?: IGqlCtx): Promise<boolean> {
    if (this.configService.DEMO_MODE && !process.argv.includes('--nuke')) {
      if (!id) return true;

      const ax = await this.ax(id, {}, gqlCtx);

      if (ax?.slug && axSeed.map((seed) => seed.slug).includes(ax.slug)) {
        throw errorMessage({ t: ['_error:pleaseDontModify'], gqlCtx });
      }
    }

    return true;
  }

  async axs(args: IAxsArgs, gqlCtx?: IGqlCtx): Promise<AxsWithPaginationObject> {
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

  async ax(id: string, args?: IAxArgs, gqlCtx?: IGqlCtx): Promise<Ax | undefined> {
    if (!id) throw errorMessage({ t: ['_error:notFoundId'], gqlCtx });

    let nextArgs: IAxArgs = {};
    if (args) nextArgs = args;

    const whereQuery: { id: string; status?: number } = { id };

    // can
    if (!gqlCtx?.user || (gqlCtx.user && !can(gqlCtx.user, 'ax.item-read--all-status'))) {
      whereQuery.status = 1;
    }

    const ax = await this.axRepository.findOne({ ...nextArgs, where: whereQuery });
    if (!ax) throw errorMessage({ t: ['_error:notFoundItem'], gqlCtx });

    return ax;
  }

  async axBySlug(slug: string, args?: IAxArgs, gqlCtx?: IGqlCtx): Promise<Ax | undefined> {
    const ax = await this.axRepository.findOne({ where: { slug } });
    if (!ax) throw errorMessage({ t: ['_error:notFoundItem'], gqlCtx });

    return this.ax(ax.id, args, gqlCtx);
  }

  async createAx(args: CreateAxInput, gqlCtx?: IGqlCtx): Promise<Ax | undefined> {
    return this.axRepository.save({ ...args });
  }

  async updateAx(id: string, args: UpdateAxInput, gqlCtx?: IGqlCtx): Promise<Ax | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id, gqlCtx);

    if (isOneField(args, 'status')) {
      return commonUpdate({ repository: this.axRepository, CLS_NAME, id, args });
    }

    return commonUpdate({ repository: this.axRepository, CLS_NAME, id, args });
  }

  async deleteAx(id: string, gqlCtx?: IGqlCtx): Promise<Ax | undefined> {
    if (this.configService.DEMO_MODE) await this.PLEASE_DONT_MODIFY_DEMO_DATA(id, gqlCtx);

    return commonDelete({ repository: this.axRepository, CLS_NAME, id });
  }
}
