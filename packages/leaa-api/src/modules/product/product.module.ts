import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, Category, Tag, Attachment } from '@leaa/common/src/entrys';
import { ProductResolver } from '@leaa/api/src/modules/product/product.resolver';
import { ProductService } from '@leaa/api/src/modules/product/product.service';
import { TagService } from '@leaa/api/src/modules/tag/tag.service';
import { AttachmentModule } from '@leaa/api/src/modules/attachment/attachment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Tag, Attachment]), AttachmentModule],
  providers: [ProductResolver, ProductService, TagService],
  exports: [ProductService],
})
export class ProductModule {}
