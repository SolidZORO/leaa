import { FindOneOptions } from 'typeorm';
import { ProductsArgs, ProductArgs } from '@leaa/common/src/dtos/product';
import { Product } from '@leaa/common/src/entrys';

export type IProductsArgs = ProductsArgs & FindOneOptions<Product>;
export type IProductArgs = ProductArgs & FindOneOptions<Product>;
