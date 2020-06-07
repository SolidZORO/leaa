import path from 'path';
import moment from 'moment';

import { envConfig } from '@leaa/api/src/modules/v1/config/config.module';

const SAVE_SUB_DIR = moment().format('YYYY/MM');
const SAVE_DIR_BY_DISK = path.join(`./${envConfig.PUBLIC_DIR}/${envConfig.ATTACHMENT_DIR}/${SAVE_SUB_DIR}`);
const SAVE_DIR_BY_DB = `attachments/${SAVE_SUB_DIR}/`;

const ALLOW_FILE_TYPES = /image|jpeg|jpg|png|gif|webp|pdf|text|mp4|mp3/;

// TIPS
// There is a problem here, the server does not know its real address,
// for example, it is proxied by nginx, so there is no meaning here.
// 这里有个问题，服务器并不知道自己真实的地址，比如被 nginx 代理了，所以这里没有意义。
//
// const __DEV__ = process.env.NODE_ENV !== 'production';
// const URL_PREFIX_BY_LOCAL = `${envConfig.SERVER_PROTOCOL}://${envConfig.SERVER_HOST}${
//   __DEV__
//     ? `:${envConfig.SERVER_PORT}` // __DEV__ have SERVER_PORT, e.g. http://localhost:8888/attachments/upload
//     : '' //                          __PROD__ not SERVER_PORT, e.g. http://leaa---api.com/attachments/upload
// }`;
const URL_PREFIX_BY_LOCAL = '';
const URL_PREFIX_BY_OSS = `${envConfig.SERVER_PROTOCOL}://${envConfig.ATTACHMENT_OSS_ALIYUN_BUCKET}.${envConfig.ATTACHMENT_OSS_ALIYUN_REGION}.aliyuncs.com`; // eslint-disable-line max-len
const URL_PREFIX_BY_AUTO = envConfig.ATTACHMENT_SAVE_IN_OSS ? URL_PREFIX_BY_OSS : URL_PREFIX_BY_LOCAL;

const UPLOAD_ENDPOINT_BY_LOCAL = `${URL_PREFIX_BY_LOCAL}/v1/attachments/upload`;
const UPLOAD_ENDPOINT_BY_OSS = URL_PREFIX_BY_OSS; // eslint-disable-line max-len

export const attachmentConfig = {
  SAVE_SUB_DIR,
  SAVE_DIR_BY_DISK,
  SAVE_DIR_BY_DB,
  ALLOW_FILE_TYPES,
  URL_PREFIX_BY_LOCAL,
  URL_PREFIX_BY_OSS,
  URL_PREFIX_BY_AUTO,
  UPLOAD_ENDPOINT_BY_LOCAL,
  UPLOAD_ENDPOINT_BY_OSS,
};
