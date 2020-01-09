import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '@leaa/common/src/entrys';
import { pathUtil } from '@leaa/api/src/utils';
import { attachmentConfig } from '@leaa/api/src/configs';

// const CLS_NAME = 'AttachmentProperty';

type IAttachment = Pick<Attachment, 'in_oss' | 'in_local' | 'path' | 'external_url'>;

export const buildUrl = (attachment: IAttachment): string | null => {
  if (attachment.external_url) {
    const externalUrls = attachment.external_url.split('|');

    return externalUrls[0];
  }

  if (attachment.in_oss) {
    return `${attachmentConfig.URL_PREFIX_BY_OSS}${attachment.path}`;
  }

  if (attachment.in_local) {
    return `${attachmentConfig.URL_PREFIX_BY_LOCAL}${attachment.path}`;
  }

  return null;
};

export const buildUrlAt2x = (attachment: Attachment): string | null => {
  if (attachment.external_url) {
    const externalUrls = attachment.external_url.split('|');

    return externalUrls[1] || externalUrls[0];
  }

  if (attachment.at2x) {
    return pathUtil.getAt2xPath(buildUrl(attachment));
  }

  return null;
};

@Injectable()
export class AttachmentProperty {
  constructor(@InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>) {}

  url(attachment: IAttachment): string | null {
    if (attachment.external_url) {
      return attachment.external_url;
    }

    return buildUrl(attachment);
  }

  urlAt2x(attachment: Attachment): string | null {
    if (attachment.external_url) {
      return attachment.external_url;
    }

    return buildUrlAt2x(attachment);
  }
}
