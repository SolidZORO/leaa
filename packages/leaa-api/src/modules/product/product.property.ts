import { Injectable } from '@nestjs/common';

import { Product, Attachment } from '@leaa/common/src/entrys';
import { ProductAttachmentsObject } from '@leaa/common/src/dtos/product';
import { AttachmentService } from '@leaa/api/src/modules/attachment/attachment.service';
import i18next from 'i18next';

// const CLS_NAME = 'ProductProperty';

@Injectable()
export class ProductProperty {
  constructor(private readonly attachmentService: AttachmentService) {}

  async attachments(product: Product | undefined): Promise<ProductAttachmentsObject | undefined> {
    if (!product || (product && !product.id)) {
      return undefined;
    }

    const gqlCtx = { t: i18next.t };

    const attachmentsResult = await this.attachmentService.attachments(gqlCtx, {
      moduleName: 'product',
      moduleId: product.id,
    });
    const attachments: Attachment[] = (attachmentsResult && attachmentsResult.items) || [];

    return {
      bannerMbList: attachments.filter((a) => a.type_name === 'banner' && a.type_platform === 'mb'),
      bannerPcList: attachments.filter((a) => a.type_name === 'banner' && a.type_platform === 'pc'),
      galleryMbList: attachments.filter((a) => a.type_name === 'gallery' && a.type_platform === 'mb'),
      galleryPcList: attachments.filter((a) => a.type_name === 'gallery' && a.type_platform === 'pc'),
    };
  }
}
