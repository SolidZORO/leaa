import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Article, User, Category } from '@leaa/common/entrys';
import {
  ArticlesArgs,
  ArticlesObject,
  ArticleArgs,
  CreateArticleInput,
  UpdateArticleInput,
} from '@leaa/common/dtos/article';
import { BaseService } from '@leaa/api/modules/base/base.service';
import { formatUtil } from '@leaa/api/utils';

// const CONSTRUCTOR_NAME = 'ArticleService';

@Injectable()
export class ArticleService extends BaseService<
  Article,
  ArticlesArgs,
  ArticlesObject,
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

    if (!nextArticle || !nextArticle.categoryId) {
      return undefined;
    }

    return this.categoryRepository.findOne(article.id);
  }

  async articles(args: ArticlesArgs): Promise<ArticlesObject> {
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
    return this.update(id, args);
  }

  async deleteArticle(id: number): Promise<Article | undefined> {
    return this.delete(id);
  }
}
