import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { Attachment } from '@leaa/common/src/entrys';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';
import { AuthTokenModule } from '@leaa/api/src/modules/v1/auth-token/auth-token.module';
import { AttachmentController } from '@leaa/api/src/modules/v1/attachment/attachment.controller';

import { AttachmentService } from '@leaa/api/src/modules/v1/attachment/attachment.service';
import { AttachmentProperty } from '@leaa/api/src/modules/v1/attachment/attachment.property';
import { MulterService } from '@leaa/api/src/modules/v1/attachment/multer.service';
import { SaveInOssService } from '@leaa/api/src/modules/v1/attachment/save-in-oss.service';
import { SaveInLocalService } from '@leaa/api/src/modules/v1/attachment/save-in-local.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useClass: MulterService,
    }),
    AuthTokenModule,
  ],
  controllers: [AttachmentController],
  providers: [AttachmentService, AttachmentProperty, MulterService, SaveInOssService, SaveInLocalService],
  exports: [AttachmentService, AttachmentProperty, MulterService, SaveInOssService, SaveInLocalService],
})
export class AttachmentModule {}
