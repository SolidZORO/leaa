import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';

import { Article } from '@leaa/common/src/entrys';
import {
  ArticlesArgs,
  ArticlesWithPaginationObject,
  ArticleArgs,
  CreateArticleInput,
  UpdateArticleInput,
} from '@leaa/common/src/dtos/article';
import { ArticleService } from '@leaa/api/src/modules/article/article.service';

import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  //
  // @Permissions('article.list-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => ArticlesWithPaginationObject)
  async articles(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args() args: ArticlesArgs,
  ): Promise<ArticlesWithPaginationObject | undefined> {
    return this.articleService.articles(gqlCtx, args);
  }

  //
  // @Permissions('article.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Article)
  async article(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: ArticleArgs,
  ): Promise<Article | undefined> {
    return this.articleService.article(gqlCtx, id, args);
  }

  //
  // @Permissions('article.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Article)
  async articleBySlug(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: ArticleArgs,
  ): Promise<Article | undefined> {
    return this.articleService.articleBySlug(gqlCtx, slug, args);
  }

  @Permissions('article.item-create')
  @Mutation(() => Article)
  async createArticle(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args('article') args: CreateArticleInput,
  ): Promise<Article | undefined> {
    return this.articleService.createArticle(gqlCtx, args);
  }

  @Permissions('article.item-update')
  @Mutation(() => Article)
  async updateArticle(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('article') args: UpdateArticleInput,
  ): Promise<Article | undefined> {
    return this.articleService.updateArticle(gqlCtx, id, args);
  }

  @Permissions('article.item-delete')
  @Mutation(() => Article)
  async deleteArticle(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Article | undefined> {
    return this.articleService.deleteArticle(gqlCtx, id);
  }
}
