import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { Attachment } from '@leaa/common/entrys';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { AuthTokenModule } from '@leaa/api/modules/auth-token/auth-token.module';
import { AttachmentController } from '@leaa/api/modules/attachment/attachment.controller';
import { AttachmentResolver } from '@leaa/api/modules/attachment/attachment.resolver';
import { AttachmentService } from '@leaa/api/modules/attachment/attachment.service';
import { MulterService } from '@leaa/api/modules/attachment/multer.service';
import { SaveInOssService } from '@leaa/api/modules/attachment/save-in-oss.service';
import { SaveInLocalService } from '@leaa/api/modules/attachment/save-in-local.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    AuthTokenModule,
    MulterModule.registerAsync({
      inject: [ConfigService],
      useClass: MulterService,
    }),
  ],
  controllers: [AttachmentController],
  providers: [AttachmentService, AttachmentResolver, MulterService, SaveInOssService, SaveInLocalService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
