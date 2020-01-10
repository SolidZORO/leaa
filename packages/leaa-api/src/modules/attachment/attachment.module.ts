import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { Attachment } from '@leaa/common/src/entrys';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { AuthTokenModule } from '@leaa/api/src/modules/auth-token/auth-token.module';
import { AttachmentController } from '@leaa/api/src/modules/attachment/attachment.controller';

import { AttachmentResolver } from '@leaa/api/src/modules/attachment/attachment.resolver';
import { AttachmentService } from '@leaa/api/src/modules/attachment/attachment.service';
import { AttachmentProperty } from '@leaa/api/src/modules/attachment/attachment.property';
import { MulterService } from '@leaa/api/src/modules/attachment/multer.service';
import { SaveInOssService } from '@leaa/api/src/modules/attachment/save-in-oss.service';
import { SaveInLocalService } from '@leaa/api/src/modules/attachment/save-in-local.service';

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
  providers: [
    AttachmentResolver,
    AttachmentService,
    AttachmentProperty,
    MulterService,
    SaveInOssService,
    SaveInLocalService,
  ],
  exports: [
    AttachmentResolver,
    AttachmentService,
    AttachmentProperty,
    MulterService,
    SaveInOssService,
    SaveInLocalService,
  ],
})
export class AttachmentModule {}
