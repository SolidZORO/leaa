import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from '@leaa/common/entrys';
import { ArticleResolver } from '@leaa/api/modules/article/article.resolver';
import { ArticleService } from '@leaa/api/modules/article/article.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [ArticleResolver, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
