import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, Category, Tag } from '@leaa/common/src/entrys';
import { ProductResolver } from '@leaa/api/src/modules/product/product.resolver';
import { ProductService } from '@leaa/api/src/modules/product/product.service';
import { TagService } from '@leaa/api/src/modules/tag/tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Tag])],
  providers: [ProductResolver, ProductService, TagService],
  exports: [ProductService],
})
export class ProductModule {}
