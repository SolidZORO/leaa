import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '@leaa/common/entrys';
import { pathUtil } from '@leaa/api/utils';
import { ConfigService } from '@leaa/api/modules/config/config.service';

// const CONSTRUCTOR_NAME = 'AttachmentProperty';

@Injectable()
export class AttachmentProperty {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
    private readonly configService: ConfigService,
  ) {}

  resolvePropertyUrl(attachment: Attachment): string | null {
    if (attachment.in_oss) {
      // eslint-disable-next-line max-len
      const ossUrlPrefix = `${this.configService.PROTOCOL}://${this.configService.OSS_ALIYUN_BUCKET}.${this.configService.OSS_ALIYUN_REGION}.aliyuncs.com`;

      return `${ossUrlPrefix}${attachment.path}`;
    }

    if (attachment.in_local) {
      // eslint-disable-next-line max-len
      const localUrlPrefix = `${this.configService.PROTOCOL}://${this.configService.BASE_HOST}:${this.configService.PORT}`;

      return `${localUrlPrefix}${attachment.path}`;
    }

    return null;
  }

  resolvePropertyUrlAt2x(attachment: Attachment): string | null {
    if (attachment.at2x) {
      return pathUtil.getAt2xPath(this.resolvePropertyUrl(attachment));
    }

    return null;
  }
}
