import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Action } from '@leaa/common/src/entrys';
import { ActionResolver } from '@leaa/api/src/modules/action/action.resolver';
import { ActionService } from '@leaa/api/src/modules/action/action.service';

@Module({
  imports: [TypeOrmModule.forFeature([Action])],
  providers: [ActionResolver, ActionService],
  exports: [ActionService],
})
export class ActionModule {}
