import fs from 'fs';
import { Repository } from 'typeorm';
import { Injectable, HttpCode } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import crypto from 'crypto';
import moment from 'moment';
import request from 'request';
import OSS from 'ali-oss';

import {
  ISaveInOssSignature,
  ICraeteAttachmentByOssCallback,
  IAttachmentType,
  IAttachmentCreateFieldByOss,
} from '@leaa/common/interfaces';
import { ConfigService } from '@leaa/api/modules/config/config.service';
import { AttachmentProperty } from '@leaa/api/modules/attachment/attachment.property';
import { Attachment } from '@leaa/common/entrys';
import { attachmentUtil, loggerUtil } from '@leaa/api/utils';

const CONSTRUCTOR_NAME = 'SaveInOssService';

@Injectable()
export class SaveInOssService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
    private readonly configService: ConfigService,
    private readonly attachmentShared: AttachmentProperty,
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
      //
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

  async saveAt2xToAt1x(filename: string): Promise<OSS.PutObjectResult | null> {
    const client: OSS = new OSS({
      accessKeyId: this.configService.OSS_ALIYUN_AK_ID,
      accessKeySecret: this.configService.OSS_ALIYUN_AK_SECRET,
      region: this.configService.OSS_ALIYUN_REGION,
      bucket: this.configService.OSS_ALIYUN_BUCKET,
    });

    const tempFilePath = '/tmp/ali-oss-tmp-file';
    const image1x = `${this.uploadEndPoint}/${filename}?x-oss-process=image/resize,p_50`;

    let result = null;

    await axios({ url: image1x, responseType: 'stream' }).then(
      response =>
        new Promise((resolve, reject) => {
          response.data
            .pipe(fs.createWriteStream(tempFilePath))
            .on('finish', async () => {
              const file = await fs.readFileSync(tempFilePath);

              result = await client.put(filename.replace('_2x', ''), file);

              return resolve();
            })
            .on('error', (e: Error) => reject(e));
        }),
    );

    return result;
  }

  async craeteAttachmentByOss(req: ICraeteAttachmentByOssCallback): Promise<{ attachment: Attachment } | undefined> {
    const splitFilename = req.object.split('/').pop();

    if (!splitFilename) {
      const message = 'not found filename';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return;
    }

    const filename = splitFilename.replace('_2x', '');

    const isImage = req.mimeType ? req.mimeType.includes(IAttachmentType.IMAGE) : false;
    const at2x = attachmentUtil.isAt2x(req.object) ? 1 : 0;
    let width = 0;
    let height = 0;

    if (isImage) {
      // const imageSize = ImageSize(file.path);

      const rawWidth = Number(req.width);
      const rawHeight = Number(req.height);

      width = rawWidth; // eslint-disable-line prefer-destructuring
      height = rawHeight; // eslint-disable-line prefer-destructuring

      if (at2x) {
        width = Math.round(rawWidth / 2);
        height = Math.round(rawHeight / 2);
      }
    }

    const filepath = `/${req.object.replace('_2x', '')}`;

    const ext = `.${req.format}`;
    const uuid = filename.replace(ext, '');
    const title = req.originalname.replace(ext, '');

    if (isImage && at2x) {
      await this.saveAt2xToAt1x(req.object);
    }

    const attachmentData: IAttachmentCreateFieldByOss = {
      uuid,
      title,
      alt: title,
      type: req.mimeType ? `${req.mimeType.split('/')[0]}` : 'no-mime',
      filename,
      // DB use snakeCase, e.g. module_abc --> moduleAbc
      module_name: req.moduleName,
      module_id: typeof req.moduleId !== 'undefined' ? Number(req.moduleId) : 0,
      module_type: req.moduleType,
      //
      ext,
      width,
      height,
      path: filepath,
      size: Number(req.size),
      at2x,
      sort: 0,
      in_oss: 1,
    };

    const attachment = await this.attachmentRepository.save({ ...attachmentData });

    // eslint-disable-next-line consistent-return
    return {
      attachment: {
        ...attachment,
        url: this.attachmentShared.url(attachment),
        urlAt2x: this.attachmentShared.urlAt2x(attachment),
      },
    };
  }

  @HttpCode(200)
  async ossCallback(req: ICraeteAttachmentByOssCallback): Promise<any> {
    const attachment = await this.craeteAttachmentByOss(req);

    return {
      ...attachment,
      request,
      status: 'success',
    };
  }
}
