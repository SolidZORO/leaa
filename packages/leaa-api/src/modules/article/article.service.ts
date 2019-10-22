import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Article, Category, Tag } from '@leaa/common/src/entrys';
import {
  ArticlesArgs,
  ArticlesWithPaginationObject,
  ArticleArgs,
  CreateArticleInput,
  UpdateArticleInput,
} from '@leaa/common/src/dtos/article';
import { formatUtil, paginationUtil, curdUtil, stringUtil, loggerUtil } from '@leaa/api/src/utils';

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

    const qb = await this.articleRepository.createQueryBuilder('article');

    // relations
    qb.leftJoinAndSelect('article.categories', 'categories');
    qb.leftJoinAndSelect('article.tags', 'tags');

    if (nextArgs.q) {
      const qLike = `%${nextArgs.q}%`;

      console.log(qLike);
      qb.andWhere('article.title LIKE :title', { title: qLike });
      qb.andWhere('article.slug LIKE :slug', { slug: qLike });
    }

    if (nextArgs.tagName) {
      qb.andWhere('tags.name IN (:...tagName)', { tagName: nextArgs.tagName });
    }

    if (nextArgs.categoryName) {
      qb.andWhere('categories.name IN (:...categoryName)', { categoryName: nextArgs.categoryName });
    }

    if (nextArgs.categoryId) {
      qb.andWhere('categories.id IN (:...categoryId)', { categoryId: nextArgs.categoryId });
    }

    const [items, total] = await qb.getManyAndCount();

    return paginationUtil.calcPageInfo({ items, total, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async article(id: number, args?: ArticleArgs & FindOneOptions<Article>): Promise<Article | undefined> {
    let nextArgs: FindOneOptions<Article> = {};

    if (args) {
      nextArgs = args;
      nextArgs.relations = ['tags', 'categories'];
    }

    return this.articleRepository.findOne(id, nextArgs);
  }

  async articleBySlug(slug: string, args?: ArticleArgs & FindOneOptions<Article>): Promise<Article | undefined> {
    const article = await this.articleRepository.findOne({ where: { slug } });

    if (!article) {
      const message = 'not found article';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return undefined;
    }

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
    const relationArgs: { tags?: Tag[]; categories?: Category[] } = {};

    const trimSlug = args.slug ? args.slug.trim().toLowerCase() : args.slug;
    const trimDescription = args.description ? args.description.trim() : args.description;

    // tags
    let tagObjects;
    if (args.tagIds) {
      tagObjects = await this.tagRepository.findByIds(args.tagIds);
    }
    relationArgs.tags = tagObjects;

    // category
    let categoryObjects;
    if (args.categoryIds) {
      categoryObjects = await this.categoryRepository.findByIds(args.categoryIds);
    }
    relationArgs.categories = categoryObjects;

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
