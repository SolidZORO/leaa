import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ax, Attachment } from '@leaa/common/entrys';
import { AxResolver } from '@leaa/api/modules/ax/ax.resolver';
import { AxService } from '@leaa/api/modules/ax/ax.service';
import { AttachmentModule } from '@leaa/api/modules/attachment/attachment.module';

// TIPS!
// ax === ad (advertising), avoid word 'ad' being blocked by adblock.

@Module({
  imports: [TypeOrmModule.forFeature([Ax, Attachment]), AttachmentModule],
  providers: [AxResolver, AxService],
  exports: [AxService],
})
export class AxModule {}
