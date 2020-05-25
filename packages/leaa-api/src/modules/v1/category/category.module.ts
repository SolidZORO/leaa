import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '@leaa/common/src/entrys';
// import { CategoryResolver } from '@leaa/api/src/modules/category/category.resolver';
import { CategoryController } from '@leaa/api/src/modules/v1/category/category.controller';
import { CategoryService } from '@leaa/api/src/modules/v1/category/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
