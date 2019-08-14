import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import moment from 'moment';
import ImageSize from 'image-size';
import { Express } from 'express';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IAttachmentType, IAttachmentCreateFieldByLocal, ISaveInLocalSignature } from '@leaa/common/interfaces';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { CreateAttachmentInput } from '@leaa/common/dtos/attachment';
import { Attachment } from '@leaa/common/entrys';
import { loggerUtil, attachmentUtil } from '@leaa/api/utils';

const CONSTRUCTOR_NAME = 'SaveInLocalService';

@Injectable()
export class SaveInLocalService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
    private readonly configService: ConfigService,
  ) {}

  async getSignature(): Promise<ISaveInLocalSignature> {
    return {
      saveIn: 'local',
      saveDirPath: `attachments/${moment().format('YYYY/MM')}/`,
      // eslint-disable-next-line max-len
      uploadEndPoint: `${this.configService.PROTOCOL}://${this.configService.BASE_HOST}:${this.configService.PORT}/attachments/upload`,
    };
  }

  async saveAt2xToAt1x(file: Express.Multer.File, rawWidth: number, rawHeight: number) {
    const width = Math.round(rawWidth / 2);
    const height = Math.round(rawHeight / 2);

    const pathAt1x = file.path.replace('_2x', '');

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

        fs.copyFileSync(file.path, pathAt1x);
      });
  }

  async craeteAttachmentByLocal(
    body: CreateAttachmentInput,
    file: Express.Multer.File,
  ): Promise<{ attachment: Attachment } | undefined> {
    if (!file) {
      const message = 'not found attachment';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return;
    }

    const isImage = file.mimetype ? file.mimetype.includes(IAttachmentType.IMAGE) : false;
    const at2x = attachmentUtil.isAt2x(file.originalname) ? 1 : 0;
    let width = 0;
    let height = 0;

    if (isImage) {
      const imageSize = ImageSize(file.path);

      width = imageSize.width; // eslint-disable-line prefer-destructuring
      height = imageSize.height; // eslint-disable-line prefer-destructuring

      if (at2x) {
        width = Math.round(imageSize.width / 2);
        height = Math.round(imageSize.height / 2);
      }
    }

    const filepath = file.path.replace(this.configService.PUBLIC_DIR, '').replace('_2x', '');
    const filename = file.filename.replace('_2x', '');
    const ext = path.extname(file.filename);
    const title = path.basename(file.originalname, ext).replace('_2x', '');
    const uuid = path.basename(filename, ext).replace('_2x', '');

    if (isImage && at2x) {
      await this.saveAt2xToAt1x(file, width, height);
    }

    const attachmentData: IAttachmentCreateFieldByLocal = {
      uuid,
      title,
      alt: title,
      type: file.mimetype ? `${file.mimetype.split('/')[0]}` : 'no-mime',
      filename,
      // module_abc --> moduleAbc
      module_name: body.moduleName,
      module_id: typeof body.moduleId !== 'undefined' ? Number(body.moduleId) : 0,
      module_type: body.moduleType,
      //
      ext,
      width,
      height,
      path: filepath,
      size: file.size,
      at2x,
      sort: 0,
      in_local: 1,
    };

    const attachment = await this.attachmentRepository.save({ ...attachmentData });

    // eslint-disable-next-line consistent-return
    return { attachment };
  }
}
