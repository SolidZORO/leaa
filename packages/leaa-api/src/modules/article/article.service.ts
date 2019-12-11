import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Article, Category, Tag, User } from '@leaa/common/src/entrys';
import {
  ArticlesArgs,
  ArticlesWithPaginationObject,
  ArticleArgs,
  CreateArticleInput,
  UpdateArticleInput,
} from '@leaa/common/src/dtos/article';
import { formatUtil, paginationUtil, curdUtil, stringUtil, dictUtil, errorUtil, authUtil } from '@leaa/api/src/utils';

import { TagService } from '@leaa/api/src/modules/tag/tag.service';

const CLS_NAME = 'ArticleService';

type IArticlesArgs = ArticlesArgs & FindOneOptions<Article>;
type IArticleArgs = ArticleArgs & FindOneOptions<Article>;

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    private readonly tagService: TagService,
  ) {}

  async articles(args: IArticlesArgs, user?: User): Promise<ArticlesWithPaginationObject> {
    const nextArgs: IArticlesArgs = formatUtil.formatArgs(args);

    const PRIMARY_TABLE = 'articles';
    const qb = await this.articleRepository.createQueryBuilder(PRIMARY_TABLE);

    // relations
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.categories`, 'categories');
    qb.leftJoinAndSelect(`${PRIMARY_TABLE}.tags`, 'tags');

    // q
    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      ['title', 'slug'].forEach(key => {
        qb.orWhere(`${PRIMARY_TABLE}.${key} LIKE :${key}`, { [key]: qLike });
      });
    }

    // tag
    if (nextArgs.tagName) {
      qb.andWhere('tags.name IN (:...tagName)', { tagName: nextArgs.tagName });
    }

    // category
    if (nextArgs.categoryName) {
      qb.andWhere('categories.name IN (:...categoryName)', { categoryName: nextArgs.categoryName });
    }

    if (nextArgs.categoryId) {
      qb.andWhere('categories.id IN (:...categoryId)', { categoryId: nextArgs.categoryId });
    }

    // order
    qb.orderBy(`${PRIMARY_TABLE}.${nextArgs.orderBy}`, nextArgs.orderSort);

    // can
    if (!user && !(user && authUtil.can(user, 'article.list-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async article(id: number, args?: IArticleArgs, user?: User): Promise<Article | undefined> {
    let nextArgs: IArticleArgs = {};

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['tags', 'categories'];
    }

    // can
    if (!(user && authUtil.can(user, 'article.item-read--all-status'))) {
      nextArgs.where = { status: 1 };
    }

    return this.articleRepository.findOne(id, nextArgs);
  }

  async articleBySlug(slug: string, args?: ArticleArgs & FindOneOptions<Article>): Promise<Article | undefined> {
    const article = await this.articleRepository.findOne({ where: { slug } });
    if (!article) return errorUtil.NOT_FOUND();

    return this.article(article.id, args);
  }

  async createArticle(args: CreateArticleInput): Promise<Article | undefined> {
    const relationArgs: { categories?: Category[] } = {};

    // category
    let categoryObjects;
    if (args.categoryIds) {
      categoryObjects = await this.categoryRepository.findByIds(args.categoryIds);
    }

    relationArgs.categories = categoryObjects;

    return this.articleRepository.save({ ...args, ...relationArgs });
  }

  async updateArticle(id: number, args: UpdateArticleInput): Promise<Article | undefined> {
    if (curdUtil.isOneField(args, 'status')) return curdUtil.commonUpdate(this.articleRepository, CLS_NAME, id, args);

    const relationArgs: { tags?: Tag[]; categories?: Category[] } = {};
    const trimSlug = args.slug ? args.slug.trim().toLowerCase() : args.slug;
    const trimDescription = args.description ? args.description.trim() : args.description;

    // tags
    let tagObjects;
    if (args.tagIds && args.tagIds.length) tagObjects = await this.tagRepository.findByIds(args.tagIds);
    if (args.tagIds === null) tagObjects = [];

    relationArgs.tags = tagObjects;

    // category
    let categoryObjects;
    if (args.categoryIds) {
      categoryObjects = await this.categoryRepository.findByIds(args.categoryIds);
    }
    relationArgs.categories = categoryObjects;

    const nextArgs = {
      ...args,
      slug: !args.slug && args.title ? stringUtil.getSlug(args.title, args.title) : trimSlug,
      description: trimDescription,
    };

    // auto add tag from article content (by jieba)
    if (args.content && (!args.tagIds || (args.tagIds && args.tagIds.length === 0))) {
      const allText = formatUtil.formatHtmlToText(args.content, args.title);

      // batch create tags
      relationArgs.tags = await this.tagService.createTags(dictUtil.cutTags(allText));

      // ⚠️ sync tags
      // execute only once when the article has no tag, reducing server pressure
      await this.tagService.syncTagsToDictFile();
    }

    return curdUtil.commonUpdate(this.articleRepository, CLS_NAME, id, nextArgs, relationArgs);
  }

  async deleteArticle(id: number): Promise<Article | undefined> {
    return curdUtil.commonDelete(this.articleRepository, CLS_NAME, id);
  }
}
