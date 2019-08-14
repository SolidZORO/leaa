import crypto from 'crypto';
import moment from 'moment';
import { Injectable, HttpCode } from '@nestjs/common';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import {
  ISaveInOssSignature,
  ICraeteAttachmentByOssCallback,
  IAttachmentType,
  IAttachmentCreateFieldByOss,
} from '@leaa/common/interfaces';
import { Attachment } from '@leaa/common/entrys';
import { attachmentUtil, loggerUtil } from '@leaa/api/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const CONSTRUCTOR_NAME = 'SaveInOssService';

@Injectable()
export class SaveInOssService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
    private readonly configService: ConfigService,
  ) {}

  // eslint-disable-next-line max-len
  private uploadEndPoint = `${this.configService.PROTOCOL}://${this.configService.OSS_ALIYUN_BUCKET}.${this.configService.OSS_ALIYUN_REGION}.aliyuncs.com`;
  private EXPIRED_TIME_MINUTES = 10;

  async getSignature(): Promise<ISaveInOssSignature> {
    // prettier-ignore
    const expiration = moment(Date.now()).add(this.EXPIRED_TIME_MINUTES, 'minutes').utc().format();

    const OSSAccessKeyId = this.configService.OSS_ALIYUN_AK_ID;
    const OSSAccessKeySecret = this.configService.OSS_ALIYUN_AK_SECRET;
    const saveDirPath = `attachments/${moment().format('YYYY/MM')}/`;

    const policyJson = JSON.stringify({
      expiration,
      conditions: [
        ['content-length-range', 0, this.configService.ATTACHMENT_LIMIT_SIZE_MB * 1024 * 1024],
        ['starts-with', '$key', saveDirPath],
      ],
    });

    const policy = Buffer.from(policyJson).toString('base64');

    const signature = crypto
      .createHmac('sha1', OSSAccessKeySecret)
      .update(policy)
      .digest('base64');

    /* eslint-disable no-template-curly-in-string */
    const callbackBody =
      '{' +
      '"object": ${object},' +
      '"bucket": ${bucket},' +
      '"size": ${size},' +
      '"etag": ${etag},' +
      '"height": ${imageInfo.height},' +
      '"width": ${imageInfo.width},' +
      '"mimeType": ${mimeType},' +
      '"format": ${imageInfo.format},' +
      // self var, only use e.g. `var_id`, not `varId`
      '"originalname": ${x:originalname},' +
      '"type": ${x:type},' +
      '"moduleId": ${x:module_id},' +
      '"moduleName": ${x:module_name},' +
      '"moduleType": ${x:module_type}' +
      '}';
    /* eslint-enable no-template-curly-in-string */

    const callbackJson = {
      callbackUrl: this.configService.OSS_ALIYUN_CALLBACK_URL,
      callbackBodyType: 'application/json', // cry... this `\/` wasting some time...
      callbackBody,
    };

    const callback = Buffer.from(JSON.stringify(callbackJson)).toString('base64');

    return {
      saveIn: 'oss',
      uploadEndPoint: this.uploadEndPoint,
      OSSAccessKeyId,
      policy,
      signature,
      expiration,
      saveDirPath,
      callback,
    };
  }

  async craeteAttachmentByOss(
    request: ICraeteAttachmentByOssCallback,
  ): Promise<{ attachment: Attachment } | undefined> {
    const splitFilename = request.object.split('/').pop();

    if (!splitFilename) {
      const message = 'not found filename';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return;
    }

    const filename = splitFilename.replace('_2x', '');

    const isImage = request.mimeType ? request.mimeType.includes(IAttachmentType.IMAGE) : false;
    const at2x = attachmentUtil.isAt2x(request.object) ? 1 : 0;
    let width = 0;
    let height = 0;

    if (isImage) {
      // const imageSize = ImageSize(file.path);

      const rawWidth = Number(request.width);
      const rawHeight = Number(request.height);

      width = rawWidth; // eslint-disable-line prefer-destructuring
      height = rawHeight; // eslint-disable-line prefer-destructuring

      if (at2x) {
        width = Math.round(rawWidth / 2);
        height = Math.round(rawHeight / 2);
      }
    }

    const filepath = `/${request.object.replace('_2x', '')}`;

    const ext = `.${request.format}`;
    const uuid = filename.replace(ext, '');
    const title = request.originalname.replace(ext, '');
    // const uuid = title;

    // return undefined;
    //
    // if (isImage && at2x) {
    //   await this.saveAt2xToAt1x(file, width, height);
    // }

    const attachmentData: IAttachmentCreateFieldByOss = {
      uuid,
      title,
      alt: title,
      type: request.mimeType ? `${request.mimeType.split('/')[0]}` : 'no-mime',
      filename,
      // DB use snakeCase, e.g. module_abc --> moduleAbc
      module_name: request.moduleName,
      module_id: typeof request.moduleId !== 'undefined' ? Number(request.moduleId) : 0,
      module_type: request.moduleType,
      //
      ext,
      width,
      height,
      path: filepath,
      size: Number(request.size),
      at2x,
      sort: 0,
      in_oss: 1,
    };

    const attachment = await this.attachmentRepository.save({ ...attachmentData });

    // eslint-disable-next-line consistent-return
    return { attachment };
  }

  @HttpCode(200)
  async ossCallback(request: ICraeteAttachmentByOssCallback): Promise<any> {
    const attachment = await this.craeteAttachmentByOss(request);

    return {
      ...attachment,
      request,
      status: 'success',
    };
  }
}
