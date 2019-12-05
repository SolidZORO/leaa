import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Category } from '@leaa/common/src/entrys';
import {
  CategoriesArgs,
  CategoriesWithPaginationObject,
  CategoryArgs,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@leaa/common/src/dtos/category';
import { CategoryService } from '@leaa/api/src/modules/category/category.service';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { Permissions } from '@leaa/api/src/decorators';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  // @UseGuards(PermissionsGuard)
  // @Permissions('category.list-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => CategoriesWithPaginationObject)
  async categories(@Args() args: CategoriesArgs): Promise<CategoriesWithPaginationObject | undefined> {
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
  async createCategory(@Args('category') args: CreateCategoryInput): Promise<Category | undefined> {
    return this.categoryService.createCategory(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('category.item-update')
  @Mutation(() => Category)
  async updateCategory(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('category') args: UpdateCategoryInput,
  ): Promise<Category | undefined> {
    return this.categoryService.updateCategory(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('category.item-delete')
  @Mutation(() => Category)
  async deleteCategory(@Args({ name: 'id', type: () => Int }) id: number): Promise<Category | undefined> {
    return this.categoryService.deleteCategory(id);
  }
}
