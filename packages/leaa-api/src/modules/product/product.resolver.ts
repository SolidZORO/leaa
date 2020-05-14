import { Args, Query, Mutation, Resolver, ResolveField, Parent, Int } from '@nestjs/graphql';

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

import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { ProductProperty } from '@leaa/api/src/modules/product/product.property';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService, private readonly productProperty: ProductProperty) {}

  @ResolveField(() => ProductAttachmentsObject)
  async attachments(@Parent() product: Product | undefined): Promise<ProductAttachmentsObject | undefined> {
    return this.productProperty.attachments(product);
  }

  //
  //

  @Query(() => ProductsWithPaginationObject, { nullable: true })
  async products(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args() args: ProductsArgs,
  ): Promise<ProductsWithPaginationObject | undefined> {
    return this.productService.products(gqlCtx, args);
  }

  @Query(() => Product, { nullable: true })
  async product(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: ProductArgs,
  ): Promise<Product | undefined> {
    return this.productService.product(gqlCtx, id, args);
  }

  @Permissions('product.item-create')
  @Mutation(() => Product)
  async createProduct(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args('product') args: CreateProductInput,
  ): Promise<Product | undefined> {
    return this.productService.createProduct(gqlCtx, args);
  }

  @Permissions('product.item-update')
  @Mutation(() => Product)
  async updateProduct(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('product') args: UpdateProductInput,
  ): Promise<Product | undefined> {
    return this.productService.updateProduct(gqlCtx, id, args);
  }

  @Permissions('product.item-delete')
  @Mutation(() => Product)
  async deleteProduct(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Product | undefined> {
    return this.productService.deleteProduct(gqlCtx, id);
  }
}
