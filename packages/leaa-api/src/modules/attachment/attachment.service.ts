import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import { Express, Request } from 'express';
import { Repository } from 'typeorm';
import ImageSize from 'image-size';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '@leaa/common/entrys';
import { CreateAttachmentInput } from '@leaa/common/dtos/attachment';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { MulterService } from './multer.service';

@Injectable()
export class AttachmentService {
  constructor(
    @Inject(MulterService) private readonly multerService: MulterService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  async saveAttachment(req: Request, body: CreateAttachmentInput, file: Express.Multer.File) {
    const at2x = this.multerService.isAt2x(file.originalname) ? 1 : 0;

    const { width, height } = ImageSize(file.path);
    const ext = path.extname(file.filename);
    const title = path.basename(file.originalname, ext);

    if (at2x) {
      await this.saveAt2xToAt1x(file, width, height);
    }

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
      at2x,
      sort: 0,
    };

    return this.attachmentRepository.save({ ...attachmentData });
  }

  async saveAt2xToAt1x(file: Express.Multer.File, rawWidth: number, rawHeight: number) {
    const width = Math.round(rawWidth / 2);
    const height = Math.round(rawHeight / 2);

    const pathAt1x = file.path.replace('@2x', '');

    // TODO jpg Error: marker was not found
    Jimp.read(file.path)
      .then(image => {
        image
          .resize(width, height)
          .quality(95)
          .write(pathAt1x);
      })
      .catch(err => {
        console.error('SAVE 2X --> 1X ERROR', err);

        fs.copyFile(file.path, pathAt1x, e => {
          if (e) {
            throw e;
          }
        });
      });
  }
}
