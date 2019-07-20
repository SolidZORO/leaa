import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { Attachment } from '@leaa/common/entrys';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { AuthTokenModule } from '@leaa/api/modules/auth-token/auth-token.module';
import { AttachmentController } from './attachment.controller';
import { AttachmentResolver } from './attachment.resolver';
import { AttachmentService } from './attachment.service';
import { MulterService } from './multer.service';

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
  providers: [AttachmentService, AttachmentResolver, MulterService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
