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
import { attachmentConfig } from '@leaa/api/configs';

const CONSTRUCTOR_NAME = 'SaveInOssService';

@Injectable()
export class SaveInOssService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepository: Repository<Attachment>,
    private readonly configService: ConfigService,
    private readonly attachmentProperty: AttachmentProperty,
  ) {}

  // eslint-disable-next-line max-len
  private uploadEndPoint = attachmentConfig.UPLOAD_ENDPOINT_BY_OSS;
  private EXPIRED_TIME_MINUTES = 10;

  public client: OSS = new OSS({
    accessKeyId: this.configService.OSS_ALIYUN_AK_ID,
    accessKeySecret: this.configService.OSS_ALIYUN_AK_SECRET,
    region: this.configService.OSS_ALIYUN_REGION,
    bucket: this.configService.OSS_ALIYUN_BUCKET,
  });

  async getSignature(): Promise<ISaveInOssSignature> {
    // prettier-ignore
    const expiration = moment(Date.now()).add(this.EXPIRED_TIME_MINUTES, 'minutes').utc().format();

    const OSSAccessKeyId = this.configService.OSS_ALIYUN_AK_ID;
    const OSSAccessKeySecret = this.configService.OSS_ALIYUN_AK_SECRET;
    const saveDirPath = attachmentConfig.SAVE_DIR_BY_DB;

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

  async downloadFile(fileUrl: string, cb: (file: Buffer) => void) {
    const tempFile = `/tmp/${new Date().getTime()}`;
    let result = null;

    await axios({ url: fileUrl, responseType: 'stream' }).then(
      response =>
        new Promise((resolve, reject) => {
          response.data
            .pipe(fs.createWriteStream(tempFile))
            .on('finish', async () => {
              const file: Buffer = fs.readFileSync(tempFile);

              result = await cb(file);

              return resolve();
            })
            .on('error', (e: Error) => reject(e));
        }),
    );

    return result;
  }

  async saveAt2xToAt1xByOss(filename: string): Promise<OSS.PutObjectResult | null> {
    const at1xUrl = `${this.uploadEndPoint}/${filename}?x-oss-process=image/resize,p_50`;

    return this.downloadFile(at1xUrl, file => this.client.put(filename.replace('_2x', ''), file));
  }

  async saveOssToLocal(
    attachment: Pick<Attachment, 'filename' | 'url' | 'urlAt2x' | 'at2x'>,
  ): Promise<'success' | Error> {
    await this.downloadFile(attachment.url || '', file => {
      try {
        fs.writeFileSync(`${attachmentConfig.SAVE_DIR_BY_DISK}/${attachment.filename}`, file);
      } catch (e) {
        throw Error(e.message);
      }
    });

    if (attachment.at2x) {
      await this.downloadFile(attachment.urlAt2x || '', file => {
        try {
          fs.writeFileSync(
            `${attachmentConfig.SAVE_DIR_BY_DISK}/${attachmentUtil.filenameAt1xToAt2x(attachment.filename)}`,
            file,
          );
        } catch (e) {
          throw Error(e.message);
        }
      });
    }

    return 'success';
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
      const at1x = await this.saveAt2xToAt1xByOss(req.object);

      if (!at1x) {
        const message = `save @2x to @1x failed, ${JSON.stringify(req.object)}`;

        loggerUtil.warn(message, CONSTRUCTOR_NAME);

        return;
      }
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
      in_local: 0,
    };

    const url = this.attachmentProperty.resolvePropertyUrl(attachmentData as Attachment);
    const urlAt2x = this.attachmentProperty.resolvePropertyUrlAt2x(attachmentData as Attachment);

    // if SAVE_IN_LOCAL failed, don't write DB
    if (this.configService.ATTACHMENT_SAVE_IN_LOCAL) {
      const status = await this.saveOssToLocal({
        filename: attachmentData.filename,
        at2x: attachmentData.at2x,
        url,
        urlAt2x,
      });

      if (status !== 'success') {
        throw Error('Save Oss To Local Error');
      }

      attachmentData.in_local = 1;
    }

    const attachment = await this.attachmentRepository.save({ ...attachmentData });

    // eslint-disable-next-line consistent-return
    return {
      attachment: {
        ...attachment,
        url,
        urlAt2x,
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
