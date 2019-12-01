import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Article, User } from '@leaa/common/src/entrys';
import {
  ArticlesArgs,
  ArticlesWithPaginationObject,
  ArticleArgs,
  CreateArticleInput,
  UpdateArticleInput,
} from '@leaa/common/src/dtos/article';
import { ArticleService } from '@leaa/api/src/modules/article/article.service';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { Permissions, CurrentUser } from '@leaa/api/src/decorators';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(PermissionsGuard)
  @Permissions('article.list-read')
  @Query(() => ArticlesWithPaginationObject)
  async articles(
    @Args() args: ArticlesArgs,
    @CurrentUser() user?: User,
  ): Promise<ArticlesWithPaginationObject | undefined> {
    return this.articleService.articles(args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('article.item-read')
  @Query(() => Article)
  async article(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: ArticleArgs,
    @CurrentUser() user?: User,
  ): Promise<Article | undefined> {
    return this.articleService.article(id, args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('article.item-read')
  @Query(() => Article)
  async articleBySlug(
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: ArticleArgs,
  ): Promise<Article | undefined> {
    return this.articleService.articleBySlug(slug, args);
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
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('article') args: UpdateArticleInput,
  ): Promise<Article | undefined> {
    return this.articleService.updateArticle(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('article.item-delete')
  @Mutation(() => Article)
  async deleteArticle(@Args({ name: 'id', type: () => Int }) id: number): Promise<Article | undefined> {
    return this.articleService.deleteArticle(id);
  }
}
