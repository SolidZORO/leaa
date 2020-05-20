import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article, Category, Tag } from '@leaa/common/src/entrys';
import { TagService } from '@leaa/api/src/modules/tag/tag.service';

import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, Tag])],
  providers: [ArticleService, TagService],
  exports: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
