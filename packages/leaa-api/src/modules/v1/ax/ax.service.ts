import _ from 'lodash';
import moment from 'moment';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CrudRequest } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { plainToClass } from 'class-transformer';
import { slugify } from 'transliteration';

import { Ax, Tag, Category } from '@leaa/common/src/entrys';
import { UpdateAxInput, CreateAxInput } from '@leaa/common/src/dtos/ax';
import { TagService } from '@leaa/api/src/modules/v1/tag/tag.service';
import { formatHtmlToText, cutTags } from '@leaa/api/src/utils';

export interface ITransIdsToEntrys {
  dto: any;
  toSave: any;
  idField: any;
  saveField: string;
  repo: any;
}

@Injectable()
export class AxService extends TypeOrmCrudService<Ax> {
  constructor(@InjectRepository(Ax) private readonly axRepo: Repository<Ax>) {
    super(axRepo);
  }

  async updateOne(req: CrudRequest, dto: UpdateAxInput): Promise<Ax> {
    const { allowParamsOverride, returnShallow } = req.options.routes?.updateOneBase || {};

    const paramsFilters = this.getParamFilters(req.parsed);
    const found = await this.getOneOrFail(req, returnShallow);
    const toSave = !allowParamsOverride
      ? { ...found, ...dto, ...paramsFilters, ...req.parsed.authPersist }
      : { ...found, ...dto, ...req.parsed.authPersist };

    const updated = await this.repo.save(plainToClass(this.entityType, toSave));

    if (returnShallow) return updated;

    req.parsed.paramsFilter.forEach((filter) => {
      // eslint-disable-next-line no-param-reassign
      filter.value = (updated as any)[filter.field];
    });

    return this.getOneOrFail(req);
  }

  //

  async getOneBySlug(slug: string): Promise<Ax | undefined> {
    return this.axRepo.findOneOrFail({ where: { slug } });
  }
}
