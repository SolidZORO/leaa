import { Injectable } from '@nestjs/common';

import { Ax, Attachment } from '@leaa/common/src/entrys';
import { AxAttachmentsObject } from '@leaa/common/src/dtos/ax';
import { AttachmentService } from '@leaa/api/src/modules/attachment/attachment.service';
import i18next from 'i18next';

// const CLS_NAME = 'AxProperty';

@Injectable()
export class AxProperty {
  constructor(private readonly attachmentService: AttachmentService) {}

  async attachments(ax: Ax | undefined): Promise<AxAttachmentsObject | undefined> {
    if (!ax || (ax && !ax.id)) {
      return undefined;
    }

    const gqlCtx = { t: i18next.t };

    const attachmentsResult = await this.attachmentService.attachments(gqlCtx, {
      moduleName: 'ax',
      moduleId: ax.id,
    });
    const attachments: Attachment[] = attachmentsResult?.items || [];

    return {
      bannerMbList: attachments.filter((a) => a.type_name === 'banner' && a.type_platform === 'mb'),
      bannerPcList: attachments.filter((a) => a.type_name === 'banner' && a.type_platform === 'pc'),
      galleryMbList: attachments.filter((a) => a.type_name === 'gallery' && a.type_platform === 'mb'),
      galleryPcList: attachments.filter((a) => a.type_name === 'gallery' && a.type_platform === 'pc'),
    };
  }
}
