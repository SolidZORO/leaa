import { Module } from '@nestjs/common';

import { IndexController } from '@leaa/api/src/modules/v1/index/index.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from '@leaa/api/src/entrys';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  providers: [],
  controllers: [IndexController],
})
export class IndexModule {}
