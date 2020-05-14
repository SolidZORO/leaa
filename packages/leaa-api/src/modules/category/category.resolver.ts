import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';

import { Category } from '@leaa/common/src/entrys';
import {
  CategoriesArgs,
  CategoriesWithPaginationOrTreeObject,
  CategoryArgs,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@leaa/common/src/dtos/category';
import { CategoryService } from '@leaa/api/src/modules/category/category.service';

import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  //
  // @Permissions('category.list-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => CategoriesWithPaginationOrTreeObject)
  async categories(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args() args: CategoriesArgs,
  ): Promise<CategoriesWithPaginationOrTreeObject | undefined> {
    return this.categoryService.categories(gqlCtx, args);
  }

  //
  // @Permissions('category.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Category)
  async category(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: CategoryArgs,
  ): Promise<Category | undefined> {
    return this.categoryService.category(gqlCtx, id, args);
  }

  //
  // @Permissions('category.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Category)
  async categoryBySlug(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: CategoryArgs,
  ): Promise<CategoryArgs | undefined> {
    return this.categoryService.categoryBySlug(gqlCtx, slug, args);
  }

  @Permissions('category.item-create')
  @Mutation(() => Category)
  async createCategory(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args('category') args: CreateCategoryInput,
  ): Promise<Category | undefined> {
    return this.categoryService.createCategory(gqlCtx, args);
  }

  @Permissions('category.item-update')
  @Mutation(() => Category)
  async updateCategory(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('category') args: UpdateCategoryInput,
  ): Promise<Category | undefined> {
    return this.categoryService.updateCategory(gqlCtx, id, args);
  }

  @Permissions('category.item-delete')
  @Mutation(() => Category)
  async deleteCategory(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Category | undefined> {
    return this.categoryService.deleteCategory(gqlCtx, id);
  }
}
