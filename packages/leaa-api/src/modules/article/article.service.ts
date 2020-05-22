import _ from 'lodash';
import moment from 'moment';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CrudRequest } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { plainToClass } from 'class-transformer';

import { Article, Tag, Category } from '@leaa/common/src/entrys';
import { UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { TagService } from '@leaa/api/src/modules/tag/tag.service';
import { formatHtmlToText, cutTags } from '@leaa/api/src/utils';

export interface ITransIdsToEntrys {
  dto: any;
  toSave: any;
  idField: any;
  saveField: string;
  repo: any;
}

@Injectable()
export class ArticleService extends TypeOrmCrudService<Article> {
  constructor(
    @InjectRepository(Article) private readonly articleRepo: Repository<Article>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    private readonly tagService: TagService,
  ) {
    super(articleRepo);
  }

  async updateOne(req: CrudRequest, dto: UpdateArticleInput): Promise<Article> {
    const { allowParamsOverride, returnShallow } = req.options.routes?.updateOneBase || {};

    const paramsFilters = this.getParamFilters(req.parsed);
    const found = await this.getOneOrFail(req, returnShallow);
    const toSave = !allowParamsOverride
      ? { ...found, ...dto, ...paramsFilters, ...req.parsed.authPersist }
      : { ...found, ...dto, ...req.parsed.authPersist };

    await this.formatRelationIdsToSave({
      dto,
      toSave,
      idField: 'categoryIds',
      saveField: 'categories',
      repo: this.categoryRepo,
    });
    await this.formatRelationIdsToSave({ dto, toSave, idField: 'tagIds', saveField: 'tags', repo: this.tagRepo });

    // // auto add tag from article content (by jieba)
    // if (dto.content && (!dto.tagIds || (dto.tagIds && dto.tagIds.length === 0))) {
    //   const allText = formatHtmlToText(dto.content, dto.title);
    //
    //
    //   console.log(cutTags(allText));
    //
    //   // batch create tags
    //   toSave.tags = await this.tagService.createTags(cutTags(allText));
    //
    //   // ⚠️ sync tags
    //   // execute only once when the article has no tag, reducing server pressure
    //   await this.tagService.syncTagsToDictFile();
    // }

    const updated = await this.repo.save(plainToClass(this.entityType, toSave));

    if (returnShallow) return updated;

    req.parsed.paramsFilter.forEach((filter) => {
      // eslint-disable-next-line no-param-reassign
      filter.value = (updated as any)[filter.field];
    });

    return this.getOneOrFail(req);
  }

  //
  //

  async formatRelationIdsToSave({ dto, toSave, idField, saveField, repo }: ITransIdsToEntrys) {
    const dtoIds: any = dto[idField];

    /* eslint-disable no-param-reassign */

    if (dtoIds === null) toSave[saveField] = [];

    if (dtoIds && dtoIds.length) {
      const items = await repo.findByIds(dtoIds);

      // 如果 relation 有更新，item 的时间也会更新
      if (!_.isEmpty(items) && !_.isEqual(items, toSave[saveField])) {
        toSave[saveField] = items;
        toSave.updated_at = moment().toDate();
      }
    }

    /* eslint-enable */
  }
}
