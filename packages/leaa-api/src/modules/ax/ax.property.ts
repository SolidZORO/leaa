import { Injectable } from '@nestjs/common';

import { Ax, Attachment } from '@leaa/common/src/entrys';
import { AxAttachmentsObject } from '@leaa/common/src/dtos/ax';
import { AttachmentService } from '@leaa/api/src/modules/attachment/attachment.service';

// const CONSTRUCTOR_NAME = 'AxProperty';

@Injectable()
export class AxProperty {
  constructor(private readonly attachmentService: AttachmentService) {}

  async resolvePropertyAttachments(ax: Ax | undefined): Promise<AxAttachmentsObject | undefined> {
    let bannerMbList: Attachment[] = [];
    let bannerPcList: Attachment[] = [];
    let galleryMbList: Attachment[] = [];
    let galleryPcList: Attachment[] = [];

    if (ax && ax.id) {
      const baseParam = {
        moduleName: 'ax',
        moduleId: ax.id,
        moduleType: 'banner_mb',
      };

      const bannerMbResult = await this.attachmentService.attachments({ ...baseParam, moduleType: 'banner_mb' });
      const bannerPcResult = await this.attachmentService.attachments({ ...baseParam, moduleType: 'banner_pc' });
      const galleryMbResult = await this.attachmentService.attachments({ ...baseParam, moduleType: 'gallery_mb' });
      const galleryPcResult = await this.attachmentService.attachments({ ...baseParam, moduleType: 'gallery_pc' });

      if (bannerMbResult && bannerMbResult.items) {
        bannerMbList = bannerMbResult.items;
      }

      if (bannerPcResult && bannerPcResult.items) {
        bannerPcList = bannerPcResult.items;
      }

      if (galleryMbResult && galleryMbResult.items) {
        galleryMbList = galleryMbResult.items;
      }

      if (galleryPcResult && galleryPcResult.items) {
        galleryPcList = galleryPcResult.items;
      }
    }

    return {
      bannerMbList,
      bannerPcList,
      galleryMbList,
      galleryPcList,
    };
  }
}
