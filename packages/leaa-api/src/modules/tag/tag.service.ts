import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Tag } from '@leaa/common/src/entrys';
import { TagsArgs, TagsWithPaginationObject, TagArgs, CreateTagInput, UpdateTagInput } from '@leaa/common/src/dtos/tag';
import { formatUtil, curdUtil, paginationUtil } from '@leaa/api/src/utils';

const CONSTRUCTOR_NAME = 'TagService';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {}

  async tags(args: TagsArgs): Promise<TagsWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    if (nextArgs.q) {
      const qLike = Like(`%${nextArgs.q}%`);

      nextArgs.where = [{ name: qLike }];
    }

    const [items, total] = await this.tagRepository.findAndCount(nextArgs);

    return paginationUtil.calcPageInfo({ items, total, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async tag(id: number, args?: TagArgs & FindOneOptions<Tag>): Promise<Tag | undefined> {
    let nextArgs: FindOneOptions<Tag> = {};

    if (args) {
      nextArgs = args;
    }

    return this.tagRepository.findOne(id, nextArgs);
  }

  async createTag(args: CreateTagInput): Promise<Tag | undefined> {
    return this.tagRepository.save({ ...args });
  }

  async updateTag(id: number, args: UpdateTagInput): Promise<Tag | undefined> {
    return curdUtil.commonUpdate(this.tagRepository, CONSTRUCTOR_NAME, id, args);
  }

  async deleteTag(id: number): Promise<Tag | undefined> {
    return curdUtil.commonDelete(this.tagRepository, CONSTRUCTOR_NAME, id);
  }
}
