import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ax, Attachment } from '@leaa/common/src/entrys';
import { AttachmentModule } from '@leaa/api/src/modules/v1/attachment/attachment.module';
import { AuthTokenModule } from '@leaa/api/src/modules/v1/auth-token/auth-token.module';

import { AxService } from './ax.service';
import { AxController } from './ax.controller';

// TIPS!
// ax === ad (advertising), avoid word 'ad' being blocked by adblock.

@Module({
  imports: [TypeOrmModule.forFeature([Ax, Attachment]), AuthTokenModule, AttachmentModule],
  providers: [AxService],
  exports: [AxService],
  controllers: [AxController],
})
export class AxModule {}
