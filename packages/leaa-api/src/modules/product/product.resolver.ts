import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Product, User } from '@leaa/common/src/entrys';
import {
  ProductsArgs,
  ProductsWithPaginationObject,
  ProductArgs,
  CreateProductInput,
  UpdateProductInput,
} from '@leaa/common/src/dtos/product';
import { ProductService } from '@leaa/api/src/modules/product/product.service';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { Permissions, CurrentUser } from '@leaa/api/src/decorators';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  // @UseGuards(PermissionsGuard)
  // @Permissions('product.list-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => ProductsWithPaginationObject, { nullable: true })
  async products(
    @Args() args: ProductsArgs,
    @CurrentUser() user?: User,
  ): Promise<ProductsWithPaginationObject | undefined> {
    return this.productService.products(args, user);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('product.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Product, { nullable: true })
  async product(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: ProductArgs,
    @CurrentUser() user?: User,
  ): Promise<Product | undefined> {
    return this.productService.product(id, args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('product.item-create')
  @Mutation(() => Product)
  async createProduct(@Args('product') args: CreateProductInput): Promise<Product | undefined> {
    return this.productService.createProduct(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('product.item-update')
  @Mutation(() => Product)
  async updateProduct(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('product') args: UpdateProductInput,
  ): Promise<Product | undefined> {
    return this.productService.updateProduct(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('product.item-delete')
  @Mutation(() => Product)
  async deleteProduct(@Args({ name: 'id', type: () => Int }) id: number): Promise<Product | undefined> {
    return this.productService.deleteProduct(id);
  }
}
