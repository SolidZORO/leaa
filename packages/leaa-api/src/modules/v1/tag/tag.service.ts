import fs from 'fs';
import mkdirp from 'mkdirp';
import { Repository, getRepository, getConnection, In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { logger } from '@leaa/api/src/utils';

import { TagSyncToFileRes, TagCreateOneReq } from '@leaa/api/src/dtos/tag';
import { tagConfig } from '@leaa/api/src/configs';

import { Tag } from '@leaa/api/src/entrys';
import { CrudRequest } from '@nestjsx/crud';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';

const CLS_NAME = 'TagService';

@Injectable()
export class TagService extends TypeOrmCrudService<Tag> {
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    private readonly configService: ConfigService,
  ) {
    super(tagRepo);
  }

  async createOne(req: CrudRequest, dto: Tag & TagCreateOneReq): Promise<Tag> {
    const hasTag = await this.tagRepo.findOne({ where: { name: dto.name } });
    if (hasTag) return hasTag;

    return super.createOne(req, dto);
  }

  //
  //

  async createManyByTagName(dto?: { name: string }[]): Promise<Tag[]> {
    if (!dto) return [];

    const tagNames = dto.map((r) => r.name);
    const qb = await getRepository(Tag).createQueryBuilder('tag');

    await qb
      .insert()
      .into(Tag)
      .values(dto)
      .orUpdate({
        conflict_target: ['name'],
        overwrite: ['name'],
      })
      .execute();

    const nextTags = await qb.where('tag.name IN (:tagNames)', { tagNames }).getMany();

    return nextTags || [];
  }

  async syncTagsToDictFile(): Promise<TagSyncToFileRes> {
    if (!this.configService.AUTO_CUT_TAGS) return { message: 'AUTO_CUT_TAGS is Disable' };

    if (!fs.existsSync(tagConfig.TAGS_DICT_PATH)) {
      logger.log(`syncTagsToDictFile, not exists ${tagConfig.DICT_DIR}`, CLS_NAME);

      try {
        mkdirp.sync(tagConfig.DICT_DIR);
      } catch (err) {
        logger.log(`syncTagsToDictFile, mkdirp ${tagConfig.DICT_DIR} ${JSON.stringify(err)}`, CLS_NAME);
        throw Error(err.message);
      }
    }

    const [items, total] = await this.tagRepo.findAndCount({ select: ['name'] });

    if (total) {
      fs.writeFileSync(tagConfig.TAGS_DICT_PATH, items.map((item) => item.name).join('\n'));
    }

    logger.log(`syncTagsToDictFile, ${total} tags`, CLS_NAME);

    return {
      message: `Synced ${total} Tags`,
    };
  }
}
