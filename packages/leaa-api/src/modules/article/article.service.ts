import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Article, Category } from '@leaa/common/src/entrys';
import {
  ArticlesArgs,
  ArticlesWithPaginationObject,
  ArticleArgs,
  CreateArticleInput,
  UpdateArticleInput,
} from '@leaa/common/src/dtos/article';
import { BaseService } from '@leaa/api/src/modules/base/base.service';
import { formatUtil } from '@leaa/api/src/utils';

// const CONSTRUCTOR_NAME = 'ArticleService';

@Injectable()
export class ArticleService extends BaseService<
  Article,
  ArticlesArgs,
  ArticlesWithPaginationObject,
  ArticleArgs,
  CreateArticleInput,
  UpdateArticleInput
> {
  constructor(
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {
    super(articleRepository);
  }

  async getCategory(article: Article): Promise<Category | undefined> {
    const nextArticle = article;

    if (!nextArticle || !nextArticle.category_id) {
      return undefined;
    }

    return this.categoryRepository.findOne(article.category_id);
  }

  async articles(args: ArticlesArgs): Promise<ArticlesWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    if (nextArgs.q) {
      const qLike = Like(`%${nextArgs.q}%`);

      nextArgs.where = [{ slug: qLike }, { title: qLike }];
    }

    const [items, total] = await this.articleRepository.findAndCount(nextArgs);

    return {
      items,
      total,
      page: nextArgs.page || 1,
      pageSize: nextArgs.pageSize || 30,
    };
  }

  async article(id: number, args?: ArticleArgs & FindOneOptions<Article>): Promise<Article | undefined> {
    let nextArgs: FindOneOptions<Article> = {};

    if (args) {
      nextArgs = args;
    }

    return this.findOne(id, nextArgs);
  }

  async craeteArticle(args: CreateArticleInput): Promise<Article | undefined> {
    return this.articleRepository.save({ ...args });
  }

  async updateArticle(id: number, args: UpdateArticleInput): Promise<Article | undefined> {
    const trimSlug = args.slug ? args.slug.trim().toLowerCase() : args.slug;
    const trimDescription = args.description ? args.description.trim() : args.description;

    const nextArgs = {
      ...args,
      slug:
        !args.slug && args.title && /^[\w]/.test(args.title)
          ? args.title
              .trim()
              .replace(/[^\w\-\s]/g, '')
              .replace(/\s/g, '-')
              .toLowerCase()
          : trimSlug,
      description: trimDescription,
    };

    return this.update(id, nextArgs);
  }

  async deleteArticle(id: number): Promise<Article | undefined> {
    return this.delete(id);
  }
}
