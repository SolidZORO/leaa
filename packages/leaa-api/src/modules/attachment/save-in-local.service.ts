import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import ImageSize from 'image-size';
import { Express } from 'express';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  IAttachmentType,
  IAttachmentCreateFieldByLocal,
  ISaveInLocalSignature,
  IAttachmentParams,
} from '@leaa/common/src/interfaces';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { AttachmentProperty } from '@leaa/api/src/modules/attachment/attachment.property';
import { Attachment } from '@leaa/common/src/entrys';
import { loggerUtil, attachmentUtil } from '@leaa/api/src/utils';
import { attachmentConfig } from '@leaa/api/src/configs';

const CONSTRUCTOR_NAME = 'SaveInLocalService';

@Injectable()
export class SaveInLocalService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
    private readonly configService: ConfigService,
    private readonly attachmentProperty: AttachmentProperty,
  ) {}

  async getSignature(): Promise<ISaveInLocalSignature> {
    console.log(attachmentConfig.UPLOAD_ENDPOINT_BY_LOCAL);

    return {
      saveIn: 'local',
      saveDirPath: attachmentConfig.SAVE_DIR_BY_DB,
      uploadEndPoint: attachmentConfig.UPLOAD_ENDPOINT_BY_LOCAL,
    };
  }

  async saveAt2xToAt1xByLocal(file: Express.Multer.File, rawWidth: number, rawHeight: number) {
    const width = Math.round(rawWidth / 2);
    const height = Math.round(rawHeight / 2);

    const pathAt1x = file.path.replace('_2x', '');

    // TODO jpg Error: marker was not found
    Jimp.read(file.path)
      .then((image: any) => {
        image
          .resize(width, height)
          .quality(95)
          .write(pathAt1x);
      })
      .catch((err: Error) => {
        console.error('SAVE 2X --> 1X ERROR', err);

        fs.copyFileSync(file.path, pathAt1x);
      });
  }

  async craeteAttachmentByLocal(
    body: IAttachmentParams,
    file: Express.Multer.File,
    options?: {
      onlySaveFile?: boolean;
    },
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
      // @ts-ignore
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
      await this.saveAt2xToAt1xByLocal(file, width, height);
    }

    if (options && options.onlySaveFile) {
      return;
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
    return {
      attachment: {
        ...attachment,
        url: this.attachmentProperty.resolvePropertyUrl(attachment),
        urlAt2x: this.attachmentProperty.resolvePropertyUrlAt2x(attachment),
      },
    };
  }
}
