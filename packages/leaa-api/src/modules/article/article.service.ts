import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Article, Tag, Category } from '@leaa/common/src/entrys';
import { Repository } from 'typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { UpdateArticleInput } from '@leaa/common/src/dtos/article';
import { TagService } from '@leaa/api/src/modules/tag/tag.service';
import { plainToClass } from 'class-transformer';
import moment from 'moment';

export interface ITransIdsToEntrys {
  dto: any;
  toSave: any;
  idName: any;
  sName: string;
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

  async transIdsToEntrys({ dto, toSave, idName, sName, repo }: ITransIdsToEntrys) {
    const dtoIds: any = dto[idName];

    /* eslint-disable no-param-reassign */

    if (dtoIds === null) toSave[sName] = [];
    if (dtoIds && dtoIds.length) {
      const items = await repo.findByIds(dtoIds);

      if (!_.isEmpty(items) && !_.isEqual(items, toSave[sName])) {
        toSave[sName] = items;
        toSave.updated_at = moment().toDate();
      }
    }

    /* eslint-enable */
  }

  async updateOne(req: CrudRequest, dto: UpdateArticleInput): Promise<Article> {
    const { allowParamsOverride, returnShallow } = req.options.routes?.updateOneBase || {};

    const paramsFilters = this.getParamFilters(req.parsed);
    const found = await this.getOneOrFail(req, returnShallow);
    const toSave = !allowParamsOverride
      ? { ...found, ...dto, ...paramsFilters, ...req.parsed.authPersist }
      : { ...found, ...dto, ...req.parsed.authPersist };

    await this.transIdsToEntrys({ dto, toSave, idName: 'categoryIds', sName: 'categories', repo: this.categoryRepo });
    await this.transIdsToEntrys({ dto, toSave, idName: 'tagIds', sName: 'tags', repo: this.tagRepo });

    // // auto add tag from article content (by jieba)
    // if (dto.content && (!dto.tagIds || (dto.tagIds && dto.tagIds.length === 0))) {
    //   const allText = formatHtmlToText(dto.content, dto.title);
    //
    //   // batch create tags
    //   relationArgs.tags = await this.tagService.createTags(gqlCtx, cutTags(allText));
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
}
