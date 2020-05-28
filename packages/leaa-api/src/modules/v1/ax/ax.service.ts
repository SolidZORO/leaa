import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CrudRequest } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Ax, Attachment } from '@leaa/common/src/entrys';
import { UpdateAxInput } from '@leaa/common/src/dtos/ax';

export interface ITransIdsToEntrys {
  dto: any;
  toSave: any;
  idField: any;
  saveField: string;
  repo: any;
}
@Injectable()
export class AxService extends TypeOrmCrudService<Ax> {
  constructor(
    @InjectRepository(Ax) private readonly axRepo: Repository<Ax>,
    @InjectRepository(Attachment) private readonly attachmentRepo: Repository<Attachment>,
  ) {
    super(axRepo);
  }

  async updateOne(req: CrudRequest, dto: UpdateAxInput): Promise<Ax> {
    return super.updateOne(req, dto);
  }

  //

  async getOneBySlug(slug: string): Promise<Ax | undefined> {
    return this.axRepo.findOneOrFail({ where: { slug } });
  }
}
