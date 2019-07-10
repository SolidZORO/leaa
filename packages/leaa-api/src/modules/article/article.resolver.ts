import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Article } from '@leaa/common/entrys';
import {
  ArticlesArgs,
  ArticlesObject,
  ArticleArgs,
  CreateArticleInput,
  UpdateArticleInput,
} from '@leaa/common/dtos/article';
import { ArticleService } from './article.service';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Query(() => ArticlesObject)
  async articles(@Args() args: ArticlesArgs): Promise<ArticlesObject | undefined> {
    return this.articleService.articles(args);
  }

  @Query(() => Article)
  async article(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: ArticleArgs,
  ): Promise<Article | undefined> {
    return this.articleService.article(id, args);
  }

  @Mutation(() => Article)
  async createArticle(@Args('article') args: CreateArticleInput): Promise<Article | undefined> {
    return this.articleService.craeteArticle(args);
  }

  @Mutation(() => Article)
  async updateArticle(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('article') args: UpdateArticleInput,
  ): Promise<Article | undefined> {
    return this.articleService.updateArticle(id, args);
  }

  @Mutation(() => Article)
  async deleteArticle(@Args({ name: 'id', type: () => Int }) id: number): Promise<Article | undefined> {
    return this.articleService.deleteArticle(id);
  }
}
