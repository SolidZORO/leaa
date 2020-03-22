import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Int } from '@nestjs/graphql';

import { Category } from '@leaa/common/src/entrys';
import {
  CategoriesArgs,
  CategoriesWithPaginationOrTreeObject,
  CategoryArgs,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@leaa/common/src/dtos/category';
import { CategoryService } from '@leaa/api/src/modules/category/category.service';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  // @UseGuards(PermissionsGuard)
  // @Permissions('category.list-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => CategoriesWithPaginationOrTreeObject)
  async categories(@Args() args: CategoriesArgs): Promise<CategoriesWithPaginationOrTreeObject | undefined> {
    return this.categoryService.categories(args);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('category.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Category)
  async category(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: CategoryArgs,
  ): Promise<Category | undefined> {
    return this.categoryService.category(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('category.item-create')
  @Mutation(() => Category)
  async createCategory(
    @Args('category') args: CreateCategoryInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Category | undefined> {
    return this.categoryService.createCategory(args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('category.item-update')
  @Mutation(() => Category)
  async updateCategory(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('category') args: UpdateCategoryInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Category | undefined> {
    return this.categoryService.updateCategory(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('category.item-delete')
  @Mutation(() => Category)
  async deleteCategory(
    @Args({ name: 'id', type: () => Int }) id: number,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Category | undefined> {
    return this.categoryService.deleteCategory(id, gqlCtx);
  }
}
