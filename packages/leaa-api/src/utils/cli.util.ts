import { IDotEnv } from '@leaa/api/src/interfaces';

import pkg from '@leaa/api/package.json';
import moment from 'moment';

export const envInfoForCli = ({
  config,
  NODE_ENV,
  PUBLIC_PATH,
  VIEWS_PATH,
  DIRNAME,
}: {
  config: IDotEnv | any;
  NODE_ENV?: string;
  PUBLIC_PATH?: string;
  VIEWS_PATH?: string;
  DIRNAME?: string;
}) => {
  // emoji for CLI
  const serverBaseByText = `${config.SERVER_PROTOCOL}://${config.SERVER_HOST}:${config.SERVER_PORT}`;
  const serverBaseByEmoji = `✨✨ \x1b[00;44;9m${serverBaseByText}\x1b[0m ✨✨`;
  const serverEnv = `${NODE_ENV !== 'production' ? '🚀' : '🔰'} ${(NODE_ENV || 'NOT-ENV').toUpperCase()}`;

  console.log(`\n\n> ${serverEnv}  /  URL`, serverBaseByEmoji);

  console.log('\n> 📮 ENVINFO');
  console.log('');
  // eslint-disable-next-line no-underscore-dangle
  console.log('     - NAME    ', `${config.SERVER_NAME} v${pkg.version} (${config.__ENV__})`);
  console.log('');
  console.log('     - DEMO_MODE      ', `${config.DEMO_MODE ? 'enable' : '-'}`);
  console.log('     - DEBUG_MODE     ', `${config.DEBUG_MODE ? 'enable' : '-'}`);
  console.log('');
  console.log('     - DATE           ', moment().toDate());
  console.log('     - NOW            ', moment().format('YYYY-MM-DD HH:mm:ss'));
  console.log('     - TZ             ', config.TZ);
  console.log('     - TZ_OFFSET      ', moment().utcOffset());
  console.log('');
  console.log('     - DB_TYPE        ', config.DB_TYPE);
  console.log('     - DB_DATABASE    ', config.DB_DATABASE);
  console.log('     - DB_SYNCHRONIZE ', config.DB_SYNCHRONIZE);
  console.log('');
  console.log('     - RATELIMIT_MAX        ', config.RATELIMIT_MAX);
  console.log('     - RATELIMIT_WINDOWMS   ', config.RATELIMIT_WINDOWMS);
  console.log('     - ENABLE_CAPTCHA_TIMES ', config.ENABLE_CAPTCHA_BY_LOGIN_FAILD_TIMES);
  console.log('');
  console.log('     - DIRNAME ', DIRNAME);
  console.log('     - PUBLIC  ', PUBLIC_PATH);
  console.log('     - VIEWS   ', VIEWS_PATH);
  console.log('');
  console.log('     - ATTACHMENT_DIR           ', config.ATTACHMENT_DIR);
  console.log('     - ATTACHMENT_LIMIT_SIZE_MB ', config.ATTACHMENT_LIMIT_SIZE_MB);
  console.log('     - ATTACHMENT_SAVE_IN_LOCAL ', config.ATTACHMENT_SAVE_IN_LOCAL);
  console.log('     - ATTACHMENT_SAVE_IN_OSS   ', config.ATTACHMENT_SAVE_IN_OSS);
  console.log('');
  console.log('     - GRAVATAR_TYPE            ', config.GRAVATAR_TYPE);
  console.log('     - AUTO_CUT_TAGS            ', config.AUTO_CUT_TAGS);
  console.log('\n\n');
};
