import { Module } from '@nestjs/common';

import { IndexController } from '@leaa/api/src/modules/v1/index/index.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [IndexController],
})
export class IndexModule {}
