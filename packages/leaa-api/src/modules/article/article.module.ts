import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article, Category } from '@leaa/common/entrys';
import { ArticleResolver } from '@leaa/api/modules/article/article.resolver';
import { ArticleService } from '@leaa/api/modules/article/article.service';
import { ArticleProperty } from '@leaa/api/modules/article/article.property';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category])],
  providers: [ArticleResolver, ArticleService, ArticleProperty],
  exports: [ArticleService],
})
export class ArticleModule {}
