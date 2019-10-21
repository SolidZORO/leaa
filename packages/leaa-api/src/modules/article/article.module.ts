import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article, Category, Tag } from '@leaa/common/src/entrys';
import { ArticleResolver } from '@leaa/api/src/modules/article/article.resolver';
import { ArticleService } from '@leaa/api/src/modules/article/article.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, Tag])],
  providers: [ArticleResolver, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
