import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from '@leaa/api/src/entrys';

import { IndexController } from './index.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  providers: [],
  controllers: [IndexController],
})
export class IndexModule {}
