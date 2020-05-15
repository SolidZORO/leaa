import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article, Category, Tag } from '@leaa/common/src/entrys';
import { ArticleService } from '@leaa/api/src/modules/article/article.service';
import { TagService } from '@leaa/api/src/modules/tag/tag.service';
import { ArticleController } from './article.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, Tag])],
  providers: [ArticleService, TagService],
  exports: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
