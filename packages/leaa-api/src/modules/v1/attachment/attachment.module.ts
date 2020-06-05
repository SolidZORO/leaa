import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { Attachment } from '@leaa/api/src/entrys';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';
import { AuthTokenModule } from '@leaa/api/src/modules/v1/auth-token/auth-token.module';
import { AttachmentController } from '@leaa/api/src/modules/v1/attachment/attachment.controller';

import { AttachmentService } from '@leaa/api/src/modules/v1/attachment/attachment.service';
import { MulterService } from '@leaa/api/src/modules/v1/attachment/multer.service';

import { SaveInLocalService } from '@leaa/api/src/modules/v1/attachment/save-in-local.service';
import { SaveInOssAliyunService } from '@leaa/api/src/modules/v1/attachment/save-in-oss-aliyun.service';

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
  providers: [AttachmentService, MulterService, SaveInOssAliyunService, SaveInLocalService],
  exports: [AttachmentService, MulterService, SaveInOssAliyunService, SaveInLocalService],
})
export class AttachmentModule {}
