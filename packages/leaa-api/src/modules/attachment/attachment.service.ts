import path from 'path';
import { Express, Request } from 'express';
import { Repository } from 'typeorm';
import ImageSize from 'image-size';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '@leaa/common/entrys';
import { CreateAttachmentInput } from '@leaa/common/dtos/attachment';
import { ConfigService } from '@leaa/api/modules/config/config.service';

@Injectable()
export class AttachmentService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  async saveAttachment(req: Request, body: CreateAttachmentInput, file: Express.Multer.File) {
    const ext = path.extname(file.filename);
    const title = path.basename(file.originalname, ext);
    const { width, height } = ImageSize(file.path);

    const attachmentData: CreateAttachmentInput = {
      uuid: path.basename(file.filename, ext),
      title,
      alt: title,
      filename: file.filename,
      moduleName: body.moduleName,
      moduleId: typeof body.moduleId !== 'undefined' ? Number(body.moduleId) : 0,
      moduleType: body.moduleType,
      ext,
      width,
      height,
      path: file.path.replace(this.configService.PUBLIC_DIR, ''),
      size: file.size,
      at2x: 0,
      sort: 0,
      // inLocal: 1,
      // inCloud: 0,
      // status: 1,
    };

    return this.attachmentRepository.save({ ...attachmentData });
  }
}
