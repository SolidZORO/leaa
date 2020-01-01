import fs from 'fs';
import xss from 'xss';
import mkdirp from 'mkdirp';
import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Division, User } from '@leaa/common/src/entrys';
import {
  DivisionsArgs,
  DivisionsWithPaginationObject,
  DivisionArgs,
  UpdateDivisionInput,
  CreateDivisionInput,
} from '@leaa/common/src/dtos/division';
import { argsUtil, paginationUtil, curdUtil, loggerUtil } from '@leaa/api/src/utils';
import { SyncTagsToFileObject } from '@leaa/common/src/dtos/tag';
import { divisionConfig } from '@leaa/api/src/configs';

const CLS_NAME = 'DivisionService';

type IDivisionsArgs = DivisionsArgs & FindOneOptions<Division>;
type IDivisionArgs = DivisionArgs & FindOneOptions<Division>;

@Injectable()
export class DivisionService {
  constructor(@InjectRepository(Division) private readonly divisionRepository: Repository<Division>) {}

  async divisions(args: IDivisionsArgs, user?: User): Promise<DivisionsWithPaginationObject> {
    const nextArgs: IDivisionsArgs = argsUtil.format(args);

    const PRIMARY_TABLE = 'divisions';
    const qb = await this.divisionRepository.createQueryBuilder(PRIMARY_TABLE);

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async division(id: number, args?: IDivisionArgs, user?: User): Promise<Division | undefined> {
    let nextArgs: IDivisionArgs = {};

    if (args) {
      nextArgs = args;
    }

    return this.divisionRepository.findOne(id, nextArgs);
  }

  async syncDivisionToFile(): Promise<SyncTagsToFileObject> {
    if (!fs.existsSync(divisionConfig.DIVISION_OF_CHINA_FILE_PATH)) {
      loggerUtil.log(`syncDivisionToFile, not exists ${divisionConfig.DIVISION_OF_CHINA_FILE_PATH}`, CLS_NAME);

      mkdirp(divisionConfig.DIVISION_DIR, err =>
        loggerUtil.log(`syncTagsToDictFile, mkdirp ${divisionConfig.DIVISION_DIR} ${JSON.stringify(err)}`, CLS_NAME),
      );
    }

    // const [items, total] = await this.tagRepository.findAndCount({ select: ['name'] });

    // if (total) {
    //   fs.writeFileSync(divisionConfig.TAGS_DICT_PATH, items.map(item => item.name).join('\n'));
    // }

    // loggerUtil.log(`syncTagsToDictFile, ${total} tags`, CLS_NAME);

    return {
      // status: `Synced ${total} Tags`,
      status: 'Synced',
    };
  }

  async createDivision(args: CreateDivisionInput): Promise<Division | undefined> {
    const relationArgs = {};

    return this.divisionRepository.save({ ...args, ...relationArgs });
  }

  async updateDivision(id: number, args: UpdateDivisionInput): Promise<Division | undefined> {
    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.divisionRepository, CLS_NAME, id, args);

    const nextArgs = {
      ...args,
    };

    return curdUtil.commonUpdate(this.divisionRepository, CLS_NAME, id, nextArgs);
  }

  async deleteDivision(id: number): Promise<Division | undefined> {
    return curdUtil.commonDelete(this.divisionRepository, CLS_NAME, id);
  }
}
