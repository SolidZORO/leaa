import path from 'path';
import moment from 'moment';

import { envConfig } from '@leaa/api/src/modules/v1/config/config.module';

const dev = process.env.NODE_ENV !== 'production';

const SAVE_SUB_DIR = moment().format('YYYY/MM');
const SAVE_DIR_BY_DISK = path.join(`./${envConfig.PUBLIC_DIR}/${envConfig.ATTACHMENT_DIR}/${SAVE_SUB_DIR}`);
const SAVE_DIR_BY_DB = `attachments/${SAVE_SUB_DIR}/`;

const ALLOW_FILE_TYPES = /image|jpeg|jpg|png|gif|webp|pdf|text|mp4|mp3/;

const URL_PREFIX_BY_LOCAL = `${envConfig.SERVER_PROTOCOL}://${envConfig.BASE_HOST}${
  dev
    ? `:${envConfig.SERVER_PORT}` // dev have SERVER_PORT, e.g. http://localhost:8888/attachments/upload
    : '' //                   prod not PORT, e.g. http://test-leaa.com/attachments/upload
}`;
const URL_PREFIX_BY_OSS = `${envConfig.SERVER_PROTOCOL}://${envConfig.ATTACHMENT_OSS_ALIYUN_BUCKET}.${envConfig.ATTACHMENT_OSS_ALIYUN_REGION}.aliyuncs.com`; // eslint-disable-line max-len

const UPLOAD_ENDPOINT_BY_LOCAL = `${URL_PREFIX_BY_LOCAL}/attachments/upload`;
// const UPLOAD_ENDPOINT_BY_OSS = URL_PREFIX_BY_OSS; // eslint-disable-line max-len

export const attachmentConfig = {
  SAVE_SUB_DIR,
  SAVE_DIR_BY_DISK,
  SAVE_DIR_BY_DB,
  ALLOW_FILE_TYPES,
  URL_PREFIX_BY_LOCAL,
  URL_PREFIX_BY_OSS,
  UPLOAD_ENDPOINT_BY_LOCAL,
  UPLOAD_ENDPOINT_BY_OSS: URL_PREFIX_BY_OSS,
};
