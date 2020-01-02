import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article, Category, Tag, Promo } from '@leaa/common/src/entrys';
import { ExportController } from '@leaa/api/src/modules/export/export.controller';
import { ExportService } from '@leaa/api/src/modules/export/export.service';
import { AuthTokenModule } from '@leaa/api/src/modules/auth-token/auth-token.module';

import { PromoModule } from '@leaa/api/src/modules/promo/promo.module';
import { PromoService } from '@leaa/api/src/modules/promo/promo.service';
import { PromoProperty } from '@leaa/api/src/modules/promo/promo.property';

import { CategoryService } from '@leaa/api/src/modules/category/category.service';

import { ArticleService } from '@leaa/api/src/modules/article/article.service';
import { ArticleResolver } from '@leaa/api/src/modules/article/article.resolver';

import { TagService } from '@leaa/api/src/modules/tag/tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, Tag, Promo]), PromoModule, AuthTokenModule],
  controllers: [ExportController],
  providers: [ExportService, ArticleResolver, ArticleService, CategoryService, TagService, PromoService, PromoProperty],
  exports: [ExportService],
})
export class ExportModule {}
