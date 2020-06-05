import { FindOneOptions } from 'typeorm';
import { ArticleGetManyReq, ArticleGetOneReq } from '@leaa/api/src/dtos/article';
import { Article } from '@leaa/api/src/entrys';

export type IArticlesArgs = ArticleGetManyReq & FindOneOptions<Article>;
export type IArticleArgs = ArticleGetOneReq & FindOneOptions<Article>;
