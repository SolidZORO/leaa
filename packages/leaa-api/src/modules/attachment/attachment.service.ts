import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import { Express, Request } from 'express';
import { Repository, FindOneOptions, Like, In } from 'typeorm';
import ImageSize from 'image-size';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '@leaa/common/entrys';
import {
  CreateAttachmentInput,
  AttachmentsArgs,
  AttachmentsObject,
  AttachmentArgs,
  UpdateAttachmentInput,
  DeleteAttachmentsObject,
} from '@leaa/common/dtos/attachment';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { formatUtil, loggerUtil } from '@leaa/api/utils';
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

  async attachments(args: AttachmentsArgs): Promise<AttachmentsObject> {
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
    const isImage = file.mimetype.includes(IAttachmentType.IMAGE);
    const at2x = this.multerService.isAt2x(file.originalname) ? 1 : 0;
    let width = 0;
    let height = 0;

    if (isImage) {
      const imageSize = ImageSize(file.path);

      width = imageSize.width; // eslint-disable-line prefer-destructuring
      height = imageSize.height; // eslint-disable-line prefer-destructuring
    }

    const ext = path.extname(file.filename);
    const title = path.basename(file.originalname, ext);

    if (isImage && at2x) {
      await this.saveAt2xToAt1x(file, width, height);
    }

    const attachmentData: CreateAttachmentInput = {
      uuid: path.basename(file.filename, ext).replace('@2x', ''),
      title,
      alt: title,
      type: `${file.mimetype.split('/')[0]}`,
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
    const nextItem = await this.repository.save(prevItem);

    loggerUtil.updateLog({ id: uuid, prevItem, nextItem, constructorName: CONSTRUCTOR_NAME });

    return nextItem;
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

    loggerUtil.warn(`delete item ${uuid} successful: ${JSON.stringify(nextItem)}\n\n`, CONSTRUCTOR_NAME);

    return {
      items: nextItem.map(i => i.uuid),
    };
  }
}
