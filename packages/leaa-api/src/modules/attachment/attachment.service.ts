import fs from 'fs';
import _ from 'lodash';
import { Express } from 'express';
import { Repository, FindOneOptions, In, getRepository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment, User } from '@leaa/common/src/entrys';
import {
  AttachmentsArgs,
  AttachmentsWithPaginationObject,
  AttachmentArgs,
  UpdateAttachmentInput,
  DeleteAttachmentsObject,
  UpdateAttachmentsInput,
  AttachmentsObject,
} from '@leaa/common/src/dtos/attachment';
import {
  IAttachmentDbFilterField,
  ISaveInOssSignature,
  ISaveInLocalSignature,
  IAttachmentParams,
} from '@leaa/common/src/interfaces';
import {
  formatUtil,
  loggerUtil,
  pathUtil,
  authUtil,
  attachmentUtil,
  paginationUtil,
  errorUtil,
} from '@leaa/api/src/utils';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';
import { SaveInOssService } from '@leaa/api/src/modules/attachment/save-in-oss.service';
import { SaveInLocalService } from '@leaa/api/src/modules/attachment/save-in-local.service';

type IAttachmentsArgs = AttachmentsArgs & FindOneOptions<Attachment>;
type IAttachmentArgs = AttachmentArgs & FindOneOptions<Attachment>;

const CONSTRUCTOR_NAME = 'AttachmentService';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
    private readonly configService: ConfigService,
    private readonly saveInLocalServer: SaveInLocalService,
    private readonly saveInOssServer: SaveInOssService,
  ) {}

  getSignature(): Promise<ISaveInOssSignature | ISaveInLocalSignature> | null {
    if (this.configService.ATTACHMENT_SAVE_IN_OSS) {
      return this.saveInOssServer.getSignature();
    }

    if (this.configService.ATTACHMENT_SAVE_IN_LOCAL) {
      return this.saveInLocalServer.getSignature();
    }

    loggerUtil.warn('Signature Missing SAVE_IN... Params', CONSTRUCTOR_NAME);

    return null;
  }

  async attachments(args: IAttachmentsArgs, user?: User): Promise<AttachmentsWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    const moduleFilter: IAttachmentDbFilterField = {};

    if (nextArgs.moduleName) {
      moduleFilter.module_name = nextArgs.moduleName;
    }

    if (nextArgs.moduleId) {
      moduleFilter.module_id = nextArgs.moduleId;
    }

    if (nextArgs.moduleType) {
      moduleFilter.module_type = nextArgs.moduleType;
    }

    const qb = getRepository(Attachment).createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'created_at', nextArgs.orderSort);
    qb.where(moduleFilter);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['title', 'slug'].forEach(q => {
        qb.orWhere(`${aliasName}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
      });
    }

    if (!user || (user && !authUtil.can(user, 'attachment.list-read--all-status'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    if (nextArgs.orderBy && nextArgs.orderSort) {
      qb.orderBy({ [nextArgs.orderBy]: nextArgs.orderSort });
    } else {
      qb.orderBy({ sort: 'ASC' }).addOrderBy('created_at', 'ASC');
    }

    return paginationUtil.calcQueryBuilderPageInfo({ qb, page: nextArgs.page, pageSize: nextArgs.pageSize });
  }

  async attachment(uuid: string, args?: IAttachmentArgs, user?: User): Promise<Attachment | undefined> {
    let nextArgs: IAttachmentArgs = {};

    if (args) nextArgs = args;

    const whereQuery: { uuid: string; status?: number } = { uuid };

    if (!user || (user && !authUtil.can(user, 'attachment.item-read--all-status'))) {
      whereQuery.status = 1;
    }

    return this.attachmentRepository.findOne({
      ...nextArgs,
      where: whereQuery,
    });
  }

  async createAttachmentByLocal(
    body: IAttachmentParams,
    file: Express.Multer.File,
  ): Promise<{ attachment: Attachment } | undefined> {
    return this.saveInLocalServer.createAttachmentByLocal(body, file);
  }

  async updateAttachment(uuid: string, args: UpdateAttachmentInput): Promise<Attachment | undefined> {
    if (!args) return errorUtil.ERROR({ error: `update item ${uuid} args does not exist` });

    let prevItem = await this.attachmentRepository.findOne({ uuid });
    if (!prevItem) return errorUtil.ERROR({ error: `update item ${uuid} does not exist` });

    prevItem = { ...prevItem, ...args };
    const nextItem = await this.attachmentRepository.save(prevItem);

    loggerUtil.updateLog({ id: uuid, prevItem, nextItem, constructorName: CONSTRUCTOR_NAME });

    return nextItem;
  }

  async updateAttachments(attachments: UpdateAttachmentsInput[]): Promise<AttachmentsObject> {
    if (!attachments) return errorUtil.ERROR({ error: 'update attachments does not exist' });

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
    if (!prevItems) return errorUtil.ERROR({ error: `delete item ${uuid} does not exist` });

    const nextItem = await this.attachmentRepository.remove(prevItems);
    if (!nextItem) return errorUtil.ERROR({ error: `delete item ${uuid} faild` });

    prevItems.forEach(i => {
      if (i.at2x) {
        try {
          // delete local
          fs.unlinkSync(`${this.configService.PUBLIC_DIR}${pathUtil.getAt2xPath(i.path)}`);

          // delete oss
          loggerUtil.log(`delete local 2x file ${i.path}\n\n`, CONSTRUCTOR_NAME);

          if (i.in_oss) {
            this.saveInOssServer.client.delete(attachmentUtil.filenameAt1xToAt2x(i.path.substr(1)));

            loggerUtil.log(`delete oss 2x file ${i.path}\n\n`, CONSTRUCTOR_NAME);
          }
        } catch (err) {
          loggerUtil.error(`delete _2x item ${i.path} fail: ${JSON.stringify(i)}\n\n`, CONSTRUCTOR_NAME, err);
        }
      }

      try {
        // delete local
        fs.unlinkSync(`${this.configService.PUBLIC_DIR}${i.path}`);
        loggerUtil.log(`delete local 1x file ${i.path}\n\n`, CONSTRUCTOR_NAME);

        // delete oss
        if (i.in_oss) {
          this.saveInOssServer.client.delete(i.path.substr(1));

          loggerUtil.log(`delete oss 1x file ${i.path}\n\n`, CONSTRUCTOR_NAME);
        }
      } catch (err) {
        loggerUtil.error(`delete file ${i.path} fail: ${JSON.stringify(i)}\n\n`, CONSTRUCTOR_NAME, err);
      }
    });

    loggerUtil.log(`delete all-file ${uuid} successful: ${JSON.stringify(nextItem)}\n\n`, CONSTRUCTOR_NAME);

    return {
      items: nextItem.map(i => i.uuid),
    };
  }
}
