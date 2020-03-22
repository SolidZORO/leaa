import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, ResolveProperty, Parent, Int } from '@nestjs/graphql';

import { Product } from '@leaa/common/src/entrys';
import {
  ProductsArgs,
  ProductsWithPaginationObject,
  ProductArgs,
  CreateProductInput,
  UpdateProductInput,
  ProductAttachmentsObject,
} from '@leaa/common/src/dtos/product';
import { ProductService } from '@leaa/api/src/modules/product/product.service';
import { PermissionsGuard } from '@leaa/api/src/guards';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { ProductProperty } from '@leaa/api/src/modules/product/product.property';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService, private readonly productProperty: ProductProperty) {}

  @ResolveProperty(() => ProductAttachmentsObject)
  async attachments(@Parent() product: Product | undefined): Promise<ProductAttachmentsObject | undefined> {
    return this.productProperty.attachments(product);
  }

  //
  //

  @Query(() => ProductsWithPaginationObject, { nullable: true })
  async products(
    @Args() args: ProductsArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<ProductsWithPaginationObject | undefined> {
    return this.productService.products(args, gqlCtx);
  }

  @Query(() => Product, { nullable: true })
  async product(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: ProductArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Product | undefined> {
    return this.productService.product(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('product.item-create')
  @Mutation(() => Product)
  async createProduct(
    @Args('product') args: CreateProductInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Product | undefined> {
    return this.productService.createProduct(args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('product.item-update')
  @Mutation(() => Product)
  async updateProduct(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('product') args: UpdateProductInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Product | undefined> {
    return this.productService.updateProduct(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('product.item-delete')
  @Mutation(() => Product)
  async deleteProduct(
    @Args({ name: 'id', type: () => Int }) id: number,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Product | undefined> {
    return this.productService.deleteProduct(id, gqlCtx);
  }
}
