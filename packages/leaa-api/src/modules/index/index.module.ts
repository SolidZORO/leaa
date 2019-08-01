import { Module } from '@nestjs/common';

import { IndexController } from '@leaa/api/modules/index/index.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [IndexController],
})
export class IndexModule {}
