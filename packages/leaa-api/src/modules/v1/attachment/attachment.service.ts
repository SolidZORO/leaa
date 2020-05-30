import fs from 'fs';
import _ from 'lodash';
import { Express } from 'express';
import { Repository, In } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '@leaa/common/src/entrys';
import {
  DeleteAttachmentsObject,
  UpdateAttachmentInput,
  UpdateAttachmentsInput,
  BatchUpdateAttachmentsSortInput,
} from '@leaa/common/src/dtos/attachment';
import { ISaveInOssSignature, ISaveInLocalSignature, IAttachmentParams } from '@leaa/common/src/interfaces';
import { logger, getAt2xPath, filenameAt1xToAt2x } from '@leaa/api/src/utils';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';
import { SaveInOssService } from '@leaa/api/src/modules/v1/attachment/save-in-oss.service';
import { SaveInLocalService } from '@leaa/api/src/modules/v1/attachment/save-in-local.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';

const CLS_NAME = 'AttachmentService';

// @Injectable()
// export class AttachmentService {
@Injectable()
export class AttachmentService extends TypeOrmCrudService<Attachment> {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepo: Repository<Attachment>,
    private readonly configService: ConfigService,
    private readonly saveInLocalServer: SaveInLocalService,
    private readonly saveInOssServer: SaveInOssService,
  ) {
    super(attachmentRepo);
  }

  async deleteOne(req: CrudRequest): Promise<Attachment | void> {
    const result = await super.deleteOne(req);

    if (result) await this.deleteRelationFiles(result);

    return result;
  }

  //
  //

  getSignature(): Promise<ISaveInOssSignature | ISaveInLocalSignature> | null {
    if (this.configService.ATTACHMENT_SAVE_IN_OSS) return this.saveInOssServer.getSignature();
    if (this.configService.ATTACHMENT_SAVE_IN_LOCAL) return this.saveInLocalServer.getSignature();

    const errorMsg = 'Signature Missing SAVE_IN... Params';

    logger.warn(errorMsg, CLS_NAME);
    throw new NotFoundException(errorMsg);
  }

  async createAttachmentByLocal(body: IAttachmentParams, file: Express.Multer.File): Promise<Attachment | undefined> {
    return this.saveInLocalServer.createAttachmentByLocal(body, file);
  }

  async batchUpdate(dto: UpdateAttachmentsInput): Promise<string> {
    const safeAttas = dto.attachments.map((att) => _.pick(att, ['id', 'link', 'status', 'title', 'sort']));
    const batchUpdate = safeAttas.map((att) => this.attachmentRepo.update(att.id, att));

    return Promise.all(batchUpdate)
      .then((data) => {
        return `Batch Updated ${data.length} Attachment`;
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async batchUpdateSort(dto: BatchUpdateAttachmentsSortInput): Promise<string> {
    const safeAttas = dto.attachments.map((att) => _.pick(att, ['id', 'sort']));
    const batchUpdate = safeAttas.map((att) => this.attachmentRepo.update(att.id, { sort: att.sort }));

    return Promise.all(batchUpdate)
      .then(() => {
        return 'OK';
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async deleteRelationFiles(atta: Attachment): Promise<Attachment | undefined> {
    if (atta.at2x) {
      try {
        // delete local
        fs.unlinkSync(`${this.configService.PUBLIC_DIR}${getAt2xPath(atta.path)}`);

        // delete oss
        logger.log(`delete local 2x file ${atta.path}\n\n`, CLS_NAME);

        if (atta.in_oss) {
          await this.saveInOssServer.client.delete(filenameAt1xToAt2x(atta.path.substr(1)));

          logger.log(`delete oss 2x file ${atta.path}\n\n`, CLS_NAME);
        }
      } catch (err) {
        logger.error(`delete _2x item ${atta.path} fail: ${JSON.stringify(atta)}\n\n`, CLS_NAME, err);
      }
    }

    try {
      // delete local
      fs.unlinkSync(`${this.configService.PUBLIC_DIR}${atta.path}`);
      logger.log(`delete local 1x file ${atta.path}\n\n`, CLS_NAME);

      // delete oss
      if (atta.in_oss) {
        await this.saveInOssServer.client.delete(atta.path.substr(1));

        logger.log(`delete oss 1x file ${atta.path}\n\n`, CLS_NAME);
      }
    } catch (err) {
      logger.error(`delete file ${atta.path} fail: ${JSON.stringify(atta)}\n\n`, CLS_NAME, err);
    }

    return atta;
  }
}
