import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import Jimp from 'jimp';
import { Express, Request } from 'express';
import { Repository, FindOneOptions, Like, In, getConnection } from 'typeorm';
import ImageSize from 'image-size';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '@leaa/common/entrys';
import {
  CreateAttachmentInput,
  AttachmentsArgs,
  AttachmentsWithPaginationObject,
  AttachmentArgs,
  UpdateAttachmentInput,
  DeleteAttachmentsObject,
  UpdateAttachmentsInput,
  AttachmentsObject,
} from '@leaa/common/dtos/attachment';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { formatUtil, loggerUtil, pathUtil } from '@leaa/api/utils';
import { IAttachmentType } from '@leaa/common/interfaces';
import { MulterService } from './multer.service';

const CONSTRUCTOR_NAME = 'AttachmentService';

@Injectable()
export class AttachmentService {
  constructor(
    @Inject(MulterService) private readonly multerService: MulterService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
  ) {}

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

        fs.copyFileSync(file.path, pathAt1x);
      });
  }

  async attachments(args: AttachmentsArgs): Promise<AttachmentsWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    const queryWhere: any[] = [];

    let qLike;

    if (nextArgs.q) {
      qLike = Like(`%${nextArgs.q}%`);

      queryWhere.push({ title: qLike });
    }

    const moduleFilter: {
      moduleName?: string;
      moduleId?: number;
      moduleType?: string;
    } = {};

    if (nextArgs.moduleName) {
      moduleFilter.moduleName = nextArgs.moduleName;
    }

    if (nextArgs.moduleId) {
      moduleFilter.moduleId = nextArgs.moduleId;
    }

    if (nextArgs.moduleType) {
      moduleFilter.moduleType = nextArgs.moduleType;
    }

    queryWhere.push(moduleFilter);
    nextArgs.where = queryWhere;

    const [items, total] = await this.attachmentRepository.findAndCount(nextArgs);

    return {
      items,
      total,
      page: nextArgs.page || 1,
      pageSize: nextArgs.pageSize || 30,
    };
  }

  async attachment(uuid: string, args?: AttachmentArgs & FindOneOptions<Attachment>): Promise<Attachment | undefined> {
    let nextArgs: FindOneOptions<Attachment> = {};

    if (args) {
      nextArgs = args;
    }

    return this.attachmentRepository.findOne({ uuid }, nextArgs);
  }

  async craeteAttachment(req: Request, body: CreateAttachmentInput, file: Express.Multer.File) {
    if (!file) {
      const message = 'not found attachment';

      return loggerUtil.warn(message, CONSTRUCTOR_NAME);
    }

    const isImage = file.mimetype ? file.mimetype.includes(IAttachmentType.IMAGE) : false;
    const at2x = this.multerService.isAt2x(file.originalname) ? 1 : 0;
    let width = 0;
    let height = 0;

    if (isImage) {
      const imageSize = ImageSize(file.path);

      width = imageSize.width; // eslint-disable-line prefer-destructuring
      height = imageSize.height; // eslint-disable-line prefer-destructuring
    }

    const filepath = file.path.replace(this.configService.PUBLIC_DIR, '').replace('@2x', '');
    const filename = file.filename.replace('@2x', '');
    const ext = path.extname(file.filename);
    const title = path.basename(file.originalname, ext).replace('@2x', '');
    const uuid = path.basename(filename, ext).replace('@2x', '');

    if (isImage && at2x) {
      await this.saveAt2xToAt1x(file, width, height);
    }

    const attachmentData: CreateAttachmentInput = {
      uuid,
      title,
      alt: title,
      type: file.mimetype ? `${file.mimetype.split('/')[0]}` : 'no-mime',
      filename,
      moduleName: body.moduleName,
      moduleId: typeof body.moduleId !== 'undefined' ? Number(body.moduleId) : 0,
      moduleType: body.moduleType,
      ext,
      width,
      height,
      path: filepath,
      size: file.size,
      at2x,
      sort: 0,
    };

    const attachment = await this.attachmentRepository.save({ ...attachmentData });

    return { attachment };
  }

  async updateAttachment(uuid: string, args: UpdateAttachmentInput): Promise<Attachment | undefined> {
    if (!args) {
      const message = `update item ${uuid} args does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    let prevItem = await this.attachmentRepository.findOne({ uuid });

    if (!prevItem) {
      const message = `update item ${uuid} does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    prevItem = {
      ...prevItem,
      ...args,
    };

    // @ts-ignore
    const nextItem = await this.attachmentRepository.save(prevItem);

    loggerUtil.updateLog({ id: uuid, prevItem, nextItem, constructorName: CONSTRUCTOR_NAME });

    return nextItem;
  }

  async updateAttachments(attachments: UpdateAttachmentsInput[]): Promise<AttachmentsObject> {
    if (!attachments) {
      const message = `update attachments does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    const batchUpdate = attachments.map(async attachment => {
      await this.attachmentRepository.update({ uuid: attachment.uuid }, _.omit(attachment, ['uuid']));
    });

    let items: Attachment[] = [];

    await Promise.all(batchUpdate)
      .then(async () => {
        loggerUtil.log(JSON.stringify(attachments), CONSTRUCTOR_NAME);

        items = await this.attachmentRepository.find({ uuid: In(attachments.map(a => a.uuid)) });
      })
      .catch(() => {
        loggerUtil.error(JSON.stringify(attachments), CONSTRUCTOR_NAME);
      });

    return {
      items,
    };
  }

  async deleteAttachments(uuid: string[]): Promise<DeleteAttachmentsObject | undefined> {
    const prevItems = await this.attachmentRepository.find({ uuid: In(uuid) });

    if (!prevItems) {
      const message = `delete item ${uuid} does not exist`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    const nextItem = await this.attachmentRepository.remove(prevItems);

    if (!nextItem) {
      const message = `delete item ${uuid} faild`;

      loggerUtil.warn(message, CONSTRUCTOR_NAME);
      throw new Error(message);
    }

    prevItems.forEach(i => {
      if (i.at2x) {
        try {
          fs.unlinkSync(`${this.configService.PUBLIC_DIR}${pathUtil.getAt2xPath(i.path)}`);
        } catch (err) {
          loggerUtil.error(`delete @2x item ${i.path} fail: ${JSON.stringify(i)}\n\n`, CONSTRUCTOR_NAME, err);
        }
      }

      try {
        fs.unlinkSync(`${this.configService.PUBLIC_DIR}${i.path}`);
      } catch (err) {
        loggerUtil.error(`delete item ${i.path} fail: ${JSON.stringify(i)}\n\n`, CONSTRUCTOR_NAME, err);
      }
    });

    loggerUtil.log(`delete item ${uuid} successful: ${JSON.stringify(nextItem)}\n\n`, CONSTRUCTOR_NAME);

    return {
      items: nextItem.map(i => i.uuid),
    };
  }
}
