import { FindOneOptions } from 'typeorm';
import { ArticleGetManyReq, ArticleGetOneReq } from '@leaa/common/src/dtos/article';
import { Article } from '@leaa/common/src/entrys';

export type IArticlesArgs = ArticleGetManyReq & FindOneOptions<Article>;
export type IArticleArgs = ArticleGetOneReq & FindOneOptions<Article>;
