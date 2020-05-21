import fs from 'fs';
import mkdirp from 'mkdirp';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { logger } from '@leaa/api/src/utils';

import { SyncTagsToFileObject } from '@leaa/common/src/dtos/tag';
import { dictConfig } from '@leaa/api/src/configs';

import { Tag } from '@leaa/common/src/entrys';
import { Repository } from 'typeorm';

const CLS_NAME = 'TagService';

@Injectable()
export class TagService extends TypeOrmCrudService<Tag> {
  constructor(@InjectRepository(Tag) private readonly tagRepo: Repository<Tag>) {
    super(tagRepo);
  }

  async syncTagsToDictFile(): Promise<SyncTagsToFileObject> {
    if (!fs.existsSync(dictConfig.TAGS_DICT_PATH)) {
      logger.log(`syncTagsToDictFile, not exists ${dictConfig.DICT_DIR}`, CLS_NAME);

      try {
        mkdirp.sync(dictConfig.DICT_DIR);
      } catch (err) {
        logger.log(`syncTagsToDictFile, mkdirp ${dictConfig.DICT_DIR} ${JSON.stringify(err)}`, CLS_NAME);
        throw Error(err.message);
      }
    }

    const [items, total] = await this.tagRepo.findAndCount({ select: ['name'] });

    if (total) {
      fs.writeFileSync(dictConfig.TAGS_DICT_PATH, items.map((item) => item.name).join('\n'));
    }

    logger.log(`syncTagsToDictFile, ${total} tags`, CLS_NAME);

    return {
      status: `Synced ${total} Tags`,
    };
  }
}
