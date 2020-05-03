import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Int } from '@nestjs/graphql';

import { Article } from '@leaa/common/src/entrys';
import {
  ArticlesArgs,
  ArticlesWithPaginationObject,
  ArticleArgs,
  CreateArticleInput,
  UpdateArticleInput,
} from '@leaa/common/src/dtos/article';
import { ArticleService } from '@leaa/api/src/modules/article/article.service';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  // @UseGuards(PermissionsGuard)
  // @Permissions('article.list-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => ArticlesWithPaginationObject)
  async articles(
    @Args() args: ArticlesArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<ArticlesWithPaginationObject | undefined> {
    return this.articleService.articles(args, gqlCtx);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('article.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Article)
  async article(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: ArticleArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Article | undefined> {
    return this.articleService.article(id, args, gqlCtx);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('article.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Article)
  async articleBySlug(
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: ArticleArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Article | undefined> {
    return this.articleService.articleBySlug(slug, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('article.item-create')
  @Mutation(() => Article)
  async createArticle(@Args('article') args: CreateArticleInput): Promise<Article | undefined> {
    return this.articleService.createArticle(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('article.item-update')
  @Mutation(() => Article)
  async updateArticle(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('article') args: UpdateArticleInput,
  ): Promise<Article | undefined> {
    return this.articleService.updateArticle(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('article.item-delete')
  @Mutation(() => Article)
  async deleteArticle(@Args({ name: 'id', type: () => Int }) id: string): Promise<Article | undefined> {
    return this.articleService.deleteArticle(id);
  }
}
