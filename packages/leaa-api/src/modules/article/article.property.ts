import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Article, Category } from '@leaa/common/entrys';

// const CONSTRUCTOR_NAME = 'ArticleProperty';

@Injectable()
export class ArticleProperty {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

  async resolvePropertyCategory(article: Article): Promise<Category | undefined> {
    const nextArticle = article;

    if (!nextArticle || !nextArticle.category_id) {
      return undefined;
    }

    return this.categoryRepository.findOne(article.category_id);
  }
}
