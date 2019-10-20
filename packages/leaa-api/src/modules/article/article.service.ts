import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Article, Category, Tag } from '@leaa/common/src/entrys';
import {
  ArticlesArgs,
  ArticlesWithPaginationObject,
  ArticleArgs,
  CreateArticleInput,
  UpdateArticleInput,
} from '@leaa/common/src/dtos/article';
import { formatUtil, paginationUtil, curdUtil, stringUtil } from '@leaa/api/src/utils';

const CONSTRUCTOR_NAME = 'ArticleService';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async articles(args: ArticlesArgs): Promise<ArticlesWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    nextArgs.relations = ['tags'];

    if (nextArgs.q) {
      const qLike = Like(`%${nextArgs.q}%`);

      nextArgs.where = [{ slug: qLike }, { title: qLike }];
    }

    const [items, total] = await this.articleRepository.findAndCount(nextArgs);

    return paginationUtil.calcPageInfo({ items, total, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async article(id: number, args?: ArticleArgs & FindOneOptions<Article>): Promise<Article | undefined> {
    let nextArgs: FindOneOptions<Article> = {};

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['tags'];
    }

    return this.articleRepository.findOne(id, nextArgs);
  }

  async createArticle(args: CreateArticleInput): Promise<Article | undefined> {
    return this.articleRepository.save({ ...args });
  }

  async updateArticle(id: number, args: UpdateArticleInput): Promise<Article | undefined> {
    const relationArgs: { tags?: Tag[] } = {};

    const trimSlug = args.slug ? args.slug.trim().toLowerCase() : args.slug;
    const trimDescription = args.description ? args.description.trim() : args.description;

    let tagObjects;

    if (args.tagIds) {
      tagObjects = await this.tagRepository.findByIds(args.tagIds);
    }

    relationArgs.tags = tagObjects;

    const nextArgs = {
      ...args,
      slug: !args.slug && args.title ? stringUtil.getSlug(args.title) : trimSlug,
      description: trimDescription,
    };

    return curdUtil.commonUpdate(this.articleRepository, CONSTRUCTOR_NAME, id, nextArgs, relationArgs);
  }

  async deleteArticle(id: number): Promise<Article | undefined> {
    return curdUtil.commonDelete(this.articleRepository, CONSTRUCTOR_NAME, id);
  }
}
