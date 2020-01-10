import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Zan, Attachment } from '@leaa/common/src/entrys';
import { ZanResolver } from '@leaa/api/src/modules/zan/zan.resolver';
import { ZanService } from '@leaa/api/src/modules/zan/zan.service';
import { AttachmentModule } from '@leaa/api/src/modules/attachment/attachment.module';
import { AuthTokenModule } from '@leaa/api/src/modules/auth-token/auth-token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Zan, Attachment]), AuthTokenModule, AttachmentModule],
  providers: [ZanResolver, ZanService],
  exports: [ZanResolver, ZanService],
})
export class ZanModule {}
