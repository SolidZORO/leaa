import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article, Category } from '@leaa/common/src/entrys';
import { ArticleResolver } from '@leaa/api/src/modules/article/article.resolver';
import { ArticleService } from '@leaa/api/src/modules/article/article.service';
import { ArticleProperty } from '@leaa/api/src/modules/article/article.property';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category])],
  providers: [ArticleResolver, ArticleService, ArticleProperty],
  exports: [ArticleService],
})
export class ArticleModule {}
