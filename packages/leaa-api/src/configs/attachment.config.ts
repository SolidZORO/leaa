import moment from 'moment';

import { envConfig } from '@leaa/api/modules/config/config.module';

const SAVE_SUB_DIR = moment().format('YYYY/MM');
const SAVE_DIR_BY_DISK = `./${envConfig.PUBLIC_DIR}/${envConfig.ATTACHMENT_DIR}/${SAVE_SUB_DIR}`;
const SAVE_DIR_BY_DB = `attachments/${SAVE_SUB_DIR}/`;

const ALLOW_FILE_TYPES = /image|jpeg|jpg|png|gif|webp|pdf|text|mp4|mp3/;

const URL_PREFIX_BY_LOCAL = `${envConfig.PROTOCOL}://${envConfig.BASE_HOST}:${envConfig.PORT}`;
const URL_PREFIX_BY_OSS = `${envConfig.PROTOCOL}://${envConfig.OSS_ALIYUN_BUCKET}.${envConfig.OSS_ALIYUN_REGION}.aliyuncs.com`; // eslint-disable-line max-len

const UPLOAD_ENDPOINT_BY_LOCAL = `${envConfig.PROTOCOL}://${envConfig.BASE_HOST}:${envConfig.PORT}/attachments/upload`;
const UPLOAD_ENDPOINT_BY_OSS = `${envConfig.PROTOCOL}://${envConfig.OSS_ALIYUN_BUCKET}.${envConfig.OSS_ALIYUN_REGION}.aliyuncs.com`; // eslint-disable-line max-len

export const attachmentConfig = {
  SAVE_SUB_DIR,
  SAVE_DIR_BY_DISK,
  SAVE_DIR_BY_DB,
  ALLOW_FILE_TYPES,
  URL_PREFIX_BY_LOCAL,
  URL_PREFIX_BY_OSS,
  UPLOAD_ENDPOINT_BY_LOCAL,
  UPLOAD_ENDPOINT_BY_OSS,
};
