import fs from 'fs';
import xss from 'xss';
import mkdirp from 'mkdirp';
import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Tag, User } from '@leaa/common/src/entrys';
import {
  TagsArgs,
  TagsWithPaginationObject,
  TagArgs,
  CreateTagInput,
  UpdateTagInput,
  SyncTagsToFileObject,
} from '@leaa/common/src/dtos/tag';

import { argsUtil, curdUtil, paginationUtil, loggerUtil, errorUtil } from '@leaa/api/src/utils';
import { dictConfig } from '@leaa/api/src/configs';

type ITagsArgs = TagsArgs & FindOneOptions<Tag>;
type ITagArgs = TagArgs & FindOneOptions<Tag>;

const CLS_NAME = 'TagService';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {}

  async tags(args: ITagsArgs): Promise<TagsWithPaginationObject> {
    const nextArgs = argsUtil.format(args);

    const qb = this.tagRepository.createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'created_at', nextArgs.orderSort);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['name'].forEach(q => {
        qb.orWhere(`${aliasName}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
      });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async tag(id: number, args?: ITagArgs, user?: User): Promise<Tag | undefined> {
    let nextArgs: ITagArgs = {};
    if (args) nextArgs = args;

    const tag = this.tagRepository.findOne(id, nextArgs);
    if (!tag) return errorUtil.NOT_FOUND({ user });

    return tag;
  }

  async tagByName(name: string, args?: ITagArgs, user?: User): Promise<Tag | undefined> {
    const tag = await this.tagRepository.findOne({ where: { name } });
    if (!tag) return undefined;

    return this.tag(tag.id, args, user);
  }

  formatTag(str: string): string {
    if (str) {
      return xss.filterXSS(str.trim().replace(/\s/g, '-'));
    }

    return '';
  }

  async syncTagsToDictFile(): Promise<SyncTagsToFileObject> {
    if (!fs.existsSync(dictConfig.TAGS_DICT_PATH)) {
      loggerUtil.log(`syncTagsToDictFile, not exists ${dictConfig.DICT_DIR}`, CLS_NAME);

      mkdirp(dictConfig.DICT_DIR, err =>
        loggerUtil.log(`syncTagsToDictFile, mkdirp ${dictConfig.DICT_DIR} ${JSON.stringify(err)}`, CLS_NAME),
      );
    }

    const [items, total] = await this.tagRepository.findAndCount({ select: ['name'] });

    if (total) {
      fs.writeFileSync(dictConfig.TAGS_DICT_PATH, items.map(item => item.name).join('\n'));
    }

    loggerUtil.log(`syncTagsToDictFile, ${total} tags`, CLS_NAME);

    return {
      status: `sync successful ${total} tags`,
    };
  }

  async createTag(args: CreateTagInput): Promise<Tag | undefined> {
    const tag = await this.tagByName(args.name);

    if (tag) return tag;

    const nextArgs = { ...args, name: this.formatTag(args.name) };

    return this.tagRepository.save({ ...nextArgs });
  }

  async createTags(tagNames: string[]): Promise<Tag[] | undefined> {
    let tags: Tag[] = [];
    const batchUpdatePromise: Promise<any>[] = [];

    await tagNames.forEach(tagName => {
      batchUpdatePromise.push(this.createTag({ name: tagName }));
    });

    await Promise.all(batchUpdatePromise)
      .then(data => {
        tags = data;
      })
      .catch(() => {
        loggerUtil.error(`Create Tags Faild: ${JSON.stringify(tags)}`, CLS_NAME);
      });

    return tags;
  }

  async updateTag(id: number, args: UpdateTagInput): Promise<Tag | undefined> {
    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.tagRepository, CLS_NAME, id, args);

    let nextArgs: UpdateTagInput = args;

    if (args.name) {
      nextArgs = { ...args, name: this.formatTag(args.name) };
    }

    return curdUtil.commonUpdate(this.tagRepository, CLS_NAME, id, nextArgs);
  }

  async deleteTag(id: number): Promise<Tag | undefined> {
    return curdUtil.commonDelete(this.tagRepository, CLS_NAME, id);
  }
}
