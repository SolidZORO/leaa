import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tag } from '@leaa/common/src/entrys';
import { TagService } from '@leaa/api/src/modules/v1/tag/tag.service';
// import { TagResolver } from '@leaa/api/src/modules/tag/tag.resolver';
import { TagController } from './tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagService],
  exports: [TagService],
  controllers: [TagController],
})
export class TagModule {}
