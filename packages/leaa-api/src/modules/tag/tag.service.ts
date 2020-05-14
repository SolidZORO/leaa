import fs from 'fs';
import xss from 'xss';
import mkdirp from 'mkdirp';
import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Tag } from '@leaa/common/src/entrys';
import {
  TagsWithPaginationObject,
  CreateTagInput,
  UpdateTagInput,
  SyncTagsToFileObject,
} from '@leaa/common/src/dtos/tag';

import {
  argsFormat,
  commonUpdate,
  commonDelete,
  isOneField,
  calcQbPageInfo,
  logger,
  errorMsg,
} from '@leaa/api/src/utils';
import { ITagsArgs, ITagArgs, IGqlCtx } from '@leaa/api/src/interfaces';
import { dictConfig } from '@leaa/api/src/configs';

const CLS_NAME = 'TagService';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {}

  async tags(args: ITagsArgs): Promise<TagsWithPaginationObject> {
    const nextArgs = argsFormat(args, gqlCtx);

    const qb = this.tagRepository.createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'created_at', nextArgs.orderSort);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['name'].forEach((q) => {
        qb.orWhere(`${aliasName}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
      });
    }

    return calcQbPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async tag(id: string, args?: ITagArgs): Promise<Tag | undefined> {
    const { t } = gqlCtx;

    if (!id) throw errorMsg(t('_error:notFoundId'), { gqlCtx });

    let nextArgs: ITagArgs = {};
    if (args) nextArgs = args;

    const tag = this.tagRepository.findOne(id, nextArgs);
    if (!tag) throw errorMsg(t('_error:notFoundItem'), { gqlCtx });

    return tag;
  }

  async tagByName(name: string, args?: ITagArgs): Promise<Tag | undefined> {
    const tag = await this.tagRepository.findOne({ where: { name } });
    if (!tag) return undefined;

    return this.tag(gqlCtx, tag.id, args);
  }

  formatTag(str: string): string {
    if (str) {
      return xss.filterXSS(str.trim().replace(/\s/g, '-'));
    }

    return '';
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

    const [items, total] = await this.tagRepository.findAndCount({ select: ['name'] });

    if (total) {
      fs.writeFileSync(dictConfig.TAGS_DICT_PATH, items.map((item) => item.name).join('\n'));
    }

    logger.log(`syncTagsToDictFile, ${total} tags`, CLS_NAME);

    return {
      status: `Synced ${total} Tags`,
    };
  }

  async createTag(args: CreateTagInput): Promise<Tag | undefined> {
    const tag = await this.tagByName(gqlCtx, args.name);

    if (tag) return tag;

    const nextArgs = { ...args, name: this.formatTag(args.name) };

    return this.tagRepository.save({ ...nextArgs });
  }

  async createTags(tagNames: string[]): Promise<Tag[] | undefined> {
    let tags: Tag[] = [];
    const batchUpdatePromise: Promise<any>[] = [];

    await tagNames.forEach((tagName) => {
      batchUpdatePromise.push(this.createTag(gqlCtx, { name: tagName }));
    });

    await Promise.all(batchUpdatePromise)
      .then((data) => {
        tags = data;
      })
      .catch(() => {
        logger.error(`Create Tags Faild: ${JSON.stringify(tags)}`, CLS_NAME);
      });

    return tags;
  }

  async updateTag(id: string, args: UpdateTagInput): Promise<Tag | undefined> {
    if (isOneField(args, 'status')) return commonUpdate({ repository: this.tagRepository, CLS_NAME, id, args, gqlCtx });

    let nextArgs: UpdateTagInput = args;

    if (args.name) {
      nextArgs = { ...args, name: this.formatTag(args.name) };
    }

    return commonUpdate({ repository: this.tagRepository, CLS_NAME, id, args: nextArgs, gqlCtx });
  }

  async deleteTag(id: string): Promise<Tag | undefined> {
    return commonDelete({ repository: this.tagRepository, CLS_NAME, id, gqlCtx });
  }
}
