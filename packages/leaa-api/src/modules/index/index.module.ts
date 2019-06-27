import { Module } from '@nestjs/common';

import { IndexController } from './index.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [IndexController],
})
export class IndexModule {}
