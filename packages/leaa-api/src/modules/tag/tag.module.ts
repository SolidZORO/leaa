import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tag } from '@leaa/common/src/entrys';

import { TagService } from '@leaa/api/src/modules/tag/tag.service';
import { TagResolver } from '@leaa/api/src/modules/tag/tag.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagResolver, TagService],
  exports: [TagService],
})
export class TagModule {}
