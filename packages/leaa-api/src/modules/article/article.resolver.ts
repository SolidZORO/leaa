import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Article } from '@leaa/common/src/entrys';
import {
  ArticlesArgs,
  ArticlesWithPaginationObject,
  ArticleArgs,
  CreateArticleInput,
  UpdateArticleInput,
} from '@leaa/common/src/dtos/article';
import { ArticleService } from '@leaa/api/src/modules/article/article.service';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Query(() => ArticlesWithPaginationObject)
  async articles(@Args() args: ArticlesArgs): Promise<ArticlesWithPaginationObject | undefined> {
    return this.articleService.articles(args);
  }

  @Query(() => Article)
  async article(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: ArticleArgs,
  ): Promise<Article | undefined> {
    return this.articleService.article(id, args);
  }

  @Query(() => Article)
  async articleBySlug(
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: ArticleArgs,
  ): Promise<Article | undefined> {
    return this.articleService.articleBySlug(slug, args);
  }

  @Mutation(() => Article)
  async createArticle(@Args('article') args: CreateArticleInput): Promise<Article | undefined> {
    return this.articleService.createArticle(args);
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
