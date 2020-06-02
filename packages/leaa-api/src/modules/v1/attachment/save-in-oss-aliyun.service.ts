import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import moment from 'moment';
import OSS from 'ali-oss';
import mkdirp from 'mkdirp';
import { Repository } from 'typeorm';
import { Injectable, HttpCode, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from '@nestjs/common/utils/is-uuid';

import {
  ISaveInOssSignature,
  ICraeteAttachmentByOssCallback,
  IAttachmentType,
  IAttachmentCreateFieldByOss,
} from '@leaa/common/src/interfaces';
import { Attachment } from '@leaa/common/src/entrys';
import { attachmentConfig } from '@leaa/api/src/configs';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';
import { filenameAt1xToAt2x, isAt2x, logger, uuid, genUrl, genUrlAt2x } from '@leaa/api/src/utils';

const CLS_NAME = 'SaveInOssAliyunService';

//
//
// ⚠️ if Enable OSS, You need to `Aliyun OSS` setting `CORS`, and Enable `AliyunOSSFullAccess` in `RAM` First.
@Injectable()
export class SaveInOssAliyunService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepo: Repository<Attachment>,
    private readonly configService: ConfigService,
  ) {}

  private EXPIRED_TIME_MINUTES = 10;

  client: OSS = new OSS({
    accessKeyId: this.configService.ATTACHMENT_OSS_ALIYUN_AK_ID,
    accessKeySecret: this.configService.ATTACHMENT_OSS_ALIYUN_AK_SECRET,
    region: this.configService.ATTACHMENT_OSS_ALIYUN_REGION,
    bucket: this.configService.ATTACHMENT_OSS_ALIYUN_BUCKET,
  });

  async getSignature(): Promise<ISaveInOssSignature> {
    // prettier-ignore
    const expiration = moment(Date.now()).add(this.EXPIRED_TIME_MINUTES, 'minutes').utc().format();

    const OSSAccessKeyId = this.configService.ATTACHMENT_OSS_ALIYUN_AK_ID;
    const OSSAccessKeySecret = this.configService.ATTACHMENT_OSS_ALIYUN_AK_SECRET;
    const saveDirPath = attachmentConfig.SAVE_DIR_BY_DB;

    const policyJson = JSON.stringify({
      expiration,
      conditions: [
        ['content-length-range', 0, this.configService.ATTACHMENT_LIMIT_SIZE_MB * 1024 * 1024],
        ['starts-with', '$key', saveDirPath],
      ],
    });

    const policy = Buffer.from(policyJson).toString('base64');
    const signature = crypto.createHmac('sha1', OSSAccessKeySecret).update(policy).digest('base64');

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
      '"typeName": ${x:type_name},' +
      '"typePlatform": ${x:type_platform}' +
      '}';
    /* eslint-enable no-template-curly-in-string */

    const callbackJson = {
      callbackUrl: encodeURI(this.configService.ATTACHMENT_OSS_ALIYUN_CALLBACK_URL),
      callbackBodyType: 'application/json', // cry... this `\/` wasting some time...
      callbackBody,
    };

    const callback = Buffer.from(JSON.stringify(callbackJson)).toString('base64');

    return {
      saveIn: 'oss',
      uploadEndPoint: attachmentConfig.UPLOAD_ENDPOINT_BY_OSS,
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
      (response) =>
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
    const at1xUrl = `${attachmentConfig.UPLOAD_ENDPOINT_BY_OSS}/${filename}?x-oss-process=image/resize,p_50`;

    return this.downloadFile(at1xUrl, (file) => this.client.put(filename.replace('_2x', ''), file));
  }

  async saveOssToLocal(attachment: Attachment): Promise<'ossIsSaveToLocal' | Error> {
    await this.downloadFile(genUrl(attachment) || '', (file) => {
      try {
        mkdirp.sync(attachmentConfig.SAVE_DIR_BY_DISK);

        fs.writeFileSync(`${attachmentConfig.SAVE_DIR_BY_DISK}/${attachment.filename}`, file);
      } catch (err) {
        logger.error(JSON.stringify(err), CLS_NAME);
        throw Error(err.message);
      }
    });

    if (attachment.at2x) {
      await this.downloadFile(genUrlAt2x(attachment) || '', (file) => {
        try {
          fs.writeFileSync(`${attachmentConfig.SAVE_DIR_BY_DISK}/${filenameAt1xToAt2x(attachment.filename)}`, file);
        } catch (e) {
          throw Error(e.message);
        }
      });
    }

    return 'ossIsSaveToLocal';
  }

  async createAttachmentByOss(req: ICraeteAttachmentByOssCallback): Promise<Attachment | undefined> {
    if (!req.object) throw new NotFoundException();

    const splitFilename = req.object.split('/').pop();

    if (!splitFilename) {
      const message = 'Not Found Filename';

      logger.warn(message, CLS_NAME);

      return;
    }

    const filename = splitFilename.replace('_2x', '');

    const isImage = req.mimeType ? req.mimeType.includes(IAttachmentType.IMAGE) : false;
    const at2x = isAt2x(req.object) ? 1 : 0;
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

    const ext = `.${req.format}`.toLowerCase();
    const title = req.originalname.replace(ext, '');
    const id = filename.replace(ext, '');

    if (isImage && at2x) {
      const at1x = await this.saveAt2xToAt1xByOss(req.object);

      if (!at1x) {
        const message = `Save @2x To @1x Failed, ${JSON.stringify(req.object)}`;

        logger.warn(message, CLS_NAME);

        return;
      }
    }

    const attachmentData: IAttachmentCreateFieldByOss = {
      id: isUUID(id) ? id : uuid(),
      title,
      alt: title,
      type: req.mimeType ? `${req.mimeType.split('/')[0]}` : 'no-mime',
      filename,
      // DB use snakeCase, e.g. module_abc --> moduleAbc
      module_name: req.moduleName,
      module_id: typeof req.moduleId !== 'undefined' ? req.moduleId : '0',
      type_name: req.typeName,
      type_platform: req.typePlatform,
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

    // if SAVE_IN_LOCAL failed, don't write DB
    if (this.configService.ATTACHMENT_SAVE_IN_LOCAL) {
      const saveStatus = await this.saveOssToLocal(attachmentData as Attachment);

      if (saveStatus !== 'ossIsSaveToLocal') throw Error('Oss SaveTo Local Error');

      attachmentData.in_local = 1;
    }

    // return this.attachmentRepo.save(attachmentData);
    // eslint-disable-next-line consistent-return
    return this.attachmentRepo.save({
      ...attachmentData,
      url: genUrl(attachmentData as Attachment),
      urlAt2x: genUrlAt2x(attachmentData as Attachment),
    });
  }

  @HttpCode(200)
  async ossCallback(req: ICraeteAttachmentByOssCallback): Promise<any> {
    const attachment = await this.createAttachmentByOss(req);
    console.log('📎 ATTACHMENT OSS CALLBACK\n', attachment);

    return attachment;
  }

  async deleteOssAliyunFiles(atta: Attachment): Promise<Attachment | undefined> {
    if (atta.in_oss) {
      const delete1xResult = await this.client.delete(atta.path.substr(1));
      if (delete1xResult) logger.log(`delete oss-aliyun 1x file ${atta.path}\n\n`, CLS_NAME);

      if (atta.at2x) {
        const delete2xResult = await this.client.delete(filenameAt1xToAt2x(atta.path.substr(1)));
        if (delete2xResult) logger.log(`delete oss-aliyun 2x file ${atta.path}\n\n`, CLS_NAME);
      }
    }

    return atta;
  }
}
