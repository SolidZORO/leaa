import _ from 'lodash';
import { Express } from 'express';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '@leaa/common/src/entrys';
import { UpdateAttachmentsInput, BatchUpdateAttachmentsSortInput } from '@leaa/common/src/dtos/attachment';
import { ISaveInOssSignature, ISaveInLocalSignature, IAttachmentParams } from '@leaa/common/src/interfaces';
import { logger } from '@leaa/api/src/utils';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';
import { SaveInOssAliyunService } from '@leaa/api/src/modules/v1/attachment/save-in-oss-aliyun.service';
import { SaveInLocalService } from '@leaa/api/src/modules/v1/attachment/save-in-local.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';

const CLS_NAME = 'AttachmentService';

@Injectable()
export class AttachmentService extends TypeOrmCrudService<Attachment> {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepo: Repository<Attachment>,
    private readonly configService: ConfigService,
    private readonly saveInLocalServer: SaveInLocalService,
    private readonly saveInOssAliyunService: SaveInOssAliyunService,
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
    if (this.configService.ATTACHMENT_SAVE_IN_OSS) return this.saveInOssAliyunService.getSignature();
    if (this.configService.ATTACHMENT_SAVE_IN_LOCAL) return this.saveInLocalServer.getSignature();

    const errorMsg = 'Signature Missing SAVE_IN... Params';

    logger.warn(errorMsg, CLS_NAME);
    throw new NotFoundException(errorMsg);
  }

  async uploadFile(body: IAttachmentParams, file: Express.Multer.File): Promise<Attachment | undefined> {
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
    await this.saveInLocalServer.deleteLocalFiles(atta);
    if (atta.in_oss) await this.saveInOssAliyunService.deleteOssAliyunFiles(atta);

    return atta;
  }
}
