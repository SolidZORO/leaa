import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '@leaa/common/src/entrys';
import { CategoryResolver } from '@leaa/api/src/modules/category/category.resolver';
import { CategoryService } from '@leaa/api/src/modules/category/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryResolver, CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
