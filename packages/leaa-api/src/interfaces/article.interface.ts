import { FindOneOptions } from 'typeorm';
import { ArticlesArgs, ArticleArgs } from '@leaa/common/src/dtos/article';
import { Article } from '@leaa/common/src/entrys';

export type IArticlesArgs = ArticlesArgs & FindOneOptions<Article>;
export type IArticleArgs = ArticleArgs & FindOneOptions<Article>;
