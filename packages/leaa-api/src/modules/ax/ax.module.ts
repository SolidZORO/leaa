import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ax } from '@leaa/common/entrys';
import { AxResolver } from '@leaa/api/modules/ax/ax.resolver';
import { AxService } from '@leaa/api/modules/ax/ax.service';

// TIPS!
// ax === ad (advertising), avoid word 'ad' being blocked by adblock.

@Module({
  imports: [TypeOrmModule.forFeature([Ax])],
  providers: [AxResolver, AxService],
  exports: [AxService],
})
export class AxModule {}
