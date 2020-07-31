import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article, Category, Tag } from '@leaa/api/src/entrys';
import { TagService } from '@leaa/api/src/modules/v1/tag/tag.service';
import { ArticleService } from '@leaa/api/src/modules/v1/article/article.service';

import { ArticleViewController } from './article-view.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, Tag])],
  providers: [TagService, ArticleService],
  exports: [],
  controllers: [ArticleViewController],
})
export class ArticleViewModule {}
