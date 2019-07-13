import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { Attachment } from '@leaa/common/entrys';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
import { MulterService } from './multer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useClass: MulterService,
    }),
  ],
  controllers: [AttachmentController],
  providers: [AttachmentService, MulterService],
})
export class AttachmentModule {}
